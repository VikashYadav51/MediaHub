import { useEffect, useState } from 'react';
import { getToken, setToken as saveToken, clearToken } from '../utils/store.js';
import { loginApi, logoutApi, profileApi } from '../services/userApi.js';
import { AuthContext } from './authCtx.js';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(getToken());
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function run() {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        const res = await profileApi();
        setUser(res?.data || null);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    run();
  }, [token]);

  async function login(data) {
    const res = await loginApi(data);
    const t = res?.data?.accessToken || '';
    if (t) {
      saveToken(t);
      setToken(t);
      setUser(res?.data?.user || null);
    }
    return res;
  }

  async function logout() {
    try {
      await logoutApi();
    } finally {
      clearToken();
      setToken('');
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider value={{ token, user, loading, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
