<template>
  <ion-modal
    :is-open="visible" :initial-breakpoint="1" :breakpoints="[0, 1]" class="bottom-modal"
    @did-dismiss="closeModal"
  >
    <div class="flex flex-col gap-6 p-6">
      <div class="flex justify-between items-center">
        <i class="pi pi-times text-xl cursor-pointer" @click="closeModal" />
        <!-- <div class="w-8 h-8 bg-red-100 rounded-lg" /> -->
      </div>

      <div class="text-center text-slate-900">
        <h1 class="text-medium font-semibold mb-2">Say Hi to Eva,</h1>
        <h2 class="text-medium font-semibold mb-4">Your Future Living Assistant!</h2>
        <p class="text-gray-600 body-large">Enter your email to get started</p>
      </div>

      <div class="flex flex-col gap-4">
        <!-- <IconField class="w-full">
          <InputIcon class="pi pi-envelope" style="font-size: 1.5rem" />
        </IconField> -->
        <TInput
          v-model="v$.email.$model"
          placeholder="Email address"
          class="w-full button-large"
          :error="v$.email.$error"
          :error-message="v$.email.$errors[0]?.$message"
        />

        <TButton
          label="Continue"
          variant="pink"
          class="w-full !rounded-full py-[1.2rem] px-[1.6rem] button-large"
          :disabled="v$.email.$invalid"
          @click="handleEmailLogin"
        />

        <div class="flex items-center gap-4 my-4">
          <div class="h-[1px] flex-1 bg-gray-200" />
          <span class="text-gray-500 body-medium">OR</span>
          <div class="h-[1px] flex-1 bg-gray-200" />
        </div>

        <div class="flex grow items-center gap-4 w-full">
          <TButton variant="dark" class="flex-1 !rounded-full py-5" @click="handleAppleLogin">
            <template #default>
              <img src="@/assets/icons/apple-icon.svg" alt="Google" class="w-[24px] h-[24px]">
            </template>
          </TButton>

          <TButton variant="dark" class="flex-1 !rounded-full py-5" @click="handleGoogleLogin">
            <template #default>
              <img src="@/assets/icons/google-icon.svg?inline" alt="Google" class="w-[24px] h-[24px]">
            </template>
          </TButton>
        </div>
      </div>

      <p class="text-center label text-gray-500">
        By continuing, your agree to TenantEvaluation's
        <a href="#" class="text-gray-700">Privacy policy</a> and
        <a href="#" class="text-gray-700">Terms of service</a>
      </p>
    </div>
  </ion-modal>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { IonModal } from '@ionic/vue'
import { useRouter } from 'vue-router'
import { useVuelidate } from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'

import { useAuthStore } from '@/stores/AuthStore'

import { ERouter } from '@/enums/router'


import TInput from '@/components/TInput.vue'
import TButton from '@/components/TButton.vue'
/* import TInput from '@/components/TInput.vue' */

const visible = ref(false)
const loading = ref(false)
const authStore = useAuthStore()
const router = useRouter()

const state = reactive({
  email: ''
})

const rules = {
  email: { required, email }
}

const v$ = useVuelidate(rules, state)

const closeModal = () => {
  visible.value = false
}

const handleEmailLogin = async () => {
  const isValid = await v$.value.$validate()
  if (!isValid) return

  try {
    loading.value = true
    await authStore.signInMagicLink(state.email)
    visible.value = false
    router.push({ name: ERouter.AudioTesting })
  } catch (error) {
    console.error('Error during login:', error)
  } finally {
    loading.value = false
  }
}

const handleAppleLogin = () => {
  // Handle Apple login
  console.log('Apple login')
}

const handleGoogleLogin = async () => {
  await authStore.signInGoogle()
}

defineExpose({
  visible
})
</script>

<style lang="scss" scoped>
.login-modal {
  --height: auto;
  --max-height: 90%;
  --width: 100%;
  --border-radius: 24px;
  border-bottom-left-radius: 0px !important;
  border-bottom-right-radius: 0px !important;
}

:deep(.ion-page) {
  border-bottom-left-radius: 0px !important;
  border-bottom-right-radius: 0px !important;
}

:deep(.modal-wrapper) {
  border-radius: var(--border-radius);
}

:deep(.p-inputtext) {
  border-radius: 100px;
}

:deep(.ion-page) {
  border-radius: var(--border-radius);
  overflow: hidden;
  background: white;
}
</style>
