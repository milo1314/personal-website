const API_BASE_URL = 'http://localhost:3000/api';

const api = {
  get: async (endpoint, params = {}) => {
    try {
      const queryString = Object.keys(params)
        .map(key => `${key}=${encodeURIComponent(params[key])}`)
        .join('&');
      const url = queryString ? `${API_BASE_URL}${endpoint}?${queryString}` : `${API_BASE_URL}${endpoint}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      return await response.json();
    } catch (error) {
      console.error('API GET error:', error);
      return { success: false, message: '网络请求失败' };
    }
  },

  post: async (endpoint, data = {}) => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      return await response.json();
    } catch (error) {
      console.error('API POST error:', error);
      return { success: false, message: '网络请求失败' };
    }
  },

  put: async (endpoint, data = {}) => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      return await response.json();
    } catch (error) {
      console.error('API PUT error:', error);
      return { success: false, message: '网络请求失败' };
    }
  },

  delete: async (endpoint) => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      return await response.json();
    } catch (error) {
      console.error('API DELETE error:', error);
      return { success: false, message: '网络请求失败' };
    }
  },

  projects: {
    getAll: (status) => api.get('/projects', { status }),
    getById: (id) => api.get(`/projects/${id}`),
    create: (data) => api.post('/projects', data),
    update: (id, data) => api.put(`/projects/${id}`, data),
    delete: (id) => api.delete(`/projects/${id}`)
  },

  blogs: {
    getAll: (status) => api.get('/blogs', { status }),
    getById: (id) => api.get(`/blogs/${id}`),
    getBySlug: (slug) => api.get(`/blogs/slug/${slug}`),
    create: (data) => api.post('/blogs', data),
    update: (id, data) => api.put(`/blogs/${id}`, data),
    like: (id) => api.post(`/blogs/${id}/like`),
    delete: (id) => api.delete(`/blogs/${id}`)
  },

  skills: {
    getAll: () => api.get('/skills'),
    getByCategory: (category) => api.get('/skills', { category }),
    create: (data) => api.post('/skills', data),
    update: (id, data) => api.put(`/skills/${id}`, data),
    delete: (id) => api.delete(`/skills/${id}`)
  },

  quotes: {
    getAll: () => api.get('/quotes'),
    getRandom: () => api.get('/quotes/random'),
    getById: (id) => api.get(`/quotes/${id}`),
    create: (data) => api.post('/quotes', data),
    update: (id, data) => api.put(`/quotes/${id}`, data),
    delete: (id) => api.delete(`/quotes/${id}`)
  },

  tools: {
    getAll: () => api.get('/tools'),
    getByCategory: (category) => api.get('/tools', { category }),
    getById: (id) => api.get(`/tools/${id}`),
    create: (data) => api.post('/tools', data),
    update: (id, data) => api.put(`/tools/${id}`, data),
    delete: (id) => api.delete(`/tools/${id}`)
  },

  travelGuides: {
    getAll: (status) => api.get('/travel-guides', { status }),
    getById: (id) => api.get(`/travel-guides/${id}`),
    getByDestination: (destination) => api.get('/travel-guides', { destination }),
    create: (data) => api.post('/travel-guides', data),
    update: (id, data) => api.put(`/travel-guides/${id}`, data),
    delete: (id) => api.delete(`/travel-guides/${id}`)
  },

  health: () => api.get('/health')
};