import http from './http.js';

export async function loginApi(data) {
  const res = await http.post('/user/login', data);
  return res.data;
}

export async function registerApi(form) {
  const res = await http.post('/user/register', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

export async function profileApi() {
  const res = await http.get('/user/profile');
  return res.data;
}

export async function logoutApi() {
  const res = await http.post('/user/logout');
  return res.data;
}

export async function passApi(data) {
  const res = await http.patch('/user/password', data);
  return res.data;
}

export async function profilePicApi(form) {
  const res = await http.patch('/user/profile-picture', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

export async function coverPicApi(form) {
  const res = await http.patch('/user/cover-picture', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

export async function avatarApi(form) {
  const res = await http.patch('/user/avatar', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}
