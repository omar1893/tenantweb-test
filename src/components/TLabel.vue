<template>
  <div class="t-label">
    <span class="button-large">{{ label }}: {{ copyValue }}</span>
    <img
      src="@/assets/icons/clone-icon.svg?inline"
      alt="Copy"
      class="icon"
      style="cursor:pointer"
      @click="copyToClipboard"
    >
    <img
      src="@/assets/icons/share-icon.svg?inline"
      alt="Share"
      class="icon"
      style="cursor:pointer"
      @click="shareValue"
    >
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    label: string,
    copyValue?: string
}>()

const emit = defineEmits<{
  'copy-success': []
}>()

const copyToClipboard = async () => {
  if (props.copyValue) {
    await navigator.clipboard.writeText(props.copyValue)
    emit('copy-success')
  }
}

const shareValue = async () => {
  const shareUrl = window.location.href

  if (navigator.share) {
    try {
      await navigator.share({
        title:'Property Details',
        text: 'Please follow the link to begin your application for this property:',
        url: shareUrl
      })
    } catch (e) {
      console.log('Share failed:', e)
    }
  } else {
    // Fallback to copy if share is not available
    await navigator.clipboard.writeText(shareUrl)
    emit('copy-success')
  }
}
</script>

<style scoped lang="scss">
.t-label {
    color: #23222A;
    padding: 0.6rem 1.2rem;
    border-radius: 0.8rem;
    background-color: #FFFFFF;
    display: flex;
    align-items: center;
    gap: 0.8rem;
}
.icon {
    width: 1.6rem;
    height: 1.6rem;
    display: inline-block;
}
</style>
