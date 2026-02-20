import http from './http.js';

export async function uploadVideoApi(form) {
  const res = await http.post('/video/uploadVideo', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

export async function titleApi(data) {
  const res = await http.patch('/video/title', data);
  return res.data;
}

export async function descApi(data) {
  const res = await http.patch('/video/description', data);
  return res.data;
}

export async function tagsApi(data) {
  const res = await http.patch('/video/tags', data);
  return res.data;
}

export async function likesApi(data) {
  const res = await http.patch('/video/likes', data);
  return res.data;
}

export async function viewsApi(data) {
  const res = await http.patch('/video/views', data);
  return res.data;
}

export async function dislikesApi(data) {
  const res = await http.patch('/video/dislikes', data);
  return res.data;
}
