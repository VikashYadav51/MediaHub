import { useState } from 'react';
import Btn from '../components/Btn.jsx';
import Card from '../components/Card.jsx';
import FileIn from '../components/FileIn.jsx';
import In from '../components/In.jsx';
import Msg from '../components/Msg.jsx';
import { useForm } from '../hooks/useForm.js';
import {
  descApi,
  dislikesApi,
  likesApi,
  tagsApi,
  titleApi,
  uploadVideoApi,
  viewsApi,
} from '../services/videoApi.js';
import { getErr } from '../utils/msg.js';

function VideoPage() {
  const { val, onChange } = useForm({
    videoUrl: '',
    title: '',
    description: '',
    tags: '',
    likes: '',
    views: '',
    dislikes: '',
  });
  const [file, setFile] = useState(null);
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

  async function onUpload() {
    if (!file) return;
    const form = new FormData();
    form.append('uploadVideo', file);
    await run(uploadVideoApi, form, 'Video uploaded');
  }

  return (
    <div className="mt-6 grid gap-4 md:grid-cols-2">
      <Card title="Upload Video">
        <div className="space-y-3">
          <FileIn label="Video file" name="uploadVideo" onChange={(e) => setFile(e.target.files?.[0])} accept="video/*" />
          <Btn text="Upload" onClick={onUpload} />
        </div>
      </Card>

      <Card title="Edit Video Data">
        <div className="space-y-3">
          <In label="Video url" name="videoUrl" value={val.videoUrl} onChange={onChange} placeholder="https://..." />
          <In label="Title" name="title" value={val.title} onChange={onChange} placeholder="My video title" />
          <Btn text="Update title" onClick={() => run(titleApi, { title: val.title, videoUrl: val.videoUrl }, 'Title updated')} />

          <In
            label="Description"
            name="description"
            value={val.description}
            onChange={onChange}
            placeholder="Video description"
          />
          <Btn
            text="Update description"
            onClick={() => run(descApi, { description: val.description, videoUrl: val.videoUrl }, 'Description updated')}
          />

          <In label="Tags (comma)" name="tags" value={val.tags} onChange={onChange} placeholder="news,react,node" />
          <Btn
            text="Update tags"
            onClick={() =>
              run(
                tagsApi,
                { tags: val.tags.split(',').map((x) => x.trim()).filter(Boolean), videoUrl: val.videoUrl },
                'Tags updated'
              )
            }
          />

          <In label="Likes" name="likes" value={val.likes} onChange={onChange} placeholder="10" />
          <Btn text="Update likes" onClick={() => run(likesApi, { likes: Number(val.likes), videoUrl: val.videoUrl }, 'Likes updated')} />

          <In label="Views" name="views" value={val.views} onChange={onChange} placeholder="100" />
          <Btn text="Update views" onClick={() => run(viewsApi, { views: Number(val.views), videoUrl: val.videoUrl }, 'Views updated')} />

          <In label="Dislikes" name="dislikes" value={val.dislikes} onChange={onChange} placeholder="1" />
          <Btn
            text="Update dislikes"
            onClick={() => run(dislikesApi, { dislikes: Number(val.dislikes), videoUrl: val.videoUrl }, 'Dislikes updated')}
          />
        </div>
      </Card>

      <Card title="Status">
        <Msg text={msg} ok={ok} />
      </Card>
    </div>
  );
}

export default VideoPage;
