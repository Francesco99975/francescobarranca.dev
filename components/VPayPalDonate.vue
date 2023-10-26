<template>
  <div class="flex flex-col justify-evenly items-center w-64 my-6 md:m-0">
    <h3 class="text-center text-primary text-lg md:text-2xl font-bold italic">
      PayPal
    </h3>

    <a
      href="https://www.paypal.com/donate/?business=8K5EBZGNUV27G&no_recurring=0&item_name=Your+support+means+a+lot+to+me.+Donations+go+towards+maintaining+this+site+and+funding+open-source+projects.+Thank+you%21&currency_code=CAD "
    >
      <img
        src="~/assets/images/paypal.webp"
        alt="PaypalQR"
        height="200"
        width="200"
        class="p-2"
      />
    </a>

    <form action="https://www.paypal.com/donate" method="post" target="_top">
      <input type="hidden" name="business" value="8K5EBZGNUV27G" />
      <input type="hidden" name="no_recurring" value="0" />
      <input
        type="hidden"
        name="item_name"
        value="Your support means a lot to me. Donations go towards maintaining this site and funding open-source projects. Thank you!"
      />
      <input type="hidden" name="currency_code" value="CAD" />
      <input
        type="image"
        src="https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif"
        border="0"
        name="submit"
        title="PayPal - The safer, easier way to pay online!"
        alt="Donate with PayPal button"
      />
      <img
        alt=""
        border="0"
        src="https://www.paypal.com/en_CA/i/scr/pixel.gif"
        width="1"
        height="1"
      />
    </form>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
