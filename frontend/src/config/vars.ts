// src/config/index.ts

////////////////////////////
///////// ENV VARS /////////
////////////////////////////

// NEXT_PUBLIC_DOMAIN
export const NEXT_PUBLIC_DOMAIN = process.env.NEXT_PUBLIC_DOMAIN || '127.0.0.1';

// NEXT_PUBLIC_SERVER_URL
let NEXT_PUBLIC_SERVER_URL;
if (!process.env.NEXT_PUBLIC_SERVER_URL) {
  NEXT_PUBLIC_SERVER_URL = 'http://127.0.0.1:8081';
} else if (process.env.NEXT_PUBLIC_SERVER_URL?.includes('http')) {
  NEXT_PUBLIC_SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;
} else {
  NEXT_PUBLIC_SERVER_URL = `http://${process.env.NEXT_PUBLIC_SERVER_URL}`;
}
export { NEXT_PUBLIC_SERVER_URL };

// API_CONFIG
export const API_CONFIG = {
  baseURL: NEXT_PUBLIC_SERVER_URL
};
