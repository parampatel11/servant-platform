"use client";

import React, { useState } from "react";
import axios from "axios";
import { CreditCard, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface CheckoutProps {
    amount: number;
    servantId: string;
    durationHours: number;
    onSuccess?: (paymentData: any) => void;
}

const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

export default function CheckoutButton({ amount, servantId, durationHours, onSuccess }: CheckoutProps) {
    const [isProcessing, setIsProcessing] = useState(false);

    const handlePayment = async () => {
        setIsProcessing(true);

        try {
            const isScriptLoaded = await loadRazorpayScript();
            if (!isScriptLoaded) {
                toast.error("Failed to load Razorpay SDK. Check your connection.");
                setIsProcessing(false);
                return;
            }

            const orderResponse = await axios.post(
                "http://localhost:8000/api/payment/create-order",
                { amount, servantId, durationHours },
                { withCredentials: true }
            );

            const orderData = orderResponse.data.order;

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, 
                amount: orderData.amount,
                currency: orderData.currency,
                name: "ShiftServe Platform",
                description: "Booking Payment",
                order_id: orderData.id,
                handler: async function (response: any) {
                    try {
                        const verifyResponse = await axios.post(
                            "http://localhost:8000/api/payment/verify",
                            {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                            },
                            { withCredentials: true }
                        );

                        toast.success("Payment verified successfully!");
                        if (onSuccess) onSuccess(verifyResponse.data.payment);
                        
                    } catch (err) {
                        toast.error("Payment verification failed. Contact support.");
                    }
                },
                prefill: {
                    name: "Client Name",
                    email: "client@shiftserve.com",
                    contact: "9999999999"
                },
                theme: {
                    color: "#22c55e"
                }
            };

            const paymentObject = new (window as any).Razorpay(options);
            paymentObject.on("payment.failed", function (response: any) {
                toast.error(response.error.description || "Payment failed");
            });
            
            paymentObject.open();

        } catch (error) {
            toast.error("Unable to initiate checkout. Please try again.");
            console.error(error);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full bg-green-500 hover:bg-green-400 text-slate-900 font-bold py-3.5 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm shadow-md active:scale-95 disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none"
        >
            {isProcessing ? (
                <>
                    <Loader2 className="animate-spin" size={18} /> Processing...
                </>
            ) : (
                <>
                    <CreditCard size={18} /> Pay ₹{amount} & Book Now
                </>
            )}
        </button>
    );
}