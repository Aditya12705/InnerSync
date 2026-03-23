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

    const [selectedSub, setSelectedSub] = useState(null);

    const getSeverityColor = (sev) => {
        const s = (sev || '').toLowerCase().replace('-', ' ').replace('_', ' ');
        if (s.includes('severe') || s.includes('significant')) return 'var(--danger)';
        if (s.includes('moderate')) return 'var(--warning)';
        return 'var(--success)';
    };

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
                                    <span
                                        className="pill"
                                        style={{
                                            backgroundColor: 'transparent',
                                            color: getSeverityColor(sub.severity),
                                            border: `1px solid ${getSeverityColor(sub.severity)}`,
                                            fontWeight: '600'
                                        }}
                                    >
                                        {(sub.severity || '').replace('_', ' ').replace('-', ' ')}
                                    </span>
                                </td>
                                <td style={{ padding: '15px' }}>{new Date(sub.completedAt).toLocaleDateString()}</td>
                                <td style={{ padding: '15px' }}>
                                    <button
                                        className="btn ghost sm"
                                        onClick={() => setSelectedSub(sub)}
                                    >
                                        View Full Answers
                                    </button>
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

            {/* Assessment Detail Modal */}
            {selectedSub && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 2000,
                    padding: '20px',
                    backdropFilter: 'blur(4px)'
                }} onClick={() => setSelectedSub(null)}>
                    <div style={{
                        backgroundColor: 'var(--bg-secondary)',
                        width: '100%',
                        maxWidth: '800px',
                        maxHeight: '90vh',
                        borderRadius: 'var(--radius-lg)',
                        padding: '40px',
                        position: 'relative',
                        overflowY: 'auto',
                        boxShadow: 'var(--shadow-lg)'
                    }} onClick={e => e.stopPropagation()}>
                        <button
                            style={{
                                position: 'absolute',
                                top: '20px',
                                right: '20px',
                                border: 'none',
                                background: 'transparent',
                                fontSize: '24px',
                                cursor: 'pointer'
                            }}
                            onClick={() => setSelectedSub(null)}
                        >
                            ×
                        </button>

                        <header style={{ marginBottom: '30px' }}>
                            <h2 style={{ fontSize: '1.75rem', marginBottom: '8px' }}>Assessment Details</h2>
                            <p style={{ color: 'var(--text-secondary)' }}>
                                Submitted by <strong>{selectedSub.studentId?.name}</strong> on {new Date(selectedSub.completedAt).toLocaleString()}
                            </p>
                        </header>

                        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                            <div className="card" style={{ textAlign: 'center' }}>
                                <p style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>Test Type</p>
                                <p style={{ fontSize: '1.25rem', fontWeight: '600' }}>{selectedSub.type}</p>
                            </div>
                            <div className="card" style={{ textAlign: 'center' }}>
                                <p style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>Total Score</p>
                                <p style={{ fontSize: '2rem', fontWeight: '700', color: getSeverityColor(selectedSub.severity) }}>{selectedSub.totalScore}</p>
                            </div>
                            <div className="card" style={{ textAlign: 'center' }}>
                                <p style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>Severity</p>
                                <p style={{
                                    fontSize: '1.25rem',
                                    fontWeight: '600',
                                    color: getSeverityColor(selectedSub.severity),
                                    textTransform: 'capitalize'
                                }}>
                                    {(selectedSub.severity || '').replace('_', ' ').replace('-', ' ')}
                                </p>
                            </div>
                        </div>

                        <h3 style={{ marginBottom: '20px' }}>Question Breakdown</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {selectedSub.responses?.map((resp, i) => (
                                <div key={i} style={{
                                    padding: '16px',
                                    backgroundColor: 'var(--bg-tertiary)',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--border)'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
                                        <p style={{ fontWeight: '500' }}>{resp.question}</p>
                                        <span className="badge" style={{
                                            backgroundColor: 'var(--primary)',
                                            color: 'white',
                                            height: 'fit-content',
                                            padding: '8px 16px',
                                            borderRadius: 'var(--radius-full)'
                                        }}>
                                            {resp.answerLabel || `Score: ${resp.answer}`}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}
