'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to login page
    router.replace('/login')
  }, [router])

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">Insurance Brokerage Platform</h1>
        <p className="mb-4">Redirecting to login page...</p>
        <div className="animate-spin h-8 w-8 mx-auto border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    </main>
  )
}
