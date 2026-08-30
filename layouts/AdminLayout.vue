<template>
  <div v-if="authedUser.isAuthenticated === true"
       class="max-w-8xl bg-gray-100 flex h-full"
  >
    <Sidebar />
    <div class="relative min-h-screen max-h-screen h-full flex flex-1 flex-col px-2 overflow-y-auto">
      <Navbar />
      <slot />
    </div>
  </div>
</template>
<script setup>
  import Sidebar from "~/components/sidebar/Sidebar.vue";
  import Navbar from "~/components/navbar/Navbar.vue";
  import {useAuthedUser} from "~/stores/authedUser";

  const authedUser = useAuthedUser();
  const { $authedUserStore } = useNuxtApp();

</script>
