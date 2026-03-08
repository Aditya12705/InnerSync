import { Link } from 'react-router-dom';
import {
  Bot,
  Users,
  Stethoscope,
  BookOpen,
  BarChart3,
  AlertTriangle
} from 'lucide-react';
import styles from './ChooseSupport.module.scss';

const supportOptions = [
  {
    icon: Bot,
    title: 'AI Companion',
    description: 'Chat with our intelligent AI that understands your emotions and provides 24/7 support.',
    features: ['Instant support', 'Always available', 'Multilingual'],
    link: '/student/peer',
    buttonText: 'Start Chatting',
  },
  {
    icon: Users,
    title: 'Peer Support',
    description: 'Connect with fellow students who understand your struggles and can offer genuine support.',
    features: ['Anonymous chat', 'Group sessions', 'Community'],
    link: '/student/peer',
    buttonText: 'Join Community',
  },
  {
    icon: Stethoscope,
    title: 'Professional Counseling',
    description: 'Book sessions with licensed mental health professionals for personalized therapy.',
    features: ['Licensed counselors', 'Flexible scheduling', 'Confidential'],
    link: '/student/counselor',
    buttonText: 'Book Session',
  },
  {
    icon: BookOpen,
    title: 'Self-Help Resources',
    description: 'Access a library of mental health resources, exercises, and educational content.',
    features: ['Guided exercises', 'Articles & videos', 'Meditation'],
    link: '/student/self-help',
    buttonText: 'Explore Resources',
  },
  {
    icon: BarChart3,
    title: 'Mood Assessment',
    description: 'Take a quick assessment to understand your current mental health status.',
    features: ['PHQ-9 & GAD-7', 'Instant results', 'Progress tracking'],
    link: '/student/assessment',
    buttonText: 'Take Assessment',
  },
  {
    icon: AlertTriangle,
    title: 'Crisis Support',
    description: 'Immediate help and emergency resources when you need them most.',
    features: ['24/7 hotline', 'Emergency contacts', 'Crisis resources'],
    link: '/student/crisis',
    buttonText: 'Get Help Now',
    isCrisis: true,
  },
];

export function ChooseSupport() {
  return (
    <div className={styles.support}>
      <div className={styles.header}>
        <h1 className={styles.title}>How can we support you?</h1>
        <p className={styles.subtitle}>Select the type of help that feels right for you today.</p>
      </div>

      <div className={styles.supportGrid}>
        {supportOptions.map((option) => {
          const Icon = option.icon;
          return (
            <div key={option.title} className={styles.supportCard}>
              <div className={styles.cardIcon}><Icon size={32} /></div>
              <h3 className={styles.cardTitle}>{option.title}</h3>
              <p className={styles.cardDescription}>{option.description}</p>
              <div className={styles.cardFeatures}>
                {option.features.map(feature => (
                  <span key={feature} className={styles.feature}>{feature}</span>
                ))}
              </div>
              <Link to={option.link} className={`${styles.cardBtn} ${option.isCrisis ? styles.crisisBtn : ''}`}>
                {option.buttonText}
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  );
}