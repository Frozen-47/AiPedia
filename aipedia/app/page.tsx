"use client";

import { useState } from 'react';
import { tools } from './data';
import ToolCard from '@/components/ToolCard';

export default function Home() {
  const [search, setSearch] = useState('');

  // Filter logic based on search input
  const filteredTools = tools.filter((tool) =>
    tool.name.toLowerCase().includes(search.toLowerCase()) ||
    tool.category.toLowerCase().includes(search.toLowerCase()) ||
    tool.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 mb-6">
          Aipedia
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-2">
          A comprehensive encyclopedia of AI tools, models, datasets, and concepts
        </p>
        <p className="text-sm text-slate-500">
          Community-written summaries · Citation-backed · Open knowledge
        </p>
      </div>

      {/* Search Section */}
      <div className="max-w-2xl mx-auto px-4 mb-16">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-200"></div>
          <input
            type="text"
            placeholder="Search for models, datasets, frameworks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="relative w-full bg-slate-900 border border-slate-700 rounded-full px-6 py-4 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder-slate-600 text-lg shadow-xl"
          />
        </div>
      </div>

      {/* Results Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-slate-500 border-2 border-dashed border-slate-800 rounded-xl">
            <p className="text-lg">No entries found matching "{search}"</p>
            <p className="text-sm mt-2">Try searching for "LLM" or "Image Gen"</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/50 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-xl font-bold text-white mb-4">📚 How Aipedia Works</h3>
          <p className="text-slate-400 mb-6">
            Aipedia follows the same legal framework as Wikipedia — we provide knowledge through original summaries and proper citations.
          </p>
          <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-4 text-sm text-indigo-200 inline-block">
            <strong>Contributing?</strong> Write everything in your own words, cite official sources, and never copy text directly.
          </div>
        </div>
      </footer>
    </main>
  );
}