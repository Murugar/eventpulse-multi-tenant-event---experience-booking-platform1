import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import {
  X,
  QrCode,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Camera,
  Search,
  Volume2
} from 'lucide-react';

export const DoorScannerModal: React.FC = () => {
  const { doorScannerOpen, setDoorScannerOpen, verifyAndCheckInTicket } = usePlatform();

  const [inputCode, setInputCode] = useState('');
  const [scanResult, setScanResult] = useState<{
    status: 'success' | 'already_checked_in' | 'invalid';
    ticket?: any;
    event?: any;
    booking?: any;
    message: string;
  } | null>(null);

  const [recentScans, setRecentScans] = useState<Array<{
    code: string;
    name: string;
    time: string;
    status: string;
  }>>([
    { code: 'LUM-9482-01', name: 'Claire Delacroix', time: '10:05 AM', status: 'Checked In' }
  ]);

  if (!doorScannerOpen) return null;

  const handleScanSubmit = (codeToVerify?: string) => {
    const code = codeToVerify || inputCode;
    if (!code.trim()) return;

    const result = verifyAndCheckInTicket(code);
    setScanResult(result);
    setInputCode('');

    // Audio chime effect
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      if (result.status === 'success') {
        osc.frequency.value = 880; // High success pitch
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.15);
      } else {
        osc.frequency.value = 220; // Low error pitch
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
      }
    } catch (e) {
      // AudioContext not available in some environments
    }

    if (result.status === 'success' && result.ticket) {
      setRecentScans(prev => [
        {
          code: result.ticket.ticketCode,
          name: result.ticket.attendeeName,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'Valid & Checked In'
        },
        ...prev.slice(0, 8)
      ]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Box Office Gate Scanner</span>
                <span className="text-[10px] bg-emerald-900 text-emerald-300 px-1.5 py-0.2 rounded font-mono">
                  Online
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">Door Staff Entrance Verification Terminal</p>
            </div>
          </div>

          <button
            onClick={() => setDoorScannerOpen(false)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Viewfinder simulation container */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="relative w-full h-52 bg-slate-950 rounded-xl border-2 border-dashed border-slate-700 flex flex-col items-center justify-center overflow-hidden">
            
            {/* Animated Laser Scanning Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-400 shadow-[0_0_15px_#10b981] animate-pulse" style={{ animation: 'bounce 2.2s infinite' }} />

            <Camera className="w-10 h-10 text-slate-600 mb-2" />
            <div className="text-xs font-semibold text-slate-300">Point Mobile Ticket QR Code at Camera</div>
            <div className="text-[11px] text-slate-500 mt-1">Automatic optical scan active</div>

            {/* Corner Bracket Guides */}
            <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-emerald-500" />
            <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-emerald-500" />
            <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-emerald-500" />
            <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-emerald-500" />
          </div>

          {/* Manual Input or barcode simulation */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Manual Barcode or Ticket Code Lookup
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. APX-9481-01, VLV-9483-01..."
                value={inputCode}
                onChange={e => setInputCode(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleScanSubmit()}
                className="flex-1 px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white font-mono uppercase focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button
                type="button"
                onClick={() => handleScanSubmit()}
                className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors cursor-pointer"
              >
                Verify Pass
              </button>
            </div>

            {/* Quick Test Chips */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2 text-[10px] text-slate-400">
              <span>Quick Test:</span>
              <button
                type="button"
                onClick={() => handleScanSubmit('APX-9481-01')}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 font-mono cursor-pointer"
              >
                APX-9481-01 (VIP Pass)
              </button>
              <button
                type="button"
                onClick={() => handleScanSubmit('LUM-9482-01')}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-indigo-300 font-mono cursor-pointer"
              >
                LUM-9482-01 (Already In)
              </button>
              <button
                type="button"
                onClick={() => handleScanSubmit('VLV-9483-01')}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-rose-300 font-mono cursor-pointer"
              >
                VLV-9483-01 (Chef Table)
              </button>
            </div>
          </div>

          {/* Validation Result Banner */}
          {scanResult && (
            <div
              className={`p-4 rounded-xl border text-xs animate-in zoom-in-95 duration-150 ${
                scanResult.status === 'success'
                  ? 'bg-emerald-950/80 border-emerald-500 text-emerald-100'
                  : scanResult.status === 'already_checked_in'
                  ? 'bg-amber-950/80 border-amber-500 text-amber-100'
                  : 'bg-rose-950/80 border-rose-500 text-rose-100'
              }`}
            >
              <div className="flex items-start gap-3">
                {scanResult.status === 'success' ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                ) : scanResult.status === 'already_checked_in' ? (
                  <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0" />
                ) : (
                  <XCircle className="w-6 h-6 text-rose-400 shrink-0" />
                )}

                <div className="flex-1">
                  <div className="text-sm font-bold">
                    {scanResult.status === 'success'
                      ? 'VALID ENTRY - ACCESS GRANTED'
                      : scanResult.status === 'already_checked_in'
                      ? 'ATTENTION: TICKET ALREADY USED'
                      : 'ENTRY DENIED: INVALID TICKET'}
                  </div>

                  <div className="mt-1 leading-relaxed">{scanResult.message}</div>

                  {scanResult.ticket && (
                    <div className="mt-3 pt-2.5 border-t border-white/10 grid grid-cols-2 gap-2 text-[11px] font-mono">
                      <div>Attendee: <strong className="text-white">{scanResult.ticket.attendeeName}</strong></div>
                      <div>Tier: <strong className="text-white">{scanResult.ticket.tierName}</strong></div>
                      <div>Seat: <strong className="text-white">{scanResult.ticket.seatInfo}</strong></div>
                      {scanResult.ticket.dietaryNote && (
                        <div className="col-span-2 text-amber-300 font-sans">
                          Allergy/Dietary: {scanResult.ticket.dietaryNote}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Recent Scans Log */}
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Recent Gate Scans Log
            </div>
            <div className="space-y-1.5 max-h-36 overflow-y-auto">
              {recentScans.map((scan, i) => (
                <div
                  key={i}
                  className="px-3 py-2 rounded bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-emerald-400 font-bold">{scan.code}</span>
                    <span className="text-slate-300">{scan.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                    <span>{scan.time}</span>
                    <span className="text-emerald-500 font-semibold">{scan.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
