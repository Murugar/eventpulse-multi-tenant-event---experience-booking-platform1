import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import {
  X,
  Ticket,
  Calendar,
  MapPin,
  QrCode,
  CheckCircle2,
  Clock,
  RotateCcw,
  Send,
  Download,
  AlertTriangle
} from 'lucide-react';
import { BookingOrder } from '../../types';

export const MyBookingsModal: React.FC = () => {
  const {
    myBookingsOpen,
    setMyBookingsOpen,
    userBookings,
    events,
    venues,
    processRefund,
    showToast
  } = usePlatform();

  const [selectedBookingForAction, setSelectedBookingForAction] = useState<BookingOrder | null>(null);
  const [showRefundConfirm, setShowRefundConfirm] = useState(false);
  const [transferAttendeeEmail, setTransferAttendeeEmail] = useState('');
  const [showTransferModal, setShowTransferModal] = useState(false);

  if (!myBookingsOpen) return null;

  const handleRefundBooking = (booking: BookingOrder) => {
    const res = processRefund(booking.id, true, 'Customer self-service request');
    setShowRefundConfirm(false);
    setSelectedBookingForAction(null);
  };

  const handleTransferTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferAttendeeEmail.trim()) return;
    showToast(`Ticket successfully transferred to ${transferAttendeeEmail}. Confirmation emailed.`);
    setShowTransferModal(false);
    setTransferAttendeeEmail('');
    setSelectedBookingForAction(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <Ticket className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-base font-bold text-white">My Bookings &amp; Digital Passes</h2>
              <div className="text-[11px] text-slate-400">
                Logged in as Marcus Reynolds (m.reynolds@apexventures.com)
              </div>
            </div>
          </div>

          <button
            onClick={() => setMyBookingsOpen(false)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {userBookings.length === 0 ? (
            <div className="text-center py-12">
              <Ticket className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <div className="text-sm font-semibold text-slate-700">No active bookings found</div>
              <p className="text-xs text-slate-500 mt-1">
                Explore our upcoming concerts, conferences, and dining experiences to reserve tickets.
              </p>
            </div>
          ) : (
            userBookings.map(booking => {
              const event = events.find(e => e.id === booking.eventId);
              const venue = event ? venues.find(v => v.id === event.venueId) : null;
              const isRefunded = booking.status === 'refunded';

              return (
                <div
                  key={booking.id}
                  className={`rounded-xl border transition-all overflow-hidden ${
                    isRefunded
                      ? 'border-slate-200 bg-slate-50 opacity-70'
                      : 'border-slate-300 bg-white shadow-sm'
                  }`}
                >
                  {/* Booking Header Banner */}
                  <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-slate-900 font-mono">{booking.id}</span>
                      <span aria-hidden="true">&middot;</span>
                      <span className="text-slate-500">Booked on {new Date(booking.bookedAt).toLocaleDateString()}</span>
                      <span aria-hidden="true">&middot;</span>
                      <span className="capitalize text-slate-600">Channel: {booking.channel}</span>
                    </div>

                    <div>
                      {isRefunded ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                          Refunded &amp; Restocked
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Confirmed &amp; Valid
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="p-5">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                      <div>
                        <div className="text-base font-bold text-slate-900">{event?.title}</div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            {event?.date} &middot; {event?.startTime}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            {venue?.name}, {venue?.city}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-xs text-slate-500">Amount Paid</div>
                        <div className="text-lg font-bold font-mono tabular-nums text-slate-900">
                          ${booking.totalAmount}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {booking.paymentMethod.replace('_', ' ').toUpperCase()}
                        </div>
                      </div>
                    </div>

                    {/* Passes Grid */}
                    <div className="space-y-2 mt-4 pt-4 border-t border-slate-100">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Individual Entry Passes ({booking.tickets.length})
                      </div>

                      {booking.tickets.map(ticket => (
                        <div
                          key={ticket.id}
                          className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-white rounded border border-slate-200 p-1 flex items-center justify-center text-slate-900">
                              <QrCode className="w-6 h-6" />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-slate-900">{ticket.attendeeName}</div>
                              <div className="text-[11px] text-slate-500 font-mono">
                                Pass Code: <strong className="text-slate-900">{ticket.ticketCode}</strong> &middot; {ticket.tierName} &middot; {ticket.seatInfo}
                              </div>
                              {ticket.dietaryNote && (
                                <div className="text-[10px] text-amber-700 italic">
                                  Dietary Note: {ticket.dietaryNote}
                                </div>
                              )}
                            </div>
                          </div>

                          <div>
                            {ticket.checkedIn ? (
                              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                Checked In
                              </span>
                            ) : isRefunded ? (
                              <span className="text-[10px] font-semibold text-slate-400 bg-slate-200 px-2 py-1 rounded">
                                Voided
                              </span>
                            ) : (
                              <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-1 rounded">
                                Ready for Gate
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Self-Service Actions */}
                    {!isRefunded && (
                      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedBookingForAction(booking);
                              setShowTransferModal(true);
                            }}
                            className="px-3 py-1.5 font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            <Send className="w-3 h-3 text-slate-500" />
                            <span>Transfer Ticket</span>
                          </button>
                        </div>

                        <div>
                          <button
                            onClick={() => {
                              setSelectedBookingForAction(booking);
                              setShowRefundConfirm(true);
                            }}
                            className="px-3 py-1.5 font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            <RotateCcw className="w-3 h-3 text-rose-600" />
                            <span>Request Refund</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Transfer Ticket Modal */}
        {showTransferModal && selectedBookingForAction && (
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl border border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 mb-1">Transfer Entry Pass</h3>
              <p className="text-xs text-slate-500 mb-4">
                Enter the email address of the colleague or friend you wish to transfer this ticket to.
              </p>
              <form onSubmit={handleTransferTicket} className="space-y-3">
                <input
                  type="email"
                  required
                  placeholder="recipient@example.com"
                  value={transferAttendeeEmail}
                  onChange={e => setTransferAttendeeEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowTransferModal(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800"
                  >
                    Send Transfer
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Refund Confirmation Modal */}
        {showRefundConfirm && selectedBookingForAction && (
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl border border-slate-200">
              <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-3">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">Confirm Cancellation &amp; Refund</h3>
              <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                Are you sure you want to cancel booking <strong>{selectedBookingForAction.id}</strong>? A refund of <strong>${selectedBookingForAction.totalAmount}</strong> will be processed to your payment method, and tickets will be returned to the inventory pool.
              </p>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRefundConfirm(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Keep Tickets
                </button>
                <button
                  type="button"
                  onClick={() => handleRefundBooking(selectedBookingForAction)}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg cursor-pointer"
                >
                  Confirm &amp; Refund
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
