<template>
  <main class="flex flex-col justify-center items-center w-full px-6">
    <h1 class="text-accent text-center text-2xl md:text-5xl mb-8">
      A bit about myself
    </h1>

    <p
      class="m-6 text-md md:text-lg text-center text-primary italic border-x-2 p-2 rounded border-accent w-3/4"
    >
      I'm Francesco, a passionate and experienced software developer
      specializing in creating robust and innovative solutions.I have honed my
      skills in web development, mobile app development, software architecture,
      and database design. My goal is to deliver exceptional software solutions
      that not only meet the requirements but also exceed the expectations of my
      clients. I thrive on solving complex problems and transforming ideas into
      scalable and efficient applications. Through a meticulous approach to
      coding, I ensure clean and maintainable code that adheres to industry best
      practices. Throughout my career, I have passionately undertaken a range of
      diverse projects, from creating captivating websites to developing
      feature-rich mobile apps, gaining invaluable hands-on experience while
      honing my skills in software development, I have acquired expertise in
      various programming languages and frameworks, including Typescrypt
      alongside React, Vue and NodeJS for the web and Dart and Flutter for
      mobile. What sets me apart is my ability to understand the unique needs of
      each client and translate their vision into a reality. I believe in a
      collaborative approach, working closely with my clients to ensure their
      requirements are met at every stage of the development process. I strive
      for excellence in every project I undertake, ensuring timely delivery and
      unwavering commitment to quality.
    </p>

    <h2
      class="underline-offset-8 underline text-accent text-xl md:text-3xl text-center py-3 mb-5 mt-8"
    >
      Support my Projects
    </h2>

    <section
      class="py-2 flex flex-col md:flex-row justify-evenly items-center w-full"
    >
      <VPayPalDonate />

      <VCryptoDonate
        title="Monero XMR"
        qr-code-url="/images/monero.webp"
        address="46PYvx4kDBgBUwPDQhRKXSetbHAQx8oNmdY6xWL7cPKpfnwrFuYVPNoTf24MDKLWFrWVnUw6dcnGVXbgkUHAyXcHNjbGb9F"
      />
      <VCryptoDonate
        title="Bitcoin BTC"
        qr-code-url="/images/bitcoin.webp"
        address="bc1qkh2g2qqeqx5xp7duy4vcndtf4qktueaaqyhqh0"
      />
    </section>
  </main>
</template>

<script setup lang="ts">
useHead({
  link: [{ rel: "canonical", href: "https://francescobarranca.dev/about" }],
});
useSeoMeta({
  title: "About | FMB.DEV",
  ogTitle: "About | FMB.DEV",
  twitterTitle: "About | FMB.DEV",
});
</script>

<style scoped></style>
