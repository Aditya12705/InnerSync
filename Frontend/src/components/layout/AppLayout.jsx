import { useState, useRef } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { MoodIndicator } from '../mood/MoodIndicator.jsx';
import { useClickAway } from 'react-use';
import { Menu, X as CloseIcon, LayoutDashboard, User, LogOut, ChevronDown, BookOpen } from 'lucide-react';
import styles from './AppLayout.module.scss';

// Icons
// Removing manual SVG icons and using Lucide

export function AppLayout() {
  const { adminLoggedIn, studentLoggedIn, logoutStudent, logoutAdmin, user } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Close dropdown when clicking outside
  useClickAway(dropdownRef, () => {
    setDropdownOpen(false);
  });

  useClickAway(mobileMenuRef, () => {
    setMobileMenuOpen(false);
  });

  const handleLogout = async () => {
    try {
      // Close dropdown
      setDropdownOpen(false);

      // Call the appropriate logout function
      if (studentLoggedIn) {
        await logoutStudent();
      } else if (adminLoggedIn) {
        await logoutAdmin();
      }

      // Force a full page reload to ensure all state is cleared
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      // Still redirect even if there's an error
      window.location.href = '/';
    }
  };

  const getUserInitials = () => {
    if (!user) return 'U';
    if (user.role === 'counselor' && user.name) {
      return user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    }
    if (user.name) {
      return user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    }
    return 'U';
  };

  const handleGoBack = () => {
    navigate(-1); // Navigates to the previous page in history
  };

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <button
              onClick={handleGoBack}
              aria-label="Go back"
              title="Go back"
              className={styles.backButton}
            >
              ←
            </button>
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
            <nav className={styles.navLinks}>
              {!adminLoggedIn && (
                <>
                  <NavLink to="/student/dashboard">Dashboard</NavLink>
                  <NavLink to="/student/self-help">Self Help</NavLink>
                  <NavLink to="/student/journal">Journal</NavLink>
                </>
              )}
            </nav>
          </div>
          <div className={styles.headerRight}>
            {!adminLoggedIn && <div className={styles.desktopMood}><MoodIndicator compact={true} /></div>}

            <button
              className={styles.mobileMenuToggle}
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open mobile menu"
            >
              <Menu size={24} />
            </button>

            {studentLoggedIn || adminLoggedIn ? (
              <div className={styles['user-menu']}>
                <div className={styles['user-avatar']}>
                  {getUserInitials()}
                </div>
                <div className={styles.dropdown} ref={dropdownRef}>
                  <button
                    className={styles['dropdown-toggle']}
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    aria-expanded={dropdownOpen}
                    aria-haspopup="true"
                  >
                    {user?.name || (adminLoggedIn ? 'Counsellor' : 'User')}
                    <ChevronDown size={16} className="caret" />
                  </button>
                  <div
                    className={styles['dropdown-menu']}
                    data-show={dropdownOpen ? 'true' : undefined}
                  >
                    <Link
                      to={adminLoggedIn ? '/admin/dashboard' : '/student/dashboard'}
                      className={styles['dropdown-item']}
                      onClick={() => setDropdownOpen(false)}
                    >
                      <User size={16} className={styles['btn-icon']} />
                      {adminLoggedIn ? 'Counsellor Dashboard' : 'My Dashboard'}
                    </Link>
                    <div className={styles.divider}></div>
                    <button
                      onClick={handleLogout}
                      className={`${styles['dropdown-item']} ${styles.danger}`}
                    >
                      <LogOut size={16} className={styles['btn-icon']} />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => navigate('/login?role=admin')}
                className={`${styles.btn} ${styles['btn-admin']}`}
              >
                <User size={16} className={styles['btn-icon']} />
                Admin Login
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div className={`${styles.mobileDrawer} ${mobileMenuOpen ? styles.drawerOpen : ''}`} ref={mobileMenuRef}>
        <div className={styles.drawerHeader}>
          <span className={styles.drawerTitle}>Menu</span>
          <button className={styles.closeDrawer} onClick={() => setMobileMenuOpen(false)}>
            <CloseIcon size={24} />
          </button>
        </div>
        <nav className={styles.drawerNav}>
          {!adminLoggedIn && (
            <>
              <NavLink to="/student/dashboard" onClick={() => setMobileMenuOpen(false)}>
                <LayoutDashboard size={20} />
                Dashboard
              </NavLink>
              <NavLink to="/student/self-help" onClick={() => setMobileMenuOpen(false)}>
                <BookOpen size={20} />
                Self Help Library
              </NavLink>
              <NavLink to="/student/journal" onClick={() => setMobileMenuOpen(false)}>
                <User size={20} />
                Daily Journal
              </NavLink>
            </>
          )}
          <div className={styles.drawerMood}>
            <span className={styles.drawerSectionLabel}>Reframing Mirror</span>
            <MoodIndicator showHistory={false} />
          </div>
        </nav>
      </div>
      {mobileMenuOpen && <div className={styles.drawerOverlay} onClick={() => setMobileMenuOpen(false)}></div>}

      <main className={styles.main}>
        <div className={styles.contentWrapper}>
          <div className={`${styles.contentArea} ${adminLoggedIn ? styles.adminContent : ''}`}>
            <Outlet />
          </div>
          {!adminLoggedIn && (
            <aside className={styles.sidebar}>
              <MoodIndicator showHistory={true} />
            </aside>
          )}
        </div>
      </main>

      <footer className={styles.footer}>
        <p>&copy; 2025 InnerSync. Your mental health matters.</p>
        <div className={styles.footerLinks}>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Service</Link>
          <Link to="/contact">Contact</Link>
        </div>
      </footer>
    </div>
  );
}