import { createContext, useContext, useEffect, useState } from 'react'
import { AuthAPI } from '../services/api.js'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  // Initialize state from localStorage if available
  const [authState, setAuthState] = useState(() => {
    try {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      
      return {
        studentLoggedIn: role === 'student' && !!token,
        adminLoggedIn: (role === 'admin' || role === 'counselor') && !!token,
        user: user || null,
        initialized: false
      };
    } catch (error) {
      console.error('Error initializing auth state:', error);
      return {
        studentLoggedIn: false,
        adminLoggedIn: false,
        user: null,
        initialized: true
      };
    }
  });
  
  const { studentLoggedIn, adminLoggedIn, user } = authState;

  // Initialize auth state on mount
  useEffect(() => {
    setAuthState(prev => ({
      ...prev,
      initialized: true
    }));
  }, []);

  const login = async (payload) => {
    try {
      const data = await AuthAPI.login(payload);
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.user.role);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      setAuthState({
        studentLoggedIn: data.user.role === 'student',
        adminLoggedIn: data.user.role === 'admin' || data.user.role === 'counselor',
        user: data.user,
        initialized: true
      });
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const loginStudent = () => { 
    try {
      const userData = { role: 'student' };
      const token = `student_${Date.now()}`;
      
      localStorage.setItem('token', token);
      localStorage.setItem('role', 'student');
      localStorage.setItem('user', JSON.stringify(userData));
      
      setAuthState({
        studentLoggedIn: true,
        adminLoggedIn: false,
        user: userData,
        initialized: true
      });
      
      return { token, user: userData };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }
  
  const logoutStudent = async () => { 
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('user');
      
      setAuthState({
        studentLoggedIn: false,
        adminLoggedIn: false,
        user: null,
        initialized: true
      });
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('user');
      setAuthState({ studentLoggedIn: false, adminLoggedIn: false, user: null, initialized: true });
      throw error;
    }
  }
  
  const loginAdmin = async (username, password) => { 
    try {
      // For admin/counselor login, we always use the username field
      const data = await AuthAPI.login({ username, password });

      if (data.user.role !== 'counselor' && data.user.role !== 'admin') {
        throw new Error('This user is not an authorized administrator or counselor.');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.user.role);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      setAuthState({
        studentLoggedIn: false,
        adminLoggedIn: true,
        user: data.user,
        initialized: true
      });
      
      return data;
    } catch (error) {
      console.error('Counselor login error:', error);
      throw error;
    }
  }
  
  const logoutAdmin = async () => { 
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('user');
      
      setAuthState({
        studentLoggedIn: false,
        adminLoggedIn: false,
        user: null,
        initialized: true
      });

      window.location.href = '/';
    } catch (error) {
      console.error('Admin logout error:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('user');
      setAuthState({ studentLoggedIn: false, adminLoggedIn: false, user: null, initialized: true });
      window.location.href = '/';
      throw error;
    }
  }

  if (!authState.initialized) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100%' }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <AuthContext.Provider 
      value={{ 
        user: authState.user, 
        studentLoggedIn: authState.studentLoggedIn, 
        adminLoggedIn: authState.adminLoggedIn, 
        loginStudent, 
        logoutStudent, 
        loginAdmin, 
        logoutAdmin, 
        login 
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() { return useContext(AuthContext) }