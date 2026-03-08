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
import { AppointmentsAPI } from '../../services/api.js';
import styles from './AdminDashboard.module.scss';

export function AdminDashboard() {
  const { logoutAdmin, user } = useAuth();
  const navigate = useNavigate();
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user || !user.id) {
        setError('Authentication error. Please log in again.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');
        const counselorId = user.id;
        const appointments = await AppointmentsAPI.getCounselorAppointments(counselorId);
        setUpcomingAppointments(Array.isArray(appointments) ? appointments : []);
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setError('Failed to load appointments. Please try again later.');
        setUpcomingAppointments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [user]);

  const formatDate = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const formatTime = (dateString) => {
    const options = { hour: '2-digit', minute: '2-digit', hour12: true };
    return new Date(dateString).toLocaleTimeString('en-US', options);
  }

  const stats = {
    activeUsers: 128,
    pendingCases: upcomingAppointments?.length || 0,
    onlineCounselors: 2,
    activeChats: 0,
  };

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
          <h1>InnerSync Counselor Portal</h1>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.adminStatus}>
            <span className={styles.statusDot}></span>
            <span>Welcome, {user?.name || 'Counselor'}</span>
          </div>
          <button
            onClick={() => {
              logoutAdmin();
              navigate('/counselor/login');
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
            <div className={styles.statLabel}>Active Users</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}><ClipboardList /></div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.pendingCases}</div>
            <div className={styles.statLabel}>Upcoming Sessions</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}><Stethoscope /></div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.onlineCounselors}</div>
            <div className={styles.statLabel}>Online Counselors</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}><MessageCircle /></div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.activeChats}</div>
            <div className={styles.statLabel}>Active Chats</div>
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
                <span>View Cases</span>
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