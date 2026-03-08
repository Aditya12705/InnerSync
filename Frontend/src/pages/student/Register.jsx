import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthAPI } from '../../services/api';
import styles from '../auth/Login.module.scss';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    studentId: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const { confirmPassword, ...registrationData } = formData;

      await AuthAPI.register({
        ...registrationData,
        role: 'student'
      });

      navigate('/login?registered=true');
    } catch (err) {
      console.error('Registration failed:', err);
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.loginCard}>
        <div className={styles.brandHeader}>
          <span className={styles.brandName}>InnerSync</span>
          <span className={styles.tagline}>Sanctuary for your mind</span>

          <h2 className={styles.title}>Create Account</h2>
          <p className={styles.subtitle}>Join our sanctuary and start your journey towards mental balance and academic success.</p>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="John Doe"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="you@university.edu"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="studentId">Student ID</label>
            <input
              type="text"
              id="studentId"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              required
              placeholder="Enter your student ID"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
              placeholder="••••••••"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              minLength="6"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={styles.submitBtn}
            style={loading ? { opacity: 0.7, cursor: 'not-allowed' } : {}}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>

          <footer className={styles.footer}>
            <p>Already have an account?</p>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className={styles.secondaryBtn}
            >
              Sign In
            </button>
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
