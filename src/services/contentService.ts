import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// News API calls
export const newsAPI = {
  // Get all news with filters
  getAll: async (params = {}) => {
    const response = await api.get("/news", { params });
    return response.data;
  },

  // Get news by ID
  getById: async (id) => {
    const response = await api.get(`/news/${id}`);
    return response.data;
  },

  // Create news article
  create: async (newsData) => {
    const response = await api.post("/news", newsData);
    return response.data;
  },

  // Update news article
  update: async (id, newsData) => {
    const response = await api.put(`/news/${id}`, newsData);
    return response.data;
  },

  // Delete news article
  delete: async (id) => {
    const response = await api.delete(`/news/${id}`);
    return response.data;
  },

  // Get trending news
  getTrending: async (limit = 10) => {
    const response = await api.get("/news/trending", { params: { limit } });
    return response.data;
  },

  // Get featured news
  getFeatured: async (limit = 10) => {
    const response = await api.get("/news/featured", { params: { limit } });
    return response.data;
  },

  // Get news by category
  getByCategory: async (category, limit = 20, page = 1) => {
    const response = await api.get(`/news/category/${category}`, {
      params: { limit, page },
    });
    return response.data;
  },
};

// Advertisement API calls
export const advertisementAPI = {
  // Get all advertisements
  getAll: async (params = {}) => {
    const response = await api.get("/advertisements", { params });
    return response.data;
  },

  // Get advertisement by ID
  getById: async (id) => {
    const response = await api.get(`/advertisements/${id}`);
    return response.data;
  },

  // Create advertisement
  create: async (adData) => {
    const response = await api.post("/advertisements", adData);
    return response.data;
  },

  // Update advertisement
  update: async (id, adData) => {
    const response = await api.put(`/advertisements/${id}`, adData);
    return response.data;
  },

  // Delete advertisement
  delete: async (id) => {
    const response = await api.delete(`/advertisements/${id}`);
    return response.data;
  },

  // Get advertisement statistics
  getStats: async (id) => {
    const response = await api.get(`/advertisements/${id}/stats`);
    return response.data;
  },

  // Track click
  trackClick: async (id) => {
    const response = await api.post(`/advertisements/${id}/click`);
    return response.data;
  },

  // Track impression
  trackImpression: async (id) => {
    const response = await api.post(`/advertisements/${id}/impression`);
    return response.data;
  },
};

// Banner API calls
export const bannerAPI = {
  // Get all banners
  getAll: async (params = {}) => {
    const response = await api.get("/banners", { params });
    return response.data;
  },

  // Get banner by ID
  getById: async (id) => {
    const response = await api.get(`/banners/${id}`);
    return response.data;
  },

  // Create banner
  create: async (bannerData) => {
    const response = await api.post("/banners", bannerData);
    return response.data;
  },

  // Update banner
  update: async (id, bannerData) => {
    const response = await api.put(`/banners/${id}`, bannerData);
    return response.data;
  },

  // Delete banner
  delete: async (id) => {
    const response = await api.delete(`/banners/${id}`);
    return response.data;
  },

  // Toggle banner active status
  toggleActive: async (id) => {
    const response = await api.post(`/banners/${id}/toggle`);
    return response.data;
  },

  // Update banner position
  updatePosition: async (id, position) => {
    const response = await api.put(`/banners/${id}/position`, { position });
    return response.data;
  },

  // Get banner statistics
  getStats: async (id) => {
    const response = await api.get(`/banners/${id}/stats`);
    return response.data;
  },

  // Track click
  trackClick: async (id) => {
    const response = await api.post(`/banners/${id}/click`);
    return response.data;
  },

  // Track view
  trackView: async (id) => {
    const response = await api.post(`/banners/${id}/view`);
    return response.data;
  },
};

// Content statistics API calls
export const contentStatsAPI = {
  // Get content overview statistics
  getOverview: async () => {
    try {
      const [newsResponse, adsResponse, bannersResponse] = await Promise.all([
        api.get("/news", { params: { limit: 1000 } }),
        api.get("/advertisements"),
        api.get("/banners"),
      ]);

      const news = newsResponse.data.data?.news || [];
      const ads = adsResponse.data.data?.advertisements || [];
      const banners = bannersResponse.data.data?.banners || [];

      return {
        totalArticles: news.length,
        publishedArticles: news.filter((n) => n.status === "published").length,
        totalAds: ads.length,
        activeAds: ads.filter((ad) => ad.status === "active").length,
        totalBanners: banners.length,
        activeBanners: banners.filter((b) => b.isActive).length,
        totalViews: news.reduce((sum, n) => sum + (n.views || 0), 0),
        totalAdClicks: ads.reduce((sum, ad) => sum + (ad.clicks || 0), 0),
        totalAdImpressions: ads.reduce(
          (sum, ad) => sum + (ad.impressions || 0),
          0
        ),
        totalBannerClicks: banners.reduce(
          (sum, b) => sum + (b.clickCount || 0),
          0
        ),
        totalBannerViews: banners.reduce(
          (sum, b) => sum + (b.viewCount || 0),
          0
        ),
      };
    } catch (error) {
      console.error("Error fetching content overview:", error);
      throw error;
    }
  },
};

export default {
  news: newsAPI,
  advertisements: advertisementAPI,
  banners: bannerAPI,
  stats: contentStatsAPI,
};
