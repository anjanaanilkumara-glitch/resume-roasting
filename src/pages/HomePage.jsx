export default function HomePage({ onNavigate }) {
  const benefits = [
    {
      title: 'What is Resume Roast AI?',
      text: 'A modern career assistant that scans your resume, highlights strengths, spots weaknesses, and serves fast, actionable feedback in a polished red and black interface.',
    },
    {
      title: 'Who is it for?',
      text: 'Job seekers, students, fresh graduates, career changers, and seasoned professionals who want better clarity and stronger positioning in their resumes.',
    },
    {
      title: 'Why use it?',
      text: 'It catches what people miss, improves ATS score, sharpens your storytelling, and helps your resume stand out in competitive hiring funnels.',
    },
    {
      title: 'How it helps',
      text: 'Get evaluation from CEO, HR, manager, and industry-pro levels with clear improvement suggestions, funny roast notes, and professional growth advice.',
    },
  ];

  const features = [
    {
      icon: '👔',
      title: 'CEO Review',
      text: 'Discovers business impact, leadership clarity, and strategy signals that impress senior decision-makers.',
    },
    {
      icon: '📋',
      title: 'HR Review',
      text: 'Checks resume readability, ATS compatibility, formatting quality, and hiring attractiveness.',
    },
    {
      icon: '👥',
      title: 'Manager Review',
      text: 'Evaluates teamwork, practical experience, leadership potential, and role fit from a manager’s lens.',
    },
    {
      icon: '📈',
      title: 'Professional Score',
      text: 'Delivers a balanced 0–100 score with strengths, weaknesses, and targeted next-step improvements.',
    },
    {
      icon: '✍️',
      title: 'Rewrite Suggestions',
      text: 'Receive polished resume writing tips and a sample improved snapshot for fast updates.',
    },
    {
      icon: '⚡',
      title: 'Fast Feedback',
      text: 'Paste or upload your resume, choose a review style, and get in-depth results instantly.',
    },
  ];

  return (
    <div className="pt-[100px] pb-16 min-h-screen">
      <section className="relative overflow-hidden bg-grad-hero py-20 lg:py-28 flex items-center">
        <div className="container mx-auto px-4 md:px-6 max-w-[1180px] relative z-10 text-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(224,28,28,0.18),transparent_35%)] pointer-events-none" />
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-black/30 border border-white/10 text-brand-red text-sm font-semibold uppercase tracking-[0.28em] mb-8 backdrop-blur-sm">
            <span>🔥</span> Resume Roast AI
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-black leading-tight tracking-tight text-white mb-6">
            Turn your resume into a confident, career-ready story.
          </h1>
          <p className="text-base md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed mb-10">
            Resume Roast AI evaluates your CV from CEO, HR, manager, and professional perspectives. It highlights strengths, exposes weak spots, and gives polished suggestions so you can apply with more confidence.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              className="px-8 py-4 rounded-3xl bg-gradient-to-br from-brand-red to-brand-red-bright text-white shadow-[0_10px_30px_rgba(224,28,28,0.35)] hover:shadow-[0_12px_36px_rgba(224,28,28,0.45)] transition-all font-semibold"
              id="btn-hero-explore"
              onClick={() => onNavigate('roaster')}
            >
              Explore Resume Analysis
            </button>
            <button
              className="px-8 py-4 rounded-3xl bg-white/5 border border-white/10 text-gray-200 hover:text-white hover:border-brand-red/30 transition-all font-semibold"
              id="btn-hero-signup"
              onClick={() => onNavigate('signup')}
            >
              Create Account
            </button>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4 md:px-6 max-w-[1180px]">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-center mb-16">
            <div>
              <div className="text-sm uppercase tracking-[0.28em] text-brand-red font-bold mb-4">What Resume Roast AI Does</div>
              <h2 className="text-4xl md:text-5xl font-display font-black text-white mb-6">
                Professional resume feedback for every career stage.
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed max-w-2xl">
                Whether you are applying for your first job, aiming for a promotion, or preparing for an executive role, Resume Roast AI gives you clear, intelligent guidance with polish and personality.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {benefits.map((item) => (
                <div key={item.title} className="rounded-[28px] border border-white/10 bg-dark-3 p-7 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
                  <div className="text-brand-red text-sm uppercase tracking-[0.28em] font-semibold mb-3">{item.title}</div>
                  <p className="text-gray-300 leading-relaxed text-sm">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-red/10 text-brand-red text-xs font-bold uppercase tracking-[0.22em] mb-4">Features</div>
            <h3 className="text-3xl md:text-4xl font-display font-extrabold text-white mb-4">A premium red & black experience built for modern job seekers.</h3>
            <p className="text-gray-400 max-w-2xl mx-auto">Compare four powerful analysis modes and get a resume review that feels intelligent, polished, and easy to act on.</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="group rounded-[28px] border border-white/10 bg-dark-3 p-7 hover:border-brand-red/30 transition-all shadow-[0_16px_45px_rgba(0,0,0,0.2)]">
                <div className="w-14 h-14 rounded-3xl bg-brand-red/10 border border-brand-red/20 flex items-center justify-center text-2xl mb-5">{feature.icon}</div>
                <h4 className="text-xl font-bold text-white mb-3">{feature.title}</h4>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[radial-gradient(circle_at_top,_rgba(224,28,28,0.12),_transparent_70%)]">
        <div className="container mx-auto px-4 md:px-6 max-w-[1180px] rounded-[36px] border border-brand-red/20 bg-black/30 p-12 backdrop-blur-xl shadow-[0_40px_100px_rgba(0,0,0,0.35)]">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] items-center">
            <div>
              <div className="text-brand-red uppercase tracking-[0.28em] font-bold text-sm mb-3">Ready to Roast</div>
              <h2 className="text-4xl font-display font-black text-white mb-4">Upload, analyze, and improve your resume in minutes.</h2>
              <p className="text-gray-400 max-w-xl leading-relaxed mb-8">Use our Review Modes to get precise, role-based feedback that helps your resume perform better in the real world.</p>
              <button
                className="px-8 py-4 rounded-3xl bg-gradient-to-br from-brand-red to-brand-red-bright text-white shadow-[0_14px_40px_rgba(224,28,28,0.35)] hover:shadow-[0_18px_48px_rgba(224,28,28,0.45)] transition-all font-semibold"
                id="btn-hero-explore-2"
                onClick={() => onNavigate('roaster')}
              >
                Explore Resume Analysis
              </button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[28px] border border-white/10 bg-black/50 p-6">
                <div className="text-brand-red text-3xl mb-4">📌</div>
                <h4 className="text-white font-bold mb-2">Quick evaluation</h4>
                <p className="text-gray-400 text-sm">Paste or upload your resume and get instant analysis.</p>
              </div>
              <div className="rounded-[28px] border border-white/10 bg-black/50 p-6">
                <div className="text-brand-red text-3xl mb-4">🧠</div>
                <h4 className="text-white font-bold mb-2">Smart feedback</h4>
                <p className="text-gray-400 text-sm">Insightful comments from multiple reviewer styles.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 py-10 text-center text-gray-500 text-sm">
        <span className="text-brand-red font-semibold">Resume Roast AI</span>
        <span className="mx-2">·</span>
        <span>Professional red & black resume feedback</span>
        <span className="mx-2">·</span>
        <span>Built for modern job seekers</span>
      </footer>
    </div>
  );
}
