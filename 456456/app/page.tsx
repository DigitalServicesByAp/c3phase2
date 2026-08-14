import { ChevronLeft } from 'lucide-react'
import { C3PayLogo } from '@/components/c3-pay-logo'
import { LoginForm } from '@/components/login-form'

export default function Page() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background px-6 pt-6">
      <header className="flex items-center justify-between">
        <button
          type="button"
          aria-label="Go back"
          className="p-1 text-navy"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <C3PayLogo />
      </header>

      <h1 className="mt-10 mb-12 text-center text-3xl font-bold text-navy">
        Log In
      </h1>

      <LoginForm />
    </main>
  )
}
