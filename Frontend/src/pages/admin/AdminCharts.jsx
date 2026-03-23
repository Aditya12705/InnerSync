import { useState, useEffect } from 'react';
import { Users, MessageCircle, BarChart3, Star } from 'lucide-react';
import { AnalyticsAPI } from '../../services/api.js';
import styles from './AdminCharts.module.scss';

export function AdminCharts() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch real data
        try {
          const [overview, chatAnalytics, assessmentAnalytics, appointmentAnalytics] = await Promise.all([
            AnalyticsAPI.getOverview().catch(e => ({})),
            AnalyticsAPI.getChatAnalytics().catch(e => ({})),
            AnalyticsAPI.getAssessmentAnalytics().catch(e => ({})),
            AnalyticsAPI.getAppointmentAnalytics().catch(e => ({ statusDistribution: [] }))
          ]);

          setData({
            overview: overview || {},
            chatAnalytics: chatAnalytics || { sessionTypes: [], moodDistribution: [], satisfactionScores: [] },
            assessmentAnalytics: assessmentAnalytics || { severityDistribution: [] },
            appointmentAnalytics: appointmentAnalytics || { statusDistribution: [] }
          });
        } catch (err) {
          console.error('Error in fetchData:', err);
          setError('Failed to load real-time analytics data.');
          setData({
            overview: {},
            chatAnalytics: { sessionTypes: [], moodDistribution: [], satisfactionScores: [] },
            assessmentAnalytics: { severityDistribution: [] },
            appointmentAnalytics: { statusDistribution: [] }
          });
        }
      } catch (err) {
        console.error('Unexpected error in fetchData:', err);
        setError('Failed to load analytics data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className={styles.chartsContainer}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading analytics data...</p>
        </div>
      </div>
    );
  }

  // Show error
  if (error) {
    console.warn(error);
  }

  // If no data, initialize with safe empty values
  const currentData = data || {
    overview: {},
    chatAnalytics: { sessionTypes: [], moodDistribution: [], satisfactionScores: [] },
    assessmentAnalytics: { severityDistribution: [] },
    appointmentAnalytics: { statusDistribution: [] }
  };

  const { overview, chatAnalytics, assessmentAnalytics, appointmentAnalytics } = currentData;

  return (
    <div className={styles.chartsContainer}>
      {/* Key Metrics */}
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricIcon}><Users size={20} /></div>
          <div className={styles.metricContent}>
            <div className={styles.metricValue}>{overview.totalUsers || 0}</div>
            <div className={styles.metricLabel}>Total Users</div>
          </div>
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricIcon}><MessageCircle size={20} /></div>
          <div className={styles.metricContent}>
            <div className={styles.metricValue}>{overview.totalChatSessions || 0}</div>
            <div className={styles.metricLabel}>Chat Sessions</div>
          </div>
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricIcon}><BarChart3 size={20} /></div>
          <div className={styles.metricContent}>
            <div className={styles.metricValue}>{overview.totalAssessments || 0}</div>
            <div className={styles.metricLabel}>Assessments</div>
          </div>
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricIcon}><Star size={20} /></div>
          <div className={styles.metricContent}>
            <div className={styles.metricValue}>
              {typeof overview.averageRating === 'number' ? overview.averageRating.toFixed(1) : '0.0'}
            </div>
            <div className={styles.metricLabel}>Avg Rating</div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className={styles.chartsGrid}>
        {/* Chat Session Types */}
        <div className={styles.chartCard}>
          <h4 className={styles.chartTitle}>Chat Session Types</h4>
          <div className={styles.chartContent}>
            {chatAnalytics.sessionTypes?.map((item, index) => (
              <div key={index} className={styles.chartBar}>
                <div className={styles.barLabel}>{item._id}</div>
                <div className={styles.barContainer}>
                  <div
                    className={styles.bar}
                    style={{
                      width: `${(item.count / Math.max(...(chatAnalytics.sessionTypes?.map(s => s.count) || [1]))) * 100}%`,
                      backgroundColor: `hsl(${index * 120}, 70%, 50%)`
                    }}
                  />
                </div>
                <div className={styles.barValue}>{item.count}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Assessment Severity */}
        <div className={styles.chartCard}>
          <h4 className={styles.chartTitle}>Assessment Severity</h4>
          <div className={styles.chartContent}>
            {assessmentAnalytics.severityDistribution?.map((item, index) => (
              <div key={index} className={styles.chartBar}>
                <div className={styles.barLabel}>{item._id}</div>
                <div className={styles.barContainer}>
                  <div
                    className={styles.bar}
                    style={{
                      width: `${(item.count / Math.max(...(assessmentAnalytics.severityDistribution?.map(s => s.count) || [1]))) * 100}%`,
                      backgroundColor: `hsl(${index * 60}, 70%, 50%)`
                    }}
                  />
                </div>
                <div className={styles.barValue}>{item.count}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Appointment Status */}
        <div className={styles.chartCard}>
          <h4 className={styles.chartTitle}>Appointment Status</h4>
          <div className={styles.chartContent}>
            {appointmentAnalytics.statusDistribution?.map((item, index) => (
              <div key={index} className={styles.chartBar}>
                <div className={styles.barLabel}>{item._id}</div>
                <div className={styles.barContainer}>
                  <div
                    className={styles.bar}
                    style={{
                      width: `${(item.count / Math.max(...(appointmentAnalytics.statusDistribution?.map(s => s.count) || [1]))) * 100}%`,
                      backgroundColor: `hsl(${index * 90}, 70%, 50%)`
                    }}
                  />
                </div>
                <div className={styles.barValue}>{item.count}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Mood Distribution */}
        <div className={styles.chartCard}>
          <h4 className={styles.chartTitle}>Mood Distribution</h4>
          <div className={styles.chartContent}>
            {chatAnalytics.moodDistribution?.map((item, index) => (
              <div key={index} className={styles.chartBar}>
                <div className={styles.barLabel}>{item._id}</div>
                <div className={styles.barContainer}>
                  <div
                    className={styles.bar}
                    style={{
                      width: `${(item.count / Math.max(...(chatAnalytics.moodDistribution?.map(s => s.count) || [1]))) * 100}%`,
                      backgroundColor: `hsl(${index * 72}, 70%, 50%)`
                    }}
                  />
                </div>
                <div className={styles.barValue}>{item.count}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Satisfaction Scores */}
      <div className={styles.satisfactionCard}>
        <h4 className={styles.chartTitle}>Satisfaction Scores</h4>
        <div className={styles.satisfactionGrid}>
          {chatAnalytics.satisfactionScores?.map((item, index) => (
            <div key={index} className={styles.satisfactionItem}>
              <div className={styles.satisfactionStars}>
                {'★'.repeat(item._id)} {'☆'.repeat(5 - item._id)}
              </div>
              <div className={styles.satisfactionCount}>{item.count}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


