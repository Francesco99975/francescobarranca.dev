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
          <NuxtLink class="font-bold text-accent text-xl md:text-3xl p-2" to="/"
            >FMB.DEV</NuxtLink
          >
        </div>
        <ul class="hidden md:flex gap-4 text-primary text-sm md:text-xl">
          <li class="link">
            <NuxtLink to="/">Home</NuxtLink>
          </li>
          <li class="link">
            <NuxtLink to="/skills">Skills</NuxtLink>
          </li>
          <li class="link">
            <NuxtLink to="/projects">Projects</NuxtLink>
          </li>
          <li class="link">
            <NuxtLink to="/commissions">Commissions</NuxtLink>
          </li>
          <li class="link">
            <NuxtLink to="/about">About</NuxtLink>
          </li>
        </ul>
        <ModeSwitch />
      </nav>
    </header>

    <div class="p-4">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.router-link-exact-active {
  color: rgb(var(--color-accent));
}
</style>
