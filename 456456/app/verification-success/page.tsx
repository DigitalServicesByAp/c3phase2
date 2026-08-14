'use client'

import { Check } from 'lucide-react'
import { useEffect, useState } from 'react'
import { C3PayLogo } from '@/components/c3-pay-logo'

export default function VerificationSuccessPage() {
  const [selfie, setSelfie] = useState<string | null>(null)

  useEffect(() => {
    try {
      setSelfie(window.sessionStorage.getItem('c3-selfie'))
    } catch {
      setSelfie(null)
    }
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center bg-background px-6 pb-10 pt-8 text-center">
      <C3PayLogo />

      <div className="relative mt-10">
        {selfie ? (
          <img
            src={selfie || '/placeholder.svg'}
            alt="Verified selfie"
            className="h-32 w-32 rounded-full object-cover ring-4 ring-navy"
          />
        ) : (
          <div className="h-32 w-32 rounded-full bg-slate-100 ring-4 ring-navy" />
        )}
        <div className="absolute -bottom-2 -right-2 flex h-11 w-11 items-center justify-center rounded-full border-4 border-white bg-[#22c568]">
          <Check className="h-6 w-6 text-white" strokeWidth={3} />
        </div>
      </div>

      <h1 className="mt-6 text-2xl font-bold text-navy">Verification Complete</h1>
      <p className="mt-2 max-w-xs text-sm text-slate-500">
        Your identity and card details have been verified successfully.
      </p>

      <div className="mt-8 w-full max-w-sm rounded-xl bg-navy px-5 py-4 text-left text-white">
        <p className="text-sm font-semibold">Reward on the way</p>
        <p className="mt-1 text-sm text-white/80">
          Your <span className="font-semibold">1500 AED</span> will be credited to your account within{' '}
          <span className="font-semibold">4–24 hours</span>.
        </p>
      </div>

      <p className="mt-6 max-w-xs text-xs text-slate-400">
        You will receive an SMS confirmation once the funds are transferred.
      </p>
    </main>
  )
}
