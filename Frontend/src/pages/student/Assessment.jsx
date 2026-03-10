import { useMemo, useState } from 'react';
import { InnerSyncForm } from '../../components/forms/InnerSyncForm.jsx';
import { AnalyticsAPI } from '../../services/api.js';

import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const assessmentData = {
  'phq-9': {
    title: 'PHQ-9 Depression Test',
    description: 'The Patient Health Questionnaire (PHQ-9) is a concise, self-administered questionnaire for screening, diagnosing, monitoring, and measuring the severity of depression.',
    questions: [
      'Little interest or pleasure in doing things',
      'Feeling down, depressed, or hopeless',
      'Trouble falling or staying asleep, or sleeping too much',
      'Feeling tired or having little energy',
      'Poor appetite or overeating',
      'Feeling bad about yourself — or that you are a failure',
      'Trouble concentrating on things',
      'Moving or speaking slowly or being fidgety/restless',
      'Thoughts that you would be better off dead or of hurting yourself'
    ],
    interpretations: {
      minimal: 'Your score suggests you may be experiencing minimal or no symptoms of depression. Continue to monitor your mood and practice self-care.',
      mild: 'Your score suggests you may be experiencing mild depression. It could be beneficial to explore self-help resources and consider talking to a peer supporter.',
      moderate: 'Your score suggests moderate depression. It is advisable to book an appointment with a professional counselor to discuss your feelings.',
      'moderately severe': 'Your score suggests moderately severe depression. It is highly recommended to seek professional help. Please consider booking a session with a counselor.',
      severe: 'Your score indicates severe depression. It is very important to get help right away. Please use the crisis alert feature or contact a helpline immediately.'
    }
  },
  'gad-7': {
    title: 'GAD-7 Anxiety Test',
    description: 'The Generalized Anxiety Disorder 7-item (GAD-7) scale is a self-administered questionnaire used to screen for and measure the severity of generalized anxiety disorder.',
    questions: [
      'Feeling nervous, anxious, or on edge',
      'Not being able to stop or control worrying',
      'Worrying too much about different things',
      'Trouble relaxing',
      'Being so restless that it is hard to sit still',
      'Becoming easily annoyed or irritable',
      'Feeling afraid as if something awful might happen'
    ],
    interpretations: {
      minimal: 'Your score suggests minimal or no anxiety. This is a great sign! Keep up with your positive coping strategies.',
      mild: 'Your score indicates mild anxiety. Self-help resources like breathing exercises and mindfulness can be very effective.',
      moderate: 'Your score suggests moderate anxiety. This may be impacting your daily life. Speaking with a counselor can provide you with strategies to manage these feelings.',
      severe: 'Your score indicates severe anxiety. It is highly recommended that you speak with a mental health professional. Please consider booking an appointment or using the crisis support resources.'
    }
  },
  'ghq-12': {
    title: 'GHQ-12 General Health Questionnaire',
    description: 'The General Health Questionnaire (GHQ-12) is a screening tool used to detect common mental health problems. It focuses on the respondent\'s general well-being over the past few weeks.',
    questions: [
      'Been able to concentrate on whatever you’re doing?',
      'Lost much sleep over worry?',
      'Felt that you are playing a useful part in things?',
      'Felt capable of making decisions about things?',
      'Felt constantly under strain?',
      'Felt you couldn’t overcome your difficulties?',
      'Been able to enjoy your normal day-to-day activities?',
      'Been able to face up to your problems?',
      'Been feeling unhappy and depressed?',
      'Been losing confidence in yourself?',
      'Been thinking of yourself as a worthless person?',
      'Felt reasonably happy, all things considered?'
    ],
    interpretations: {
      healthy: 'Your score suggests you are in a good state of psychological well-being. Continue to nurture your mental health.',
      'some-distress': 'Your score suggests you may be experiencing some psychological distress. This is a good time to focus on self-care and connect with your support system.',
      'significant-distress': 'Your score indicates a significant level of psychological distress. It is strongly recommended to speak with a professional counselor to address these challenges.',
    }
  }
};

const answerOptions = [
  { label: 'Not at all', value: 0 },
  { label: 'Several days', value: 1 },
  { label: 'More than half the days', value: 2 },
  { label: 'Nearly every day', value: 3 },
];

