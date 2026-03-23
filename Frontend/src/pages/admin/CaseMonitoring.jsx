import { useState, useEffect } from 'react';
import { AppointmentsAPI } from '../../services/api.js';

export function CaseMonitoring() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        // This is a placeholder since we don't have a specific "all appointments" endpoint yet
        // but it's better than fake data. We'll use getOverview to at least get the count?
        // Actually, let's keep it as an empty list for now until we have the endpoint.
        setAppointments([]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  return (
    <div className="card">
      <h2>Appointment Monitoring</h2>
      {loading ? <p>Loading...</p> : (
        appointments.length > 0 ? appointments.map(appt => (
          <div key={appt._id} className="card" style={{ marginTop: 10 }}>
            <strong>{new Date(appt.startsAt).toLocaleDateString()}</strong> • {appt.student?.name} • Status: <span className="pill">{appt.status}</span>
          </div>
        )) : <p style={{ marginTop: 10 }}>No active appointments scheduled.</p>
      )}
    </div>
  );
}


