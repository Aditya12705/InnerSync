import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  ClipboardList,
  Stethoscope,
  MessageCircle,
  BarChart3,
  Clock,
  Calendar,
  Zap,
  TrendingUp,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { AdminCharts } from './AdminCharts.jsx';
import { AnimatedBackground } from '../../components/layout/AnimatedBackground.jsx';
import { AppointmentsAPI, AnalyticsAPI } from '../../services/api.js';
import styles from './AdminDashboard.module.scss';

export function AdminDashboard() {
  const { logoutAdmin, user } = useAuth();
  const navigate = useNavigate();
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [stats, setStats] = useState({
    activeUsers: 0,
    totalCounselors: 0,
    totalAssessments: 0,
    pendingCases: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isCounselor = user?.role === 'counselor';
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError('');

        // Fetch Overview Stats
        const overview = await AnalyticsAPI.getOverview();
        setStats({
          activeUsers: overview.activeUsers || 0,
          totalCounselors: overview.totalCounselors || 0,
          totalAssessments: overview.totalAssessments || 0,
          pendingCases: overview.pendingAppointments || 0
        });

        // Fetch Appointments only if Counselor
        if (isCounselor && user?.id) {
          const appointments = await AppointmentsAPI.getCounselorAppointments(user.id);
          setUpcomingAppointments(Array.isArray(appointments) ? appointments : []);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, isCounselor]);

  const formatDate = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const formatTime = (dateString) => {
    const options = { hour: '2-digit', minute: '2-digit', hour12: true };
    return new Date(dateString).toLocaleTimeString('en-US', options);
  }

  const recentActivity = [
    ...upcomingAppointments.slice(0, 3).map(appt => ({
      icon: Calendar,
      title: `Appointment with ${appt.student?.name || 'Student'}`,
      time: formatDate(appt.startsAt)
    })),
  ].slice(0, 3);

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <img src="/images/logo.png" alt="InnerSync Logo" className={styles.logo} />
          <h1>InnerSync {isAdmin ? 'Admin' : 'Counselor'} Portal</h1>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.adminStatus}>
            <span className={styles.statusDot}></span>
            <span>Welcome, {user?.name || (isAdmin ? 'Admin' : 'Counselor')}</span>
          </div>
          <button
            onClick={() => {
              logoutAdmin();
              navigate(isAdmin ? '/admin/login' : '/counselor/login');
            }}
            className={styles.logoutBtn}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      <section className={styles.statsSection}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}><Users /></div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.activeUsers}</div>
            <div className={styles.statLabel}>Students</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}><Stethoscope /></div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.totalCounselors}</div>
            <div className={styles.statLabel}>Counselors</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}><ClipboardList /></div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.totalAssessments}</div>
            <div className={styles.statLabel}>Assessments Filled</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}><MessageCircle /></div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.pendingCases}</div>
            <div className={styles.statLabel}>Booked Appts</div>
          </div>
        </div>
      </section>

      <div className={styles.contentGrid}>
        <div className={styles.mainContent}>
          <section className="card">
            <div className={styles.cardHeader}>
              <h3>Analytics Overview</h3>
              <div className={styles.cardIcon}><TrendingUp size={20} /></div>
            </div>
            <AdminCharts />
          </section>

          <section className="card">
            <div className={styles.cardHeader}>
              <h3>Recent Activity</h3>
              <div className={styles.cardIcon}><Clock size={20} /></div>
            </div>
            <div className={styles.activityList}>
              {recentActivity.length > 0 ? recentActivity.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className={styles.activityItem}>
                    <div className={styles.activityIcon}><Icon size={18} /></div>
                    <div className={styles.activityContent}>
                      <div className={styles.activityTitle}>{item.title}</div>
                      <div className={styles.activityTime}>{item.time}</div>
                    </div>
                  </div>
                )
              }) : <p>No recent activity</p>}
            </div>
          </section>
        </div>

        <aside className={styles.sidebar}>
          {isCounselor && (
            <section className="card" style={{ marginBottom: '20px' }}>
              <div className={styles.cardHeader}>
                <h3>Upcoming Appointments</h3>
                <div className={styles.cardIcon}><Calendar size={20} /></div>
              </div>
              {loading ? (
                <p>Loading appointments...</p>
              ) : error ? (
                <p style={{ color: 'var(--danger)' }}>{error}</p>
              ) : upcomingAppointments.length === 0 ? (
                <p>No upcoming appointments</p>
              ) : (
                <div className={styles.appointmentList}>
                  {upcomingAppointments.map((appointment) => (
                    <div key={appointment._id} className={styles.appointmentItem}>
                      <div className={styles.appointmentTime}>
                        {formatTime(appointment.startsAt)}
                      </div>
                      <div className={styles.appointmentDetails}>
                        <div className={styles.appointmentTitle}>
                          {appointment.student?.name || 'Student'}
                        </div>
                        <div className={styles.appointmentDate}>
                          {formatDate(appointment.startsAt)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          <section className="card">
            <div className={styles.cardHeader}>
              <h3>Quick Actions</h3>
              <div className={styles.cardIcon}><Zap size={20} /></div>
            </div>
            <div className={styles.actionList}>
              <button className={styles.actionBtn} onClick={() => navigate('/counselor/users')}>
                <div className={styles.actionIcon}><Users size={18} /></div>
                <span>Manage Users</span>
              </button>
              <button className={styles.actionBtn} onClick={() => navigate('/counselor/cases')}>
                <div className={styles.actionIcon}><ClipboardList size={18} /></div>
                <span>Active Appts</span>
              </button>
              <button className={styles.actionBtn} onClick={() => navigate('/admin/assessment-results')}>
                <div className={styles.actionIcon}><ClipboardList size={18} /></div>
                <span>View Forms/Tests</span>
              </button>
              <button className={styles.actionBtn} onClick={() => navigate('/counselor/reports')}>
                <div className={styles.actionIcon}><BarChart3 size={18} /></div>
                <span>Generate Reports</span>
              </button>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}