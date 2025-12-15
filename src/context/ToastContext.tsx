/**
 * Toast Context - Gerencia toasts globalmente
 * Usa Context API para compartilhar estado entre componentes
 */

import React, { createContext, useContext, useState, useCallback } from "react";
import { ToastConfig, Toast } from "../components/ui/Toast";

interface ToastState extends ToastConfig {
  id: string;
}

interface ToastContextType {
  toasts: ToastState[];
  showToast: (config: ToastConfig) => void;
  dismissToast: (id: string) => void;
  showSuccess: (message: string, duration?: number) => void;
  showError: (message: string, duration?: number) => void;
  showInfo: (message: string, duration?: number) => void;
  showWarning: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastState[]>([]);

  const showToast = useCallback((config: ToastConfig) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { ...config, id }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showSuccess = useCallback((message: string, duration?: number) => {
    showToast({ message, type: "success", duration });
  }, [showToast]);

  const showError = useCallback((message: string, duration?: number) => {
    showToast({ message, type: "error", duration: duration || 5000 });
  }, [showToast]);

  const showInfo = useCallback((message: string, duration?: number) => {
    showToast({ message, type: "info", duration });
  }, [showToast]);

  const showWarning = useCallback((message: string, duration?: number) => {
    showToast({ message, type: "warning", duration });
  }, [showToast]);

  return (
    <ToastContext.Provider
      value={{
        toasts,
        showToast,
        dismissToast,
        showSuccess,
        showError,
        showInfo,
        showWarning,
      }}
    >
      {children}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          action={toast.action}
          onDismiss={() => dismissToast(toast.id)}
        />
      ))}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}
