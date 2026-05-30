import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { roastAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ResultsPanel from '../components/ResultsPanel';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist/build/pdf';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import mammoth from 'mammoth';

// Set up pdf.js worker for Vite
GlobalWorkerOptions.workerSrc = workerUrl;

const MODES = [
  { id: 'CEO', emoji: '👔', title: 'CEO Review', desc: 'Business impact & leadership focus' },
  { id: 'HR', emoji: '📋', title: 'HR Review', desc: 'Readability, ATS compatibility and hiring appeal' },
  { id: 'Manager', emoji: '👥', title: 'Manager Review', desc: 'Teamwork, ownership and practical delivery' },
  { id: 'Professional', emoji: '📈', title: 'Professional Review', desc: 'Balanced industry-level evaluation' },
];

function FlameLoader() {
  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-dark-1/90 backdrop-blur-sm rounded-3xl">
      <div className="relative w-20 h-20 flex items-center justify-center mb-6">
        <div className="absolute inset-0 rounded-full border-2 border-brand-red animate-pulse-ring" />
        <div className="absolute inset-0 rounded-full border-2 border-brand-red animate-pulse-ring" style={{ animationDelay: '0.5s' }} />
        <div className="relative z-10 w-12 h-12 rounded-full bg-brand-red/10 border-2 border-brand-red flex items-center justify-center text-2xl animate-[spin_2s_linear_infinite]">
          🔥
        </div>
      </div>
      <div className="text-lg font-bold text-white mb-2">Roasting your resume...</div>
      <div className="text-sm text-gray-400">Our AI is tearing it apart (lovingly) 🔥</div>
    </div>
  );
}

