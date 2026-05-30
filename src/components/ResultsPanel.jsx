import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ATSScoreGauge from './ATSScoreGauge';

const TABS = [
  { id: 'roast',       label: '🔥 Roast',       emoji: '🔥' },
  { id: 'mistakes',    label: '❌ Mistakes',     emoji: '❌' },
  { id: 'fixes',       label: '➕ Fixes',        emoji: '➕' },
  { id: 'perspective', label: '💼 Perspective',  emoji: '💼' },
  { id: 'rewrite',     label: '✍️ Rewrite',      emoji: '✍️' },
  { id: 'sw',          label: '💪 S & W',        emoji: '💪' },
  { id: 'tips',        label: '💡 Tips',         emoji: '💡' },
];

function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  const handle = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:border-white/20 hover:bg-white/10 transition-all font-semibold text-xs flex items-center justify-center gap-1.5 min-w-[80px]" onClick={handle}>
      {copied ? '✅ Copied!' : '📋 Copy'}
    </button>
  );
}

function SectionContent({ content }) {
  if (!content) return <p className="text-gray-500 italic text-sm">No data in this section.</p>;
  return (
    <div className="prose prose-invert max-w-none prose-p:text-gray-300 prose-headings:text-white prose-a:text-brand-red hover:prose-a:text-brand-red-bright prose-strong:text-white prose-ul:text-gray-300 prose-ol:text-gray-300">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}

export default function ResultsPanel({ data, role, intensity, onReset }) {
  const [activeTab, setActiveTab] = useState('roast');

  const sourceLabel = {
    gemini: { text: 'Powered by Gemini AI', color: 'text-blue-400' },
    mock: { text: 'Mock Evaluator', color: 'text-yellow-400' },
    mock_fallback: { text: 'Mock Fallback', color: 'text-yellow-400' },
  }[data.source] || { text: 'AI Evaluated', color: 'text-green-400' };

  const intensityColors = {
    Mild: 'text-green-400 border-green-400/25 bg-green-400/10',
    Medium: 'text-yellow-400 border-yellow-400/25 bg-yellow-400/10',
    Spicy: 'text-orange-400 border-orange-400/25 bg-orange-400/10',
    'Ghost Pepper': 'text-brand-red border-brand-red/25 bg-brand-red/10',
  };

  return (
    <div className="animate-fade-up">
      {/* Header row */}
      <div className="bg-dark-3 border border-white/5 rounded-t-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 flex-wrap mb-1">
            <h2 className="text-xl font-extrabold text-white">Your Roast Results</h2>
            <span className="px-3 py-1 rounded-full bg-brand-red/10 border border-brand-red/30 text-brand-red text-[11px] font-bold uppercase tracking-wider">{role}</span>
            <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${intensityColors[intensity]}`}>{intensity}</span>
          </div>
          <p className="text-xs text-gray-500 font-medium flex items-center gap-1.5">
            <span className={sourceLabel.color}>●</span> {sourceLabel.text}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <CopyBtn text={`ATS Score: ${data.atsScore}\n\n${data.roast}\n\n${data.mistakes}\n\n${data.corrections}\n\n${data.tips}`} />
          <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:border-white/20 hover:bg-white/10 transition-all font-semibold text-xs flex items-center gap-2" onClick={onReset} id="btn-reset-roast">
            🔄 New Roast
          </button>
        </div>
      </div>

      {/* ATS Score + Tabs */}
      <div className="bg-dark-3 border-l border-r border-b border-white/5 p-6 sm:p-8 flex flex-col md:flex-row items-center gap-8 md:gap-10">
        <ATSScoreGauge score={data.atsScore || 55} />
        <div className="flex-1 w-full min-w-[260px]">
          <p className="text-[13px] text-gray-400 mb-3 font-semibold tracking-wide">
            Navigate your roast results:
          </p>
          <div className="flex flex-wrap gap-2">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                className={`px-4 py-2 rounded-xl border font-semibold text-sm transition-all shadow-sm ${activeTab === tab.id ? 'bg-gradient-to-br from-brand-red to-brand-red-bright border-transparent text-white shadow-[0_2px_10px_rgba(224,28,28,0.3)]' : 'bg-dark-2 border-white/5 text-gray-400 hover:text-white hover:border-white/10 hover:bg-dark-4'}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-dark-3 border border-t-0 border-white/5 rounded-b-3xl p-6 sm:p-10 min-h-[300px]">

        {activeTab === 'roast' && (
          <div className="animate-fade-up">
            <div className="text-xl font-bold text-white mb-6 pb-2 border-b border-white/5 flex items-center gap-2">
              🔥 The Roast
            </div>
            <div className="text-gray-300 text-lg leading-relaxed font-medium italic p-6 rounded-2xl bg-dark-2 border border-white/5 border-l-4 border-l-brand-red relative before:content-['\u201C'] before:absolute before:-top-4 before:-left-2 before:text-6xl before:text-white/10 before:font-display">
              {data.roast || 'No roast text found.'}
            </div>
          </div>
        )}

        {activeTab === 'mistakes' && (
          <div className="animate-fade-up">
            <div className="text-xl font-bold text-white mb-6 pb-2 border-b border-white/5 flex items-center gap-2">❌ Critical Mistakes</div>
            <SectionContent content={data.mistakes} />
          </div>
        )}

        {activeTab === 'fixes' && (
          <div className="animate-fade-up">
            <div className="text-xl font-bold text-white mb-6 pb-2 border-b border-white/5 flex items-center gap-2">➕ What to Add / Fix</div>
            <SectionContent content={data.corrections} />
          </div>
        )}

        {activeTab === 'perspective' && (
          <div className="animate-fade-up">
            <div className="text-xl font-bold text-white mb-6 pb-2 border-b border-white/5 flex items-center gap-2">💼 {role} Perspective</div>
            <SectionContent content={data.perspective} />
          </div>
        )}

        {activeTab === 'rewrite' && (
          <div className="animate-fade-up">
            <div className="text-xl font-bold text-white mb-6 pb-2 border-b border-white/5 flex items-center gap-2">✍️ Improved Resume Snippet</div>
            <div className="rounded-2xl border border-white/10 bg-[#0d1117] overflow-hidden shadow-inner">
              <div className="flex items-center justify-between px-4 py-3 bg-[#161b22] border-b border-white/10">
                <span className="text-xs font-mono text-gray-400">📄 markdown</span>
                <CopyBtn text={data.rewrite || ''} />
              </div>
              <div className="p-6 text-[13px] font-mono leading-relaxed text-gray-300 overflow-x-auto whitespace-pre-wrap">
                {data.rewrite || 'No rewrite suggestions found.'}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sw' && (
          <div className="animate-fade-up">
            <div className="text-xl font-bold text-white mb-6 pb-2 border-b border-white/5 flex items-center gap-2">Strengths & Weaknesses</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-green-500/5 border border-green-500/20">
                <div className="text-lg font-bold text-green-400 mb-4 pb-2 border-b border-green-500/20">💪 Strengths</div>
                <div className="prose prose-invert max-w-none prose-p:text-green-100/70 prose-li:text-green-100/70 prose-strong:text-green-300">
                  <SectionContent content={data.strengths} />
                </div>
              </div>
              <div className="p-6 rounded-2xl bg-red-500/5 border border-red-500/20">
                <div className="text-lg font-bold text-red-400 mb-4 pb-2 border-b border-red-500/20">📉 Weaknesses</div>
                <div className="prose prose-invert max-w-none prose-p:text-red-100/70 prose-li:text-red-100/70 prose-strong:text-red-300">
                  <SectionContent content={data.weaknesses} />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tips' && (
          <div className="animate-fade-up">
            <div className="text-xl font-bold text-white mb-6 pb-2 border-b border-white/5 flex items-center gap-2">💡 Final Tips</div>
            <div className="p-6 rounded-2xl bg-gradient-to-br from-brand-red/10 to-transparent border border-brand-red/20 text-brand-red-light">
              <SectionContent content={data.tips} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
