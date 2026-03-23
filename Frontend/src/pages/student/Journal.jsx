import { useState, useEffect } from 'react';
import { PenLine, Save, Trash2, Calendar, History, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styles from './Journal.module.scss';

export function Journal() {
    const navigate = useNavigate();
    const [entry, setEntry] = useState('');
    const [journalHistory, setJournalHistory] = useState([]);
    const [showSuccess, setShowSuccess] = useState(false);

    // Load history from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('journal_history');
        if (saved) {
            try {
                setJournalHistory(JSON.parse(saved));
            } catch (e) {
                console.error('Error loading journal history:', e);
            }
        }
    }, []);

    const handleSave = () => {
        if (!entry.trim()) return;

        const newEntry = {
            id: Date.now(),
            text: entry,
            date: new Date().toISOString(),
        };

        const updatedHistory = [newEntry, ...journalHistory];
        setJournalHistory(updatedHistory);
        localStorage.setItem('journal_history', JSON.stringify(updatedHistory));

        setEntry('');
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    const deleteEntry = (id) => {
        const updated = journalHistory.filter(e => e.id !== id);
        setJournalHistory(updated);
        localStorage.setItem('journal_history', JSON.stringify(updated));
    };

    return (
        <div className={styles.journalContainer}>
            <header className={styles.header}>
                <button onClick={() => navigate(-1)} className={styles.backBtn}>
                    <ArrowLeft size={20} />
                </button>
                <div className={styles.headerTitle}>
                    <h1>Personal Journal</h1>
                    <p>A safe space for your thoughts</p>
                </div>
            </header>

            <div className={styles.layout}>
                <main className={styles.mainArea}>
                    <div className={styles.editorCard}>
                        <div className={styles.editorHeader}>
                            <div className={styles.todayInfo}>
                                <Calendar size={18} />
                                <span>Today, {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                            </div>
                            <PenLine size={20} className={styles.penIcon} />
                        </div>

                        <textarea
                            className={styles.textarea}
                            placeholder="How are you feeling today? What's on your mind?..."
                            value={entry}
                            onChange={(e) => setEntry(e.target.value)}
                        />

                        <div className={styles.editorFooter}>
                            <div className={styles.wordCount}>
                                {entry.trim().split(/\s+/).filter(Boolean).length} words
                            </div>
                            <button
                                className={styles.saveBtn}
                                onClick={handleSave}
                                disabled={!entry.trim()}
                            >
                                <Save size={18} />
                                Save Entry
                            </button>
                        </div>
                    </div>

                    {showSuccess && (
                        <div className={styles.successToast}>
                            <CheckCircle2 size={18} />
                            <span>Entry saved to your sanctuary.</span>
                        </div>
                    )}
                </main>

                <aside className={styles.historySidebar}>
                    <div className={styles.sidebarHeader}>
                        <History size={18} />
                        <h2>Past Reflections</h2>
                    </div>

                    <div className={styles.historyList}>
                        {journalHistory.length === 0 ? (
                            <div className={styles.emptyHistory}>
                                <p>No past entries yet. Start writing your journey.</p>
                            </div>
                        ) : (
                            journalHistory.map((item) => (
                                <div key={item.id} className={styles.historyItem}>
                                    <div className={styles.itemHeader}>
                                        <span className={styles.itemDate}>
                                            {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </span>
                                        <button onClick={() => deleteEntry(item.id)} className={styles.deleteBtn}>
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                    <p className={styles.itemPreview}>{item.text}</p>
                                </div>
                            ))
                        )}
                    </div>
                </aside>
            </div>
        </div>
    );
}
