import axios from 'axios';
import { getCookie } from './cookie';

// API Host
const host = 'localhost';

// Server Port
const port = '3001';

// Base Url
export const baseUrl = `http://${host}:${port}`;

// API api
const api = axios.create({
  baseURL: baseUrl,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  },
});

// Add an interceptor to set the token in the request headers
api.interceptors.request.use((config) => {
  // Get token fom cookie
  const token = getCookie('token');

  // Check token is valid
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Fetching
const fetching = async (response: any, route: Function | null = null) => {
  // Get Status
  const status = response?.status;

  // Check and change error route
  route && typeof route == 'function' && status !== 200 && route(`/${status}`);

  // Fetch response data
  const data: any = response?.data?.data;

  // Destructuring
  const statusCode: number = response?.status || 500;

  // Return Data
  return { status: statusCode, data };
  
};

// Custom Fetcher
const POST = async (url: string, data: any, route: Function | null = null) => {
  // Create Fetch
  const response: any = await api
    .post(url, data)
    .then((res) => res)
    .catch((err) => err.response);

  // Return Fetching
  return fetching(response, route);
};

const PUT = async (url: string, data: any, route: Function | null = null) => {
  // Create Fetch
  const response: any = await api
    .put(url, data)
    .then((res) => res)
    .catch((err) => err.response);

  // Return Fetching
  return fetching(response, route);
};

// Fetcher Upload file
const UPLOAD = async (
  url: string,
  payload: FormData,
  route: Function | null = null,
) => {
  // Send file list
  const response: any = await api
    .post(url, payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((res) => res)
    .catch((err) => err.response);

  // Return Fetching
  return fetching(response, route);
};

// Fetcher Get
export const GET = async (
  url: string,
  params: { [key: string]: any } | null = null,
  route: Function | null = null,
) => {
  // Response
  const response: any = await api
    .get(url, { params })
    .then((res) => res)
    .catch((err) => err.response);

  // Return Fetching
  return fetching(response, route);
};
const PATCH = async (url: string, data: any, route: Function | null = null) => {
  // Create Fetch
  const response: any = await api
    .patch(url, data)
    .then((res) => res)
    .catch((err) => err.response);

  // Return Fetching
  return fetching(response, route);
};
// Fetcher Delete
const DELETE = async (
  url: string,
  params: { [key: string]: any } | null = null,
  route: Function | null = null,
) => {
  // String params
  const strParams = params
    ? Object.keys(params)
        .map((key) => `${key}=${params[key]}`)
        .join('&')
    : null;

  // Token
  const accessToken: string | null = getCookie('token')?.accessToken;

  // Create Fetch
  const response: any = await fetch(
    `${baseUrl}${url}${strParams ? `?${strParams}` : ''}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    },
  );

  // Return Fetching
  return fetching(response, route);
};

type Config = {
  method: string;
  url: string;
  payload?: FormData | any;
  params?: { [key: string]: any };
  admin?: boolean;
};

export const fetcher = async (config: Config) => {
  // Switch Case
  switch (config.method) {
    case 'POST':
      // Return Fetcher
      return await POST(config.url, config.payload);
    case 'PUT':
      // Return Fetcher
      return await PUT(config.url, config.payload);
    case 'GET':
      // Return Fetcher
      return await GET(config.url, config?.payload);
    case 'DELETE':
      // Return Fetcher
      return await DELETE(config.url, config?.payload);
    case 'UPLOAD':
      // Return Fetcher
      return await UPLOAD(config.url, config.payload);
    case 'PATCH':
      return await PATCH(config.url, config.payload);
  }
};
