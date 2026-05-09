"use client"

import { toast } from "sonner"
import type { ExternalToast } from "sonner"
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
} from "lucide-react"
import React from "react"

type ToastType = "success" | "error" | "warning" | "info"

interface ToastOptions {
  description?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

const defaultMessages: Record<ToastType, string> = {
  success: "تمت العملية بنجاح",
  error: "حدث خطأ",
  warning: "تحذير",
  info: "معلومة",
}

const defaultDurations: Record<ToastType, number> = {
  success: 3000,
  error: 5000,
  warning: 4000,
  info: 3000,
}

const toastIcons: Record<ToastType, React.ReactNode> = {
  success: React.createElement(CheckCircle2, { className: "toast-icon-success", size: 20, strokeWidth: 2.2 }),
  error: React.createElement(XCircle, { className: "toast-icon-error", size: 20, strokeWidth: 2.2 }),
  warning: React.createElement(AlertTriangle, { className: "toast-icon-warning", size: 20, strokeWidth: 2.2 }),
  info: React.createElement(Info, { className: "toast-icon-info", size: 20, strokeWidth: 2.2 }),
}

export function showToast(type: ToastType, message?: string, options?: ToastOptions) {
  const msg = message || defaultMessages[type]
  const duration = options?.duration ?? defaultDurations[type]

  const config: ExternalToast = {
    description: options?.description,
    duration,
    icon: toastIcons[type],
  }

  switch (type) {
    case "success":
      toast.success(msg, {
        ...config,
        action: options?.action
          ? { label: options.action.label, onClick: options.action.onClick }
          : undefined,
      })
      break
    case "error":
      toast.error(msg, config)
      break
    case "warning":
      toast.warning(msg, config)
      break
    case "info":
      toast.info(msg, config)
      break
  }
}

export function toastLoading(message: string, options?: { description?: string }) {
  return toast.loading(message, {
    description: options?.description,
    icon: React.createElement("div", { className: "toast-spinner" }),
    duration: Infinity,
  })
}

export const toastSuccess = (message?: string, options?: ToastOptions) =>
  showToast("success", message, options)

export const toastError = (message?: string, options?: ToastOptions) =>
  showToast("error", message, options)

export const toastWarning = (message?: string, options?: ToastOptions) =>
  showToast("warning", message, options)

export const toastInfo = (message?: string, options?: ToastOptions) =>
  showToast("info", message, options)
