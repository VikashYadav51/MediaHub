import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import Btn from '../components/Btn.jsx';

import Card from '../components/Card.jsx';

import In from '../components/In.jsx';

import Msg from '../components/Msg.jsx';

import { useAuth } from '../hooks/useAuth.js';

import { useForm } from '../hooks/useForm.js';

import { Error } from '../utils/msg.js';

function LoginPage() {
  const { login } = useAuth();

  const go = useNavigate();

  const { val, onChange } = useForm({ userName: '', email: '', password: '' });

  const [msg, setMsg] = useState('');

  const [ok, setOk] = useState(false);

  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    setOk(false);
    try {
      await login(val);
      setOk(true);
      setMsg('Login success');
      go('/profile');
    } catch (err) {
      setOk(false);
      setMsg(Error(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Login
          </h2>
          <form onSubmit={onSubmit} className="space-y-5">
            
          <In
            label="User name"
            name="userName"
            value={val.userName}
            onChange={onChange}
            placeholder="vikas"
          />

          <In
            label="Email"
            name="email"
            value={val.email}
            onChange={onChange}
            placeholder="mail@site.com"
          />

          <In
            label="Password"
            name="password"
            type="password"
            value={val.password}
            onChange={onChange}
            placeholder="******"
          />

          <Msg text={msg} ok={ok} />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold transition duration-300 
              ${loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
              }`}
          >
            {loading ? 'Please wait...' : 'Login'}
          </button>

        </form>
      </div>
    </div>
  </div>

  );
}

export default LoginPage;
