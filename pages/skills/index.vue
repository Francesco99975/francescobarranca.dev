<template>
  <main class="container mx-auto px-4 py-8">
    <h1
      class="text-3xl text-primary font-bold -ml-7 mb-5 underline underline-offset-2"
    >
      Skills
    </h1>
    <section
      v-if="skills && !pending"
      class="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
    >
      <div v-for="(platform, index) in skillCards.platforms">
        <VSkillCard
          :key="index"
          :platform="platform"
          :subplatforms="skillCards.subplatformsList[index]"
          :skills="skillCards.skillsList[index]"
        />
      </div>
    </section>
    <section
      v-if="(!skills || skills.length <= 0) && !pending"
      class="flex items-center justify-center w-full h-[60vh]"
    >
      <h1 class="text-center text-accent italic">
        No Skills <span class="underline">git gud</span>
      </h1>
    </section>

    <VLoadingScreen v-if="pending" />
  </main>
</template>

<script setup lang="ts">
import type Skill from "~/interfaces/skill";

useSeoMeta({
  title: "Skills | FMB.DEV",
  description:
    "Unlock a treasure trove of skills and expertise in my portfolio. Explore a wide range of talents and proficiencies, each a testament to innovation and versatility. Get inspired and imagine how these skills can enhance your projects and ideas.",

  ogTitle: "Skills | FMB.DEV",
  ogDescription:
    "Unlock a treasure trove of skills and expertise in my portfolio. Explore a wide range of talents and proficiencies, each a testament to innovation and versatility. Get inspired and imagine how these skills can enhance your projects and ideas.",

  twitterTitle: "Skills | FMB.DEV",
  twitterDescription:
    "Unlock a treasure trove of skills and expertise in my portfolio. Explore a wide range of talents and proficiencies, each a testament to innovation and versatility. Get inspired and imagine how these skills can enhance your projects and ideas.",
});

const { pending, data: skills } = await useFetch<Skill[]>("/api/skills", {
  lazy: true,
});

const skillCards = computed(() => {
  if (skills.value) {
    const platforms = [
      ...new Set(
        skills.value.map((skill) => (skill.platform ? skill.platform : "Other"))
      ),
    ];
    const subplatformsList: string[][] = [];
    const skillsList: Skill[][] = [];
    for (const platform of platforms) {
      const filteredSkills = skills.value.filter((skill) => {
        if (platform !== "Other") {
          return skill.platform === platform;
        } else {
          skill.platform === null;
        }
      });
      const subs: string[] = [
        ...new Set(
          filteredSkills.map((skill) =>
            skill.subplatform ? skill.subplatform : ""
          )
        ),
      ];
      subplatformsList.push(subs.filter((s) => s.length > 0));

      skillsList.push(filteredSkills);
    }

    return { platforms, subplatformsList, skillsList };
  } else {
    return { platforms: [], subplatformsList: [[]], skillsList: [[]] };
  }
});
</script>

<style scoped></style>
