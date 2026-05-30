// ATSScoreGauge – animated circular progress ring
export default function ATSScoreGauge({ score }) {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  // Color based on score
  const getColor = (s) => {
    if (s >= 75) return '#22c55e';
    if (s >= 50) return '#ffb347';
    return '#ef4444';
  };

  const getLabel = (s) => {
    if (s >= 80) return 'Excellent';
    if (s >= 65) return 'Good';
    if (s >= 50) return 'Average';
    if (s >= 35) return 'Weak';
    return 'Poor';
  };

  const color = getColor(score);

  return (
    <div className="ats-score-container">
      <div className="score-circle">
        <svg width="160" height="160" viewBox="0 0 160 160">
          {/* Track */}
          <circle
            className="score-circle-bg"
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="12"
          />
          {/* Glow filter */}
          <defs>
            <filter id="score-glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {/* Fill */}
          <circle
            className="score-circle-fill"
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 80 80)"
            filter="url(#score-glow)"
            style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1)' }}
          />
        </svg>
        <div className="score-number">
          <span className="score-value" style={{ color }}>{score}</span>
          <span className="score-label">ATS Score</span>
        </div>
      </div>

      <div style={{ marginBottom: '8px' }}>
        <span style={{
          display: 'inline-block',
          padding: '4px 14px',
          borderRadius: '999px',
          fontSize: '13px',
          fontWeight: '700',
          background: `${color}22`,
          color,
          border: `1px solid ${color}44`,
        }}>
          {getLabel(score)}
        </span>
      </div>

      {/* Score bar breakdown */}
      <div style={{ width: '200px', margin: '0 auto' }}>
        <div style={{
          height: '6px',
          borderRadius: '3px',
          background: 'var(--bg-glass)',
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${score}%`,
            background: `linear-gradient(90deg, ${color}88, ${color})`,
            borderRadius: '3px',
            transition: 'width 1.5s cubic-bezier(0.4,0,0.2,1)',
          }} />
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '10px',
          color: 'var(--text-muted)',
          marginTop: '4px',
        }}>
          <span>0</span>
          <span>50</span>
          <span>100</span>
        </div>
      </div>
    </div>
  );
}
