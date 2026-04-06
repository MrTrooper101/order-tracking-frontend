import React, { ReactNode } from 'react'

interface StatusBadgeProps {
  status: string
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig: Record<string, string> = {
    'New': 'bg-gray-100 text-gray-800',
    'Confirmed': 'bg-blue-100 text-blue-800',
    'Paid': 'bg-green-100 text-green-800',
    'Packed': 'bg-purple-100 text-purple-800',
    'Shipped': 'bg-indigo-100 text-indigo-800',
    'Delivered': 'bg-emerald-100 text-emerald-800',
    'Cancelled': 'bg-red-100 text-red-800'
  }

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusConfig[status] || 'bg-gray-100 text-gray-800'}`}>
      {status}
    </span>
  )
}

interface PaymentStatusBadgeProps {
  status: string
}

export function PaymentStatusBadge({ status }: PaymentStatusBadgeProps) {
  const statusConfig: Record<string, string> = {
    'Pending': 'bg-yellow-100 text-yellow-800',
    'Paid': 'bg-green-100 text-green-800'
  }

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusConfig[status] || 'bg-gray-100 text-gray-800'}`}>
      {status}
    </span>
  )
}

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  )
}

interface ErrorAlertProps {
  message: string
}

export function ErrorAlert({ message }: ErrorAlertProps) {
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
      {message}
    </div>
  )
}

interface SuccessAlertProps {
  message: string
}

export function SuccessAlert({ message }: SuccessAlertProps) {
  return (
    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
      {message}
    </div>
  )
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'danger' | 'success'
}

export function Button({ children, variant = 'primary', className = '', ...props }: ButtonProps) {
  const baseStyles = 'px-4 py-2 rounded-lg font-medium transition-colors duration-200'
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    success: 'bg-green-600 text-white hover:bg-green-700'
  }

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}

interface CardProps {
  children: ReactNode
  className?: string
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      {children}
    </div>
  )
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  id?: string
}

export function Input({ label, id, ...props }: InputProps) {
  return (
    <div className="mb-4">
      {label && <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}
      <input
        id={id}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        {...props}
      />
    </div>
  )
}

interface OptionType {
  value: string | number
  label: string
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  id?: string
  options?: OptionType[]
}

export function Select({ label, id, options, ...props }: SelectProps) {
  return (
    <div className="mb-4">
      {label && <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}
      <select
        id={id}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        {...props}
      >
        <option value="">Select {label?.toLowerCase()}</option>
        {options?.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  )
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  id?: string
}

export function Textarea({ label, id, ...props }: TextareaProps) {
  return (
    <div className="mb-4">
      {label && <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}
      <textarea
        id={id}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        rows={4}
        {...props}
      />
    </div>
  )
}