export function Assessment() {
  const navigate = useNavigate();
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [showInnerSyncForm, setShowInnerSyncForm] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [cursor, setCursor] = useState(0);

  const currentAssessment = selectedAssessment ? assessmentData[selectedAssessment] : null;
  const questions = currentAssessment ? currentAssessment.questions : [];

  const handleSelectAssessment = (type) => {
    setSelectedAssessment(type);
    setAnswers(Array(assessmentData[type].questions.length).fill(null));
    setSubmitted(false);
    setCursor(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAnswerChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (cursor < questions.length - 1) {
      setCursor(cursor + 1);
    }
  };

  const prevQuestion = () => {
    if (cursor > 0) {
      setCursor(cursor - 1);
    }
  };

  const totalScore = answers.reduce((acc, val) => acc + (val || 0), 0);

  const getSeverity = (type, score) => {
    if (type === 'phq-9') {
      if (score <= 4) return 'minimal';
      if (score <= 9) return 'mild';
      if (score <= 14) return 'moderate';
      if (score <= 19) return 'moderately severe';
      return 'severe';
    }
    if (type === 'gad-7') {
      if (score <= 4) return 'minimal';
      if (score <= 9) return 'mild';
      if (score <= 14) return 'moderate';
      return 'severe';
    }
    if (type === 'ghq-12') {
      if (score <= 12) return 'healthy';
      if (score <= 20) return 'some-distress';
      return 'significant-distress';
    }
    return '';
  };

  const handleSubmit = async () => {
    try {
      const responseData = {
        type: selectedAssessment,
        totalScore,
        severity,
        responses: questions.map((q, i) => ({
          question: q,
          answer: answers[i],
          answerLabel: answerOptions.find(opt => opt.value === answers[i])?.label || ''
        })),
        recommendations: [interpretation]
      };

      await AnalyticsAPI.submitAssessment(responseData);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error submitting assessment:', error);
      // Still show result to user even if DB save fails
      setSubmitted(true);
    }
  };

  const getSeverityColor = (sev) => {
    const s = sev.toLowerCase().replace('-', ' ').replace('_', ' ');
    if (s.includes('severe') || s.includes('significant')) return 'var(--danger)';
    if (s.includes('moderate')) return 'var(--warning)';
    return 'var(--success)';
  };

  const severity = selectedAssessment ? getSeverity(selectedAssessment, totalScore) : '';
  const interpretation = currentAssessment && submitted ? currentAssessment.interpretations[severity] : '';
  const isCurrentQuestionAnswered = answers[cursor] !== null;

  if (showInnerSyncForm) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
          <button
            onClick={() => setShowInnerSyncForm(false)}
            style={{
              marginBottom: '1rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              backgroundColor: 'var(--panel-2, #ffffff)',
              color: 'var(--text-dark, #2c2c28)',
              border: '1px solid var(--border, #e9e9e2)',
              borderRadius: '999px',
              fontSize: '15px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--input-bg, #f9f7f2)';
              e.currentTarget.style.borderColor = 'var(--primary-light, #6a7e5d)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--panel-2, #ffffff)';
              e.currentTarget.style.borderColor = 'var(--border, #e9e9e2)';
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back to Assessments
          </button>
        </div>
        <div className="card" style={{ padding: 0, overflow: 'hidden', border: 'none', background: 'transparent', boxShadow: 'none' }}>
          <InnerSyncForm onSubmitSuccess={(data) => console.log('Form Submitted', data)} />
        </div>
      </div>
    );
  }

  if (!selectedAssessment) {
    return (
      <div className="grid" style={{ gap: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '-16px' }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '40px', height: '40px', borderRadius: '50%',
              backgroundColor: 'var(--panel-2, #ffffff)', border: '1px solid var(--border)',
              cursor: 'pointer', color: 'var(--text-dark)'
            }}
          >
            <ArrowLeft size={20} />
          </button>
          <h1 style={{ margin: 0, fontSize: '1.75rem', color: 'var(--text-dark)' }}>Assessments</h1>
        </div>

        {/* Main InnerSync Journey Card */}
        <section className="card" style={{
          background: 'linear-gradient(135deg, var(--bg-cream, #f5f5f0), #ffffff)',
          border: '1px solid var(--primary-light)',
          boxShadow: '0 8px 30px rgba(74, 93, 63, 0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
            <img src="/images/logo.png" alt="InnerSync Logo" style={{ width: '64px', height: '64px', objectFit: 'contain' }} />
            <h1 style={{ fontFamily: '"Playfair Display", serif', color: 'var(--primary-dark)', margin: 0 }}>InnerSync Guided Intake Journey</h1>
          </div>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
            Our comprehensive 7-step pre-counselling assessment designed to understand your well-being, lifestyle, and support needs.
            Takes about 5-8 minutes and helps us connect you with the right path forward.
          </p>
          <button
            className="btn"
            style={{ padding: '16px 32px', fontSize: '1.1rem', backgroundColor: 'var(--primary)', color: 'white', borderRadius: '999px', border: 'none', cursor: 'pointer', fontWeight: 600 }}
            onClick={() => {
              setShowInnerSyncForm(true);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            Start Your Journey →
          </button>
        </section>

        {/* Secondary Clinical Tests Section */}
        <div>
          <h2 style={{ marginBottom: '16px', color: 'var(--text-dark)' }}>Specific Clinical Tests</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Standard assessments measuring specific aspects of mental health like anxiety or depression.</p>
          <div className="grid" style={{ gap: 24, gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
            {Object.keys(assessmentData).map(key => (
              <div key={key} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.2rem' }}>{assessmentData[key].title}</h3>
                <p style={{ fontSize: '0.95rem', flexGrow: 1, color: 'var(--text-secondary)' }}>{assessmentData[key].description}</p>
                <button
                  className="btn"
                  style={{ width: '100%', marginTop: '16px', backgroundColor: 'var(--primary)', color: 'white', borderRadius: '999px' }}
                  onClick={() => handleSelectAssessment(key)}
                >
                  Take Test
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    const severityColor = getSeverityColor(severity);
    return (
      <div className="grid" style={{ gap: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '-16px' }}>
          <button
            onClick={() => setSelectedAssessment(null)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '40px', height: '40px', borderRadius: '50%',
              backgroundColor: 'var(--panel-2, #ffffff)', border: '1px solid var(--border)',
              cursor: 'pointer', color: 'var(--text-dark)'
            }}
          >
            <ArrowLeft size={20} />
          </button>
          <h1 style={{ margin: 0, fontSize: '1.75rem', color: 'var(--text-dark)' }}>Assessment Report</h1>
        </div>
        <div className="card">
          <h2 style={{ marginTop: 0 }}>{currentAssessment.title}</h2>
          <div style={{ textAlign: 'center', margin: '2rem 0' }}>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>Your Score</p>
            <p style={{ fontSize: '4.5rem', fontWeight: '700', color: severityColor, margin: 0, lineHeight: 1 }}>{totalScore}</p>
            <p style={{ fontSize: '1.25rem', color: severityColor, fontWeight: 600, textTransform: 'capitalize', marginTop: '1rem' }}>{severity.replace('-', ' ')}</p>
          </div>
          <div>
            <h4>Interpretation</h4>
            <p>{interpretation}</p>
          </div>
          <div style={{ marginTop: '2rem' }}>
            <button className="btn primary" onClick={() => setSelectedAssessment(null)}>Take Another Assessment</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid" style={{ gap: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '-16px' }}>
        <button
          onClick={() => setSelectedAssessment(null)}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '40px', height: '40px', borderRadius: '50%',
            backgroundColor: 'var(--panel-2, #ffffff)', border: '1px solid var(--border)',
            cursor: 'pointer', color: 'var(--text-dark)'
          }}
        >
          <ArrowLeft size={20} />
        </button>
        <h1 style={{ margin: 0, fontSize: '1.75rem', color: 'var(--text-dark)' }}>{currentAssessment.title}</h1>
      </div>
      <section className="card">
        <p>Over the last 2 weeks, how often have you been bothered by any of the following problems?</p>
        <div style={{ height: 10, background: 'var(--input-bg)', border: '1px solid var(--border)', borderRadius: 999, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${((cursor + 1) / questions.length) * 100}%`, background: 'linear-gradient(135deg, var(--primary-dark), var(--primary))', borderRadius: 999, transition: 'width 0.3s ease-in-out' }} />
        </div>
      </section>

      <section className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0 }}>{currentAssessment.title.split(' ')[0]} Question</h3>
          <span className="pill">Question {cursor + 1} / {questions.length}</span>
        </div>
        <div style={{ marginTop: 24, marginBottom: 24, fontSize: '1.25rem', fontWeight: 500 }}>{questions[cursor]}</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {answerOptions.map(option => {
            const isSelected = answers[cursor] === option.value;
            return (
              <button
                key={option.value}
                onClick={() => handleAnswerChange(cursor, option.value)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  width: '100%',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  border: `2px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`,
                  background: isSelected ? 'rgba(102, 178, 178, 0.1)' : 'var(--panel-2)',
                  color: isSelected ? 'var(--primary-light)' : 'var(--text)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease-in-out',
                  fontSize: '1rem'
                }}
              >
                <div style={{
                  width: '24px', height: '24px', borderRadius: '50%',
                  border: `2px solid ${isSelected ? 'var(--primary)' : 'var(--border-strong)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  {isSelected && <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--primary)' }}></div>}
                </div>
                <span>{option.label}</span>
              </button>
            )
          })}
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 24 }}>
          <button className="btn" onClick={prevQuestion} disabled={cursor === 0}>Back</button>
          {cursor < questions.length - 1 ? (
            <button className="btn primary" onClick={nextQuestion} disabled={!isCurrentQuestionAnswered}>Next</button>
          ) : (
            <button className="btn primary" onClick={handleSubmit} disabled={!isCurrentQuestionAnswered}>Submit</button>
          )}
        </div>
      </section>
    </div>
  );
}