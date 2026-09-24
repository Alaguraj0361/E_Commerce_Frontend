'use client';

import { Toaster as SonnerToaster } from 'sonner';

export const ToastProvider = () => {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        className: 'border border-zinc-200 bg-white text-zinc-900 shadow-xl rounded-xl p-4 font-sans text-sm',
      }}
      richColors
      closeButton
    />
  );
};
