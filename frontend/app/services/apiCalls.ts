import axios from "axios";

export const getApi = async (route: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const res = await axios.get(`${baseUrl}${route}`);
  return res.data.data;
};

export const postApi = async (route: string, payload: any, config?: any) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const res = await axios.post(`${baseUrl}${route}`, payload, config);
  return res.data;
};

export const deleteApi = async (route: string, payload?: any) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const res = await axios.delete(`${baseUrl}${route}`, { data: payload });
  return res.data;
};

export const putApi = async (route: string, payload: any) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const res = await axios.put(`${baseUrl}${route}`, payload);
  return res.data;
};
