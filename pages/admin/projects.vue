<template>
  <main
    class="flex flex-col w-full items-center justify-center md:flex-row md:justify-around"
  >
    <section class="flex flex-col w-full">
      <h1 class="text-xl md:text-2xl text-primary my-5 font-bold">
        Manage Projects
      </h1>
      <p
        v-if="form.error"
        class="my-3 text-white bg-error rounded shadow-md p-2"
      >
        {{ form.error }}
      </p>

      <form
        @submit.prevent="handleSubmit"
        class="shadow-2xl border-x-2 border-accent rounded bg-transparent text-primary flex flex-col items-center justify-center m-6 p-2 w-11/12"
      >
        <VInput
          name="project_tit"
          label="Project Title"
          type="text"
          :value="form.data.projectTitle"
          @update:value="(val: string) => form.data.projectTitle = val"
        />

        <VInput
          name="project_desc"
          label="Project Description"
          type="text"
          :value="form.data.projectDesc"
          @update:value="(val: string) => form.data.projectDesc = val"
        />

        <VInput
          name="project_src"
          label="Project SourceCode Url"
          type="text"
          :value="form.data.projectSourceUrl"
          @update:value="(val: string) => form.data.projectSourceUrl = val"
        />

        <VInput
          name="project_dld"
          label="Project Download Url"
          type="text"
          :value="form.data.projectDownloadUrl"
          @update:value="(val: string) => form.data.projectDownloadUrl = val"
        />

        <h3 v-if="skills && skills.length > 0" class="self-start mt-5 italic">
          Skill used in this project
        </h3>

        <p v-if="pending" class="text-primary italic">Loading Projects...</p>

        <VMultiCheck
          v-if="skills && skills.length > 0 && !pending"
          :options="
            skills!.map((skill) => {
              return {
                id: skill.id,
                label: skill.name,
              };
            })
          "
          @choice="handleSkillSelection"
        />

        <div class="self-start my-5 flex flex-col">
          <label class="italic mb-2" for="images"
            >Upload Reference Images</label
          >
          <input
            type="file"
            accept="image/*"
            name="images[]"
            id="images"
            multiple
            ref="fileInput"
            @change="uploadFiles"
          />
        </div>

        <div class="flex w-32 justify-around self-start mb-5">
          <button
            type="button"
            :class="projectFeatured ? 'bg-std' : 'bg-accent'"
            class="p-1 text-center cursor-pointer rounded-md"
            @click="handleToggleFetatured"
          >
            <ClientOnly>
              <Icon
                name="streamline:computer-desktop-favorite-star-computer-desktop-device-display-like-favorite-star"
                :class="projectFeatured ? 'text-success' : 'text-std'"
                size="1.5rem"
              />
            </ClientOnly>
          </button>

          <button
            type="button"
            :class="projectCommission ? 'bg-std' : 'bg-accent'"
            class="p-1 text-center cursor-pointer rounded-md"
            @click="handleToggleCommission"
          >
            <ClientOnly>
              <Icon
                name="clarity:contract-solid"
                :class="projectCommission ? 'text-success' : 'text-std'"
                size="1.5rem"
              />
            </ClientOnly>
          </button>
        </div>

        <button
          type="submit"
          :class="form.pending && 'cursor-wait'"
          class="btn"
          :disabled="form.pending"
        >
          <span class="text-center" v-if="!form.pending">Submit Project</span>
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
      <p class="text-primary italic" v-if="prjPending">Loading...</p>

      <h3
        v-else-if="!skills || skills.length <= 0"
        class="text-lg md:text-xl text-primary text-center"
      >
        No Projects Yet...
      </h3>

      <ul
        class="p-3 flex flex-col justify-start h-[80vh] items-center overflow-scroll w-full"
        v-else
      >
        <li class="w-full m-2" v-for="project in projects">
          <VProjectItem
            :project="project"
            :loading="updating"
            @delete="handleProjectRemoval"
            @feature="handleSetFeature"
          />
        </li>
      </ul>
    </section>
  </main>
</template>

<script setup lang="ts">
import type Project from "~/interfaces/project";
import type Skill from "~/interfaces/skill";

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

const selectedSkillIds = ref<string[]>([]);
const projectFeatured = ref<boolean>(false);
const projectCommission = ref<boolean>(false);

const updating = ref<boolean>(false);

const fileInput = ref<HTMLInputElement | null>(null);
const images = ref<File[]>([]);

const uploadFiles = () => {
  if (fileInput.value?.files) {
    const files = Array.from(fileInput.value.files);
    images.value = files;
  }
};

const form = reactive({
  data: {
    projectTitle: "",
    projectDesc: "",
    projectSourceUrl: "",
    projectDownloadUrl: "",
  },
  error: "",
  pending: false,
});

const handleSkillSelection = (choice: { index: number; status: boolean }) => {
  if (choice.status)
    selectedSkillIds.value.push(skills.value![choice.index].id!);
  else selectedSkillIds.value.splice(choice.index, 1);
};

const handleToggleFetatured = () => {
  projectFeatured.value = !projectFeatured.value;
};
const handleToggleCommission = () => {
  projectCommission.value = !projectCommission.value;
};

const handleSetFeature = async (id: string, value: boolean) => {
  try {
    updating.value = true;
    if (!projects.value) throw Error("No Projects Found!");
    const index: number = projects.value.findIndex((x) => x.id === id);
    if (index < 0) throw new Error("Projkect not found");

    const updatedProject = await $fetch<{ project: Project }>("/api/projects", {
      method: "PUT",
      body: {
        ...projects.value[index],
        featured: value,
      },
    });
    projects.value[index] = updatedProject.project;
  } catch (error) {
    console.log(error);
  } finally {
    updating.value = false;
  }
};

const handleProjectRemoval = async (id: string) => {
  try {
    await $fetch<{ project: Project }>("/api/projects", {
      method: "DELETE",
      body: {
        id,
      },
    });

    projects.value = projects.value!.filter((prj) => prj.id !== id);
  } catch (error) {
    console.log(error);
  }
};

const handleSubmit = async () => {
  try {
    form.pending = true;
    form.error = "";
    const selectedSkills = skills.value!.filter((prj) =>
      selectedSkillIds.value.includes(prj.id!)
    );

    if (selectedSkills.length <= 0) throw Error("No skills selected");

    const formValues = {
      title: form.data.projectTitle,
      description: form.data.projectDesc,
      commission: projectCommission.value,
      featured: projectFeatured.value,
      sourceCodeUrl: form.data.projectSourceUrl,
      downloadUrl: form.data.projectDownloadUrl,
      skills: selectedSkills,
    };
    const formData = new FormData();
    formData.append("form", JSON.stringify(formValues));

    if (images.value.length <= 0) throw Error("No file selected");

    for (let index = 0; index < images.value.length; index++) {
      formData.append(`image${index}`, images.value[index]);
    }

    const data = await $fetch<{ project: Project }>("/api/projects", {
      method: "POST",
      body: formData,
    });
    projects.value!.push(data.project);
  } catch (error: any) {
    console.log(error);
    if (error.data.message) form.error = error.data.message;
  } finally {
    form.pending = false;
  }
};
</script>

<style scoped></style>
