<template>
  <div>
    <header>
      <nav class="container mx-auto p-4 flex justify-between items-center">
        <div class="flex flex-row justify-around p-2 items-center">
          <img
            src="~/assets/images/logo.webp"
            alt="Logo"
            width="50"
            height="50"
          />
          <NuxtLink
            class="font-bold text-accent text-xl md:text-3xl p-2"
            to="/admin"
            >.DEV</NuxtLink
          >
        </div>
        <ul class="hidden md:flex gap-4 text-primary text-sm md:text-xl">
          <li class="link">
            <NuxtLink to="/admin">Dashboard</NuxtLink>
          </li>
          <li class="link">
            <NuxtLink to="/admin/skills">Skills</NuxtLink>
          </li>
          <li class="link">
            <NuxtLink to="/admin/projects">Projects</NuxtLink>
          </li>
          <li class="link">
            <NuxtLink to="/admin/commissions">Commissions</NuxtLink>
          </li>
          <button @click="handleLogout" class="outbtn" type="button">
            Logout
          </button>
        </ul>

        <div class="hidden md:block">
          <ModeSwitch />
        </div>

        <div @click="toggleNav" class="flex md:hidden">
          <button
            type="button"
            class="text-gray-100 hover:text-gray-400 focus:outline-none focus:text-gray-400"
          >
            <ClientOnly>
              <Icon
                v-if="!showMenu"
                name="system-uicons:menu-hamburger"
                class="text-primary"
                size="2.7rem"
              />

              <Icon
                v-if="showMenu"
                name="material-symbols:close-rounded"
                class="text-primary"
                size="2.7rem"
              />
            </ClientOnly>
          </button>
        </div>

        <ul
          :class="showMenu ? 'flex' : 'hidden'"
          class="fixed top-0 right-0 z-50 flex-col bg-std p-4 rounded-sm shadow-lg mt-20 mr-2 space-y-4 md:hidden text-primary"
        >
          <li class="link">
            <NuxtLink to="/admin">Dashboard</NuxtLink>
          </li>
          <li class="link">
            <NuxtLink to="/admin/skills">Skills</NuxtLink>
          </li>
          <li class="link">
            <NuxtLink to="/admin/projects">Projects</NuxtLink>
          </li>
          <li class="link">
            <NuxtLink to="/admin/commissions">Commissions</NuxtLink>
          </li>
          <li class="link">
            <ModeSwitch />
          </li>
          <button @click="handleLogout" class="outbtn" type="button">
            Logout
          </button>
        </ul>
      </nav>
    </header>

    <div class="container mx-auto p-4">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
let showMenu = ref(false);
const toggleNav = () => (showMenu.value = !showMenu.value);

const { logout } = useAuth();

const handleLogout = () => {
  logout();
  navigateTo("/admin/auth");
};
</script>

<style scoped>
.router-link-exact-active {
  color: rgb(var(--color-accent));
}
</style>
