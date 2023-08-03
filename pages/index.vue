<template>
  <main
    class="flex flex-col justify-center items-center md:items-start w-full h-[80vh] md:h-[50vh] px-6"
  >
    <div
      class="flex flex-col justify-center items-center md:items-start w-full"
    >
      <h1 class="text-primary text-center text-3xl md:text-6xl">
        Francesco M. Barranca
      </h1>
      <h3 class="text-accent text-center my-2 p-2 text-xl rounded md:text-3xl">
        Software Developer
      </h3>

      <ul class="flex flex-row justify-center">
        <li>
          <a href="https://github.com/Francesco99975">
            <ClientOnly>
              <Icon name="uil:github" class="text-primary" size="3rem" />
            </ClientOnly>
          </a>
        </li>
        <!-- <li>
          <a href=""></a>
        </li> -->
      </ul>
    </div>

    <p
      class="m-6 text-md md:text-lg text-center text-primary italic border-y-2 p-2 rounded border-accent md:w-1/3 self-end"
    >
      Unleash the potential of technology with a driven and innovative software
      developer committed to crafting cutting-edge solutions while constantly
      pushing the boundaries of knowledge and expertise.
    </p>
  </main>
</template>

<script setup lang="ts"></script>

<style scoped></style>
