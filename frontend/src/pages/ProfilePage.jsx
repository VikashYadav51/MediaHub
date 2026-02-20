import { useState } from 'react';
import Btn from '../components/Btn.jsx';
import Card from '../components/Card.jsx';
import FileIn from '../components/FileIn.jsx';
import In from '../components/In.jsx';
import Msg from '../components/Msg.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { useForm } from '../hooks/useForm.js';
import { avatarApi, coverPicApi, passApi, profilePicApi, profileApi } from '../services/userApi.js';
import { getErr } from '../utils/msg.js';

function ProfilePage() {
  const { user, setUser, loading } = useAuth();
  const { val, onChange, reset } = useForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [profilePicture, setProfilePicture] = useState(null);
  const [coverPicture, setCoverPicture] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [msg, setMsg] = useState('');
  const [ok, setOk] = useState(false);

  async function reloadProfile() {
    const res = await profileApi();
    setUser(res?.data || null);
  }

  async function onPass(e) {
    e.preventDefault();
    setMsg('');
    try {
      await passApi(val);
      setOk(true);
      setMsg('Password updated');
      reset();
    } catch (err) {
      setOk(false);
      setMsg(getErr(err));
    }
  }

  async function onProfilePic() {
    setMsg('');
    try {
      if (!profilePicture) return;
      const form = new FormData();
      form.append('profilePicture', profilePicture);
      await profilePicApi(form);
      await reloadProfile();
      setOk(true);
      setMsg('Profile picture updated');
    } catch (err) {
      setOk(false);
      setMsg(getErr(err));
    }
  }

  async function onCoverPic() {
    setMsg('');
    try {
      if (!coverPicture) return;
      const form = new FormData();
      form.append('coverPicture', coverPicture);
      await coverPicApi(form);
      await reloadProfile();
      setOk(true);
      setMsg('Cover picture updated');
    } catch (err) {
      setOk(false);
      setMsg(getErr(err));
    }
  }

  async function onAvatar() {
    setMsg('');
    try {
      if (!avatar) return;
      const form = new FormData();
      form.append('avatar', avatar);
      await avatarApi(form);
      await reloadProfile();
      setOk(true);
      setMsg('Avatar updated');
    } catch (err) {
      setOk(false);
      setMsg(getErr(err));
    }
  }

  if (loading) return <p className="mt-8 text-sm text-slate-600">Loading...</p>;

  return (
    <div className="mt-6 grid gap-4 md:grid-cols-2">
      <Card title="My Profile">
        <div className="space-y-2 text-sm">
          <p>
            <b>User:</b> {user?.userName}
          </p>
          <p>
            <b>Name:</b> {user?.fullName}
          </p>
          <p>
            <b>Email:</b> {user?.email}
          </p>
          {user?.profilePicture ? <img src={user.profilePicture} alt="profile" className="h-24 w-24 rounded-full object-cover" /> : null}
          {user?.coverPicture ? <img src={user.coverPicture} alt="cover" className="h-24 w-full rounded-lg object-cover" /> : null}
          {user?.avatar ? <img src={user.avatar} alt="avatar" className="h-24 w-24 rounded-lg object-cover" /> : null}
        </div>
      </Card>

      <Card title="Update Password">
        <form className="space-y-3" onSubmit={onPass}>
          <In
            label="Old password"
            name="oldPassword"
            type="password"
            value={val.oldPassword}
            onChange={onChange}
            placeholder="******"
          />
          <In
            label="New password"
            name="newPassword"
            type="password"
            value={val.newPassword}
            onChange={onChange}
            placeholder="******"
          />
          <In
            label="Confirm password"
            name="confirmPassword"
            type="password"
            value={val.confirmPassword}
            onChange={onChange}
            placeholder="******"
          />
          <Btn type="submit" text="Update password" />
        </form>
      </Card>

      <Card title="Update Images">
        <div className="space-y-3">
          <FileIn label="Profile picture" name="profilePicture" onChange={(e) => setProfilePicture(e.target.files?.[0])} />
          <Btn text="Save profile picture" onClick={onProfilePic} />
          <FileIn label="Cover picture" name="coverPicture" onChange={(e) => setCoverPicture(e.target.files?.[0])} />
          <Btn text="Save cover picture" onClick={onCoverPic} />
          <FileIn label="Avatar" name="avatar" onChange={(e) => setAvatar(e.target.files?.[0])} />
          <Btn text="Save avatar" onClick={onAvatar} />
        </div>
      </Card>

      <Card title="Status">
        <Msg text={msg} ok={ok} />
      </Card>
    </div>
  );
}

export default ProfilePage;
