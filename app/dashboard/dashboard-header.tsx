"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardHeader({ userName, userEmail }: { userName?: string | null, userEmail?: string | null }) {
  const pathname = usePathname();

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="text-2xl font-bold">
              <span style={{ color: '#0b5d4b' }}>Next</span>
              <span style={{ color: '#f2994a' }}>Touch</span>
            </Link>
            
            <nav className="flex gap-6">
              <Link 
                href="/dashboard" 
                className={`text-sm font-medium transition-colors ${
                  pathname === '/dashboard' 
                    ? 'text-green-700' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Today&apos;s 10
              </Link>
              <Link 
                href="/leads" 
                className={`text-sm font-medium transition-colors ${
                  pathname === '/leads' 
                    ? 'text-green-700' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                All Leads
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{userName || userEmail}</p>
              <p className="text-xs text-gray-500">{userName ? userEmail : ''}</p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
