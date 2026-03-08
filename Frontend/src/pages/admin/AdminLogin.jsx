import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import styles from '../auth/Login.module.scss';

export function AdminLogin() {
  const { adminLoggedIn, loginAdmin } = useAuth();
  const [counselor, setCounselor] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!counselor) {
      setError('Please select a counselor');
      return;
    }

    if (!password) {
      setError('Please enter your password');
      return;
    }

    try {
      await loginAdmin(counselor, password);
      navigate('/counselor/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please try again.');
      console.error('Login error:', err);
    }
  };

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.loginCard}>
        <div className={styles.brandHeader}>
          <span className={styles.brandName}>InnerSync</span>
          <span className={styles.tagline}>Sanctuary for your mind</span>

          <h2 className={styles.title}>Counselor Portal</h2>
          <p className={styles.subtitle}>Welcome back, professional. Log in to access your dashboard and support your students.</p>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Select Counselor</label>
            <select
              value={counselor}
              onChange={(e) => setCounselor(e.target.value)}
              required
            >
              <option value="">-- Select Counselor --</option>
              <option value="rajat">Dr. Rajat Sharma</option>
              <option value="iyer">Ms. R Iyer</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className={styles.submitBtn}>
            Sign In as Counselor
          </button>

          <footer className={styles.footer}>
            <button
              type="button"
              onClick={() => navigate('/')}
              className={styles.secondaryBtn}
              style={{ border: 'none' }}
            >
              ← Back to Home
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