export default function RoasterPage({ onNavigate }) {
  const { user, logout } = useAuth();
  const [mode, setMode] = useState('CEO');
  const [resumeText, setResumeText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [charCount, setCharCount] = useState(0);

  const extractPdfText = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await getDocument({ data: arrayBuffer }).promise;
      let fullText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item) => item.str).join(' ');
        fullText += `${pageText}\n`;
      }
      return fullText;
    } catch (err) {
      console.error('PDF extraction error:', err);
      throw new Error('Failed to extract text from PDF.');
    }
  };

  const extractDocxText = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const doc = await mammoth.extractRawText({ arrayBuffer });
      return doc.value;
    } catch (err) {
      console.error('DOCX extraction error:', err);
      throw new Error('Failed to extract text from DOCX.');
    }
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setError('');

    try {
      let text = '';
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        text = await extractPdfText(file);
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.name.endsWith('.docx')) {
        text = await extractDocxText(file);
      } else {
        text = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.onerror = reject;
          reader.readAsText(file);
        });
      }

      setResumeText(text);
      setCharCount(text.length);
    } catch (err) {
      setError(err.message || 'Error processing file.');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
    multiple: false,
  });

  const handleTextChange = (e) => {
    setResumeText(e.target.value);
    setCharCount(e.target.value.length);
    if (error) setError('');
  };

  const handleRoast = async () => {
    if (!resumeText.trim()) {
      setError('Please paste your resume text or upload a file.');
      return;
    }
    if (resumeText.trim().length < 50) {
      setError('Resume text is too short. Please paste the full resume.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await roastAPI.generate({ resumeText, mode });
      if (res.data.success) {
        setResult(res.data.data);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Session expired. Please login again.');
        logout();
        onNavigate('login');
      } else {
        setError(err.response?.data?.error || 'Roast failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setResumeText('');
    setCharCount(0);
    setError('');
  };

  return (
    <div className="pt-20 min-h-screen">
      <div className="container mx-auto px-4 md:px-6 py-10 pb-20 max-w-[1180px]">
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-black mb-2 text-white">🔥 Resume Roast AI</h1>
              <p className="text-sm text-gray-400">Welcome back, <strong className="text-brand-red">{user?.fullName || user?.username}</strong>. Choose your review mode and start the analysis.</p>
            </div>
            <button
              className="rounded-3xl bg-white/5 border border-white/10 px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-all"
              onClick={() => { logout(); onNavigate('home'); }}
              id="btn-logout"
            >
              Logout
            </button>
          </div>
        </div>

        {result ? (
          <ResultsPanel data={result} mode={mode} onReset={handleReset} />
        ) : loading ? (
          <div className="relative bg-dark-3 border border-white/5 rounded-3xl p-8 min-h-[500px]">
            <FlameLoader />
          </div>
        ) : (
          <div className="space-y-8">
            <div className="bg-dark-3 border border-white/5 rounded-3xl p-6 sm:p-8 transition-all hover:border-brand-red/30">
              <div className="flex flex-col gap-5">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-red/10 text-brand-red text-xs uppercase tracking-[0.24em] font-semibold mb-4">Review Mode</div>
                  <h2 className="text-2xl font-bold text-white">Select an analysis mode</h2>
                  <p className="text-gray-400 mt-2">Only one mode can be selected at a time. Each mode gives you a different resume lens.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                  {MODES.map((option) => (
                    <button
                      key={option.id}
                      id={`mode-${option.id.replace(/\s+/g, '-').toLowerCase()}`}
                      type="button"
                      className={`rounded-3xl border-2 p-5 text-left transition-all ${mode === option.id ? 'border-brand-red bg-brand-red/10 shadow-[0_10px_35px_rgba(224,28,28,0.2)]' : 'border-white/10 bg-dark-2 hover:border-brand-red/30 hover:bg-white/5'}`}
                      onClick={() => setMode(option.id)}
                    >
                      <div className="text-4xl mb-4">{option.emoji}</div>
                      <div className="text-lg font-bold text-white mb-2">{option.title}</div>
                      <p className="text-sm text-gray-400 leading-relaxed">{option.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-8">
              <div className="bg-dark-3 border border-white/5 rounded-3xl p-6 sm:p-8 flex flex-col gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-3xl bg-brand-red/10 border border-brand-red/20 flex items-center justify-center text-2xl">📄</div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Resume input</h3>
                    <p className="text-gray-400 text-sm">Paste your resume text or upload a file for automatic extraction.</p>
                  </div>
                </div>

                <div {...getRootProps()} className={`rounded-3xl border-2 border-dashed p-8 text-center transition-all ${isDragActive ? 'border-brand-red bg-brand-red/5' : 'border-white/10 bg-dark-2 hover:border-brand-red/30 hover:bg-white/5'}`}>
                  <input {...getInputProps()} id="input-file-upload" />
                  <div className="text-5xl mb-4">📎</div>
                  <p className="text-white font-semibold mb-2">Drag & drop a file or click to upload</p>
                  <p className="text-gray-400 text-sm">Supports PDF, DOCX, and TXT.</p>
                </div>

                <div className="flex flex-col gap-3">
                  <label className="text-xs font-bold uppercase tracking-[0.28em] text-gray-400" htmlFor="input-resume-text">Resume text</label>
                  <textarea
                    id="input-resume-text"
                    className="min-h-[340px] rounded-3xl border border-white/10 bg-dark-2 p-5 text-sm text-white outline-none focus:border-brand-red focus:ring-4 focus:ring-brand-red/10 transition-all resize-none"
                    placeholder="Paste your full resume here..."
                    value={resumeText}
                    onChange={handleTextChange}
                  />
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{charCount.toLocaleString()} chars</span>
                    <span>Include metrics, titles, and achievements for the best result.</span>
                  </div>
                </div>

                {error && (
                  <div className="rounded-3xl border border-red-500/25 bg-red-500/10 p-4 text-sm text-red-200">
                    <strong className="font-semibold">Error:</strong> {error}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-6">
                <div className="bg-dark-3 border border-white/5 rounded-3xl p-6 sm:p-8">
                  <h3 className="text-xl font-bold text-white mb-3">Generate a detailed review</h3>
                  <p className="text-gray-400 mb-6">Our AI will analyze the resume according to the selected mode and return score cards, strong points, weak points, and growth suggestions.</p>
                  <button
                    type="button"
                    id="btn-generate-analysis"
                    onClick={handleRoast}
                    className="w-full rounded-3xl bg-gradient-to-br from-brand-red to-brand-red-bright px-6 py-4 text-white font-bold shadow-[0_12px_28px_rgba(224,28,28,0.3)] hover:shadow-[0_14px_34px_rgba(224,28,28,0.4)] transition-all"
                  >
                    Generate Analysis
                  </button>
                </div>

                <div className="bg-dark-3 border border-white/5 rounded-3xl p-6 sm:p-8 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-red/10 text-brand-red text-xs uppercase tracking-[0.2em] font-semibold">What to expect</div>
                  <div className="space-y-3 text-sm text-gray-400">
                    <p>• A clean professional review with role-specific feedback.</p>
                    <p>• A funny roast section that stays sharp and respectful.</p>
                    <p>• Suggestions for missing sections, structure, and growth.</p>
                  </div>
                </div>

                <div className="bg-dark-3 border border-white/5 rounded-3xl p-6 sm:p-8">
                  <h4 className="text-lg font-bold text-white mb-3">Pro tips</h4>
                  <ul className="list-disc list-inside space-y-2 text-sm text-gray-400">
                    <li>Include measurable achievements, not just responsibilities.</li>
                    <li>Keep formatting consistent and easy to scan.</li>
                    <li>Use strong verbs and clear role titles.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
