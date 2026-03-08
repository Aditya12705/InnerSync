import { API_BASE } from './config.js';

function getToken() {
  let token = localStorage.getItem('token');
  if (!token) {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      token = user?.token || '';
    } catch (e) {
      console.error('Error parsing user data:', e);
      token = '';
    }
  }
  return token || '';
}

function authHeaders() {
  const token = getToken();
  if (!token) return {};
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
}

export async function apiPost(path, body, opts = {}) {
  try {
    const logBody = body ? { ...body } : {};
    if (logBody.password) logBody.password = '***';
    if (logBody.token) logBody.token = '***';
    
    const headers = {
      'Content-Type': 'application/json',
      ...authHeaders(),
      ...(opts.headers || {})
    };

    const res = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      credentials: 'include'
    });

    if (res.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login?session_expired=true';
      throw new Error('Unauthorized - Please log in again');
    }

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || `HTTP ${res.status}`);
    }

    try {
      return await res.json();
    } catch (e) {
      return await res.text();
    }
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
}

async function apiGet(path, opts = {}) {
  try {
    const headers = {
      ...authHeaders(),
      ...(opts.headers || {})
    };

    const res = await fetch(`${API_BASE}${path}`, {
      method: 'GET',
      headers,
      credentials: 'include'
    });

    if (res.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login?session_expired=true';
      throw new Error('Unauthorized - Please log in again');
    }

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || `HTTP ${res.status}`);
    }

    try {
      return await res.json();
    } catch (e) {
      return await res.text();
    }
  } catch (error) {
    console.error('API GET Request failed:', error);
    throw error;
  }
}

export const AuthAPI = {
  login: (payload) => apiPost('/api/auth/login', payload),
  register: (payload) => apiPost('/api/auth/register', payload),
};

export const AppointmentsAPI = {
  book: (payload) => apiPost('/api/appointments/book', payload),
  getCounselorAppointments: (counselorId) => apiGet(`/api/appointments/counselor/${counselorId}`),
};

export const FeedbackAPI = {
  submit: (payload) => apiPost('/api/feedback/submit', payload),
};

export const AIAPI = {
  chat: (payload) => apiPost('/api/ai/chat', payload),
};

export const AnalyticsAPI = {
  getOverview: () => apiGet('/api/analytics/overview'),
  getUserTrends: (period) => apiGet(`/api/analytics/users/trends?period=${period}`),
  getChatAnalytics: () => apiGet('/api/analytics/chat/analytics'),
  getAssessmentAnalytics: () => apiGet('/api/analytics/assessments/analytics'),
  getAppointmentAnalytics: () => apiGet('/api/analytics/appointments/analytics'),
  getSystemHealth: () => apiGet('/api/analytics/system/health'),
  getActivityFeed: (limit) => apiGet(`/api/analytics/activity/feed?limit=${limit}`),
};

export const StudentAPI = {
  getDashboardSummary: () => apiGet('/api/student/dashboard-summary'),
};