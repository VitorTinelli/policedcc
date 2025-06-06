const API_KEY = import.meta.env.VITE_APP_API_KEY;

export const apiCall = async (url: string, options: RequestInit = {}) => {
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'authorization': API_KEY,
      ...options.headers,
    },
  })
}