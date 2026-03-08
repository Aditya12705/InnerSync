import { createContext, useContext, useState, useEffect } from 'react'
import { AIAPI } from '../services/api.js'

const MoodContext = createContext(null)

export function MoodProvider({ children }) {
  const [lastReframing, setLastReframing] = useState(null)
  const [isReframing, setIsReframing] = useState(false)
  const [history, setHistory] = useState([])

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('reframing_history')
    if (saved) {
      try {
        setHistory(JSON.parse(saved))
      } catch (e) {
        console.error('Error loading history:', e)
      }
    }
  }, [])

  const reframeStress = async (stressText) => {
    if (!stressText.trim()) return

    setIsReframing(true)
    try {
      const prompt = `You are the "Reframing Mirror" for a university student. 
      The student has "dumped" this stressor: "${stressText}"
      
      Your task:
      1. Briefly validate the feeling (1 sentence).
      2. Provide a "Growth Mindset" reframe that shifts the perspective from stuck/overwhelmed to an actionable opportunity or a balanced truth (2 sentences).
      3. Suggest 1 specific type of relief (e.g. "Take a 5-minute breathing ritual" or "Listen to calming rain").
      
      Format as JSON: {"validation": "...", "reframe": "...", "suggestion": "..."}`

      const response = await AIAPI.chat({ message: prompt })

      let reflection
      try {
        reflection = JSON.parse(response.reply)
      } catch (e) {
        // Fallback for non-JSON or malformed
        reflection = {
          validation: "I hear that you're carrying a lot right now.",
          reframe: "This pressure is a sign that you're pushing your boundaries and growing. Every challenge is a stepping stone to a stronger version of yourself.",
          suggestion: "Try a 3-minute micro-ritual to clear your head."
        }
      }

      const newEntry = {
        id: Date.now(),
        stressor: stressText,
        reflection,
        timestamp: new Date().toISOString()
      }

      setLastReframing(newEntry)
      const updatedHistory = [newEntry, ...history].slice(0, 10)
      setHistory(updatedHistory)
      localStorage.setItem('reframing_history', JSON.stringify(updatedHistory))

      return newEntry
    } catch (error) {
      console.error('Reframing error:', error)
      return null
    } finally {
      setIsReframing(false)
    }
  }

  const clearLastReframing = () => setLastReframing(null)

  const value = {
    lastReframing,
    isReframing,
    history,
    reframeStress,
    clearLastReframing
  }

  return (
    <MoodContext.Provider value={value}>
      {children}
    </MoodContext.Provider>
  )
}

export function useMood() {
  const context = useContext(MoodContext)
  if (!context) {
    throw new Error('useMood must be used within a MoodProvider')
  }
  return context
}