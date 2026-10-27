import React, { useState, useEffect, useRef } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import {
  MessageSquare,
  X,
  Send,
  Mic,
  MicOff,
  UserCheck,
  Bot,
  User,
  Sparkles,
  PhoneCall,
  CheckCheck,
  ShieldCheck,
  Lock,
  ArrowRight
} from 'lucide-react';

export const OmnichannelConcierge: React.FC = () => {
  const {
    conciergeOpen,
    setConciergeOpen,
    conciergeChannel,
    setConciergeChannel,
    conversations,
    activeConversationId,
    setActiveConversationId,
    sendMessageToChannel,
    requestHumanHandoff,
    setSelectedEventId,
    createTemporaryHold
  } = usePlatform();

  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeSession = conversations.find(c => c.id === activeConversationId) || conversations[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeSession?.messages, conciergeOpen]);

  if (!conciergeOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setConciergeOpen(true)}
          className="group flex items-center gap-2.5 px-4 py-3 bg-slate-900 text-white rounded-full shadow-xl hover:bg-slate-800 transition-all hover:scale-105 cursor-pointer border border-slate-700"
        >
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div className="text-left">
            <div className="text-xs font-bold leading-tight">Omnichannel Concierge</div>
            <div className="text-[10px] text-slate-300 font-medium">Chat · WhatsApp · Voice</div>
          </div>
        </button>
      </div>
    );
  }

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || !activeSession) return;
    sendMessageToChannel(activeSession.id, inputMessage, 'user');
    setInputMessage('');
  };

  // Voice Web Speech API Integration
  const handleToggleVoiceListen = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      // Simulate voice capture if browser API is restricted
      setIsListening(true);
      setTimeout(() => {
        setInputMessage('Check VIP tickets for Astra Nova concert');
        setIsListening(false);
      }, 1500);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputMessage(transcript);
    };

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
    }
  };

  // Text-to-Speech playback for voice assistant
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="fixed bottom-6 right-4 sm:right-6 z-50 w-[94vw] sm:w-[440px] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[580px] max-h-[85vh] animate-in slide-in-from-bottom-6 duration-200">
      
      {/* Concierge Channel Selector Header */}
      <div className="bg-slate-900 text-white p-4 border-b border-slate-800 shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-xs">
              EP
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>Conversational Concierge</span>
                <span className="text-[10px] bg-slate-800 text-emerald-400 font-mono px-1.5 py-0.5 rounded">Live</span>
              </div>
              <div className="text-[10px] text-slate-400">
                Unified inventory holds across all channels
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              if ('speechSynthesis' in window) window.speechSynthesis.cancel();
              setConciergeOpen(false);
            }}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 3 Channels Switcher Tabs */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-slate-950 rounded-lg text-xs font-medium">
          <button
            onClick={() => {
              setConciergeChannel('chatbot');
              setActiveConversationId('conv-02');
            }}
            className={`py-1.5 rounded-md transition-colors cursor-pointer text-center ${
              conciergeChannel === 'chatbot' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            AI Assistant
          </button>

          <button
            onClick={() => {
              setConciergeChannel('whatsapp');
              setActiveConversationId('conv-01');
            }}
            className={`py-1.5 rounded-md transition-colors cursor-pointer text-center ${
              conciergeChannel === 'whatsapp' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            WhatsApp Web
          </button>

          <button
            onClick={() => {
              setConciergeChannel('voice');
              setActiveConversationId('conv-02');
            }}
            className={`py-1.5 rounded-md transition-colors cursor-pointer text-center ${
              conciergeChannel === 'voice' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Voice Agent
          </button>
        </div>
      </div>

      {/* SPECIAL WHATSAPP SIMULATOR HEADER */}
      {conciergeChannel === 'whatsapp' && (
        <div className="bg-[#075E54] text-white px-4 py-2.5 flex items-center justify-between text-xs border-b border-[#128C7E] shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-800 flex items-center justify-center font-bold text-xs border border-emerald-400">
              WA
            </div>
            <div>
              <div className="font-semibold text-white flex items-center gap-1">
                <span>EventPulse Concierge</span>
                <span className="text-[10px] text-emerald-300">✓ Verified</span>
              </div>
              <div className="text-[10px] text-emerald-200">Official WhatsApp Business API</div>
            </div>
          </div>
          <div className="text-[10px] text-emerald-100 font-mono">
            Direct Inventory Link
          </div>
        </div>
      )}

      {/* SPECIAL VOICE SIMULATOR HEADER */}
      {conciergeChannel === 'voice' && (
        <div className="bg-indigo-950 text-indigo-200 px-4 py-2 flex items-center justify-between text-xs border-b border-indigo-900 shrink-0">
          <div className="flex items-center gap-2">
            <PhoneCall className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            <span>Voice Concierge Active (Speech-to-Text &amp; Audio)</span>
          </div>
          <button
            onClick={() => speakText("Hello, I am your voice booking concierge. How can I assist with your reservations today?")}
            className="text-[10px] bg-indigo-800 hover:bg-indigo-700 text-white px-2 py-0.5 rounded cursor-pointer"
          >
            Test Audio
          </button>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className={`p-4 overflow-y-auto space-y-3 flex-1 ${
        conciergeChannel === 'whatsapp' ? 'bg-[#ECE5DD]' : 'bg-slate-50'
      }`}>
        {/* Security / Safeguard Notice */}
        <div className="text-center my-1">
          <span className="inline-block px-3 py-1 bg-white/80 rounded-full text-[10px] text-slate-500 shadow-xs border border-slate-200">
            End-to-end encrypted · Unified temporary hold engine active
          </span>
        </div>

        {activeSession?.messages.map(msg => {
          const isUser = msg.sender === 'user';
          const isSystem = msg.sender === 'system';
          const isHuman = msg.sender === 'human_agent';

          if (isSystem) {
            return (
              <div key={msg.id} className="text-center my-2">
                <span className="inline-block px-3 py-1 bg-indigo-50 border border-indigo-200 rounded-md text-[11px] text-indigo-800 font-medium">
                  {msg.text}
                </span>
              </div>
            );
          }

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs shadow-xs relative ${
                  isUser
                    ? conciergeChannel === 'whatsapp'
                      ? 'bg-[#DCF8C6] text-slate-900 rounded-br-xs'
                      : 'bg-slate-900 text-white rounded-br-xs'
                    : isHuman
                    ? 'bg-amber-50 text-amber-950 border border-amber-200 rounded-bl-xs'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs'
                }`}
              >
                {/* Sender badge if human agent */}
                {isHuman && (
                  <div className="text-[10px] font-bold text-amber-800 mb-0.5 flex items-center gap-1">
                    <UserCheck className="w-3 h-3 text-amber-700" />
                    <span>Amara Patel (Human Guest Specialist)</span>
                  </div>
                )}

                <div className="leading-relaxed">{msg.text}</div>

                {/* Optional Action Payload Button */}
                {msg.actionPayload?.eventId && (
                  <div className="mt-2.5 pt-2 border-t border-slate-200/60">
                    <button
                      onClick={() => {
                        setSelectedEventId(msg.actionPayload!.eventId!);
                        setConciergeOpen(false);
                      }}
                      className="px-3 py-1 bg-slate-900 text-white text-[11px] font-semibold rounded hover:bg-slate-800 flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Open Event &amp; Book</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-end gap-1 text-[9px] text-slate-400 mt-1">
                  <span>{msg.timestamp}</span>
                  {isUser && conciergeChannel === 'whatsapp' && (
                    <CheckCheck className="w-3 h-3 text-sky-500" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Human Handoff Banner / Action */}
      {activeSession?.status === 'handed_off_to_human' ? (
        <div className="px-4 py-2 bg-amber-50 border-t border-amber-200 text-amber-900 text-xs flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-amber-700" />
            <span className="font-medium">Live Human Specialist Active (Amara)</span>
          </div>
          <span className="text-[10px] text-amber-700 font-mono">Agent connected</span>
        </div>
      ) : (
        <div className="px-4 py-1.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs shrink-0">
          <span className="text-[11px] text-slate-500">Need specific custom arrangements?</span>
          <button
            onClick={() => requestHumanHandoff(activeSession.id)}
            className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer"
          >
            Request Human Handoff &rarr;
          </button>
        </div>
      )}

      {/* Quick Prompt Chips */}
      <div className="px-4 py-2 bg-white border-t border-slate-200 flex items-center gap-1.5 overflow-x-auto text-[11px] shrink-0 scrollbar-none">
        <button
          onClick={() => {
            setInputMessage('Check VIP tickets for Astra Nova concert');
            setTimeout(() => {
              sendMessageToChannel(activeSession.id, 'Check VIP tickets for Astra Nova concert', 'user');
            }, 100);
          }}
          className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 whitespace-nowrap cursor-pointer"
        >
          Astra Nova VIP Pass
        </button>

        <button
          onClick={() => {
            setInputMessage('Reserve 2 seats for Truffle Degustation');
            setTimeout(() => {
              sendMessageToChannel(activeSession.id, 'Reserve 2 seats for Truffle Degustation', 'user');
            }, 100);
          }}
          className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 whitespace-nowrap cursor-pointer"
        >
          Chef Degustation Table
        </button>

        <button
          onClick={() => {
            setInputMessage('Are there promo codes available for tech summit?');
            setTimeout(() => {
              sendMessageToChannel(activeSession.id, 'Are there promo codes available for tech summit?', 'user');
            }, 100);
          }}
          className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 whitespace-nowrap cursor-pointer"
        >
          Promo Codes
        </button>
      </div>

      {/* Message Input Bar */}
      <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={handleToggleVoiceListen}
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
            isListening ? 'bg-rose-600 text-white animate-pulse' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
          }`}
          title="Speak to Agent"
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        <input
          type="text"
          placeholder={
            conciergeChannel === 'whatsapp'
              ? 'Message on WhatsApp...'
              : conciergeChannel === 'voice'
              ? 'Speak or type your inquiry...'
              : 'Ask about tickets, venues, VIP holds...'
          }
          value={inputMessage}
          onChange={e => setInputMessage(e.target.value)}
          className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
        />

        <button
          type="submit"
          disabled={!inputMessage.trim()}
          className="w-9 h-9 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white flex items-center justify-center cursor-pointer transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
};
