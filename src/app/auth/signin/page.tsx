import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import SignInButton from "@/components/auth/SignInButton"

export default async function SignInPage() {
  const session = await getServerSession(authOptions)
  
  if (session) {
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="bg-black/60 backdrop-blur-sm rounded-xl p-8 border border-gray-800/50 max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 font-dogelica text-white">
            🔮 Gorki SoloQ Challenge
          </h1>
          <p className="text-gray-400">
            Connecte-toi avec Discord pour participer aux prédictions
          </p>
        </div>
        
        <SignInButton />
        
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Seuls les membres du serveur Discord peuvent participer</p>
        </div>
      </div>
    </div>
  )
}
