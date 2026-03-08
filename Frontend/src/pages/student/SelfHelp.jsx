import { useEffect, useMemo, useState } from 'react'
import {
  Play,
  Music,
  Sparkles,
  X,
  Filter,
  Coffee,
  Wind,
  Moon,
  Zap,
  BookOpen,
  ChevronRight
} from 'lucide-react'
import styles from './SelfHelp.module.scss'

const videos = [
  { id: 'breath5', yt: 'inpok4MKVLM', title: 'Mindful Breathing (5 min)', tag: 'Meditation', desc: 'Find your center with a short, guided breathing session.' },
  { id: 'ground321', yt: 'tEmt1Znux58', title: 'Grounding Exercise (3-2-1)', tag: 'Exercise', desc: 'Calm your nervous system using your five senses.' },
  { id: 'motivation', mp4: 'https://cdn.pixabay.com/vimeo/147015082/bird-1860.mp4?width=1280&hash=a0b3f0ed9d9f3e3c2e6f1', title: 'Student Motivation Boost', tag: 'Motivation', desc: 'A quick spark of inspiration for your academic journey.' },
]

const sounds = [
  {
    id: 'rain',
    title: 'Gentle Rain',
    url: 'https://cdn.freesound.org/previews/237/237728_3203902-lq.mp3', // Verified stable preview
    icon: <Wind size={20} />
  },
  {
    id: 'piano',
    title: 'Soft Piano',
    url: 'https://cdn.freesound.org/previews/415/415510_7965545-lq.mp3', // Verified stable preview
    icon: <Music size={20} />
  },
]

