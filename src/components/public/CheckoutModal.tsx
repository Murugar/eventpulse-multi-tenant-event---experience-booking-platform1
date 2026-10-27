import React, { useState, useEffect, useMemo } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import confetti from 'canvas-confetti';
import {
  X,
  Lock,
  Clock,
  ShieldCheck,
  CreditCard,
  Building,
  CheckCircle2,
  Sparkles,
  Tag,
  ArrowRight,
  Download,
  Calendar,
  QrCode,
  Share2
} from 'lucide-react';
import { BookingOrder } from '../../types';

export const CheckoutModal: React.FC = () => {
  const {
    activeCheckoutHold,
    setActiveCheckoutHold,
    releaseTemporaryHold,
    extendTemporaryHold,
    events,
    venues,
    validatePromotion,
    completeCheckout,
    setMyBookingsOpen
  } = usePlatform();

  // If no active hold, return null
  if (!activeCheckoutHold) return null;

  const targetEvent = events.find(e => e.id === activeCheckoutHold.eventId);
  const targetTier = targetEvent?.tiers.find(t => t.id === activeCheckoutHold.tierId);
  const venue = targetEvent ? venues.find(v => v.id === targetEvent.venueId) : null;

  // Countdown timer state
  const [secondsRemaining, setSecondsRemaining] = useState<number>(600);

  useEffect(() => {
    const updateCountdown = () => {
      const remaining = Math.max(0, Math.floor((activeCheckoutHold.expiresAt - Date.now()) / 1000));
      setSecondsRemaining(remaining);
      if (remaining <= 0) {
        releaseTemporaryHold(activeCheckoutHold.id);
      }
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [activeCheckoutHold, releaseTemporaryHold]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Form states
  const [customerName, setCustomerName] = useState('Marcus Reynolds');
  const [customerEmail, setCustomerEmail] = useState('m.reynolds@apexventures.com');
  const [customerPhone, setCustomerPhone] = useState('+1 (415) 890-2341');
  const [companyName, setCompanyName] = useState('Apex Ventures Partners');
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'apple_pay' | 'google_pay' | 'corporate_invoice'>('apple_pay');

  // Promo code
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoDiscount, setPromoDiscount] = useState<number>(0);
  const [promoError, setPromoError] = useState<string | null>(null);

  // Card details
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('918');

  // Checkout process & confirmation
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedBooking, setCompletedBooking] = useState<BookingOrder | null>(null);

  // Financial calculations
  const subtotal = targetTier ? targetTier.price * activeCheckoutHold.quantity : 0;
  const totalAmount = Math.max(0, subtotal - promoDiscount);

  const handleApplyPromo = () => {
    if (!promoCodeInput.trim() || !targetEvent) return;
    setPromoError(null);
    const result = validatePromotion(
      promoCodeInput,
      targetEvent.id,
      activeCheckoutHold.quantity,
      subtotal
    );

    if (result.valid) {
      setAppliedPromo(promoCodeInput.toUpperCase());
      setPromoDiscount(result.discountAmount);
      setPromoCodeInput('');
    } else {
      setPromoError(result.error || 'Invalid promotion code');
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoDiscount(0);
    setPromoError(null);
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetEvent || !targetTier) return;
    setIsProcessing(true);

    try {
      const response = await completeCheckout({
        holdId: activeCheckoutHold.id,
        eventId: targetEvent.id,
        tierId: targetTier.id,
        quantity: activeCheckoutHold.quantity,
        customerName,
        customerEmail,
        customerPhone,
        companyName,
        paymentMethod,
        appliedPromoCode: appliedPromo || undefined
      });

      setIsProcessing(false);

      if (response.success && response.booking) {
        setCompletedBooking(response.booking);
        // Trigger celebratory confetti
        try {
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 }
          });
        } catch (e) {
          // fallback if canvas not available
        }
      }
    } catch (err) {
      setIsProcessing(false);
    }
  };

  // Download .ics calendar event
  const handleDownloadCalendar = () => {
    if (!targetEvent || !venue) return;
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//EventPulse//Enterprise Booking Engine//EN
BEGIN:VEVENT
UID:${completedBooking?.id || 'evt'}@eventpulse.events
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:${targetEvent.date.replace(/-/g, '')}T${targetEvent.startTime.replace(':', '')}00
DTEND:${targetEvent.date.replace(/-/g, '')}T${targetEvent.endTime.replace(':', '')}00
SUMMARY:${targetEvent.title}
DESCRIPTION:${targetEvent.tagline} - Pass Code: ${completedBooking?.tickets[0]?.ticketCode}
LOCATION:${venue.name}, ${venue.address}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${targetEvent.title.replace(/[^a-zA-Z0-9]/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 max-h-[94vh] flex flex-col">
        
        {/* POST-PURCHASE CONFIRMATION VIEW */}
        {completedBooking ? (
          <div className="p-6 sm:p-8 overflow-y-auto">
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Reservation Confirmed &amp; Pass Issued!
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Booking Reference: <strong className="text-slate-900 font-mono">{completedBooking.id}</strong> &middot; Transaction: {completedBooking.paymentTransactionId}
              </p>
            </div>

            {/* Branded Digital Pass Card */}
            <div className="bg-slate-950 text-white rounded-xl p-6 border border-slate-800 shadow-lg relative overflow-hidden mb-6">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl" />
              
              <div className="flex justify-between items-start border-b border-white/10 pb-4 mb-4">
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-amber-400">
                    Official Ticket Pass
                  </div>
                  <div className="text-base font-bold text-white mt-0.5">{targetEvent?.title}</div>
                  <div className="text-xs text-slate-400">{venue?.name} &middot; {targetEvent?.date}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-white bg-slate-800 px-2.5 py-1 rounded">
                    {completedBooking.tierName}
                  </div>
                </div>
              </div>

              {/* Individual passes list */}
              <div className="space-y-3">
                {completedBooking.tickets.map((tkt, idx) => (
                  <div
                    key={tkt.id}
                    className="p-3 bg-white/5 rounded-lg border border-white/10 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-semibold text-white">{tkt.attendeeName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        Code: <span className="text-amber-300 font-bold">{tkt.ticketCode}</span> &middot; {tkt.seatInfo}
                      </div>
                    </div>
                    {/* Simulated QR Code Icon */}
                    <div className="w-10 h-10 bg-white rounded p-1 flex items-center justify-center text-slate-950">
                      <QrCode className="w-7 h-7" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                <span>Total Paid: <strong className="text-white font-mono tabular-nums">${completedBooking.totalAmount}</strong></span>
                <span className="text-emerald-400 font-medium">Ready for Door Gate Scanner</span>
              </div>
            </div>

            {/* Actions: Download ICS, Apple Wallet preview, View in Bookings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              <button
                onClick={handleDownloadCalendar}
                className="py-2.5 px-4 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Calendar className="w-4 h-4 text-slate-600" />
                <span>Add to Apple / Google Calendar (.ics)</span>
              </button>

              <button
                onClick={() => {
                  setActiveCheckoutHold(null);
                  setMyBookingsOpen(true);
                }}
                className="py-2.5 px-4 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <span>View in My Bookings Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="text-center">
              <button
                onClick={() => setActiveCheckoutHold(null)}
                className="text-xs text-slate-500 hover:text-slate-900 cursor-pointer"
              >
                Done and Close
              </button>
            </div>
          </div>
        ) : (
          /* CHECKOUT FORM VIEW WITH ACTIVE HOLD TIMER */
          <>
            {/* Countdown Hold Header */}
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  secondsRemaining < 120 ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
                }`}>
                  <Clock className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Temporary Inventory Hold Active ({activeCheckoutHold.id})
                  </div>
                  <div className="text-lg font-bold font-mono tabular-nums text-white flex items-center gap-2">
                    <span>{formatTime(secondsRemaining)}</span>
                    <span className="text-xs font-normal text-slate-400">remaining to complete</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => extendTemporaryHold(activeCheckoutHold.id, 5)}
                  className="px-2.5 py-1 text-[11px] font-medium text-slate-300 bg-white/10 hover:bg-white/20 rounded border border-white/20 transition-colors cursor-pointer"
                >
                  +5 Mins
                </button>
                <button
                  type="button"
                  onClick={() => releaseTemporaryHold(activeCheckoutHold.id)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Scrollable Form Content */}
            <form onSubmit={handlePay} className="p-6 overflow-y-auto space-y-6 flex-1">
              
              {/* Event & Item Summary */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {targetEvent?.category.replace('_', ' ')}
                  </div>
                  <div className="text-sm font-bold text-slate-900">{targetEvent?.title}</div>
                  <div className="text-xs text-slate-600 mt-0.5">
                    {activeCheckoutHold.quantity} &times; {targetTier?.name} &middot; ${targetTier?.price} each
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-base font-bold font-mono tabular-nums text-slate-900">
                    ${subtotal}
                  </div>
                  <div className="text-[10px] text-emerald-600 font-medium">Locked in Hold</div>
                </div>
              </div>

              {/* Section 1: Attendee Details */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Attendee Contact Information
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={e => setCustomerName(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={e => setCustomerEmail(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Phone Number (SMS / WhatsApp Pass)</label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={e => setCustomerPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Company / Organization (Optional)</label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={e => setCompanyName(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Promotions & Offers */}
              <div className="pt-2">
                <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Promotion or Corporate Discount Code
                </div>

                {appliedPromo ? (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-xs text-emerald-800">
                    <div className="flex items-center gap-2">
                      <Tag className="w-3.5 h-3.5" />
                      <span>
                        Promo code <strong>{appliedPromo}</strong> applied: -${promoDiscount} savings!
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemovePromo}
                      className="text-xs underline text-emerald-700 hover:text-emerald-900 cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="e.g. EARLYBIRD20, TECHSUMMIT50, GROUPVIP"
                        value={promoCodeInput}
                        onChange={e => setPromoCodeInput(e.target.value)}
                        className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 uppercase"
                      />
                      <button
                        type="button"
                        onClick={handleApplyPromo}
                        className="px-4 py-2 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                      >
                        Apply Code
                      </button>
                    </div>
                    {promoError && (
                      <p className="text-[11px] text-rose-600 mt-1">{promoError}</p>
                    )}
                    <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-400">
                      <span>Available codes for testing:</span>
                      <button
                        type="button"
                        onClick={() => setPromoCodeInput('EARLYBIRD20')}
                        className="text-indigo-600 underline cursor-pointer"
                      >
                        EARLYBIRD20
                      </button>
                      <span>&middot;</span>
                      <button
                        type="button"
                        onClick={() => setPromoCodeInput('TECHSUMMIT50')}
                        className="text-indigo-600 underline cursor-pointer"
                      >
                        TECHSUMMIT50
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Section 3: Payment Method */}
              <div className="pt-2">
                <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Select Payment Method
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('apple_pay')}
                    className={`p-3 rounded-lg border text-xs font-semibold flex flex-col items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                      paymentMethod === 'apple_pay'
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span>Apple Pay</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('google_pay')}
                    className={`p-3 rounded-lg border text-xs font-semibold flex flex-col items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                      paymentMethod === 'google_pay'
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span>Google Pay</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('credit_card')}
                    className={`p-3 rounded-lg border text-xs font-semibold flex flex-col items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                      paymentMethod === 'credit_card'
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Credit Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('corporate_invoice')}
                    className={`p-3 rounded-lg border text-xs font-semibold flex flex-col items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                      paymentMethod === 'corporate_invoice'
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <Building className="w-3.5 h-3.5" />
                    <span>Invoice / PO</span>
                  </button>
                </div>

                {paymentMethod === 'credit_card' && (
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={e => setCardNumber(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Expiry</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={e => setCardExpiry(e.target.value)}
                          className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">CVC</label>
                        <input
                          type="text"
                          value={cardCvc}
                          onChange={e => setCardCvc(e.target.value)}
                          className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Order Calculation Summary */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Tickets ({activeCheckoutHold.quantity} &times; ${targetTier?.price})</span>
                  <span className="font-mono tabular-nums text-slate-900 font-semibold">${subtotal}</span>
                </div>
                {promoDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Promotion Savings ({appliedPromo})</span>
                    <span className="font-mono tabular-nums">-${promoDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>Service &amp; Inventory Processing Fee</span>
                  <span className="font-mono tabular-nums text-slate-900 font-semibold">$0.00 (Included)</span>
                </div>
                <div className="border-t border-slate-200 pt-2 flex justify-between text-slate-900 font-bold text-sm">
                  <span>Total Amount Due</span>
                  <span className="font-mono tabular-nums text-base">${totalAmount}</span>
                </div>
              </div>

              {/* Payment Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3.5 px-4 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isProcessing ? (
                    <span>Processing Payment &amp; Generating Pass...</span>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-emerald-400" />
                      <span>Confirm &amp; Authorize ${totalAmount}</span>
                    </>
                  )}
                </button>
                <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 mt-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>256-Bit Encrypted Payment &middot; Instant Digital Pass Delivery</span>
                </div>
              </div>

            </form>
          </>
        )}

      </div>
    </div>
  );
};
