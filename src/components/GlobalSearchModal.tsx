import React, { useState, useEffect, useRef } from 'react';
import { useEvent } from '../context/EventContext';
import { searchGlobal, SearchResultItem } from '../features/search/searchEngine';
import {
  Search,
  X,
  Calendar,
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Coffee,
  Users,
} from 'lucide-react';

export const GlobalSearchModal: React.FC = () => {
  const {
    isSearchModalOpen,
    setIsSearchModalOpen,
    sessions,
    zones,
    setDestinationZoneId,
    setActiveTab,
  } = useEvent();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchModalOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isSearchModalOpen]);

  useEffect(() => {
    if (query.trim().length > 0) {
      const res = searchGlobal(query, sessions, zones);
      setResults(res);
    } else {
      setResults([]);
    }
  }, [query, sessions, zones]);

  if (!isSearchModalOpen) return null;

  const handleSelectResult = (item: SearchResultItem) => {
    setIsSearchModalOpen(false);
    if (item.type === 'session') {
      const session = sessions.find((s) => s.id === item.targetId);
      if (session) {
        setDestinationZoneId(session.locationId);
        setActiveTab('map');
      }
    } else if (item.type === 'venue' || item.type === 'facility') {
      setDestinationZoneId(item.targetId);
      setActiveTab('map');
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Global Event Search"
      className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/60 backdrop-blur-xs p-4 pt-16 sm:pt-24"
    >
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl overflow-hidden flex flex-col">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 p-4 border-b border-slate-100 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            id="global-search-input"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search sessions, speakers, stages, restrooms, food, help..."
            className="w-full bg-transparent text-base text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden"
          />
          <button
            onClick={() => setIsSearchModalOpen(false)}
            aria-label="Close search"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        {query.trim().length === 0 && (
          <div className="p-4 bg-slate-50 dark:bg-slate-950/40 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
              Popular Quick Searches
            </span>
            <div className="flex flex-wrap gap-2">
              {['AI Workshops', 'Restrooms', 'Food Court', 'First Aid', 'Hall B', 'Keynote'].map((chip) => (
                <button
                  key={chip}
                  onClick={() => setQuery(chip)}
                  className="text-xs font-medium px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 hover:text-indigo-600 transition-colors"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-3 divide-y divide-slate-100 dark:divide-slate-800">
          {query.trim().length > 0 && results.length === 0 && (
            <div className="py-12 text-center">
              <Sparkles className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">No matching results found</p>
              <p className="text-xs text-slate-400 mt-1">
                Try searching for keywords like "AI", "Cloud", "Hall B", or "Restroom"
              </p>
            </div>
          )}

          {results.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSelectResult(item)}
              className="w-full text-left p-3.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors flex items-center justify-between group"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                  {item.iconType === 'calendar' ? (
                    <Calendar className="w-4 h-4" />
                  ) : item.iconType === 'map-pin' ? (
                    <MapPin className="w-4 h-4" />
                  ) : (
                    <Users className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-slate-900 dark:text-white">
                      {item.title}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {item.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {item.subtitle}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Navigate</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
