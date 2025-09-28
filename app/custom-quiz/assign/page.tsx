"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function CustomQuizAssignPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect directly to form page
    router.push('/custom-quiz/form')
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-700">Redirecting to form...</h2>
      </div>
    </div>
  )
}
