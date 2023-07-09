import { useAuth } from "composables/useAuth";

export default defineNuxtPlugin(async () => {
  const { me } = useAuth();

  await me();
});
