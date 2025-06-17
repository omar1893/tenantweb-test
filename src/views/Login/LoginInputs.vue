<template>
  <ion-modal
    :is-open="isOpen"
    :initial-breakpoint="0.85"
    :breakpoints="[0.85, 1]"
    class="bottom-modal"
    :swipe-to-close="false"
    @didDismiss="closeModal"
  >
    <div class="flex flex-col gap-6 p-6 pb-40">
      <div class="flex justify-between items-center">
        <img src="@/assets/icons/close-icon.svg" alt="Close" class="w-[17px] h-[17px] cursor-pointer" @click="closeModal">
        <div class="ml-auto flex items-center">
          <Vue3Lottie :animation-data="sparksLottie" :height="32" :width="32" :speed="2" :loop="true" :auto-play="true" />
        </div>
      </div>

      <div v-if="!emailSent" class="text-center text-slate-900">
        <h1 class="text-medium font-semibold mb-2">Say Hi to Eva,</h1>
        <h2 class="text-medium font-semibold mb-4">Your Future Living Assistant!</h2>
        <p class="text-gray-600 body-large">Enter your email to get started</p>

        <div class="flex flex-col gap-4 mt-6">
          <TInput
            v-model="v$.email.$model"
            placeholder="Email address"
            class="w-full button-large"
            :error="v$.email.$error"
            :error-message="v$.email.$errors[0]?.$message?.toString()"
            :icon="mailIcon"
          />

          <TButton
            :label="loading ? '' : 'Continue'"
            variant="pink"
            class="w-full !rounded-full py-[1.2rem] px-[1.6rem] button-large"
            :disabled="v$.email.$invalid"
            :loading="loading"
            @click="handleSendEmail"
          />

          <div class="flex items-center gap-4 my-4">
            <div class="h-[1px] flex-1 bg-gray-200" />
            <span class="text-gray-500 body-medium">OR</span>
            <div class="h-[1px] flex-1 bg-gray-200" />
          </div>

          <div class="flex grow items-center gap-4 w-full">
            <TButton variant="dark" class="flex-1 !rounded-full py-5" @click="handleAppleLogin">
              <template #default>
                <img src="@/assets/icons/apple-icon.svg" alt="Apple" class="w-[24px] h-[24px]">
              </template>
            </TButton>

            <TButton variant="dark" class="flex-1 !rounded-full py-5" @click="handleGoogleLogin">
              <template #default>
                <img src="@/assets/icons/google-icon.svg?inline" alt="Google" class="w-[24px] h-[24px]">
              </template>
            </TButton>
          </div>

          <p class="text-center label text-te-secondary my-8 opacity-50 leading-7">
            By continuing, your agree to TenantEvaluation's
            <a href="#"><b>Privacy policy</b></a> and
            <a href="#"><b>Terms of service</b></a>
          </p>
        </div>
      </div>

      <div v-else class="flex flex-col items-center gap-6">
        <div class="text-center">
          <div class="flex items-center justify-center mb-6">
            <img src="@/assets/icons/mail.svg" alt="Email" class="w-[23px] h-[18px]">
          </div>
          <h2 class="text-medium mb-2">To continue, click the link sent to</h2>
          <p class="text-medium mb-6"><b>{{ state.email }}</b></p>
          <p v-if="countdown > 0" class="body-large text-gray-600">
            Request New Link in {{ countdown }}s seconds
          </p>
          <TButton
            v-else
            label="Send Another Email"
            variant="pink"
            class="w-full !rounded-full py-[1.2rem] px-[1.6rem] button-large"
            :loading="loading"
            @click="handleSendEmail"
          />
        </div>

        <div class="w-full h-[1px] bg-gray-200 my-6" />

        <button
          class="button-large mb-6"
          @click="goBack"
        >
          Back to login
        </button>
      </div>
    </div>
  </ion-modal>
</template>

<script setup lang="ts">
import { ref, reactive, defineEmits } from 'vue'
import { IonModal } from '@ionic/vue'
import { useVuelidate } from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'
import { useAuth } from '@/composables/useAuth'
import TInput from '@/components/TInput.vue'
import TButton from '@/components/TButton.vue'
import mailIcon from '@/assets/icons/mail.svg'
import { Vue3Lottie } from 'vue3-lottie'
import sparksLottie from '@/data/sparks-lottie.json'

const loading = ref(false)
const emailSent = ref(false)
const { login } = useAuth()

const state = reactive({
  email: ''
})

const rules = {
  email: { required, email }
}

defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits(['closeModal'])

const v$ = useVuelidate(rules, state)

const countdown = ref(30)
let countdownInterval: number | null = null

const startCountdown = () => {
  countdown.value = 30
  if (countdownInterval) clearInterval(countdownInterval)
  countdownInterval = window.setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--
    } else {
      if (countdownInterval) clearInterval(countdownInterval)
    }
  }, 1000)
}

/* const resetForm = () => {
  state.email = ''
  emailSent.value = false
  v$.value.$reset()
} */
const closeModal = () => {
  emit('closeModal')
}

const goBack = () => {
  emailSent.value = false
  emit('closeModal')
}

const handleSendEmail = async () => {
  const isValid = await v$.value.email.$validate()
  if (!isValid) return

  try {
    loading.value = true
    await login(state.email)
    emailSent.value = true
    startCountdown()
  } catch (error) {
    console.error('[LoginInputs] Error sending email:', error)
  } finally {
    loading.value = false
  }
}

const handleProviderRedirect = (provider: 'apple' | 'google') => {
  emit('closeModal')
  console.log(`[LoginInputs] Redirecting to ${provider} login`)
  window.location.href = `https://auth-qa.tenantev.dev/oauth2/authorization/${provider}`
}

const handleAppleLogin = () => handleProviderRedirect('apple')
const handleGoogleLogin = () => handleProviderRedirect('google')
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

.property-selector-modal {
  --height: auto;
  --max-height: 95%;
  --width: 100%;
  --border-radius: 24px;

  :deep(.ion-page) {
    border-radius: var(--border-radius);
    background: white;
    position: relative;
    padding: 1.5rem 0;
  }
}
</style>
