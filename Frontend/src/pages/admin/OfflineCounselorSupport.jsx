import { useState } from 'react'

const initialCounselors = [
  { id: 1, name: 'Dr. A. Sharma', available: true },
  { id: 2, name: 'Ms. R. Iyer', available: false },
]

const initialStudents = [
    { id: 101, name: 'Aarav Sharma' },
    { id: 102, name: 'Dia Mehta' },
    { id: 103, name: 'Kabir Singh' },
]

export function OfflineCounselorSupport() {
  const [counselors, setCounselors] = useState(initialCounselors)
  const [students] = useState(initialStudents)
  const [selectedCounselor, setSelectedCounselor] = useState(counselors[0].id)
  const [selectedStudent, setSelectedStudent] = useState(students[0].id)
  const [assignments, setAssignments] = useState([])

  function toggle(id){ setCounselors(prev=>prev.map(c=>c.id===id? {...c, available:!c.available}:c)) }

  function assignStudent() {
      if(selectedCounselor && selectedStudent) {
          const counselor = counselors.find(c => c.id === selectedCounselor)
          const student = students.find(s => s.id === selectedStudent)
          const newAssignment = { counselor: counselor.name, student: student.name }
          setAssignments([...assignments, newAssignment])
      }
  }

  return (
    <div className="card">
      <h2>Offline Counselor Support</h2>
      {counselors.map(c => (
        <div key={c.id} className="card" style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:10}}>
          <div>
            <strong>{c.name}</strong>
            <span className="pill" style={{marginLeft:8}}>{c.available? 'Available':'Unavailable'}</span>
          </div>
          <button className="btn" onClick={()=>toggle(c.id)}>Toggle</button>
        </div>
      ))}
      <div className="card" style={{marginTop:12}}>
        <h4>Assign Students</h4>
        <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
            <div>
                <label>Student</label>
                <select value={selectedStudent} onChange={e => setSelectedStudent(Number(e.target.value))}>
                    {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
            </div>
            <div>
                <label>Counselor</label>
                <select value={selectedCounselor} onChange={e => setSelectedCounselor(Number(e.target.value))}>
                    {counselors.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
            </div>
            <button className="btn primary" onClick={assignStudent}>Assign</button>
        </div>
        <div style={{marginTop: '1rem'}}>
            <h5>Assignments</h5>
            <ul>
                {assignments.map((a, i) => <li key={i}>{a.student} assigned to {a.counselor}</li>)}
            </ul>
        </div>
      </div>
    </div>
  )
}