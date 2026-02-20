import { useContext } from 'react';
import { AuthContext } from '../context/authCtx.js';

export function useAuth() {
  return useContext(AuthContext);
}
