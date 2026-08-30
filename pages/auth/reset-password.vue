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
        <h2 class="py-2 text-2xl mt-5 text-gray-800">Réinitialiser votre mot de passe.</h2>
        <p class="text-gray-700 text-sm">
          Entrer un nouveau mot de passe pour votre compte.
        </p>
<!--        <p v-if="errors" class="py-1 bg-red-100/50 text-red-400 rounded ps-4 border border-red-300">-->
<!--          {{ errors }}-->
<!--        </p>-->

        <div class="pb-2">
          <va-value v-slot="isPasswordVisible" :default-value="false">
            <va-input
                v-model="password"
                :type="isPasswordVisible.value ? 'text' : 'password'"
                label="Mot de passe"
                placeholder="********"
                @click-append-inner="
                isPasswordVisible.value = !isPasswordVisible.value
              "
                :rules="[
                    v => !!v || 'Mot de passe requis',
                    v => v.length >= 8 || 'Le mot de passe doit contenir au moins 8 caractères',
                    v => /[A-Z]/.test(v) || 'Le mot de passe doit contenir au moins une lettre majuscule',
                    v => /[a-z]/.test(v) || 'Le mot de passe doit contenir au moins une lettre minuscule',
                    v => /[0-9]/.test(v) || 'Le mot de passe doit contenir au moins un chiffre',
                    v => /[^A-Za-z0-9]/.test(v) || 'Le mot de passe doit contenir au moins un caractère spécial'
                   ]"
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
        <div class="pb-2">
          <va-value v-slot="isPasswordVisible" :default-value="false">
            <va-input
                v-model="password_confirmation"
                :type="isPasswordVisible.value ? 'text' : 'password'"
                label="Confirmer le mot de passe"
                placeholder="********"
                @click-append-inner="
                  isPasswordVisible.value = !isPasswordVisible.value
                "
                @change="confirmPassword"
                :rules="[v => !!v || 'Confirmer le mot de passe', v => v === password || 'Les mots de passe ne correspondent pas']"
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
        <div class="pb-2 mt-6">
          <va-button
              @click="login"
              :disabled="isButtonDisabled"
              size="large"
              block
          >
            Confirmer
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
const router = useRouter();

definePageMeta({
  layout: false,
  title: "D-liv | Réinitialiser le mot de passe",
});

let password = ref("");
let password_confirmation = ref("");
let errors = ref(null);

const isButtonDisabled = computed(() => {
  return !password.value || !password_confirmation.value || password.value !== password_confirmation.value;
});

const confirmPassword = () => {
  if (password.value !== password_confirmation.value) {
    errors.value = "Les mots de passe ne correspondent pas";
  } else {
    errors.value = null;
  }
};
const login = async () => {
  const res = await $authedUserStore.resetPassword(password.value);
  if (res.response?.status === 401) {
    errors.value = "Code invalide ou expiré";
  }

  if (res.response?.status === 500) {
    errors.value = "Erreur interne du serveur";
  }

  if (res.status === 200 || res.status === 201) {
    errors.value = null;
    await router.push("/");
  }
};

watchEffect(() => {
  if ($authedUserStore.error) {
    errors.value = $authedUserStore.error;
  }
});

onMounted(() => {
  if ($authedUserStore.isAuthenticated) {
    router.push("/");
  }
});
</script>
<style>
</style>