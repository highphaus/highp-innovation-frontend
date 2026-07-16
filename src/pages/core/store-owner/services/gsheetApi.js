import axios from 'axios';

export const getGsheetStatus = async (slug) => {
  const res = await axios.get(`/api/gsheets/status/${slug}`);
  return res.data;
};

export const connectGsheet = async (slug, googleSheetId) => {
  const res = await axios.post('/api/gsheets/connect', { storeSlug: slug, googleSheetId });
  return res.data;
};

export const disconnectGsheet = async (slug) => {
  const res = await axios.post('/api/gsheets/disconnect', { storeSlug: slug });
  return res.data;
};

export const syncGsheet = async (slug) => {
  const res = await axios.post('/api/gsheets/sync', { storeSlug: slug });
  return res.data;
};
