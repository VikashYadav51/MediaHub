import { useState } from 'react';
import Btn from '../components/Btn.jsx';
import Card from '../components/Card.jsx';
import In from '../components/In.jsx';
import Msg from '../components/Msg.jsx';
import { useForm } from '../hooks/useForm.js';
import { createChannelApi, editChannelDescApi, editChannelNameApi } from '../services/channelApi.js';
import { getErr } from '../utils/msg.js';

function ChannelPage() {
  const { val, onChange } = useForm({
    name: '',
    description: '',
    newChannelName: '',
    channelId: '',
    newDesc: '',
  });
  const [msg, setMsg] = useState('');
  const [ok, setOk] = useState(false);

  async function run(fn, data, done) {
    setMsg('');
    try {
      await fn(data);
      setOk(true);
      setMsg(done);
    } catch (err) {
      setOk(false);
      setMsg(getErr(err));
    }
  }

  async function onCreate() {
    await run(createChannelApi, { name: val.name, description: val.description }, 'Channel created');
  }

  async function onEditName() {
    await run(editChannelNameApi, { newChannelName: val.newChannelName }, 'Channel name updated');
  }

  async function onEditDesc() {
    setMsg('');
    try {
      await editChannelDescApi(val.channelId, { description: val.newDesc });
      setOk(true);
      setMsg('Channel description updated');
    } catch (err) {
      setOk(false);
      setMsg(getErr(err));
    }
  }

  return (
    <div className="mt-6 grid gap-4 md:grid-cols-2">
      <Card title="Create Channel">
        <div className="space-y-3">
          <In label="Name" name="name" value={val.name} onChange={onChange} placeholder="My Channel" />
          <In label="Description" name="description" value={val.description} onChange={onChange} placeholder="Channel info" />
          <Btn text="Create channel" onClick={onCreate} />
        </div>
      </Card>

      <Card title="Edit Channel">
        <div className="space-y-3">
          <In
            label="New channel name"
            name="newChannelName"
            value={val.newChannelName}
            onChange={onChange}
            placeholder="New name"
          />
          <Btn text="Update name" onClick={onEditName} />
          <In label="Channel id" name="channelId" value={val.channelId} onChange={onChange} placeholder="Mongo id" />
          <In label="New description" name="newDesc" value={val.newDesc} onChange={onChange} placeholder="New channel description" />
          <Btn text="Update description" onClick={onEditDesc} />
        </div>
      </Card>

      <Card title="Status">
        <Msg text={msg} ok={ok} />
      </Card>
    </div>
  );
}

export default ChannelPage;
