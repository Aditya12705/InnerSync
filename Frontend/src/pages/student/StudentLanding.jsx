import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  Sparkles,
  Leaf,
  Users,
  Heart,
  BookOpen,
  Bird,
  Brain,
  ShieldCheck,
  Compass,
  MessageCircle,
  Stethoscope,
  ArrowRight,
  Menu,
  X as CloseIcon,
  LayoutDashboard
} from 'lucide-react';
import { useMood } from '../../context/MoodContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import styles from './StudentLanding.module.scss';

export function StudentLanding() {
  const { lastReframing, isReframing, reframeStress } = useMood();
  const { studentLoggedIn } = useAuth();
  const [animationKey, setAnimationKey] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const getDynamicGreeting = () => {
    if (studentLoggedIn) return "Welcome back to your sanctuary";
    return <>Find your <em>peace of mind</em></>;
  };

  const getDynamicDescription = () => {
    if (lastReframing) {
      return "Your perspective has been reframed. Check your Mirror for clarity.";
    }
    if (studentLoggedIn) {
      return "Continue your journey towards balance and clarity with InnerSync.";
    }
    return "A peaceful space designed for your mental well-being. Connect with AI support, peers, or professional counselors at your own pace.";
  };

  return (
    <div className={styles.pageWrapper}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link to="/" className={styles.brand}>
            <img
              src="/images/logo.png"
              alt="InnerSync Logo"
              className={styles.logo}
            />
            <div className={styles.brandText}>
              <span className={styles.brandName}>InnerSync</span>
              <span className={styles.tagline}>Sanctuary for your mind</span>
            </div>
          </Link>
          <nav className={styles.nav}>
            <Link to="/" className={styles.navLink}>Home</Link>
            <Link to="/student/self-help" className={styles.navLink}>Resources</Link>
            <Link to="/student/assessment" className={styles.navLink}>Assessment</Link>
            <Link to="/student/counselor" className={styles.navLink}>Counselor</Link>
            {studentLoggedIn && <Link to="/student/support" className={styles.navLink}>Support</Link>}
            <Link
              to={studentLoggedIn ? "/student/dashboard" : "/login?role=student"}
              className={styles.signInBtn}
            >
              {studentLoggedIn ? 'Dashboard' : 'Start Journey'}
            </Link>
          </nav>
          <button
            className={styles.mobileToggle}
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Toggle menu"
          >
            <Menu size={28} />
          </button>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <div className={`${styles.mobileDrawer} ${mobileMenuOpen ? styles.drawerOpen : ''}`}>
        <div className={styles.drawerHeader}>
          <span className={styles.drawerTitle}>Menu</span>
          <button className={styles.closeDrawer} onClick={() => setMobileMenuOpen(false)}>
            <CloseIcon size={28} />
          </button>
        </div>
        <nav className={styles.drawerNav}>
          <Link to="/" className={styles.drawerLink} onClick={() => setMobileMenuOpen(false)}>Home</Link>
          <Link to="/student/self-help" className={styles.drawerLink} onClick={() => setMobileMenuOpen(false)}>Resources</Link>
          <Link to="/student/assessment" className={styles.drawerLink} onClick={() => setMobileMenuOpen(false)}>Assessment</Link>
          <Link to="/student/counselor" className={styles.drawerLink} onClick={() => setMobileMenuOpen(false)}>Counselor</Link>
          {studentLoggedIn && <Link to="/student/support" className={styles.drawerLink} onClick={() => setMobileMenuOpen(false)}>Support</Link>}
          <Link
            to={studentLoggedIn ? "/student/dashboard" : "/login?role=student"}
            className={styles.drawerCta}
            onClick={() => setMobileMenuOpen(false)}
          >
            {studentLoggedIn ? 'Dashboard' : 'Start Journey'}
          </Link>
        </nav>
      </div>
      {mobileMenuOpen && <div className={styles.drawerOverlay} onClick={() => setMobileMenuOpen(false)}></div>}

      <main className={styles.mainContent}>
        <section className={styles.heroSection}>
          <div className={styles.heroGrid}>
            <div className={styles.heroContent}>
              <div className={styles.badge}>
                <Sparkles size={14} />
                <span>Your AI Sanctuary</span>
              </div>
              <h1 className={styles.headline} key={animationKey}>
                {getDynamicGreeting()}
              </h1>
              <p className={styles.description}>
                {getDynamicDescription()}
              </p>
              <div className={styles.ctaButtons}>
                <Link to={studentLoggedIn ? "/student/dashboard" : "/login?role=student"} className={styles.primaryBtn}>
                  {studentLoggedIn ? "Go to Dashboard" : "Start your Journey"}
                </Link>
              </div>
            </div>
            <div className={styles.heroImageContainer}>
              <img src="/images/innersync_hero.png" alt="InnerSync Hero Illustration" />
            </div>
          </div>
        </section>

        <section className={styles.mirrorIntroSection}>
          <div className={styles.mirrorIntroCard}>
            <div className={styles.mirrorIcon}>
              <Sparkles size={48} />
            </div>
            <div className={styles.mirrorText}>
              <h2>The Reframing Mirror</h2>
              <p>Don't just track your mood—change your perspective. Pour out your stressors and let InnerSync help you find the growth-oriented path forward.</p>
              <Link to="/student/dashboard" className={styles.mirrorActionBtn}>
                Try the Mirror
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>

        <section id="features" className={styles.infoSection}>
          <div className={styles.infoGrid}>
            <div className={styles.featuresCard}>
              <h2 className={styles.cardTitle}>The InnerSync Experience</h2>
              <div className={styles.featuresList}>
                <div className={styles.featureItem}>
                  <div className={styles.featureIcon}>
                    <Brain size={32} />
                  </div>
                  <div>
                    <h4>Peaceful AI Support</h4>
                    <p>Gentle, 24/7 intelligent accompaniment for your thoughts.</p>
                  </div>
                </div>
                <div className={styles.featureItem}>
                  <div className={styles.featureIcon}>
                    <Users size={32} />
                  </div>
                  <div>
                    <h4>Safe Community</h4>
                    <p>Connect with peers who share your journey in a protected space.</p>
                  </div>
                </div>
                <div className={styles.featureItem}>
                  <div className={styles.featureIcon}>
                    <Compass size={32} />
                  </div>
                  <div>
                    <h4>Guided Wellbeing</h4>
                    <p>Personalized resources to help you find your steady ground.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.aboutCard}>
              <h2 className={styles.cardTitle}>Our Mission</h2>
              <div className={styles.aboutContent}>
                <p>InnerSync is more than just a platform; it's a digital sanctuary built to support the modern student. We believe that mental wellbeing is the foundation of academic and personal growth.</p>
                <p>By blending compassionate AI technology with human expertise, we provide a tiered support system that adapts to your unique emotional landscape.</p>
                <h4>Confidential & Compassionate</h4>
                <p>Your journey is private. We ensure the highest level of security so you can focus entirely on your healing and growth.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="support" className={styles.supportSection}>
          <h2 className={styles.sectionTitle}>Choose your path</h2>
          <div className={styles.supportGrid}>
            <div className={styles.supportCard}>
              <div className={styles.supportIcon}><Bird size={48} /></div>
              <h3>AI Sanctuary</h3>
              <p>Clarity and comfort through our serene AI companion.</p>
              <Link to="/student/peer" className={styles.supportBtn}>Open Sanctuary</Link>
            </div>
            <div className={styles.supportCard}>
              <div className={styles.supportIcon}><Leaf size={48} /></div>
              <h3>Peer Garden</h3>
              <p>Growth through connection with fellow students.</p>
              <Link to="/student/peer" className={styles.supportBtn}>Enter Garden</Link>
            </div>
            <div className={styles.supportCard}>
              <div className={styles.supportIcon}><Stethoscope size={48} /></div>
              <h3>Light Guidance</h3>
              <p>Direct support from licensed professionals.</p>
              <Link to="/student/counselor" className={styles.supportBtn}>Seek Guidance</Link>
            </div>
            <div className={styles.supportCard}>
              <div className={styles.supportIcon}><BookOpen size={48} /></div>
              <h3>Knowledge Base</h3>
              <p>Explore tools for your personal toolkit.</p>
              <Link to="/student/self-help" className={styles.supportBtn}>Learn More</Link>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerBrand}>
            <div className={styles.footerLogo}>
              <img src="/images/logo.png" alt="InnerSync Logo" className={styles.footerLogoImg} />
            </div>
            <p>Your companion for a balanced mind and a peaceful heart. Dedicated to student wellbeing everywhere.</p>
          </div>
          <div className={styles.footerLinks}>
            <div className={styles.footerColumn}>
              <h4>Explore</h4>
              <a href="#features">Experience</a>
              <a href="#support">Paths</a>
              <Link to="/student/self-help">Resources</Link>
            </div>
            <div className={styles.footerColumn}>
              <h4>Safety</h4>
              <a href="/privacy">Privacy</a>
              <a href="/terms">Terms</a>
              <a href="/help">Sanctuary Rules</a>
            </div>
            <div className={styles.footerColumn}>
              <h4>Connect</h4>
              <a href="mailto:hello@innersync.com">Contact Us</a>
              <Link to="/student/crisis">Crisis Support</Link>
            </div>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>&copy; 2025 InnerSync. Deep breath, you're here now.</p>
          <p>Made with resilience by Support Team</p>
        </div>
      </footer>
    </div >
  );
}