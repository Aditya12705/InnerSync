import { useMood } from '../../context/MoodContext.jsx'
import { useState } from 'react'
import {
  Sparkles,
  MessageCircle,
  ArrowRight,
  RefreshCw,
  Lightbulb,
  CheckCircle2,
  Minimize2,
  Maximize2
} from 'lucide-react'
import styles from './MoodIndicator.module.scss'

export function MoodIndicator({ compact = false }) {
  const { lastReframing, isReframing, reframeStress, clearLastReframing } = useMood()
  const [stressInput, setStressInput] = useState('')

  const handleReflect = async () => {
    if (!stressInput.trim()) return
    await reframeStress(stressInput)
    setStressInput('')
  }

  if (compact) {
    return (
      <div className={styles.compactMirror}>
        <div className={styles.mirrorAura} title="Reframing Mirror">
          <Sparkles size={16} />
        </div>
      </div>
    )
  }

  return (
    <div className={styles.reframingMirror}>
      <div className={styles.mirrorHeader}>
        <h3><Sparkles size={18} className={styles.sparkle} /> The Reframing Mirror</h3>
        <p>Pour out your stress; receive a new perspective.</p>
      </div>

      {!lastReframing ? (
        <div className={styles.inputArea}>
          <textarea
            className={styles.stressInput}
            placeholder="What's weighing on your mind right now? (e.g., 'I failed an exam', 'I feel lonely'...)"
            value={stressInput}
            onChange={(e) => setStressInput(e.target.value)}
            disabled={isReframing}
          />
          <button
            className={styles.reflectBtn}
            onClick={handleReflect}
            disabled={isReframing || !stressInput.trim()}
          >
            {isReframing ? (
              <>
                <RefreshCw size={18} className={styles.spinning} />
                Filtering perspective...
              </>
            ) : (
              <>
                Reflect in the Mirror
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>
      ) : (
        <div className={styles.reflectionArea}>
          <div className={styles.stressQuote}>
            <MessageCircle size={14} />
            <p>"{lastReframing.stressor}"</p>
          </div>

          <div className={styles.mirrorResult}>
            <div className={styles.resultBlock}>
              <div className={styles.resultTitle}>
                <Sparkles size={14} /> The Mirror's Insight
              </div>
              <p className={styles.validation}>{lastReframing.reflection.validation}</p>
              <p className={styles.reframe}>{lastReframing.reflection.reframe}</p>
            </div>

            <div className={styles.suggestionBlock}>
              <Lightbulb size={16} />
              <span><strong>Action:</strong> {lastReframing.reflection.suggestion}</span>
            </div>
          </div>

          <button className={styles.resetBtn} onClick={clearLastReframing}>
            Dump another stressor
          </button>
        </div>
      )}
    </div>
  )
}
