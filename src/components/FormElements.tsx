import React from 'react'
import { Button } from './UI'

interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'danger' | 'success'
  className?: string
}

export function PrimaryButton({ children, className = '', ...props }: ButtonProps) {
  return (
    <Button variant="primary" className={className} {...props}>
      {children}
    </Button>
  )
}

export function SecondaryButton({ children, className = '', ...props }: ButtonProps) {
  return (
    <Button variant="secondary" className={className} {...props}>
      {children}
    </Button>
  )
}
