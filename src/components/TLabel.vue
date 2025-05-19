<template>
  <div class="t-label">
    <span>{{ label }}: {{ copyValue }}</span>
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

const copyToClipboard = async () => {
  if (props.copyValue) {
    await navigator.clipboard.writeText(props.copyValue)
    // Optionally, show a toast or feedback
  }
}

const shareValue = async () => {
  if (navigator.share && props.copyValue) {
    try {
      await navigator.share({
        title: props.label,
        text: `${props.label}: ${props.copyValue}`
      })
    } catch (e) {
      // Optionally, handle error or cancellation
    }
  } else {
    // Optionally, fallback or show message
  }
}
</script>

<style scoped lang="scss">
.t-label {
    font-size: 18px;
    font-weight: 600;
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
