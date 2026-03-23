import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Star, ArrowLeft } from 'lucide-react'
import { FeedbackAPI } from '../../services/api.js'

export function Feedback() {
  const navigate = useNavigate()
  const [rating, setRating] = useState(0)
  const [text, setText] = useState('')
  const [sent, setSent] = useState(false)
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
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
        <h1 style={{ margin: 0, fontSize: '1.75rem', color: 'var(--text-dark)' }}>Session Feedback</h1>
      </div>
      <div className="card">
        <h2>Rate your experience</h2>
        <p>Your feedback is invaluable to us.</p>
        <div style={{ display: 'flex', gap: 8 }}>
          {[1, 2, 3, 4, 5].map(i => (
            <button key={i} className={`btn ${rating >= i ? 'primary' : ''}`} onClick={() => setRating(i)} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {i} <Star size={14} fill={rating >= i ? "currentColor" : "none"} />
            </button>
          ))}
        </div>
        <label style={{ marginTop: 12 }}>Comments</label>
        <textarea rows={4} value={text} onChange={e => setText(e.target.value)} placeholder="Share anything that can help us improve" />
        <button className="btn primary" style={{ marginTop: 10 }} onClick={async () => {
          const appointmentId = localStorage.getItem('lastAppointmentId')
          try {
            await FeedbackAPI.submit({
              studentId: '000000000000000000000001',
              counselorId: '000000000000000000000002',
              appointmentId,
              rating,
              comment: text,
            })
            setSent(true)
          } catch (e) { alert('Failed to send feedback (mock IDs). Ensure API running.') }
        }}>Submit</button>
        {sent && <p className="pill" style={{ marginTop: 8 }}>Thanks for your feedback!</p>}
      </div>
    </div>
  )
}


