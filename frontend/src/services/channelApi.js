import http from './http.js';

export async function createChannelApi(data) {
  const res = await http.post('/channel', data);
  return res.data;
}

export async function editChannelNameApi(data) {
  const res = await http.patch('/channel/name', data);
  return res.data;
}

export async function editChannelDescApi(channelId, data) {
  const res = await http.patch(`/channel/${channelId}/description`, data);
  return res.data;
}
