import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { AlertCircle } from 'lucide-react';
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
      const data = await loginAdmin(counselor, password);
      if (data.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/counselor/dashboard');
      }
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

          <h2 className={styles.title}>Admin Portal</h2>
          <p className={styles.subtitle}>System administration. Log in with your credentials to manage the platform.</p>
        </div>

        {error && (
          <div className={styles.error}>
            <AlertCircle />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Username</label>
            <input
              type="text"
              value={counselor}
              onChange={(e) => setCounselor(e.target.value)}
              required
              placeholder="Enter admin username"
            />
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
            Sign In as Admin
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
