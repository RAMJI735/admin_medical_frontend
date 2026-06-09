const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const request = async (method, path, body = null, customHeaders = {}) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  const headers = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const options = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${path}`, options);

  let data = null;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    const text = await response.text();
    data = text ? { message: text } : null;
  }

  if (!response.ok) {
    throw new Error(data?.message || 'Something went wrong');
  }

  return data;
};

export const api = {
  get: (path, headers) => request('GET', path, null, headers),
  post: (path, body, headers) => request('POST', path, body, headers),
  put: (path, body, headers) => request('PUT', path, body, headers),
  delete: (path, headers) => request('DELETE', path, null, headers),
};
export default api;
