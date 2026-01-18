import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Categories API
export const categoriesAPI = {
    // Get all categories with pagination
    getAll: async (skip = 0, limit = 100) => {
        const response = await api.get('/categories', {
            params: { skip, limit }
        });
        return response.data;
    },

    // Get categories as tree structure
    getTree: async () => {
        const response = await api.get('/categories/tree');
        return response.data;
    },

    // Get single category by ID
    getById: async (id) => {
        const response = await api.get(`/categories/${id}`);
        return response.data;
    },

    // Create new category
    create: async (data) => {
        const response = await api.post('/categories', data);
        return response.data;
    },

    // Update category
    update: async (id, data) => {
        const response = await api.put(`/categories/${id}`, data);
        return response.data;
    },

    // Delete category
    delete: async (id) => {
        const response = await api.delete(`/categories/${id}`);
        return response.data;
    },
};

// Brands API
export const brandsAPI = {
    // Get all brands with pagination and filters
    getAll: async (skip = 0, limit = 100, activeOnly = false, search = null, manufacturerId = null) => {
        const params = { skip, limit };
        if (activeOnly) params.active_only = true;
        if (search) params.search = search;
        if (manufacturerId) params.manufacturer_id = manufacturerId;

        const response = await api.get('/brands', { params });
        return response.data;
    },

    // Get brands with manufacturer information
    getWithManufacturer: async (skip = 0, limit = 100, activeOnly = false) => {
        const response = await api.get('/brands/with-manufacturer', {
            params: { skip, limit, active_only: activeOnly }
        });
        return response.data;
    },

    // Get single brand by ID
    getById: async (id) => {
        const response = await api.get(`/brands/${id}`);
        return response.data;
    },

    // Create new brand
    create: async (data) => {
        const response = await api.post('/brands', data);
        return response.data;
    },

    // Update brand
    update: async (id, data) => {
        const response = await api.put(`/brands/${id}`, data);
        return response.data;
    },

    // Delete brand
    delete: async (id) => {
        const response = await api.delete(`/brands/${id}`);
        return response.data;
    },
};

// Manufacturers API
export const manufacturersAPI = {
    // Get all manufacturers with pagination and filters
    getAll: async (skip = 0, limit = 100, search = null, country = null) => {
        const params = { skip, limit };
        if (search) params.search = search;
        if (country) params.country = country;
        
        const response = await api.get('/manufacturers', { params });
        return response.data;
    },

    // Get manufacturers with brand count
    getWithBrands: async (skip = 0, limit = 100) => {
        const response = await api.get('/manufacturers/with-brands', {
            params: { skip, limit }
        });
        return response.data;
    },

    // Get single manufacturer by ID
    getById: async (id) => {
        const response = await api.get(`/manufacturers/${id}`);
        return response.data;
    },

    // Create new manufacturer
    create: async (data) => {
        const response = await api.post('/manufacturers', data);
        return response.data;
    },

    // Update manufacturer
    update: async (id, data) => {
        const response = await api.put(`/manufacturers/${id}`, data);
        return response.data;
    },

    // Delete manufacturer
    delete: async (id) => {
        const response = await api.delete(`/manufacturers/${id}`);
        return response.data;
    },
};

// Stores API
export const storesAPI = {
    // Get all stores with pagination and filters
    getAll: async (skip = 0, limit = 100, activeOnly = false, search = null) => {
        const params = { skip, limit };
        if (activeOnly) params.active_only = true;
        if (search) params.search = search;
        
        const response = await api.get('/stores', { params });
        return response.data;
    },

    // Get single store by ID
    getById: async (id) => {
        const response = await api.get(`/stores/${id}`);
        return response.data;
    },

    // Create new store
    create: async (data) => {
        const response = await api.post('/stores', data);
        return response.data;
    },

    // Update store
    update: async (id, data) => {
        const response = await api.put(`/stores/${id}`, data);
        return response.data;
    },

    // Delete store
    delete: async (id) => {
        const response = await api.delete(`/stores/${id}`);
        return response.data;
    },
};

// Products Catalog API
export const productsCatalogAPI = {
    // Get all products with pagination and filters
    getAll: async (skip = 0, limit = 100, activeOnly = false, search = null, brandId = null, categoryId = null) => {
        const params = { skip, limit };
        if (activeOnly) params.active_only = true;
        if (search) params.search = search;
        if (brandId) params.brand_id = brandId;
        if (categoryId) params.category_id = categoryId;
        
        const response = await api.get('/products-catalog', { params });
        return response.data;
    },

    // Get products with brand and category details
    getWithDetails: async (skip = 0, limit = 100, activeOnly = false) => {
        const response = await api.get('/products-catalog/with-details', {
            params: { skip, limit, active_only: activeOnly }
        });
        return response.data;
    },

    // Get single product by ID
    getById: async (id) => {
        const response = await api.get(`/products-catalog/${id}`);
        return response.data;
    },

    // Create new product
    create: async (data) => {
        const response = await api.post('/products-catalog', data);
        return response.data;
    },

    // Update product
    update: async (id, data) => {
        const response = await api.put(`/products-catalog/${id}`, data);
        return response.data;
    },

    // Delete product
    delete: async (id) => {
        const response = await api.delete(`/products-catalog/${id}`);
        return response.data;
    },
};

// Products API (Scraped products)
export const productsAPI = {
    // Get all scraped products with details
    getAll: async () => {
        const response = await api.get('/products');
        return response.data;
    },
};

export default api;
