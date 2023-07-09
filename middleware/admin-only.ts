import { useAuth } from "composables/useAuth";

export default defineNuxtRouteMiddleware(async () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return navigateTo({ name: "login" });
});
