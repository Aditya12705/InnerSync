import { useState } from 'react';
import styles from './InnerSyncForm.module.scss';
import { useNavigate } from 'react-router-dom';

const TOTAL_STEPS = 7;

export function InnerSyncForm({ onSubmitSuccess }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({
        q1: '',
        q2: '',
        q4: '',
        q5: '',
        q6: '',
        q7: '',
        q9: '',
        q10: '',
        q11: '',
        q13: '',
        q15: '',
        q16: '',
        q17: '',
        q19: '',
        q19detail: '',
        q21: '',
        q23: [],
        q24: ''
    });
    const [errors, setErrors] = useState({});
    const [isSuccess, setIsSuccess] = useState(false);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === 'checkbox') {
            const currentValues = [...(formData[name] || [])];
            if (checked) {
                currentValues.push(value);
            } else {
                const index = currentValues.indexOf(value);
                if (index > -1) currentValues.splice(index, 1);
            }
            setFormData({ ...formData, [name]: currentValues });
        } else {
            setFormData({ ...formData, [name]: value });
        }

        // Clear error for this field
        if (errors[name]) {
            setErrors({ ...errors, [name]: false });
        }
    };

    const validateStep = (step) => {
        let isValid = true;
        const newErrors = { ...errors };

        if (step === 1) {
            if (!formData.q2) { newErrors.q2 = true; isValid = false; }
            if (!formData.q4) { newErrors.q4 = true; isValid = false; }
        } else if (step === 2) {
            if (!formData.q5.trim()) { newErrors.q5 = true; isValid = false; }
            if (!formData.q6) { newErrors.q6 = true; isValid = false; }
            if (!formData.q7) { newErrors.q7 = true; isValid = false; }
        } else if (step === 3) {
            if (!formData.q9) { newErrors.q9 = true; isValid = false; }
            if (!formData.q10) { newErrors.q10 = true; isValid = false; }
            if (!formData.q11) { newErrors.q11 = true; isValid = false; }
        } else if (step === 4) {
            if (!formData.q13) { newErrors.q13 = true; isValid = false; }
            if (!formData.q15) { newErrors.q15 = true; isValid = false; }
        } else if (step === 5) {
            if (!formData.q17) { newErrors.q17 = true; isValid = false; }
        } else if (step === 7) {
            if (!formData.q23 || formData.q23.length === 0) { newErrors.q23 = true; isValid = false; }
        }

        setErrors(newErrors);
        return isValid;
    };

    const nextStep = () => {
        if (validateStep(currentStep)) {
            if (currentStep < TOTAL_STEPS) {
                setCurrentStep(prev => prev + 1);
                window.scrollTo(0, 0);
            } else {
                // Submit
                setIsSuccess(true);
                if (onSubmitSuccess) {
                    onSubmitSuccess(formData);
                }
            }
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
            window.scrollTo(0, 0);
        }
    };

    if (isSuccess) {
        return (
            <div className={styles.pageContainer}>
                <div className={styles.successScreen} id="successScreen">
                    <div className={styles.successIcon}>
                        <img
                            src="/images/logo.png"
                            alt="InnerSync Success Logo"
                            style={{ width: '160px', height: 'auto', borderRadius: '12px', marginBottom: '12px', objectFit: 'contain' }}
                        />
                    </div>
                    <h1 style={{ fontFamily: '"Playfair Display", serif', color: 'var(--primary-dark)', marginBottom: '24px' }}>Journey Initiated</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '19px', marginBottom: '40px', lineHeight: '1.6' }}>
                        Thank you for trusting InnerSync. We have received your thoughts and will be in touch within 24 hours.
                    </p>
                    <div style={{ fontWeight: '600', color: 'var(--primary)', fontSize: '18px' }}>Take a moment for yourself today.</div>
                </div>
            </div>
        );
    }

    const renderOptionCard = (name, value, label) => {
        const isSelected = formData[name] === value;
        return (
            <label className={`${styles.optionCard} ${isSelected ? styles.optionCardSelected : ''}`}>
                <input
                    type="radio"
                    name={name}
                    value={value}
                    checked={isSelected}
                    onChange={handleInputChange}
                />
                {label}
            </label>
        );
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.journeyHeader}>
                <div className={styles.progressContainer}>
                    <div className={styles.progressMeta}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div className={styles.brandMini}>InnerSync</div>
                            <div className={styles.privacyBadge}>🔒 Private & Secure</div>
                        </div>
                        <div className={styles.stepIndicator}>
                            {currentStep} of {TOTAL_STEPS} Steps
                        </div>
                    </div>
                    <div className={styles.progressTrack}>
                        <div
                            className={styles.progressFill}
                            style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            <form noValidate onSubmit={e => e.preventDefault()}>
                {/* STEP 0: Welcome */}
                {currentStep === 0 && (
                    <div className={styles.formStepActive}>
                        <div className={styles.introCard}>
                            <div className={styles.successIcon}>
                                <img src="/images/logo.png" alt="InnerSync Official Logo" style={{ width: '180px', height: 'auto', borderRadius: '12px', marginBottom: '8px', objectFit: 'contain' }} />
                            </div>
                            <h1>Welcome to <em>InnerSync</em></h1>
                            <p>This guided journey is a safe space to share. It takes about <strong>5-8 minutes</strong> and helps us connect you with the right path forward.</p>

                            <div style={{ background: 'var(--input-bg)', padding: '20px', borderRadius: 'var(--radius-sm)', margin: '0 auto 32px', maxWidth: '500px', textAlign: 'left', border: '1px dashed var(--border)' }}>
                                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                    <span style={{ fontSize: '20px' }}>🔒</span>
                                    <p style={{ fontSize: '14px', marginBottom: 0, color: 'var(--text-dark)', lineHeight: '1.5' }}>
                                        <strong>Your privacy is protected.</strong> Everything you share is strictly confidential and secured. Your data will never be shared without your consent — the only exception is an immediate safety concern requiring urgent intervention.
                                    </p>
                                </div>
                            </div>

                            <button type="button" className={`${styles.btn} ${styles.btnPrimary}`} style={{ margin: '0 auto' }} onClick={nextStep}>
                                Begin the Journey →
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 1: Basic Info */}
                {currentStep === 1 && (
                    <div className={styles.formStepActive}>
                        <div className={styles.questionSet}>
                            <span className={styles.sectionTag}>Step 1: Introduction</span>

                            <div className={styles.questionItem}>
                                <label className={styles.questionLabel}>What should we call you?</label>
                                <p className={styles.questionHint}>Optional — you may remain anonymous or use a nickname</p>
                                <input type="text" name="q1" value={formData.q1} onChange={handleInputChange} className={styles.textInput} placeholder="Your name..." />
                            </div>

                            <div className={`${styles.questionItem} ${errors.q2 ? styles.hasError : ''}`}>
                                <label className={styles.questionLabel}>How old are you?<span className={styles.requiredDot}>*</span></label>
                                <div className={styles.optionsGrid}>
                                    {renderOptionCard('q2', 'Under 18', 'Under 18')}
                                    {renderOptionCard('q2', '18–21', '18–21')}
                                    {renderOptionCard('q2', '22–25', '22–25')}
                                    {renderOptionCard('q2', '26–35', '26–35')}
                                    {renderOptionCard('q2', '36–45', '36–45')}
                                    {renderOptionCard('q2', '46+', '46+')}
                                </div>
                                <div className={styles.errorText}>Please select your age group.</div>
                            </div>

                            <div className={`${styles.questionItem} ${errors.q4 ? styles.hasError : ''}`}>
                                <label className={styles.questionLabel}>Current Status?<span className={styles.requiredDot}>*</span></label>
                                <div className={styles.optionsGrid}>
                                    {renderOptionCard('q4', 'Student', 'Student')}
                                    {renderOptionCard('q4', 'Professional', 'Professional')}
                                    {renderOptionCard('q4', 'Self-employed', 'Self-employed')}
                                    {renderOptionCard('q4', 'Unemployed', 'Unemployed')}
                                </div>
                                <div className={styles.errorText}>Please select one.</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 2: The Why */}
                {currentStep === 2 && (
                    <div className={styles.formStepActive}>
                        <div className={styles.questionSet}>
                            <span className={styles.sectionTag}>Step 2: Mental Space</span>

                            <div className={`${styles.questionItem} ${errors.q5 ? styles.hasError : ''}`}>
                                <label className={styles.questionLabel}>What's been on your mind lately?<span className={styles.requiredDot}>*</span></label>
                                <p className={styles.questionHint}>Share what brought you to seek support today. There are no wrong answers.</p>
                                <textarea name="q5" value={formData.q5} onChange={handleInputChange} className={styles.textInput} placeholder="Describe in your own words..."></textarea>
                                <div className={styles.errorText}>Please share a little with us.</div>
                            </div>

                            <div className={`${styles.questionItem} ${errors.q6 ? styles.hasError : ''}`}>
                                <label className={styles.questionLabel}>How long has this been occurring?<span className={styles.requiredDot}>*</span></label>
                                <div className={styles.optionsGrid}>
                                    {renderOptionCard('q6', 'Less than 1 month', '< 1 month')}
                                    {renderOptionCard('q6', '1–3 months', '1–3 months')}
                                    {renderOptionCard('q6', '3–6 months', '3–6 months')}
                                    {renderOptionCard('q6', '6+ months', '6+ months')}
                                </div>
                                <div className={styles.errorText}>Please select a duration.</div>
                            </div>

                            <div className={`${styles.questionItem} ${errors.q7 ? styles.hasError : ''}`}>
                                <label className={styles.questionLabel}>How deeply is this impacting you?<span className={styles.requiredDot}>*</span></label>
                                <div className={styles.optionsGrid}>
                                    {renderOptionCard('q7', 'Minimally', 'Minimally')}
                                    {renderOptionCard('q7', 'Somewhat', 'Somewhat')}
                                    {renderOptionCard('q7', 'Moderately', 'Moderately')}
                                    {renderOptionCard('q7', 'Severely', 'Severely')}
                                </div>
                                <div className={styles.errorText}>Please select an option.</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 3: Emotional Wellbeing */}
                {currentStep === 3 && (
                    <div className={styles.formStepActive}>
                        <div className={styles.questionSet}>
                            <span className={styles.sectionTag}>Step 3: Wellbeing Check</span>

                            <div className={`${styles.questionItem} ${errors.q9 ? styles.hasError : ''}`}>
                                <label className={styles.questionLabel}>Frequency of anxiety or restlessness?<span className={styles.requiredDot}>*</span></label>
                                <div className={styles.optionsGrid}>
                                    {renderOptionCard('q9', 'Not at all', 'Not at all')}
                                    {renderOptionCard('q9', 'Several days', 'Several days')}
                                    {renderOptionCard('q9', 'Often', 'Most days')}
                                    {renderOptionCard('q9', 'Daily', 'Every day')}
                                </div>
                            </div>

                            <div className={`${styles.questionItem} ${errors.q10 ? styles.hasError : ''}`}>
                                <label className={styles.questionLabel}>Frequency of low mood or hopelessness?<span className={styles.requiredDot}>*</span></label>
                                <div className={styles.optionsGrid}>
                                    {renderOptionCard('q10', 'Not at all', 'Not at all')}
                                    {renderOptionCard('q10', 'Several days', 'Several days')}
                                    {renderOptionCard('q10', 'Often', 'Most days')}
                                    {renderOptionCard('q10', 'Daily', 'Every day')}
                                </div>
                            </div>

                            <div className={`${styles.questionItem} ${errors.q11 ? styles.hasError : ''}`}>
                                <label className={styles.questionLabel}>Have you lost interest in regular activities?<span className={styles.requiredDot}>*</span></label>
                                <div className={styles.optionsGrid}>
                                    {renderOptionCard('q11', 'No', 'No')}
                                    {renderOptionCard('q11', 'A little', 'A little')}
                                    {renderOptionCard('q11', 'Noticeably', 'Noticeably')}
                                    {renderOptionCard('q11', 'Significantly', 'Significantly')}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 4: Lifestyle */}
                {currentStep === 4 && (
                    <div className={styles.formStepActive}>
                        <div className={styles.questionSet}>
                            <span className={styles.sectionTag}>Step 4: Daily Habits</span>

                            <div className={`${styles.questionItem} ${errors.q13 ? styles.hasError : ''}`}>
                                <label className={styles.questionLabel}>Average night's sleep?<span className={styles.requiredDot}>*</span></label>
                                <div className={styles.optionsGrid}>
                                    {renderOptionCard('q13', '< 4 hrs', '< 4 hours')}
                                    {renderOptionCard('q13', '4-6 hrs', '4–6 hours')}
                                    {renderOptionCard('q13', '6-8 hrs', '6–8 hours')}
                                    {renderOptionCard('q13', '8+ hrs', '8+ hours')}
                                </div>
                            </div>

                            <div className={`${styles.questionItem} ${errors.q15 ? styles.hasError : ''}`}>
                                <label className={styles.questionLabel}>Do you move or exercise regularly?<span className={styles.requiredDot}>*</span></label>
                                <div className={styles.optionsGrid}>
                                    {renderOptionCard('q15', 'Daily', 'Daily')}
                                    {renderOptionCard('q15', 'Few times a week', '2-3x / week')}
                                    {renderOptionCard('q15', 'Rarely', 'Rarely')}
                                    {renderOptionCard('q15', 'Never', 'Never')}
                                </div>
                            </div>

                            <div className={styles.questionItem}>
                                <label className={styles.questionLabel}>Substance use (Alcohol, Tobacco, etc.)</label>
                                <p className={styles.questionHint}>No judgment. This helps us see the full picture.</p>
                                <div className={styles.optionsGrid}>
                                    {renderOptionCard('q16', 'No', 'Never')}
                                    {renderOptionCard('q16', 'Occasionally', 'Occasionally')}
                                    {renderOptionCard('q16', 'Regularly', 'Regularly')}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 5: Social & Medical */}
                {currentStep === 5 && (
                    <div className={styles.formStepActive}>
                        <div className={styles.questionSet}>
                            <span className={styles.sectionTag}>Step 5: Connections</span>

                            <div className={`${styles.questionItem} ${errors.q17 ? styles.hasError : ''}`}>
                                <label className={styles.questionLabel}>Describe your support system.<span className={styles.requiredDot}>*</span></label>
                                <div className={styles.optionsGrid}>
                                    {renderOptionCard('q17', 'Strong', 'Very Supportive')}
                                    {renderOptionCard('q17', 'Moderate', 'Somewhat')}
                                    {renderOptionCard('q17', 'None', 'No support system')}
                                </div>
                            </div>

                            <div className={styles.questionItem}>
                                <label className={styles.questionLabel}>Medical history or conditions?</label>
                                <div className={styles.optionsGrid}>
                                    {renderOptionCard('q19', 'Yes', 'Yes')}
                                    {renderOptionCard('q19', 'No', 'No')}
                                    {renderOptionCard('q19', 'Not sure', 'Not sure')}
                                </div>
                                {formData.q19 === 'Yes' && (
                                    <div style={{ marginTop: '16px' }}>
                                        <input type="text" name="q19detail" value={formData.q19detail} onChange={handleInputChange} className={styles.textInput} placeholder="Please briefly specify..." />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 6: Safety */}
                {currentStep === 6 && (
                    <div className={styles.formStepActive}>
                        <div className={styles.questionSet}>
                            <span className={styles.sectionTag}>Step 6: Wellbeing Check</span>

                            <div className={styles.questionItem}>
                                <label className={styles.questionLabel}>Thoughts of self-harm or hopelessness?</label>
                                <p className={styles.questionHint}>Your answers help us keep you safe. We are here to support you.</p>
                                <div className={styles.optionsGrid}>
                                    {renderOptionCard('q21', 'No', 'No')}
                                    {renderOptionCard('q21', 'Briefly', 'Brief thoughts')}
                                    {renderOptionCard('q21', 'Sometimes', 'Sometimes')}
                                    {renderOptionCard('q21', 'Often', 'Frequently')}
                                </div>
                                <div className={styles.safetyBox}>
                                    <p>🌿 <strong>A Note from InnerSync:</strong> If you are in immediate distress, please reach out to: <strong>iCall (9152987821)</strong> or emergency services <strong>(112)</strong>.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 7: Final Step */}
                {currentStep === 7 && (
                    <div className={styles.formStepActive}>
                        <div className={styles.questionSet}>
                            <span className={styles.sectionTag}>Step 7: Final Step</span>

                            <div className={`${styles.questionItem} ${errors.q23 ? styles.hasError : ''}`}>
                                <label className={styles.questionLabel}>What kind of support are you seeking?<span className={styles.requiredDot}>*</span></label>
                                <div className={styles.tagsContainer}>
                                    {['Anonymous Support', 'AI Wellness', 'Counselling', 'Peer Groups', 'Resources'].map((label, idx) => {
                                        const values = ['Anonymous', 'AI tools', 'Counselling', 'Peer group', 'Self-help'];
                                        const value = values[idx];
                                        const icons = ['🗨', '🤖', '🧑‍⚕️', '🤝', '📚'];
                                        const isChecked = formData.q23.includes(value);
                                        return (
                                            <label key={value} className={`${styles.tagItem} ${isChecked ? styles.tagItemActive : ''}`}>
                                                <input type="checkbox" name="q23" value={value} checked={isChecked} onChange={handleInputChange} />
                                                {icons[idx]} {label}
                                            </label>
                                        );
                                    })}
                                </div>
                                <div className={styles.errorText}>Please select at least one path.</div>
                            </div>

                            <div className={styles.questionItem}>
                                <label className={styles.questionLabel}>Any specific preferences for your guide?</label>
                                <textarea name="q24" value={formData.q24} onChange={handleInputChange} className={styles.textInput} placeholder="Gender, language, specific expertise..."></textarea>
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation */}
                {currentStep > 0 && (
                    <div className={styles.navigationBar}>
                        <button type="button" className={`${styles.btn} ${styles.btnOutline}`} onClick={prevStep}>
                            ← Previous
                        </button>
                        <button type="button" className={`${styles.btn} ${styles.btnPrimary}`} onClick={nextStep}>
                            {currentStep === TOTAL_STEPS ? 'Submit Journey' : 'Continue Journey →'}
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
}
