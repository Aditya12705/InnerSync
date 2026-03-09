import { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, ArrowLeft } from 'lucide-react'
import { AppointmentsAPI } from '../../services/api.js'
import { AuthContext } from '../../context/AuthContext.jsx'

// Use valid MongoDB ObjectId format (24-character hex string)
const counselors = [
  { id: '000000000000000000000001', name: 'Dr. Rajat Sharma', specialty: 'Anxiety', photo: '/avatar1.png' },
  { id: '000000000000000000000002', name: 'Dr. R. Iyer', specialty: 'Depression', photo: '/avatar2.png' },
]

export function Counselor() {
  const [selected, setSelected] = useState(null)
  const [date, setDate] = useState('')
  const [slot, setSlot] = useState('10:00')
  const [booked, setBooked] = useState(false)
  const [lastAppointment, setLastAppointment] = useState(null)
  const [error, setError] = useState('')
  const { user, studentLoggedIn } = useContext(AuthContext)
  const navigate = useNavigate()

  // Redirect to login if not authenticated as student
  useEffect(() => {
    if (!studentLoggedIn) {
      navigate('/login?role=student')
    }
  }, [studentLoggedIn, navigate])

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
        <h1 style={{ margin: 0, fontSize: '1.75rem', color: 'var(--text-dark)' }}>Counseling Services</h1>
      </div>
      <div className="grid" style={{ gap: 24 }}>
        <section className="card">
          <h2>Available Counselors</h2>
          <div className="grid grid-3">
            {counselors.map(c => (
              <button key={c.id} className="card btn" onClick={() => setSelected(c)}>
                <img src={c.photo} alt="" style={{ borderRadius: 12 }} />
                <div>
                  <h4>{c.name}</h4>
                  <p className="pill">{c.specialty}</p>
                </div>
              </button>
            ))}
          </div>
        </section>
        <section className="card">
          <h3>Book Appointment</h3>
          {!selected ? <p>Select a counselor above</p> : (
            <div>
              <p>With <strong>{selected.name}</strong></p>
              <label>Date</label>
              <input
                type="date"
                value={date}
                min={new Date().toISOString().split('T')[0]}
                onChange={e => setDate(e.target.value)}
                className="form-input"
                style={{ width: '100%', padding: '8px', marginBottom: '12px' }}
              />
              <label>Time</label>
              <select
                value={slot}
                onChange={e => setSlot(e.target.value)}
                className="form-select"
                style={{ width: '100%', padding: '8px', marginBottom: '12px' }}
              >
                {['10:00', '11:00', '14:00', '15:00'].map(s =>
                  <option key={s} value={s}>{s}</option>
                )}
              </select>
              <button
                className="btn primary"
                style={{ marginTop: 10, width: '100%' }}
                disabled={!date}
                onClick={async () => {
                  try {
                    if (!studentLoggedIn) {
                      navigate('/login?role=student')
                      return
                    }

                    if (!date) {
                      setError('Please select a date')
                      return
                    }

                    // Combine date and time
                    const [year, month, day] = date.split('-')
                    const [hours, minutes] = slot.split(':')
                    const appointmentDate = new Date(year, month - 1, day, hours, minutes)

                    // Ensure we have valid ObjectId format
                    const studentId = user?._id || '000000000000000000000003'; // Different from counselor IDs
                    const counselorId = selected.id;

                    console.log('Booking appointment with:', {
                      studentId,
                      counselorId,
                      startsAt: appointmentDate.toISOString()
                    });

                    const res = await AppointmentsAPI.book({
                      studentId,
                      counselorId,
                      startsAt: appointmentDate.toISOString()
                    });

                    console.log('Appointment booked:', res);

                    setBooked(true)
                    setLastAppointment(res)
                    setError('')
                    localStorage.setItem('lastAppointmentId', res._id || '')
                  } catch (err) {
                    console.error('Error booking appointment:', err)
                    setError('Failed to book appointment. Please try again.')
                  }
                }}
              >
                Book Appointment
              </button>
              {error && <p className="error" style={{ color: 'red', marginTop: '8px' }}>{error}</p>}
              {booked && (
                <div className="success-message" style={{ marginTop: '12px', padding: '10px', background: '#d4edda', color: '#155724', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle size={18} />
                  <p>Successfully booked appointment with {selected.name} on {new Date(lastAppointment?.startsAt).toLocaleString()}</p>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}