export function SelfHelp() {
  const [activeVideo, setActiveVideo] = useState(null)
  const [filter, setFilter] = useState('All')

  // Meditation Timer State
  const [timeLeft, setTimeLeft] = useState(180) // 3 minutes
  const [isTimerActive, setIsTimerActive] = useState(false)
  const [breathPhase, setBreathPhase] = useState('Ready') // Inhale, Hold, Exhale, Ready

  useEffect(() => {
    let interval = null
    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1)

        // Breathing cycle logic (14s total: 4 inhale, 4 hold, 6 exhale)
        const cyclePos = (180 - timeLeft) % 14
        if (cyclePos < 4) setBreathPhase('Inhale')
        else if (cyclePos < 8) setBreathPhase('Hold')
        else setBreathPhase('Exhale')

      }, 1000)
    } else if (timeLeft === 0) {
      setIsTimerActive(false)
      setBreathPhase('Complete')
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [isTimerActive, timeLeft])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const startMeditation = () => {
    setTimeLeft(180)
    setIsTimerActive(true)
    setBreathPhase('Inhale')
  }

  const stopMeditation = () => {
    setIsTimerActive(false)
    setBreathPhase('Ready')
    setTimeLeft(180)
  }

  return (
    <div className={styles.selfHelpContainer}>
      <header className={styles.header}>
        <h1>Self-Help Library</h1>
        <p>Your curated collection of tools for mental clarity and emotional strength.</p>
      </header>

      <div className={styles.controls}>
        <div className={styles.filterLabel}>
          <Filter size={16} />
          <span>Explore Categories:</span>
        </div>
        <select
          className={styles.select}
          value={filter}
          onChange={e => setFilter(e.target.value)}
        >
          {['All', 'Meditation', 'Exercise', 'Motivation'].map(o => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      </div>

      {/* Vision Section */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <Play className={styles.icon} size={24} />
          <h2>Vision & Guidance</h2>
        </div>
        <div className={styles.resourceGrid}>
          {videos.filter(v => filter === 'All' || v.tag === filter).map(v => (
            <div key={v.id} className={styles.resourceCard}>
              <div className={styles.cardTop}>
                <span className={styles.tag}>{v.tag}</span>
              </div>
              <h3 className={styles.cardTitle}>{v.title}</h3>
              <p>{v.desc}</p>
              <div className={styles.cardFooter}>
                <button className={styles.actionBtn} onClick={() => setActiveVideo(v)}>
                  <Play size={16} />
                  Open Video
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Audio Section */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <Music className={styles.icon} size={24} />
          <h2>Calming Sounds</h2>
        </div>
        <div className={styles.audioGrid}>
          {sounds.map(s => (
            <div key={s.id} className={styles.audioCard}>
              <div className={styles.audioIcon}>{s.icon}</div>
              <div className={styles.audioContent}>
                <h4>{s.title}</h4>
                <audio
                  controls
                  src={s.url}
                  onError={(e) => console.error(`Audio error for ${s.title}:`, e)}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Rituals Section */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <Sparkles className={styles.icon} size={24} />
          <h2>Micro-Rituals</h2>
        </div>
        <div className={`${styles.ritualCard} ${isTimerActive ? styles.timerActive : ''}`}>
          <div className={styles.ritualInfo}>
            <div className={styles.ritualHeading}>
              <h3>3-Minute Mindful Reset</h3>
              {isTimerActive && <span className={styles.liveBadge}>LIVE SESSION</span>}
            </div>

            {!isTimerActive && breathPhase !== 'Complete' ? (
              <div className={styles.ritualIntro}>
                <p>A guided breathing ritual to clear mental clutter and center your focus.</p>
                <div className={styles.stepPreview}>
                  <div className={styles.step}><span>4s</span> Inhale</div>
                  <div className={styles.step}><span>4s</span> Hold</div>
                  <div className={styles.step}><span>6s</span> Exhale</div>
                </div>
              </div>
            ) : breathPhase === 'Complete' ? (
              <div className={styles.completionMessage}>
                <div className={styles.successIcon}><Sparkles size={40} /></div>
                <h4>Perspective Shifted</h4>
                <p>You've successfully completed your reset. Your mind is clearer, your heart is steadier.</p>
                <button className={styles.resetBtn} onClick={stopMeditation}>Return to Library</button>
              </div>
            ) : (
              <div className={styles.zenConsole}>
                <div className={styles.bloomContainer}>
                  <div className={`${styles.auraRipple} ${styles[breathPhase.toLowerCase()]}`}></div>
                  <div className={`${styles.zenBloom} ${styles[breathPhase.toLowerCase()]}`}>
                    <svg viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" className={styles.track} />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        className={styles.progress}
                        style={{ strokeDashoffset: 283 - (timeLeft / 180) * 283 }}
                      />
                    </svg>
                    <div className={styles.bloomContent}>
                      <span className={styles.phaseLabel}>{breathPhase}</span>
                      <span className={styles.timerSub}>{formatTime(timeLeft)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className={styles.ritualAction}>
            {!isTimerActive ? (
              <button
                className={styles.startRitualBtn}
                onClick={startMeditation}
              >
                <Zap size={24} />
                {breathPhase === 'Complete' ? 'Restart Ritual' : 'Begin Sanctuary Ritual'}
              </button>
            ) : (
              <button
                className={`${styles.startRitualBtn} ${styles.stopBtn}`}
                onClick={stopMeditation}
              >
                <X size={24} />
                End Session
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Modal for Videos */}
      {activeVideo && (
        <div className={styles.modalBackdrop} onClick={() => setActiveVideo(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>{activeVideo.title}</h3>
              <button className={styles.closeBtn} onClick={() => setActiveVideo(null)}>
                <X size={18} />
              </button>
            </div>
            <div className={styles.videoWrapper}>
              {activeVideo.mp4 ? (
                <video controls playsInline autoPlay>
                  <source src={activeVideo.mp4} type="video/mp4" />
                </video>
              ) : (
                <iframe
                  title={activeVideo.title}
                  src={`https://www.youtube-nocookie.com/embed/${activeVideo.yt}?rel=0&modestbranding=1&autoplay=1`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


