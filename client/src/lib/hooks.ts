import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "./api";
import type { User, Detective, Service, Review, Order, DetectiveApplication, ProfileClaim, ServiceCategory, InsertDetective, InsertService, InsertReview, InsertOrder, InsertServiceCategory } from "@shared/schema";

export function useAuth() {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => api.auth.me(),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      api.auth.login(email, password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api.auth.logout(),
    onSuccess: () => {
      queryClient.clear();
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      // Force refetch auth status
      queryClient.refetchQueries({ queryKey: ["auth", "me"] });
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ email, password, name }: { email: string; password: string; name: string }) =>
      api.auth.register(email, password, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });
}

export function useDetectives(limit?: number, offset?: number) {
  return useQuery({
    queryKey: ["detectives", "all", limit, offset],
    queryFn: () => api.detectives.getAll(limit, offset),
  });
}

export function useDetective(id: string | null | undefined) {
  return useQuery({
    queryKey: ["detectives", id],
    queryFn: () => api.detectives.getById(id!),
    enabled: !!id,
  });
}

export function useDetectivesByCountry(country: string | null | undefined) {
  return useQuery({
    queryKey: ["detectives", "country", country],
    queryFn: () => api.detectives.getByCountry(country!),
    enabled: !!country,
  });
}

export function useCreateDetective() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: InsertDetective) => api.detectives.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["detectives"] });
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });
}

export function useUpdateDetective() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Detective> }) =>
      api.detectives.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["detectives", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["detectives", "all"] });
    },
  });
}

export function useServices(limit?: number, offset?: number) {
  return useQuery({
    queryKey: ["services", "all", limit, offset],
    queryFn: () => api.services.getAll(limit, offset),
  });
}

export function useSearchServices(params?: {
  categoryId?: string;
  country?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  limit?: number;
  offset?: number;
}) {
  return useQuery({
    queryKey: ["services", "search", params],
    queryFn: () => api.services.search(params),
  });
}

export function useService(id: string | null | undefined) {
  return useQuery({
    queryKey: ["services", id],
    queryFn: () => api.services.getById(id!),
    enabled: !!id,
  });
}

export function useServicesByDetective(detectiveId: string | null | undefined) {
  return useQuery({
    queryKey: ["services", "detective", detectiveId],
    queryFn: () => api.services.getByDetective(detectiveId!),
    enabled: !!detectiveId,
  });
}

export function useCreateService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: InsertService) => api.services.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
}

export function useUpdateService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Service> }) =>
      api.services.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["services", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["services", "all"] });
    },
  });
}

export function useDeleteService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.services.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
}

export function useReviews(limit?: number, offset?: number) {
  return useQuery({
    queryKey: ["reviews", "all", limit, offset],
    queryFn: () => api.reviews.getAll(limit, offset),
  });
}

export function useReviewsByService(serviceId: string | null | undefined, limit?: number) {
  return useQuery({
    queryKey: ["reviews", "service", serviceId, limit],
    queryFn: () => api.reviews.getByService(serviceId!, limit),
    enabled: !!serviceId,
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: InsertReview) => api.reviews.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
}

export function useUpdateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Review> }) =>
      api.reviews.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["reviews", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["reviews", "all"] });
    },
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.reviews.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
}

export function useOrders(limit?: number, offset?: number) {
  return useQuery({
    queryKey: ["orders", "all", limit, offset],
    queryFn: () => api.orders.getAll(limit, offset),
  });
}

export function useOrder(id: string | null | undefined) {
  return useQuery({
    queryKey: ["orders", id],
    queryFn: () => api.orders.getById(id!),
    enabled: !!id,
  });
}

export function useOrdersByUser(userId: string | null | undefined) {
  return useQuery({
    queryKey: ["orders", "user", userId],
    queryFn: () => api.orders.getByUser(userId!),
    enabled: !!userId,
  });
}

export function useOrdersByDetective(detectiveId: string | null | undefined) {
  return useQuery({
    queryKey: ["orders", "detective", detectiveId],
    queryFn: () => api.orders.getByDetective(detectiveId!),
    enabled: !!detectiveId,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: InsertOrder) => api.orders.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

export function useUpdateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Order> }) =>
      api.orders.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["orders", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["orders", "all"] });
    },
  });
}

export function useFavorites(userId: string | null | undefined) {
  return useQuery({
    queryKey: ["favorites", "user", userId],
    queryFn: () => api.favorites.getByUser(userId!),
    enabled: !!userId,
  });
}

export function useAddFavorite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, detectiveId }: { userId: string; detectiveId: string }) =>
      api.favorites.add(userId, detectiveId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
}

export function useRemoveFavorite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, detectiveId }: { userId: string; detectiveId: string }) =>
      api.favorites.remove(userId, detectiveId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
}

export function useUser(id: string | null | undefined) {
  return useQuery({
    queryKey: ["users", id],
    queryFn: () => api.users.getById(id!),
    enabled: !!id,
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) =>
      api.users.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });
}

export function useApplications() {
  return useQuery({
    queryKey: ["applications"],
    queryFn: () => api.applications.getAll(),
  });
}

export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: "approved" | "rejected" }) =>
      api.applications.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({ queryKey: ["detectives"] });
    },
  });
}

export function useClaims() {
  return useQuery({
    queryKey: ["claims"],
    queryFn: () => api.claims.getAll(),
  });
}

export function useUpdateClaimStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: "approved" | "rejected" }) =>
      api.claims.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["claims"] });
      queryClient.invalidateQueries({ queryKey: ["detectives"] });
    },
  });
}

export function useServiceCategories(activeOnly?: boolean) {
  return useQuery({
    queryKey: ["serviceCategories", activeOnly],
    queryFn: () => api.serviceCategories.getAll(activeOnly),
  });
}

export function useServiceCategory(id: string | null | undefined) {
  return useQuery({
    queryKey: ["serviceCategories", id],
    queryFn: () => api.serviceCategories.getById(id!),
    enabled: !!id,
  });
}

export function useCreateServiceCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: InsertServiceCategory) => api.serviceCategories.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["serviceCategories"] });
    },
  });
}

export function useUpdateServiceCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ServiceCategory> }) =>
      api.serviceCategories.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["serviceCategories", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["serviceCategories"] });
    },
  });
}

export function useDeleteServiceCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.serviceCategories.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["serviceCategories"] });
    },
  });
}
