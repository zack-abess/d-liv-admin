<template>
  <div
      class="mx-4 bg-blue-100 h-svh w-full md:mx-auto flex items-center gap-5 lg:justify-center flex-col lg:flex-row py-10"
  >
    <div class="w-full py-12 xl:py-24 rounded-md lg:w-2/5 bg-white">
      <div>
        <NuxtLink to="/" class="flex items-center justify-center md:mt-5 gap-3">
          <Logo
              :textColor="'text-gray-700'"
              :imgSize="'w-16  xl:w-20'"
              :textSize="'text-[15px]'"
          />
        </NuxtLink>
      </div>
      <div class="px-16">
        <h2 class="py-2 text-2xl mt-5 text-gray-800">Bienvenue</h2>
        <p v-if="errors" class="my-3 py-1 bg-red-100/50 text-red-400 rounded ps-4 border border-red-300">
          {{ errors }}
        </p>
        <p class="text-gray-700 text-sm">
          Veuillez vous connecter pour accéder à votre espace
        </p>
        
        <div class="py-4 w-full">
          <va-input
              clearable
              type="email"
              v-model="email"
              placeholder="exemple@domaine.com"
              label="Email"
              class="capitalize"
          />
        </div>
        <div class="pb-2">
          <va-value v-slot="isPasswordVisible" :default-value="false">
            <va-input
                clearable
                v-model="password"
                :type="isPasswordVisible.value ? 'text' : 'password'"
                label="Mot de passe"
                placeholder="********"
                @click-append-inner="
                isPasswordVisible.value = !isPasswordVisible.value
              "
            >
              <template #appendInner>
                <va-icon
                    :name="
                    isPasswordVisible.value ? 'visibility_off' : 'visibility'
                  "
                    size="small"
                    color="primary"
                />
              </template>
            </va-input>
          </va-value>
        </div>
        <div class="text-sm text-gray-600 text-right">
          <div class="cursor-pointer underline">
            <NuxtLink
                to="/auth/forgot-password"
                class="text-primary hover:text-primary-dark"
            >Mot de passe oublié?</NuxtLink
            >
          </div>
        </div>
        <div class="pb-2 mt-6">
          <va-button
              @click="login"
              :disabled="isButtonDisabled"
              size="large"
              block
          >
            Connexion
          </va-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Logo from "~/components/core/Logo.vue";
import axios from "axios";
const { $authedUserStore } = useNuxtApp();
const route = useRoute();
const router = useRouter();

definePageMeta({
  layout: false,
  title: "D-liv | Connexion",
});

let email = ref("");
let password = ref("");
let errors = ref(null);

const isButtonDisabled = computed(() => {
  return !email.value || !password.value;
});
const login = async () => {
  const res = await $authedUserStore.login(email.value, password.value);
};

watchEffect(() => {
  if ($authedUserStore.error) {
    errors.value = $authedUserStore.error;
  }
});

onMounted(async () => {
  await $authedUserStore.logout();
});
</script>
<style>
</style>