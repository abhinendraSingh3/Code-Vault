import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

interface SnippetSample {
  id: string;
  title: string;
  language: string;
  version: string;
  description: string;
  code: string;
}

const SAMPLE_SNIPPETS: Record<string, SnippetSample[]> = {
  TypeScript: [
    {
      id: "ts-1",
      title: "NestJS Auth Guard with JWT Validation",
      language: "TypeScript",
      version: "v2.1.0",
      description: "Custom authentication guard extracting JWT payload & validating active user session.",
      code: `@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) throw new UnauthorizedException('Access token missing');
    
    try {
      const payload = await this.jwtService.verifyAsync(token);
      request['user'] = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}`
    }
  ],
  Python: [
    {
      id: "py-1",
      title: "FastAPI Async Database Session",
      language: "Python",
      version: "v1.0.0",
      description: "Async context manager pattern for SQLAlchemy database session management.",
      code: `@asynccontextmanager
async def get_db_session() -> AsyncSession:
    async with AsyncSession(engine) as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()`
    }
  ],
  Go: [
    {
      id: "go-1",
      title: "Worker Pool with Context Cancellation",
      language: "Go",
      version: "v3.0.1",
      description: "Concurrent worker queue pattern with context cancellation support.",
      code: `func ProcessJobs(ctx context.Context, jobs []Job, workers int) []Result {
    jobChan := make(chan Job, len(jobs))
    resChan := make(chan Result, len(jobs))
    var wg sync.WaitGroup

    for i := 0; i < workers; i++ {
        wg.Add(1)
        go func() {
            defer wg.Done()
            for job := range jobChan {
                select {
                case <-ctx.Done():
                    return
                case resChan <- job.Execute():
                }
            }
        }()
    }
    close(jobChan)
    wg.Wait()
    return results
}`
    }
  ],
  Rust: [
    {
      id: "rs-1",
      title: "Zero-Copy String Parser",
      language: "Rust",
      version: "v1.2.0",
      description: "High-performance string slice parser avoiding unnecessary heap allocations.",
      code: `pub struct HeaderParser<'a> {
    raw: &'a str,
}

impl<'a> HeaderParser<'a> {
    pub fn new(input: &'a str) -> Self {
        Self { raw: input }
    }

    pub fn parse_key_value(&self) -> Option<(&'a str, &'a str)> {
        let mut parts = self.raw.splitn(2, ':');
        let key = parts.next()?.trim();
        let val = parts.next()?.trim();
        Some((key, val))
    }
}`
    }
  ]
};

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [activeLang, setActiveLang] = useState<string>("TypeScript");
  const [copied, setCopied] = useState<boolean>(false);
  const [mobileNavOpen, setMobileNavOpen] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const loggedState = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(!!(token || loggedState));
  }, []);

  const currentSnippets = SAMPLE_SNIPPETS[activeLang] || SAMPLE_SNIPPETS["TypeScript"];
  const currentSnippet = currentSnippets[0];

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scrollToSection = (id: string) => {
    setMobileNavOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="home-container">
      {/* Background Lighting & Grid */}
      <div className="bg-glow bg-glow-1" />
      <div className="bg-glow bg-glow-2" />
      <div className="bg-grid-overlay" />

      {/* Header / Navigation Bar - Sticky */}
      <header className="home-header">
        <div className="nav-container">
          <div className="logo-brand" onClick={() => navigate("/")}>
            <div className="logo-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16.5 9.4 7.55 4.24a2.29 2.29 0 0 0-3.28 2v11.52a2.29 2.29 0 0 0 3.28 2L16.5 14.6a2.3 2.3 0 0 0 0-5.2Z" />
                <path d="M21 16V8" />
              </svg>
            </div>
            <span className="logo-text">Code<span className="logo-highlight">Vault</span></span>
          </div>

          <nav className={`nav-links ${mobileNavOpen ? "open" : ""}`}>
            <button type="button" className="nav-link-btn" onClick={() => scrollToSection("features")}>Features</button>
            <button type="button" className="nav-link-btn" onClick={() => scrollToSection("explorer")}>Languages</button>
            <button type="button" className="nav-link-btn" onClick={() => scrollToSection("workflow")}>Workflow</button>
          </nav>

          <div className="nav-actions">
            {isLoggedIn ? (
              <>
                <button type="button" className="btn-secondary" onClick={() => navigate("/dashboard")}>
                  Dashboard
                </button>
                <button type="button" className="btn-primary" onClick={() => navigate("/profile")}>
                  My Account
                </button>
              </>
            ) : (
              <>
                <button type="button" className="btn-ghost" onClick={() => navigate("/login")}>
                  Sign In
                </button>
                <button type="button" className="btn-primary" onClick={() => navigate("/signup")}>
                  Sign Up
                </button>
              </>
            )}
            
            <button type="button" className="mobile-menu-btn" onClick={() => setMobileNavOpen(!mobileNavOpen)} aria-label="Toggle navigation menu">
              {mobileNavOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </header>

      {/* Main Hero Section */}
      <main>
        <section className="hero-section">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="pulse-dot" /> Developer Code Snippet & Version Vault
            </div>
            <h1 className="hero-title">
              Store, Version & Organize Your Code Snippets <span className="gradient-text">Effortlessly</span>
            </h1>
            <p className="hero-subtitle">
              Centralize your reusable logic, infrastructure scripts, and algorithms. Built for developers who demand instant search, version tracking, and seamless sharing.
            </p>

            <div className="hero-cta-group">
              {isLoggedIn ? (
                <button type="button" id="hero-go-dashboard" className="btn-hero-primary" onClick={() => navigate("/dashboard")}>
                  Go to Dashboard <span>→</span>
                </button>
              ) : (
                <button type="button" id="hero-start-free" className="btn-hero-primary" onClick={() => navigate("/signup")}>
                  Get Started Free <span>→</span>
                </button>
              )}
              <button type="button" id="hero-explore-all" className="btn-hero-secondary" onClick={() => navigate("/allsnippets")}>
                Browse All Snippets
              </button>
            </div>

            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-num">Multi-Lang</span>
                <span className="stat-label">Syntax Highlighting</span>
              </div>
              <div className="stat-divider" />
              <div className="stat-item">
                <span className="stat-num">Versioned</span>
                <span className="stat-label">Revision History</span>
              </div>
              <div className="stat-divider" />
              <div className="stat-item">
                <span className="stat-num">Instant</span>
                <span className="stat-label">Full-Text & Tag Search</span>
              </div>
            </div>
          </div>
        </section>

        {/* Core Features Grid */}
        <section className="features-section" id="features">
          <div className="section-header">
            <h2 className="section-title">Built for Modern Developer Workflows</h2>
            <p className="section-subtitle">
              Stop losing snippet code in random notes or Slack threads. Keep everything indexed, versioned, and at your fingertips.
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Snippet Version Control</h3>
              <p>Keep track of revisions, compare changes across releases, and never lose working code iterations.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Smart Instant Search</h3>
              <p>Find snippets in milliseconds by language tag, title keyword, or specific code contents.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Private & Public Vaults</h3>
              <p>Store confidential configuration helpers securely or publish shareable snippets with unique links.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">💻</div>
              <h3>Multi-Language Support</h3>
              <p>Full support and rich formatting for TypeScript, Python, Go, Rust, C++, SQL, HTML/CSS, and more.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Developer Dashboard</h3>
              <p>Get instant activity analytics, total snippet counts, recent updates, and rapid action triggers.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🚀</div>
              <h3>Monaco-Powered Feel</h3>
              <p>Designed with intuitive syntax rendering and keyboard shortcuts that feel natural to modern devs.</p>
            </div>
          </div>
        </section>

        {/* Responsive Languages Explorer */}
        <section className="explorer-section" id="explorer">
          <div className="section-header">
            <h2 className="section-title">Explore Snippets by Language</h2>
            <p className="section-subtitle">Select a programming language to inspect sample vault entries</p>
          </div>

          <div className="lang-tabs">
            {Object.keys(SAMPLE_SNIPPETS).map((lang) => (
              <button
                key={lang}
                type="button"
                className={`lang-tab-btn ${activeLang === lang ? "active" : ""}`}
                onClick={() => setActiveLang(lang)}
              >
                {lang}
              </button>
            ))}
          </div>

          <div className="explorer-display">
            <div className="explorer-card">
              <div className="explorer-card-header">
                <div className="explorer-info">
                  <h3>{currentSnippet.title}</h3>
                  <p className="explorer-desc">{currentSnippet.description}</p>
                </div>
                <div className="explorer-actions">
                  <span className="lang-tag">{currentSnippet.language}</span>
                  <button type="button" className="copy-btn-sm" onClick={() => handleCopyCode(currentSnippet.code)}>
                    {copied ? "✓ Copied" : "Copy Code"}
                  </button>
                </div>
              </div>

              <div className="explorer-code-block">
                <pre className="code-editor-pre">
                  <code>{currentSnippet.code}</code>
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* High-Contrast Workflow Steps */}
        <section className="workflow-section" id="workflow">
          <div className="section-header">
            <h2 className="section-title">How CodeVault Works</h2>
            <p className="section-subtitle">Three simple steps to effortless code management</p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">01</div>
              <h3>Capture & Save</h3>
              <p>Create a new snippet in seconds using our editor with language tags and descriptive metadata.</p>
            </div>

            <div className="step-card">
              <div className="step-number">02</div>
              <h3>Revise & Version</h3>
              <p>Add version updates whenever your logic improves. Maintain full revision history over time.</p>
            </div>

            <div className="step-card">
              <div className="step-number">03</div>
              <h3>Search & Reuse</h3>
              <p>Query your vault instantly or share public snippets with your team or community.</p>
            </div>
          </div>
        </section>

        {/* Call To Action Banner */}
        <section className="cta-banner">
          <div className="cta-content">
            <h2>Ready to Organize Your Codebase?</h2>
            <p>Join developers keeping their code snippets clean, searchable, and version-controlled.</p>
            <div className="cta-buttons">
              {isLoggedIn ? (
                <button type="button" className="btn-cta-primary" onClick={() => navigate("/dashboard")}>
                  Open Dashboard
                </button>
              ) : (
                <button type="button" className="btn-cta-primary" onClick={() => navigate("/signup")}>
                  Get Started For Free
                </button>
              )}
              <button type="button" className="btn-cta-secondary" onClick={() => navigate("/searchany")}>
                Search Vault
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Component */}
      <footer className="home-footer">
        <div className="footer-container">
          <div className="footer-brand">
            <div className="logo-brand" onClick={() => navigate("/")}>
              <span className="logo-text">Code<span className="logo-highlight">Vault</span></span>
            </div>
            <p className="footer-tagline">
              Your centralized hub for code snippet storage, revision management, and multi-language organization.
            </p>
          </div>

          <div className="footer-links-group">
            <div className="footer-col">
              <h4>Navigation</h4>
              <button type="button" className="footer-link-btn" onClick={() => navigate("/allsnippets")}>All Snippets</button>
              <button type="button" className="footer-link-btn" onClick={() => navigate("/searchbylanguage")}>Search by Language</button>
              <button type="button" className="footer-link-btn" onClick={() => navigate("/searchByTitle")}>Search by Title</button>
              <button type="button" className="footer-link-btn" onClick={() => navigate("/searchany")}>Universal Search</button>
            </div>

            <div className="footer-col">
              <h4>Account</h4>
              {isLoggedIn ? (
                <>
                  <button type="button" className="footer-link-btn" onClick={() => navigate("/dashboard")}>Dashboard</button>
                  <button type="button" className="footer-link-btn" onClick={() => navigate("/profile")}>User Profile</button>
                </>
              ) : (
                <>
                  <button type="button" className="footer-link-btn" onClick={() => navigate("/login")}>Sign In</button>
                  <button type="button" className="footer-link-btn" onClick={() => navigate("/signup")}>Sign Up</button>
                </>
              )}
            </div>

            <div className="footer-col">
              <h4>Platform</h4>
              <span>React 19</span>
              <span>TypeScript</span>
              <span>NestJS Backend</span>
              <span>Monaco Editor</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} CodeVault. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
