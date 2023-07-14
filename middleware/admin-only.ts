export default defineNuxtRouteMiddleware(async () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated())
    return navigateTo({ path: "/admin/auth", replace: true });
});
