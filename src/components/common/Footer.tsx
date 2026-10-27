import React from 'react';
import { usePlatform } from '../../context/PlatformContext';

export const Footer: React.FC = () => {
  const { tenants, setCurrentTenantId } = usePlatform();

  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-1">
            <div className="text-white font-extrabold text-base tracking-tight mb-2">EVENTPULSE</div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Enterprise multi-tenant booking infrastructure powering world-class concerts, summits, fine dining chef tables, and immersive brand activations.
            </p>
            <div className="text-[11px] text-slate-500 font-mono">
              PostgreSQL · Unified Redis Inventory · Omnichannel Concierge
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">Client Portals</h4>
            <ul className="space-y-2 text-xs">
              {tenants.map(t => (
                <li key={t.id}>
                  <button
                    onClick={() => {
                      setCurrentTenantId(t.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    {t.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">Platform Capabilities</h4>
            <ul className="space-y-2 text-xs">
              <li className="text-slate-400">Atomic 10-Minute Hold Engine</li>
              <li className="text-slate-400">WhatsApp &amp; Voice Automated Concierge</li>
              <li className="text-slate-400">Door &amp; Gate Box Office POS Scanner</li>
              <li className="text-slate-400">Native Tiered Promotions &amp; Bundles</li>
              <li className="text-slate-400">Client Net Settlement &amp; Reconciliation</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">Security &amp; Compliance</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              All transactions secured via tokenized gateways. Safeguards against concurrency overbooking enforced across conversational and web channels simultaneously.
            </p>
            <div className="text-xs text-emerald-400 font-medium">
              Zero-Overbooking Guarantee Active
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            &copy; 2026 EventPulse Technologies Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span aria-hidden="true">&middot;</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span aria-hidden="true">&middot;</span>
            <span className="hover:text-slate-400 cursor-pointer">API Documentation</span>
            <span aria-hidden="true">&middot;</span>
            <span className="hover:text-slate-400 cursor-pointer">Support Desk</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
