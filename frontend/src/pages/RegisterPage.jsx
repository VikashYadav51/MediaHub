import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Btn from '../components/Btn.jsx';
import Card from '../components/Card.jsx';
import FileIn from '../components/FileIn.jsx';
import In from '../components/In.jsx';
import Msg from '../components/Msg.jsx';
import { useForm } from '../hooks/useForm.js';
import { registerApi } from '../services/userApi.js';
import { getErr } from '../utils/msg.js';

function RegisterPage() {
  const go = useNavigate();
  const { val, onChange } = useForm({
    userName: '',
    fullName: '',
    email: '',
    password: '',
  });

  const [profilePicture, setProfilePicture] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [msg, setMsg] = useState('');
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    setOk(false);
    try {
      const form = new FormData();
      form.append('userName', val.userName);
      form.append('fullName', val.fullName);
      form.append('email', val.email);
      form.append('password', val.password);
      if (profilePicture) form.append('profilePicture', profilePicture);
      if (coverImage) form.append('coverImage', coverImage);
      if (avatar) form.append('avatar', avatar);
      await registerApi(form);
      setOk(true);
      setMsg('Register success. Please login.');
      go('/login');
    } catch (err) {
      setOk(false);
      setMsg(getErr(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto mt-10 max-w-md">
      <Card title="Register">
        <form onSubmit={onSubmit} className="space-y-3">
          <In label="User name" name="userName" value={val.userName} onChange={onChange} placeholder="vikas" />
          <In label="Full name" name="fullName" value={val.fullName} onChange={onChange} placeholder="Vikas Yadav" />
          <In label="Email" name="email" value={val.email} onChange={onChange} placeholder="mail@site.com" />
          <In
            label="Password"
            name="password"
            type="password"
            value={val.password}
            onChange={onChange}
            placeholder="******"
          />
          <FileIn label="Profile picture" name="profilePicture" onChange={(e) => setProfilePicture(e.target.files?.[0])} />
          <FileIn label="Cover image" name="coverImage" onChange={(e) => setCoverImage(e.target.files?.[0])} />
          <FileIn label="Avatar" name="avatar" onChange={(e) => setAvatar(e.target.files?.[0])} />
          <Msg text={msg} ok={ok} />
          <Btn type="submit" text={loading ? 'Please wait...' : 'Register'} disabled={loading} />
        </form>
      </Card>
    </div>
  );
}

export default RegisterPage;
