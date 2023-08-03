<template>
  <main
    class="flex flex-col w-full items-center justify-center md:flex-row md:justify-around"
  >
    <section class="flex flex-col w-full">
      <h1 class="text-xl md:text-2xl text-primary my-5">Manage Skills</h1>
      <p v-if="form.error" class="my-3 text-std bg-error rounded shadow-md p-2">
        {{ form.error }}
      </p>

      <form
        @submit.prevent="handleSubmit"
        class="shadow-2xl border-x-2 border-accent rounded bg-transparent text-primary flex flex-col items-center justify-center m-6 p-2 w-11/12"
      >
        <VInput
          name="skill"
          label="Skill Name"
          type="text"
          :value="form.data.skillName"
          @update:value="(val: string) => form.data.skillName = val"
        />

        <VMultiCheck
          v-if="projects && projects.length > 0"
          :options="
            projects!.map((prj) => {
              return {
                id: prj.id,
                label: prj.title,
              };
            })
          "
          @choice="handleProjectSelection"
        />

        <VRadio @platform="(val: Platform) => form.data.platform = val" />
        <button
          type="submit"
          :class="form.pending && 'cursor-wait'"
          class="btn"
          :disabled="form.pending"
        >
          <span class="text-center" v-if="!form.pending">Submit Skill</span>
          <ClientOnly>
            <Icon
              v-if="form.pending"
              name="eos-icons:bubble-loading"
              class="text-accent text-center"
              size="1.2rem"
            ></Icon>
          </ClientOnly>
        </button>
      </form>
    </section>

    <DynSep />

    <section class="flex flex-col w-full justify-center items-center">
      <p v-if="pending">Loading...</p>

      <h3
        v-else-if="!skills || skills.length <= 0"
        class="text-lg md:text-xl text-primary text-center"
      >
        No Skills Yet...
      </h3>

      <ul
        class="p-3 flex flex-col justify-start h-[80vh] overflow-scroll w-full"
        v-else
      >
        <li class="w-full m-2" v-for="skill in skills">
          <VSkillItem :skill="skill" @delete="handleSkillRemoval" />
        </li>
      </ul>
    </section>
  </main>
</template>

<script setup lang="ts">
import Skill from "~/interfaces/skill";
import Platform from "~/interfaces/platform";
import Project from "~/interfaces/project";

definePageMeta({
  layout: "admin",
});

const { pending, data: skills } = await useFetch<Skill[]>("/api/skills", {
  lazy: true,
});

const { pending: prjPending, data: projects } = await useFetch<Project[]>(
  "/api/projects",
  { lazy: true }
);

const selectedProjectIds = ref<string[]>([]);

const form = reactive({
  data: {
    skillName: "",
    platform: { name: "Web", subtype: "Frontend" },
  },
  error: "",
  pending: false,
});

const handleProjectSelection = (choice: { index: number; status: boolean }) => {
  if (choice.status)
    selectedProjectIds.value.push(projects.value![choice.index].id!);
  else selectedProjectIds.value.splice(choice.index, 1);
};

const handleSkillRemoval = async (id: string) => {
  try {
    await $fetch<Skill>("/api/skills", {
      method: "DELETE",
      body: {
        id,
      },
    });

    skills.value = skills.value!.filter((skill) => skill.id !== id);
  } catch (error) {
    console.log(error);
  }
};

const handleSubmit = async () => {
  try {
    form.pending = true;
    form.error = "";
    const data = await $fetch<{ skill: Skill }>("/api/skills", {
      method: "POST",
      body: {
        name: form.data.skillName,
        platform: form.data.platform.name,
        subplatform: form.data.platform.subtype,
        projects:
          !projects.value || projects.value.length <= 0
            ? []
            : projects.value.filter((prj) =>
                selectedProjectIds.value.includes(prj.id!)
              ),
      },
    });
    skills.value!.push(data.skill);
  } catch (error: any) {
    console.log(error);
    // if (error.data.message) form.error = error.data.message;
  } finally {
    form.pending = false;
  }
};
</script>

<style scoped></style>
