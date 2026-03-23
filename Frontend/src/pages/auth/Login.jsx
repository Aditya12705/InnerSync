import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import styles from './Login.module.scss';

export function Login() {
  const { login, loginAdmin } = useAuth();
  const navigate = useNavigate();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const initialRole = params.get('role') === 'counselor' ? 'counselor' : 'student';
  const [role, setRole] = useState(initialRole);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(
    params.get('registered') ? 'Registration successful! Please log in.' : ''
  );

  useEffect(() => {
    if (role !== initialRole) {
      navigate(`/login?role=${role}`, { replace: true });
    }
  }, [role, initialRole, navigate]);

  async function submit(e) {
    e.preventDefault();
    setError('');

    const form = new FormData(e.currentTarget);
    const identity = form.get('identity').trim();
    const password = form.get('password');

    try {
      if (role === 'counselor') {
        await loginAdmin(identity, password);
        navigate('/counselor/dashboard');
      } else {
        try {
          await login({ email: identity, password });
          navigate('/student/dashboard');
        } catch (emailError) {
          await login({ username: identity, password });
          navigate('/student/dashboard');
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      let errorMessage = 'Login failed. Please check your credentials.';
      if (err.message && typeof err.message === 'string') {
        try {
          const errorData = JSON.parse(err.message);
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          errorMessage = err.message || errorMessage;
        }
      }
      setError(errorMessage);
    }
  }

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.loginCard}>
        <div className={styles.brandHeader}>
          <span className={styles.brandName}>InnerSync</span>
          <span className={styles.tagline}>Sanctuary for your mind</span>

          <h2 className={styles.title}>Welcome Back</h2>
          <p className={styles.subtitle}>Sign in to continue your journey towards peace and clarity.</p>
        </div>

        {error && (
          <div className={styles.error}>
            <AlertCircle />
            <span>{error}</span>
          </div>
        )}
        {successMessage && (
          <div className={styles.success}>
            <CheckCircle2 />
            <span>{successMessage}</span>
          </div>
        )}

        <div className={styles.roleToggle}>
          <button
            type="button"
            className={`${styles.roleBtn} ${role === 'student' ? styles.active : ''}`}
            onClick={() => setRole('student')}
          >
            Student
          </button>
          <button
            type="button"
            className={`${styles.roleBtn} ${role === 'counselor' ? styles.active : ''}`}
            onClick={() => setRole('counselor')}
          >
            Counselor
          </button>
        </div>

        <form onSubmit={submit}>
          <div className={styles.formGroup}>
            <label>{role === 'counselor' ? 'Username' : 'Email Address'}</label>
            <input
              type={role === 'counselor' ? 'text' : 'email'}
              name="identity"
              required
              placeholder={role === 'counselor' ? 'Enter your username' : 'you@university.edu'}
              autoComplete={role === 'counselor' ? 'username' : 'email'}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Password</label>
            <input
              type="password"
              name="password"
              required
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className={styles.submitBtn}>
            Sign In
          </button>

          <footer className={styles.footer}>
            {role === 'student' && (
              <>
                <p>Don't have an account?</p>
                <button
                  type="button"
                  onClick={() => navigate('/student/register')}
                  className={styles.secondaryBtn}
                >
                  Create Student Account
                </button>
              </>
            )}
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

export default Login;
