import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import LoginForm from "./login-form";

export const dynamic = 'force-dynamic';

export default async function LoginPage() {
  const session = await auth();
  
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(160deg, #eaf6f2, #fff 60%)' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">
            <span style={{ color: '#0b5d4b' }}>Next</span>
            <span style={{ color: '#f2994a' }}>Touch</span>
          </h1>
          <p className="text-gray-600">Your follow-up list, written for you every morning</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Sign in</h2>
          <LoginForm />
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm font-semibold text-blue-900 mb-1">Demo Account</p>
            <p className="text-xs text-blue-700">Email: demo@nexttouch.app</p>
            <p className="text-xs text-blue-700">Password: demo123</p>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Real estate follow-up, simplified
        </p>
      </div>
    </div>
  );
}
