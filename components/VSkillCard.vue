<template>
  <section
    class="flex flex-col justify-between items-center p-2 max-h-80 w-full bg-accent shadow-md"
  >
    <h1 class="text-xl md:text-2xl text-std font-bold text-center">
      {{ platform }}
    </h1>

    <div class="w-full overflow-scroll" v-if="props.subplatforms.length > 0">
      <div class="w-full" v-for="subplatform in props.subplatforms">
        <h3 class="text-center">{{ subplatform }}</h3>
        <div
          v-for="(skill, i) in props.skills.filter(
            (sk) => sk.subplatform === subplatform
          )"
        >
          <VSkill
            :key="i"
            :name="skill.name"
            :uses="!skill.projects ? 0 : skill.projects.length"
          />
        </div>
      </div>
    </div>

    <div class="overflow-scroll" v-else>
      <div v-for="(skill, i) in props.skills">
        <VSkill
          :key="i"
          :name="skill.name"
          :uses="!skill.projects ? 0 : skill.projects.length"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import Skill from "interfaces/skill";

const props = defineProps<{
  platform: string;
  subplatforms: string[];
  skills: Skill[];
}>();
</script>

<style scoped></style>
