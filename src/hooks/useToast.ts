/**
 * Hook para gerenciar toasts
 * Substitui alerts e console.log para feedback ao usuário
 */

import { useState, useCallback } from "react";
import { ToastConfig } from "../components/ui/Toast";

export interface ToastState extends ToastConfig {
  id: string;
}

export function useToast() {
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

  return {
    toasts,
    showToast,
    showSuccess,
    showError,
    showInfo,
    showWarning,
    dismissToast,
  };
}
