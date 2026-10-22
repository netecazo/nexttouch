import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { leadDb, activityDb } from "@/lib/db";
import DashboardHeader from "../../dashboard/dashboard-header";
import LeadDetails from "./lead-details";

export const dynamic = 'force-dynamic';

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/login");
  }

  const { id } = await params;
  const lead = leadDb.findById(id);
  
  if (!lead || lead.userId !== session.user.id) {
    redirect("/leads");
  }

  const activities = activityDb.findMany({ leadId: id });

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader userName={session.user.name || null} userEmail={session.user.email || null} />
      
      <main className="max-w-4xl mx-auto px-6 py-8">
        <LeadDetails lead={lead} activities={activities} />
      </main>
    </div>
  );
}
