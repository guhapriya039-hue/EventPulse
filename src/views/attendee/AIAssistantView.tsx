import React, { useState } from 'react';
import { useEvent } from '../../context/EventContext';
import { askEventPulseAI, AskAIResponse } from '../../services/aiService';
import { AIMessage } from '../../types';
import {
  Sparkles,
  Send,
  MapPin,
  Clock,
  Footprints,
  Users,
  ArrowRight,
  Bot,
  User,
  Radio,
  CheckCircle2,
} from 'lucide-react';

const SUGGESTED_QUESTIONS = [
  'I have 30 minutes. What should I attend?',
  'I want an AI workshop with low crowd.',
  'How do I reach Hall B without stairs?',
  'Where is the nearest restroom?',
  'Which food court is less crowded?',
  'I am near Hall A. What is happening nearby?',
];

export const AIAssistantView: React.FC = () => {
  const {
    sessions,
    zones,
    profile,
    setDestinationZoneId,
    setActiveTab,
  } = useEvent();

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Initial greeting message
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'msg-init',
      role: 'assistant',
      content: `Hello ${profile.name}! I am **EventPulse AI**, your dedicated event navigation assistant for FutureTech 2026.\n\nI can help you locate sessions, discover low-crowd dining, plan step-free wheelchair routes, and maximize your time between talks. What would you like to explore?`,
      timestamp: '2:00 PM',
      source: 'gemini',
    },
  ]);

  const handleSendQuery = async (queryText: string) => {
    const clean = queryText.trim();
    if (!clean || isLoading) return;

    const userMsg: AIMessage = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      content: clean,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const response = await askEventPulseAI({
        prompt: clean,
        sessions,
        zones,
        profile,
      });

      const aiMsg: AIMessage = {
        id: `msg-${Date.now()}-ai`,
        role: 'assistant',
        content: response.answer,
        structuredCards: response.structuredCards,
        timestamp: 'Just now',
        source: response.source,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}-err`,
          role: 'assistant',
          content: 'I encountered an unexpected issue while retrieving event details. Please try again or select one of the suggested inquiries below.',
          timestamp: 'Just now',
          source: 'deterministic-fallback',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigateFromCard = (locationId: string) => {
    setDestinationZoneId(locationId);
    setActiveTab('map');
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Header card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-extrabold text-slate-900 dark:text-white">
                EventPulse AI Assistant
              </h1>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                Grounded Knowledge
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Directly synthesized with real-time crowd telemetry and venue floorplan
            </p>
          </div>
        </div>

        <div className="text-xs text-slate-400 flex items-center gap-1.5 self-start sm:self-auto">
          <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
          <span>Synced with FutureTech 2026 Core</span>
        </div>
      </div>

      {/* Suggested Quick Question Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="font-bold text-slate-400 shrink-0 text-[11px] uppercase tracking-wider">
          Suggested:
        </span>
        {SUGGESTED_QUESTIONS.map((q) => (
          <button
            key={q}
            onClick={() => handleSendQuery(q)}
            disabled={isLoading}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 text-slate-700 dark:text-slate-300 hover:text-indigo-600 whitespace-nowrap transition-all shadow-2xs text-xs font-medium cursor-pointer"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Messages Container */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs min-h-[450px] flex flex-col justify-between">
        <div className="space-y-6 overflow-y-auto max-h-[550px] pr-2">
          {messages.map((msg) => {
            const isAI = msg.role === 'assistant';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isAI ? '' : 'flex-row-reverse'}`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold ${
                    isAI
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900'
                  }`}
                >
                  {isAI ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                <div className={`space-y-3 max-w-xl ${isAI ? '' : 'text-right'}`}>
                  <div
                    className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      isAI
                        ? 'bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-700/60 text-slate-800 dark:text-slate-200'
                        : 'bg-indigo-600 text-white ml-auto'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.content}</p>
                    {msg.source && (
                      <span className="text-[10px] opacity-60 block mt-2 text-right">
                        {msg.source === 'gemini' ? 'Synthesized via Gemini API' : 'EventPulse Verified Intelligence'}
                      </span>
                    )}
                  </div>

                  {/* Structured Recommendation Cards if provided */}
                  {msg.structuredCards && msg.structuredCards.length > 0 && (
                    <div className="grid grid-cols-1 gap-2.5 pt-1 text-left">
                      {msg.structuredCards.map((card) => (
                        <div
                          key={card.id}
                          className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 space-y-2 shadow-2xs"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-600 text-white">
                              Best Match
                            </span>
                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                              Crowd: {card.crowd}
                            </span>
                          </div>

                          <div>
                            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                              {card.title}
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {card.subtitle}
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-300 pt-1">
                            <span className="flex items-center gap-1 font-semibold">
                              <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                              {card.locationName}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-amber-500" />
                              {card.time}
                            </span>
                            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                              <Footprints className="w-3.5 h-3.5" />
                              Walk: {card.walkMinutes} min
                            </span>
                          </div>

                          {card.reason && (
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                              “{card.reason}”
                            </p>
                          )}

                          <div className="pt-2 border-t border-indigo-200/60 dark:border-indigo-800/40 flex justify-end">
                            <button
                              onClick={() => handleNavigateFromCard(card.locationId)}
                              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                            >
                              <span>View Route</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 text-xs text-slate-500 flex items-center gap-2">
                <span>Analyzing venue density and schedule gaps...</span>
              </div>
            </div>
          )}
        </div>

        {/* Query Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendQuery(inputQuery);
          }}
          className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask about sessions, crowd levels, step-free routes, or food courts..."
            className="flex-1 px-4 py-3 text-xs sm:text-sm rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isLoading}
            className="p-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
