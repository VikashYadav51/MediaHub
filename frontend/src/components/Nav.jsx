import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

function Nav() {
  const { token, logout } = useAuth();
  const go = useNavigate();

  async function onOut() {
    await logout();
    go('/login');
  }

  const cls = ({ isActive }) =>
    `rounded-md px-3 py-2 text-sm ${isActive ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-200'}`;

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between p-4">
        <Link to="/" className="text-lg font-bold text-slate-900">
          MiniTube
        </Link>
        <nav className="flex items-center gap-2">
          {token ? (
            <>
              <NavLink className={cls} to="/profile">
                Profile
              </NavLink>
              <NavLink className={cls} to="/video">
                Video
              </NavLink>
              <NavLink className={cls} to="/channel">
                Channel
              </NavLink>
              <button
                onClick={onOut}
                className="rounded-md bg-rose-600 px-3 py-2 text-sm text-white hover:bg-rose-500"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink className={cls} to="/login">
                Login
              </NavLink>
              <NavLink className={cls} to="/register">
                Register
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Nav;
