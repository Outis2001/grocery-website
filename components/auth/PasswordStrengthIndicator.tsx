'use client'

import { getPasswordStrengthChecks } from '@/lib/auth/password'
import { Check, X } from 'lucide-react'

interface PasswordStrengthIndicatorProps {
  password: string
  confirmPassword?: string
}

export function PasswordStrengthIndicator({ password, confirmPassword }: PasswordStrengthIndicatorProps) {
  const checks = getPasswordStrengthChecks(password)
  const passwordsMatch = confirmPassword === undefined || password === confirmPassword || confirmPassword === ''

  return (
    <div className="space-y-2 text-sm" role="list" aria-label="Password requirements">
      <div className={`flex items-center gap-2 ${checks.minLength ? 'text-green-600' : 'text-gray-500'}`}>
        {checks.minLength ? (
          <Check className="w-4 h-4 flex-shrink-0" aria-hidden />
        ) : (
          <X className="w-4 h-4 flex-shrink-0" aria-hidden />
        )}
        <span>At least 8 characters</span>
      </div>
      <div className={`flex items-center gap-2 ${checks.hasNumber ? 'text-green-600' : 'text-gray-500'}`}>
        {checks.hasNumber ? (
          <Check className="w-4 h-4 flex-shrink-0" aria-hidden />
        ) : (
          <X className="w-4 h-4 flex-shrink-0" aria-hidden />
        )}
        <span>At least one number</span>
      </div>
      {confirmPassword !== undefined && (
        <div className={`flex items-center gap-2 ${passwordsMatch ? 'text-green-600' : 'text-gray-500'}`}>
          {passwordsMatch ? (
            <Check className="w-4 h-4 flex-shrink-0" aria-hidden />
          ) : (
            <X className="w-4 h-4 flex-shrink-0" aria-hidden />
          )}
          <span>Passwords match</span>
        </div>
      )}
    </div>
  )
}
