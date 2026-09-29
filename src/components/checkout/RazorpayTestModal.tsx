'use client';

import React, { useState } from 'react';
import { X, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';

interface RazorpayTestModalProps {
  isOpen: boolean;
  orderNumber: string;
  amount: number; // in paise or rupees
  currency?: string;
  onSuccess: () => Promise<void> | void;
  onFailure: (reason?: string) => void;
  onClose: () => void;
}

export const RazorpayTestModal: React.FC<RazorpayTestModalProps> = ({
  isOpen,
  orderNumber,
  amount,
  currency = 'INR',
  onSuccess,
  onFailure,
  onClose,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  // Convert paise to rupees if > 1000 and total matches order magnitude
  const displayAmount = amount > 100 ? (amount / 100).toFixed(2) : amount.toFixed(2);

  const handleSuccessClick = async () => {
    try {
      setIsProcessing(true);
      await onSuccess();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFailureClick = () => {
    onFailure('Payment declined by customer (Test Mode)');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden transform animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Dismiss Button */}
        <button
          onClick={onClose}
          disabled={isProcessing}
          aria-label="Close"
          className="absolute top-4 right-4 p-1.5 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header / Brand */}
        <div className="pt-8 pb-4 px-6 text-center border-b border-zinc-100 dark:border-zinc-800/80">
          <div className="flex items-center justify-center gap-2 mb-2">
            {/* Razorpay SVG Logo */}
            <svg
              className="h-7 w-auto"
              viewBox="0 0 140 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Slanted Razorpay Blue Icon */}
              <path
                d="M17.472 2.155L3.63 18.258h10.978l-3.328 11.587 18.06-19.123H17.842l3.418-8.567-3.788-.0001z"
                fill="#0C2340"
                className="dark:fill-[#528FF0]"
              />
              <path
                d="M14.608 18.258l-3.328 11.587 18.06-19.123H17.842l3.418-8.567-6.652 16.103z"
                fill="#00BAF2"
              />
              {/* Wordmark "Razorpay" */}
              <text
                x="36"
                y="23"
                fontFamily="system-ui, -apple-system, sans-serif"
                fontSize="22"
                fontWeight="800"
                fontStyle="italic"
                fill="#0C2340"
                className="dark:fill-white"
                letterSpacing="-0.5"
              >
                Razorpay
              </text>
            </svg>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 text-[11px] font-semibold tracking-wide border border-amber-200 dark:border-amber-800/50">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            TEST MODE SANDBOX
          </div>

          {/* Amount & Order Details */}
          <div className="mt-4 flex items-center justify-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
            <span className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">
              ₹{Number(displayAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-zinc-300 dark:text-zinc-700">•</span>
            <span>Order #{orderNumber}</span>
          </div>
        </div>

        {/* Body Prompt (Image 1 Exact Layout) */}
        <div className="p-6 text-center">
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-200 mb-6">
            You can choose whether to make this payment successful or not:
          </p>

          {isProcessing ? (
            <div className="py-6 flex flex-col items-center justify-center gap-2">
              <Loader2 className="w-8 h-8 text-[#0C2340] dark:text-[#528FF0] animate-spin" />
              <p className="text-xs text-zinc-500 font-medium">Verifying transaction with Razorpay...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
              {/* Success Button */}
              <button
                type="button"
                onClick={handleSuccessClick}
                className="w-full py-3 px-4 rounded-xl font-semibold text-sm text-white bg-[#22c55e] hover:bg-[#16a34a] active:scale-[0.98] transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4" />
                Success
              </button>

              {/* Failure Button */}
              <button
                type="button"
                onClick={handleFailureClick}
                className="w-full py-3 px-4 rounded-xl font-semibold text-sm text-white bg-[#ef4444] hover:bg-[#dc2626] active:scale-[0.98] transition-all shadow-md shadow-rose-600/20 flex items-center justify-center gap-1.5"
              >
                <AlertCircle className="w-4 h-4" />
                Failure
              </button>
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="px-6 py-3 bg-zinc-50 dark:bg-zinc-800/40 border-t border-zinc-100 dark:border-zinc-800 text-[11px] text-zinc-500 dark:text-zinc-400 text-center flex items-center justify-center gap-1">
          <span>🔒 Simulated Razorpay Gateway • Safe for Testing</span>
        </div>
      </div>
    </div>
  );
};
