import axios from 'axios';

const AUTH_STORAGE_KEY = 'rr_users';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getStoredUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
};

const saveStoredUsers = (users) => {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(users));
};

const createToken = (username) => `${username}-${Math.random().toString(36).slice(2, 10)}-${Date.now()}`;

const buildMockAnalysis = (resumeText, mode) => {
  const cleanText = resumeText.trim();
  const lowercase = cleanText.toLowerCase();
  const words = lowercase.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const bullets = (cleanText.match(/•|\*|\-|\n\s*\u2022/g) || []).length;

  const hasNumbers = /\d+/.test(cleanText);
  const hasImpact = /(launched|increased|decreased|saved|delivered|grew|optimized|reduced|led|managed|built|designed)/i.test(cleanText);
  const hasLeadership = /(managed|led|supervised|mentored|owner|strategy|executive|stakeholder)/i.test(cleanText);
  const hasTeams = /(team|collaborated|cross-functional|partnered|group|stakeholder)/i.test(cleanText);
  const hasSkills = /(javascript|react|node|python|java|aws|sql|design|marketing|sales|analytics)/i.test(cleanText);
  const hasSummary = /(summary|profile|objective)/i.test(lowercase);

  const baseScore = 48;
  const lengthScore = Math.min(22, Math.floor(Math.min(wordCount, 700) / 30));
  const bulletScore = Math.min(15, bullets * 3 + (bullets > 4 ? 4 : 0));
  const impactScore = hasImpact ? 12 : 4;
  const skillScore = hasSkills ? 10 : 3;
  const leadershipScore = hasLeadership ? 8 : 0;
  const summaryScore = hasSummary ? 6 : 0;

  let score = baseScore + lengthScore + bulletScore + impactScore + skillScore + leadershipScore + summaryScore;
  if (mode === 'HR Review') score += 5;
  if (mode === 'Professional Review') score += 3;
  if (mode === 'Manager Review') score += hasTeams ? 5 : 0;
  if (mode === 'CEO Review') score += hasLeadership ? 4 : 0;
  score = Math.min(100, Math.max(35, Math.round(score)));

  const buildBullets = (items) => items.map((item) => `- ${item}`).join('\n');

  const strongPoints = [
    hasImpact ? 'Strong action-oriented achievement language that shows results.' : 'Clear role headings and responsibilities are visible.',
    hasSkills ? 'Relevant skills and keywords are present throughout the resume.' : 'A professional structure with logical sections makes the resume easy to scan.',
    bullets > 2 ? 'Experience items are delivered in bullet form for quick readability.' : 'The content is straightforward and concise.'
  ].filter(Boolean);

  const weakPoints = [
    !hasNumbers ? 'Missing measurable impact numbers and specific outcome metrics.' : null,
    !hasSummary ? 'No strong professional summary or opening pitch to guide the reader.' : null,
    bullets < 3 ? 'Experience entries would benefit from more achievement-oriented bullets.' : null,
    !hasLeadership && mode === 'CEO Review' ? 'Lacks strategic leadership signals or executive-level language.' : null,
    !hasTeams && mode === 'Manager Review' ? 'Needs stronger teamwork, project ownership, or collaboration details.' : null,
  ].filter(Boolean);

  const improvements = [
    'Add a strong, results-focused summary that highlights your value proposition.',
    'Include at least three measurable accomplishments for key roles.',
    'Use action verbs and measurable outcomes instead of generic responsibilities.',
    !hasSkills ? 'Add a dedicated skills section with your top technical and professional strengths.' : null,
    !hasTeams ? 'Showcase collaboration and leadership through project or team achievements.' : null,
  ].filter(Boolean);

  const suggestions = [
    mode === 'CEO Review' ? 'Frame your resume around business impact, revenue, efficiency, and leadership.' : null,
    mode === 'HR Review' ? 'Polish formatting, headers, and ATS-friendly layout for better scanability.' : null,
    mode === 'Manager Review' ? 'Emphasize project ownership, mentoring, and team results.' : null,
    mode === 'Professional Review' ? 'Balance your resume with achievements, skills, and future growth goals.' : null,
    'Limit long paragraphs and keep the highest-impact achievements at the top of each section.',
  ].filter(Boolean);

  const finalVerdict = {
    'CEO Review': 'This resume shows promise, but it should shift more toward leadership, outcome focus, and strategic impact to catch a CEO’s eye.',
    'HR Review': 'The resume is serviceable, yet it needs stronger ATS structure, clearer headings, and more measurable results.',
    'Manager Review': 'A manager will like the experience base, but it needs sharper team and project leadership signals.',
    'Professional Review': 'This is a solid foundation, though polishing summary, accomplishments, and format will move it into the top tier.',
  }[mode];

  const funnyRoast = {
    'CEO Review': 'This resume is close to executive-ready, but right now it is more “business report” than “boardroom story.”',
    'HR Review': 'An HR processor will probably smile and keep scanning, but it won’t stop at the top of the pile yet.',
    'Manager Review': 'A manager will ask “who led this?” before they can appreciate the actual work.',
    'Professional Review': 'This resume is competent, but it still has a little too much “just enough” energy.',
  }[mode];

  const additional = [
    hasSkills ? 'Add a short leadership or achievement highlight section for extra polish.' : 'Create a dedicated skills section to make your strengths obvious at a glance.',
    !hasSummary ? 'A short professional summary will make the opening much stronger.' : 'Refine the opening section to match the role you are targeting.',
    'Include certifications, tools, or awards if available to strengthen credibility.',
  ];

  const rewrite = `**Improved Resume Snapshot**\n\n${hasSummary ? 'Seasoned professional with proven outcomes in' : 'Highly motivated candidate with experience in'} ${hasSkills ? 'technical execution, collaboration, and measurable results.' : 'delivering effective solutions and sustaining strong teams.'}\n\n- Delivered measurable improvement through focused project delivery.\n- Communicated clear results using metrics and business impact.\n- Emphasized leadership, collaboration, and practical skills for the target role.\n`;

  const perspective = {
    'CEO Review': 'Evaluated from an executive lens, this review focuses on business impact, leadership clarity, and strategic value.',
    'HR Review': 'Evaluated from an HR lens, this review focuses on ATS compatibility, format, readability, and hiring appeal.',
    'Manager Review': 'Evaluated from a team lead lens, this review focuses on collaboration, ownership, and delivery experience.',
    'Professional Review': 'Evaluated from an industry lens, this review delivers a balanced score and practical growth guidance.',
  }[mode];

  return {
    score,
    atsScore: score,
    strongPoints: buildBullets(strongPoints),
    weakPoints: buildBullets(weakPoints.length ? weakPoints : ['Needs clearer performance metrics and leadership signals.']),
    roast: funnyRoast,
    improvements: buildBullets(improvements),
    suggestions: buildBullets(suggestions),
    finalVerdict,
    additional: buildBullets(additional),
    rewrite,
    perspective,
    source: 'mock',
  };
};

