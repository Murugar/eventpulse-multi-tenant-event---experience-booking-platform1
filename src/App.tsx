import React from 'react';
import { PlatformProvider, usePlatform } from './context/PlatformContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { EventDiscovery } from './components/public/EventDiscovery';
import { EventDetailModal } from './components/public/EventDetailModal';
import { CheckoutModal } from './components/public/CheckoutModal';
import { MyBookingsModal } from './components/public/MyBookingsModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { DoorScannerModal } from './components/admin/DoorScannerModal';
import { EventCreateModal } from './components/admin/EventCreateModal';
import { OmnichannelConcierge } from './components/channels/OmnichannelConcierge';
import { CheckCircle2 } from 'lucide-react';

const AppContent: React.FC = () => {
  const { viewMode, toastMessage } = usePlatform();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white">
      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 animate-in slide-in-from-top-4 fade-in duration-200">
          <div className="bg-slate-900 text-white text-xs px-4 py-2.5 rounded-lg shadow-xl border border-slate-700 flex items-center gap-2 max-w-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="leading-snug">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Common Header */}
      <Header />

      {/* Primary Content View */}
      <main className="flex-1">
        {viewMode === 'public' ? (
          <EventDiscovery />
        ) : (
          <AdminDashboard />
        )}
      </main>

      {/* Global Modals & Floating Concierge Channels */}
      <EventDetailModal />
      <CheckoutModal />
      <MyBookingsModal />
      <DoorScannerModal />
      <EventCreateModal />
      <OmnichannelConcierge />

      {/* Common Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <PlatformProvider>
      <AppContent />
    </PlatformProvider>
  );
}
