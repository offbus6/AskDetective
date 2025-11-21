import type { User, Detective, Service, Review, Order, InsertDetective, InsertService, InsertReview, InsertOrder } from "@shared/schema";

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }));
    throw new ApiError(response.status, error.error || response.statusText);
  }
  return response.json();
}

export const api = {
  auth: {
    login: async (email: string, password: string): Promise<{ user: User }> => {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      return handleResponse(response);
    },

    logout: async (): Promise<{ message: string }> => {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      return handleResponse(response);
    },

    me: async (): Promise<{ user: User }> => {
      const response = await fetch("/api/auth/me", {
        credentials: "include",
      });
      return handleResponse(response);
    },

    register: async (email: string, password: string, name: string): Promise<{ user: User }> => {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
        credentials: "include",
      });
      return handleResponse(response);
    },
  },

  detectives: {
    getAll: async (limit = 50, offset = 0): Promise<{ detectives: Detective[] }> => {
      const response = await fetch(`/api/detectives?limit=${limit}&offset=${offset}`, {
        credentials: "include",
      });
      return handleResponse(response);
    },

    getById: async (id: string): Promise<{ detective: Detective }> => {
      const response = await fetch(`/api/detectives/${id}`, {
        credentials: "include",
      });
      return handleResponse(response);
    },

    getByCountry: async (country: string): Promise<{ detectives: Detective[] }> => {
      const response = await fetch(`/api/detectives/country/${country}`, {
        credentials: "include",
      });
      return handleResponse(response);
    },

    create: async (data: InsertDetective): Promise<{ detective: Detective }> => {
      const response = await fetch("/api/detectives", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      return handleResponse(response);
    },

    update: async (id: string, data: Partial<Detective>): Promise<{ detective: Detective }> => {
      const response = await fetch(`/api/detectives/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      return handleResponse(response);
    },
  },

  services: {
    search: async (params?: {
      category?: string;
      country?: string;
      search?: string;
      minPrice?: number;
      maxPrice?: number;
      sortBy?: string;
      limit?: number;
      offset?: number;
    }): Promise<{ services: Array<Service & { detective: Detective; avgRating: number; reviewCount: number }> }> => {
      const queryParams = new URLSearchParams();
      if (params?.category) queryParams.append("category", params.category);
      if (params?.country) queryParams.append("country", params.country);
      if (params?.search) queryParams.append("search", params.search);
      if (params?.minPrice !== undefined) queryParams.append("minPrice", params.minPrice.toString());
      if (params?.maxPrice !== undefined) queryParams.append("maxPrice", params.maxPrice.toString());
      if (params?.sortBy) queryParams.append("sortBy", params.sortBy);
      if (params?.limit !== undefined) queryParams.append("limit", params.limit.toString());
      if (params?.offset !== undefined) queryParams.append("offset", params.offset.toString());

      const response = await fetch(`/api/services?${queryParams.toString()}`, {
        credentials: "include",
      });
      return handleResponse(response);
    },

    getAll: async (limit = 50, offset = 0): Promise<{ services: Service[] }> => {
      const response = await fetch(`/api/services?limit=${limit}&offset=${offset}`, {
        credentials: "include",
      });
      return handleResponse(response);
    },

    getById: async (id: string): Promise<{ service: Service }> => {
      const response = await fetch(`/api/services/${id}`, {
        credentials: "include",
      });
      return handleResponse(response);
    },

    getByDetective: async (detectiveId: string): Promise<{ services: Service[] }> => {
      const response = await fetch(`/api/services/detective/${detectiveId}`, {
        credentials: "include",
      });
      return handleResponse(response);
    },

    create: async (data: InsertService): Promise<{ service: Service }> => {
      const response = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      return handleResponse(response);
    },

    update: async (id: string, data: Partial<Service>): Promise<{ service: Service }> => {
      const response = await fetch(`/api/services/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      return handleResponse(response);
    },

    delete: async (id: string): Promise<{ message: string }> => {
      const response = await fetch(`/api/services/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      return handleResponse(response);
    },
  },

  reviews: {
    getAll: async (limit = 50, offset = 0): Promise<{ reviews: Review[] }> => {
      const response = await fetch(`/api/reviews?limit=${limit}&offset=${offset}`, {
        credentials: "include",
      });
      return handleResponse(response);
    },

    getByService: async (serviceId: string, limit = 20): Promise<{ reviews: Review[] }> => {
      const response = await fetch(`/api/reviews/service/${serviceId}?limit=${limit}`, {
        credentials: "include",
      });
      return handleResponse(response);
    },

    create: async (data: InsertReview): Promise<{ review: Review }> => {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      return handleResponse(response);
    },

    update: async (id: string, data: Partial<Review>): Promise<{ review: Review }> => {
      const response = await fetch(`/api/reviews/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      return handleResponse(response);
    },

    delete: async (id: string): Promise<{ message: string }> => {
      const response = await fetch(`/api/reviews/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      return handleResponse(response);
    },
  },

  orders: {
    getAll: async (limit = 50, offset = 0): Promise<{ orders: Order[] }> => {
      const response = await fetch(`/api/orders?limit=${limit}&offset=${offset}`, {
        credentials: "include",
      });
      return handleResponse(response);
    },

    getById: async (id: string): Promise<{ order: Order }> => {
      const response = await fetch(`/api/orders/${id}`, {
        credentials: "include",
      });
      return handleResponse(response);
    },

    getByUser: async (userId: string): Promise<{ orders: Order[] }> => {
      const response = await fetch(`/api/orders/user/${userId}`, {
        credentials: "include",
      });
      return handleResponse(response);
    },

    getByDetective: async (detectiveId: string): Promise<{ orders: Order[] }> => {
      const response = await fetch(`/api/orders/detective/${detectiveId}`, {
        credentials: "include",
      });
      return handleResponse(response);
    },

    create: async (data: InsertOrder): Promise<{ order: Order }> => {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      return handleResponse(response);
    },

    update: async (id: string, data: Partial<Order>): Promise<{ order: Order }> => {
      const response = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      return handleResponse(response);
    },
  },

  users: {
    getById: async (id: string): Promise<{ user: User }> => {
      const response = await fetch(`/api/users/${id}`, {
        credentials: "include",
      });
      return handleResponse(response);
    },

    update: async (id: string, data: Partial<User>): Promise<{ user: User }> => {
      const response = await fetch(`/api/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      return handleResponse(response);
    },
  },

  favorites: {
    getByUser: async (userId: string): Promise<{ favorites: any[] }> => {
      const response = await fetch(`/api/favorites/user/${userId}`, {
        credentials: "include",
      });
      return handleResponse(response);
    },

    add: async (userId: string, detectiveId: string): Promise<{ favorite: any }> => {
      const response = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, detectiveId }),
        credentials: "include",
      });
      return handleResponse(response);
    },

    remove: async (userId: string, detectiveId: string): Promise<{ message: string }> => {
      const response = await fetch(`/api/favorites/${userId}/${detectiveId}`, {
        method: "DELETE",
        credentials: "include",
      });
      return handleResponse(response);
    },
  },
};

export { ApiError };
