import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { leadDb } from "@/lib/db";
import DashboardHeader from "../dashboard/dashboard-header";
import LeadsList from "./leads-list";
import AddLeadButton from "./add-lead-button";
import ImportButton from "./import-button";

export const dynamic = 'force-dynamic';

export default async function LeadsPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/login");
  }

  const leads = leadDb.findMany({ userId: session.user.id });

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader userName={session.user.name || null} userEmail={session.user.email || null} />
      
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">All Leads</h1>
            <p className="text-gray-600">{leads.length} total leads</p>
          </div>
          
          <div className="flex gap-3">
            <ImportButton userId={session.user.id} />
            <AddLeadButton userId={session.user.id} />
          </div>
        </div>

        <LeadsList leads={leads} />
      </main>
    </div>
  );
}
