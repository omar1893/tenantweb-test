<template>
  <ion-modal
    :is-open="uiStore.loginModalVisible"
    :initial-breakpoint="1"
    :breakpoints="[0, 1]"
    class="bottom-modal"
    @did-dismiss="closeModal"
  >
    <div class="flex flex-col gap-6 p-6">
      <div class="flex justify-between items-center">
        <i class="pi pi-times text-xl cursor-pointer" @click="closeModal" />
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

  <!-- Property Selector Modal -->
  <ion-modal
    :is-open="showPropertySelector"
    :initial-breakpoint="0.95"
    :breakpoints="[0, 0.95]"
    class="property-selector-modal"
    @did-dismiss="showPropertySelector = false"
  >
    <div class="p-6">
      <div class="flex justify-between items-center mb-8">
        <h2 class="text-2xl font-semibold">Select Property</h2>
        <i class="pi pi-times text-xl cursor-pointer" @click="showPropertySelector = false" />
      </div>

      <div class="flex flex-col gap-4 pb-6">
        <button
          v-for="property in properties"
          :key="property.id"
          class="w-full text-left px-6 py-5 rounded-2xl hover:bg-gray-100 transition-colors text-lg"
          :class="{ 'bg-gray-100': selectedPropertyId === property.id }"
          @click="selectProperty(property.id)"
        >
          {{ property.name }}
        </button>
        <button
          class="w-full text-left px-6 py-5 rounded-2xl hover:bg-gray-100 transition-colors text-lg"
          :class="{ 'bg-gray-100': selectedPropertyId === null }"
          @click="selectProperty(null)"
        >
          No Property (Go to Chatbot)
        </button>
      </div>
    </div>
  </ion-modal>
</template>

<script setup lang="ts">
import { ref, reactive, onUnmounted, onMounted } from 'vue'
import { IonModal } from '@ionic/vue'
import { useVuelidate } from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'
import { authService } from '@/services/auth.service'
import { useUIStore } from '@/stores/UIStore'
import { useRouter } from 'vue-router'
import TInput from '@/components/TInput.vue'
import TButton from '@/components/TButton.vue'

const router = useRouter()
const loading = ref(false)
const emailSent = ref(false)
const uiStore = useUIStore()
const showPropertySelector = ref(false)

const properties = [
  { id: '14791', name: 'Property 14791' },
  { id: '14795', name: 'Property 14795' },
  { id: '14798', name: 'Property 14798' },
  { id: '14766', name: 'Property 14766' }
]

const selectedPropertyId = ref<string | null>(localStorage.getItem('selectedPropertyId'))

const selectProperty = (propertyId: string | null) => {
  selectedPropertyId.value = propertyId
  if (propertyId) {
    localStorage.setItem('selectedPropertyId', propertyId)
  } else {
    localStorage.removeItem('selectedPropertyId')
  }
  showPropertySelector.value = false
}

const state = reactive({
  email: ''
})

const rules = {
  email: { required, email }
}

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

onUnmounted(() => {
  if (countdownInterval) clearInterval(countdownInterval)
})

const closeModal = () => {
  uiStore.hideLoginModal()
  resetForm()
}

const resetForm = () => {
  state.email = ''
  emailSent.value = false
  v$.value.$reset()
}

const goBack = () => {
  emailSent.value = false
}

const handleSendEmail = async () => {
  const isValid = await v$.value.email.$validate()
  if (!isValid) return

  try {
    loading.value = true
    const success = await authService.sendPasswordlessEmail(state.email)
    if (success) {
      emailSent.value = true
      startCountdown()
    }
  } catch (error) {
    console.error('Error sending email:', error)
  } finally {
    loading.value = false
  }
}

const handleLoginSuccess = () => {
  uiStore.hideLoginModal()
  resetForm()
  if (selectedPropertyId.value) {
    router.push('/property-video')
  } else {
    router.push('/chatbot')
  }
}

const handleAppleLogin = async () => {
  try {
    loading.value = true
    await authService.initiateProviderLogin('apple')
  } catch (error) {
    console.error('Apple login error:', error)
  } finally {
    loading.value = false
  }
}

const handleGoogleLogin = async () => {
  try {
    loading.value = true
    await authService.initiateProviderLogin('google')
  } catch (error) {
    console.error('Google login error:', error)
  } finally {
    loading.value = false
  }
}

const handleAuthCallback = async () => {
  try {
    const url = window.location.href
    if (url.includes('auth-verify')) {
      loading.value = true
      await authService.handleProviderCallback(url)
      handleLoginSuccess()
    }
  } catch (error) {
    console.error('Auth callback error:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  const savedPropertyId = localStorage.getItem('selectedPropertyId')
  if (savedPropertyId) {
    selectedPropertyId.value = savedPropertyId
  }

  handleAuthCallback()
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
