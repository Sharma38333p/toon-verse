import { trendingCartoons, recentlyAdded, featuredCartoon, networks, categories } from '../data/cartoons';

export const API_BASE = import.meta.env.VITE_API_BASE_URL
  || (import.meta.env.DEV ? 'http://localhost:5000/api' : '/api');

// Helper for fetch with timeout and fallback
async function fetchWithFallback(url, options = {}, fallbackData = null) {
  try {
    const token = localStorage.getItem('toonverse_token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    };

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(`${API_BASE}${url}`, {
      ...options,
      headers,
      signal: controller.signal,
    });
    clearTimeout(id);

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || `HTTP ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    if (fallbackData !== null) {
      console.warn(`[ToonVerse API fallback] Failed ${url}: ${error.message}. Using offline fallback.`);
      return fallbackData;
    }
    throw error;
  }
}

export const api = {
  // Cartoons
  getFeatured: async () => {
    return fetchWithFallback('/cartoons/featured', {}, { success: true, cartoon: featuredCartoon });
  },

  getTrending: async () => {
    return fetchWithFallback('/cartoons/trending', {}, { success: true, cartoons: trendingCartoons });
  },

  getRecent: async () => {
    return fetchWithFallback('/cartoons/recent', {}, { success: true, cartoons: recentlyAdded });
  },

  getAllCartoons: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const fallbackList = [...trendingCartoons, ...recentlyAdded];
    return fetchWithFallback(`/cartoons${query ? `?${query}` : ''}`, {}, {
      success: true,
      cartoons: fallbackList,
      total: fallbackList.length,
    });
  },

  getCartoon: async (idOrSlug) => {
    const all = [featuredCartoon, ...trendingCartoons, ...recentlyAdded];
    const match = all.find(c => c.id === idOrSlug || c.slug === idOrSlug || c._id === idOrSlug) || featuredCartoon;
    return fetchWithFallback(`/cartoons/${idOrSlug}`, {}, {
      success: true,
      cartoon: match,
      related: trendingCartoons.slice(0, 4),
    });
  },

  // Downloads
  requestDownloadToken: async (cartoonId, quality) => {
    return fetchWithFallback('/downloads/request-token', {
      method: 'POST',
      body: JSON.stringify({ cartoonId, quality }),
    }, {
      success: true,
      token: 'demo-auth-download-token',
      fileInfo: {
        title: 'ToonVerse Authorized Download',
        quality,
        size: '1.2 GB',
        format: 'MKV (HEVC)',
        resolution: '1920x1080',
        audioLanguages: ['Hindi', 'English'],
        downloadUrl: 'https://archive.org/download/sample-animation/1080p.mkv',
      },
    });
  },

  // Local Video Container Media Server
  getMediaFiles: async () => {
    return fetchWithFallback('/media/files', {}, {
      success: true,
      containerPath: 'D:\\ToonVerse\\video_container',
      count: 0,
      files: [],
    });
  },

  uploadMediaFile: async (formData) => {
    const token = localStorage.getItem('toonverse_token');
    const res = await fetch(`${API_BASE}/media/upload`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Upload failed');
    }
    return await res.json();
  },

  getStreamUrl: (slug, filename = '') => {
    return `${API_BASE}/media/stream/${slug}${filename ? `/${encodeURIComponent(filename)}` : ''}`;
  },

  getDownloadUrl: (slug, filename = '') => {
    return `${API_BASE}/media/download/${slug}${filename ? `/${encodeURIComponent(filename)}` : ''}`;
  },

  // Auth
  login: async (credentials) => {
    return fetchWithFallback('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  register: async (userData) => {
    return fetchWithFallback('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  getMe: async () => {
    return fetchWithFallback('/auth/me', {});
  },

  toggleFavorite: async (cartoonId) => {
    return fetchWithFallback(`/auth/favorites/${cartoonId}`, {
      method: 'POST',
    });
  },

  getFavorites: async () => {
    return fetchWithFallback('/auth/favorites', {}, { success: true, favorites: [] });
  },

  // Admin
  getAdminStats: async () => {
    return fetchWithFallback('/admin/stats', {}, {
      success: true,
      stats: {
        totalCartoons: 15,
        totalUsers: 2,
        totalDownloads: 48,
        networks: [
          { _id: 'Cartoon Network', count: 6 },
          { _id: 'Disney Channel', count: 4 },
          { _id: 'Nickelodeon', count: 3 },
          { _id: 'Pogo', count: 1 },
          { _id: 'Hungama TV', count: 1 },
        ],
      },
    });
  },

  createCartoon: async (data) => {
    return fetchWithFallback('/admin/cartoons', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateCartoon: async (id, data) => {
    return fetchWithFallback(`/admin/cartoons/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteCartoon: async (id) => {
    return fetchWithFallback(`/admin/cartoons/${id}`, {
      method: 'DELETE',
    });
  },
};
