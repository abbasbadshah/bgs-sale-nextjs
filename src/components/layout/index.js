import Header from "@/components/header";
import Footer from "@/components/footer";
import Sidebar from "@/components/sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <Header className="z-10" />

      {/* Main content area with sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar className="w-64 flex-shrink-0 bg-white shadow-sm" />

        {/* Main content with footer */}
        <main className="flex-1 flex flex-col overflow-y-auto">
          {/* Content area that grows to push footer down */}
          <div className="flex-1 p-6">{children}</div>

          {/* Footer fixed at bottom of main content */}
          <Footer className="mt-auto bg-white shadow-sm" />
        </main>
      </div>
    </div>
  );
}
