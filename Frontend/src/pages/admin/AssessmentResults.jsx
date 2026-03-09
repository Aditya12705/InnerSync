import { useState, useEffect } from 'react';
import { AnalyticsAPI } from '../../services/api.js';
import styles from './ReportsAnalytics.module.scss'; // Reuse styles or create new

export function AssessmentResults() {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                setLoading(true);
                const data = await AnalyticsAPI.getAssessmentSubmissions();
                setSubmissions(data);
            } catch (err) {
                console.error('Error fetching submissions:', err);
                setError('Failed to load assessment results');
            } finally {
                setLoading(false);
            }
        };
        fetchSubmissions();
    }, []);

    if (loading) return <div className="container" style={{ padding: '40px' }}><p>Loading records...</p></div>;
    if (error) return <div className="container" style={{ padding: '40px' }}><p className="error">{error}</p></div>;

    return (
        <div className="container" style={{ padding: '40px' }}>
            <header style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{ fontSize: '2rem', color: 'var(--primary)' }}>Assessment Records</h1>
                <div className="badge primary">{submissions.length} Submissions</div>
            </header>

            <div className="card" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--border)' }}>
                            <th style={{ padding: '15px' }}>Student</th>
                            <th style={{ padding: '15px' }}>Test Type</th>
                            <th style={{ padding: '15px' }}>Score</th>
                            <th style={{ padding: '15px' }}>Severity</th>
                            <th style={{ padding: '15px' }}>Date</th>
                            <th style={{ padding: '15px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {submissions.length > 0 ? submissions.map(sub => (
                            <tr key={sub._id} style={{ borderBottom: '1px solid var(--border)' }}>
                                <td style={{ padding: '15px' }}>{sub.studentId?.name || 'Unknown student'}</td>
                                <td style={{ padding: '15px' }}>{sub.type}</td>
                                <td style={{ padding: '15px' }}>{sub.totalScore}</td>
                                <td style={{ padding: '15px' }}>
                                    <span className={`pill ${sub.severity}`}>
                                        {sub.severity.replace('_', ' ')}
                                    </span>
                                </td>
                                <td style={{ padding: '15px' }}>{new Date(sub.completedAt).toLocaleDateString()}</td>
                                <td style={{ padding: '15px' }}>
                                    <button className="btn ghost sm">View Full Answers</button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>No real assessments found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