export const authAPI = {
  login: async ({ username, password }) => {
    await delay(400);
    const users = getStoredUsers();
    const user = users.find((record) => record.username.toLowerCase() === username.trim().toLowerCase());
    if (!user || user.password !== password) {
      const error = new Error('Invalid username or password.');
      error.response = { status: 401, data: { error: 'Invalid username or password.' } };
      throw error;
    }
    const safeUser = { ...user };
    delete safeUser.password;
    return { data: { success: true, data: safeUser, token: createToken(safeUser.username) } };
  },

  signup: async ({ username, password, confirmPassword }) => {
    await delay(600);
    const normalizedUsername = username.trim().toLowerCase();
    const users = getStoredUsers();
    if (users.some((record) => record.username.toLowerCase() === normalizedUsername)) {
      const error = new Error('Username already exists.');
      error.response = { status: 409, data: { error: 'Username already exists.' } };
      throw error;
    }
    if (password !== confirmPassword) {
      const error = new Error('Passwords do not match.');
      error.response = { status: 400, data: { error: 'Passwords do not match.' } };
      throw error;
    }
    if (password.length < 6) {
      const error = new Error('Password must be at least 6 characters.');
      error.response = { status: 400, data: { error: 'Password must be at least 6 characters.' } };
      throw error;
    }
    const newUser = { username: normalizedUsername, password, fullName: username.trim() };
    users.push(newUser);
    saveStoredUsers(users);
    return { data: { success: true, data: { username: newUser.username, fullName: newUser.fullName }, token: createToken(newUser.username) } };
  },
};

export const roastAPI = {
  generate: async ({ resumeText, mode }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/resume/evaluate`,
        { resumeText, role: mode },
        { headers: { 'Content-Type': 'application/json' }, timeout: 10000 }
      );
      return response;
    } catch (error) {
      console.warn('Backend roast API failed, falling back to local mock:', error.message || error);
      await delay(900);
      return {
        data: {
          success: true,
          data: { ...buildMockAnalysis(resumeText, mode), source: 'fallback' },
        },
      };
    }
  },
};
