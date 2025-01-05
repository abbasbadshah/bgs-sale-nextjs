"use client";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Sidebar from "@/components/sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex flex-col h-screen">
      {/* Fixed Header */}
      <div className="flex-shrink-0">
        <Header />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Fixed Sidebar */}
        <div className="flex-shrink-0 w-64">
          <Sidebar />
        </div>

        {/* Main Content with Footer */}
        <div className="flex flex-col flex-1 p-6">
          {/* Scrollable Content Area */}
          <main className="flex-1 overflow-y-auto">
            <div className="bg-black rounded h-full">{children}</div>
          </main>

          {/* Fixed Footer */}
          <div className="flex-shrink-0">
            <Footer className="mt-5" />
          </div>
        </div>
      </div>
    </div>
  );
}
