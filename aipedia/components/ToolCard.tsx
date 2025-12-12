// components/ToolCard.tsx
import { Tool } from '@/app/data';

interface ToolCardProps {
  tool: Tool;
}

export default function ToolCard({ tool }: ToolCardProps) {
  return (
    <div className="bg-slate-900/50 border border-slate-700/50 p-6 rounded-xl hover:border-indigo-500/50 transition-all hover:shadow-lg hover:shadow-indigo-500/10 group">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-white mb-2">{tool.name}</h3>
        <span className="text-xs px-2 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
          {tool.category}
        </span>
      </div>
      <p className="text-slate-400 text-sm mb-4 leading-relaxed">
        {tool.description}
      </p>
      <a 
        href={tool.link} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-sm text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
      >
        Learn more &rarr;
      </a>
    </div>
  );
}