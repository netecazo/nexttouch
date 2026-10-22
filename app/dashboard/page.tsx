import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { leadDb } from "@/lib/db";
import { scoreAndRankLeads, estimateContactTime } from "@/lib/scoring";
import DashboardHeader from "./dashboard-header";
import TodaysList from "./todays-list";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/login");
  }

  // Get all leads for the user
  const allLeads = await leadDb.findMany({ userId: session.user.id });
  
  // Score and get top 10
  const todaysLeads = scoreAndRankLeads(allLeads, 10);
  
  const timeEstimate = estimateContactTime(todaysLeads.length);

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader userName={session.user.name || null} userEmail={session.user.email || null} />
      
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-baseline gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">Today&apos;s Follow-Ups</h1>
            <span className="text-lg text-gray-500">{todaysLeads.length} leads · {timeEstimate}</span>
          </div>
          <p className="text-gray-600">Your prioritized list for {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>

        {todaysLeads.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <p className="text-xl text-gray-600 mb-2">All caught up!</p>
            <p className="text-gray-500">No urgent follow-ups for today.</p>
          </div>
        ) : (
          <TodaysList leads={todaysLeads} userId={session.user.id} />
        )}
      </main>
    </div>
  );
}
