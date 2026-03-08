import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  Zap,
  Users,
  BarChart3,
  AlertTriangle,
  Calendar,
  Book,
  Wind,
  BookOpen,
  LayoutDashboard
} from 'lucide-react';
import { StudentAPI } from '../../services/api.js';
import styles from './StudentDashboard.module.scss';

// Helper to format date distance
const formatDistanceToNow = (date) => {
  if (!date) return 'Never';
  const now = new Date();
  const past = new Date(date);
  const diffTime = Math.abs(now - past);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    if (diffHours === 0) return 'Just now';
    return `${diffHours}h ago`;
  }
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return past.toLocaleDateString();
};

export function StudentDashboard() {
  const { user } = useAuth();
  // ... state and effects (remained same)
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await StudentAPI.getDashboardSummary();
        if (data) {
          setSummary(data);
        } else {
          setError('No data available. Complete your first assessment to see your dashboard.');
        }
      } catch (err) {
        console.error('Dashboard error:', err);
        const errorMessage = err.response?.data?.message || 'Could not load dashboard data. Please try again later.';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  const lastAssessment = summary?.lastAssessment;
  const wellnessScore = lastAssessment?.totalScore !== undefined
    ? (100 - (lastAssessment.totalScore / 27) * 100).toFixed(0)
    : 'N/A';

  const getRiskLevel = () => {
    if (!lastAssessment) return 'low';
    const score = lastAssessment.totalScore;
    if (score < 5) return 'low';
    if (score < 10) return 'medium';
    return 'high';
  };

  const riskLevel = getRiskLevel();

  return (
    <div className={styles.dashboard}>
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.welcomeWrapper}>
            <LayoutDashboard className={styles.welcomeIcon} />
            <h1 className={styles.welcome}>Welcome back, {user?.name || summary?.studentName || 'Student'}!</h1>
          </div>
          <p className={styles.subtitle}>Your space for mental clarity and support.</p>
          {loading ? (
            <p>Loading your status...</p>
          ) : error ? (
            <p style={{ color: 'var(--danger)' }}>{error}</p>
          ) : (
            <div className={styles.statusGrid}>
              <div className={styles.statusItem}>
                <span className={styles.statusLabel}>Current Status</span>
                <span className={`${styles.statusValue} ${styles[riskLevel + 'Risk']}`}>
                  {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)} Risk
                </span>
              </div>
              <div className={styles.statusItem}>
                <span className={styles.statusLabel}>Last Assessment</span>
                <span className={styles.statusValue}>{formatDistanceToNow(lastAssessment?.completedAt)}</span>
              </div>
              <div className={styles.statusItem}>
                <span className={styles.statusLabel}>Wellness Score</span>
                <span className={styles.statusValue}>{wellnessScore}%</span>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className={styles.grid}>
        <section className={`${styles.card} ${styles.actionsCard}`}>
          <div className={styles.cardHeader}>
            <h3>How can we help today?</h3>
            <div className={styles.cardIcon}><Zap size={20} /></div>
          </div>
          <div className={styles.actionGrid}>
            <Link to="/student/support" className={styles.actionBtn}>
              <div className={styles.actionIcon}><Users size={24} /></div>
              <div>
                <div className={styles.actionTitle}>Find Support</div>
                <div className={styles.actionDesc}>Explore your options</div>
              </div>
            </Link>
            <Link to="/student/assessment" className={styles.actionBtn}>
              <div className={styles.actionIcon}><BarChart3 size={24} /></div>
              <div>
                <div className={styles.actionTitle}>Take Assessment</div>
                <div className={styles.actionDesc}>Check on your mood</div>
              </div>
            </Link>
            <Link to="/student/self-help" className={styles.actionBtn}>
              <div className={styles.actionIcon}><BookOpen size={24} /></div>
              <div>
                <div className={styles.actionTitle}>Self Help Library</div>
                <div className={styles.actionDesc}>Relax and recharge</div>
              </div>
            </Link>
            <Link to="/student/crisis" className={`${styles.actionBtn} ${styles.crisisBtn}`}>
              <div className={styles.actionIcon}><AlertTriangle size={24} /></div>
              <div>
                <div className={styles.actionTitle}>Crisis Alert</div>
                <div className={styles.actionDesc}>Get immediate help</div>
              </div>
            </Link>
          </div>
        </section>

        {summary?.nextAppointment && (
          <section className={`${styles.card} ${styles.appointmentCard}`}>
            <div className={styles.cardHeader}>
              <h3>Upcoming Appointment</h3>
              <div className={styles.cardIcon}><Calendar size={20} /></div>
            </div>
            <div className={styles.appointmentDetails}>
              <p>With <strong>{summary.nextAppointment.counselorId?.name || 'Counselor'}</strong></p>
              <p>{new Date(summary.nextAppointment.startsAt).toLocaleString('en-US', {
                dateStyle: 'full',
                timeStyle: 'short',
              })}</p>
            </div>
          </section>
        )}

        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>Recommended For You</h3>
            <div className={styles.cardIcon}><Book size={20} /></div>
          </div>
          <div className={styles.resourceList}>
            <div className={styles.resourceItem}>
              <div className={styles.resourceIcon}><Wind size={20} /></div>
              <div className={styles.resourceContent}>
                <div className={styles.resourceTitle}>Mindful Breathing</div>
                <div className={styles.resourceDesc}>A 5-minute guided session to calm your mind.</div>
              </div>
              <Link to="/student/self-help" className={styles.resourceLink}>Start</Link>
            </div>
            <div className={styles.resourceItem}>
              <div className={styles.resourceIcon}><BookOpen size={20} /></div>
              <div className={styles.resourceContent}>
                <div className={styles.resourceTitle}>Daily Journaling</div>
                <div className={styles.resourceDesc}>Reflect on your day and organize your thoughts.</div>
              </div>
              <Link to="/student/journal" className={styles.resourceLink}>Write</Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}