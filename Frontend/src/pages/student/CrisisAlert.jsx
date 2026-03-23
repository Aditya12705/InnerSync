import { Link } from 'react-router-dom'

export function CrisisAlert() {
  return (
    <div className="modal-backdrop">
      <div className="card modal">
        <h2 className="risk-high">Immediate Support Available</h2>
        <p><em>"Find your peace of mind"</em></p>
        <p>If you are in immediate danger, please call emergency services. Here are some resources that can help:</p>
        <ul>
          <li><strong>Campus Security:</strong> +91 12345 67890</li>
          <li><strong>National Suicide Prevention Helpline:</strong> 1800-599-0019</li>
          <li><strong>Mental Health Helpline:</strong> 080-46110007</li>
        </ul>
        <div style={{display:'flex', gap:10, justifyContent:'flex-end'}}>
          <a className="btn danger" href="tel:18005990019">Call National Helpline Now</a>
          <Link className="btn" to="/student/self-help">Back to Safety Resources</Link>
        </div>
      </div>
    </div>
  )
}