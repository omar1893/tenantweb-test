import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUIStore = defineStore('ui', () => {
  const loginModalVisible = ref(false)

  const showLoginModal = () => {
    loginModalVisible.value = true
  }

  const hideLoginModal = () => {
    loginModalVisible.value = false
  }

  return {
    loginModalVisible,
    showLoginModal,
    hideLoginModal
  }
}) 