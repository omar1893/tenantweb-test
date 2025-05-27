<template>
  <Button
    :class="buttonClass"
    :type="type"
    :disabled="disabled"
    :loading="loading"
    :icon="icon"
    :icon-pos="iconPos"
    :label="label"
    :severity="variant"
    @click="(e: MouseEvent) => emit('click', e)"
    @focus="(e: FocusEvent) => emit('focus', e)"
    @blur="(e: FocusEvent) => emit('blur', e)"
  >
    <slot />
  </Button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Button from 'primevue/button'

  interface Props {
    // Button variants
    variant?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'help' | 'danger' | 'white' | 'dark' | 'pink' | 'text'
    // Button sizes
    size?: 'small' | 'normal' | 'large'
    // Custom classes
    class?: string
    // Button type
    type?: 'button' | 'submit' | 'reset'
    // Disabled state
    disabled?: boolean
    // Loading state
    loading?: boolean
    // Icon props
    icon?: string
    iconPos?: 'left' | 'right'
    // Button label
    label?: string
  }

// Define emits
const emit = defineEmits<{
    click: [event: MouseEvent]
    focus: [event: FocusEvent]
    blur: [event: FocusEvent]
  }>()

// Define props with defaults
const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'normal',
  type: 'button',
  disabled: false,
  loading: false,
  iconPos: 'left'
})

// Compute classes based on variant and size
const buttonClass = computed(() => {
  const classes = ['t-button']

  /* switch (props.size) {
      case 'small':
        classes.push('button-small px-3 py-1')
        break
      case 'normal':
        classes.push('button-large px-4 py-2')
        break
      case 'large':
        classes.push('button-large px-6 py-3')
        break
    } */

  if (props.class) {
    classes.push(props.class)
  }

  if (props.loading) {
    classes.push('loading')
  }

  return classes.join(' ')
})
</script>

  <style lang="scss" scoped>
  .p-button {
    padding: 1.6rem;
    &.p-button-white {
      overflow: visible;
      border: none;
      background-color: var(--te-light);
      color: var(--te-secondary);
    }

    &.p-button-dark {
      overflow: visible;
      background-color: var(--te-secondary);
      color: var(--te-light);
      border: none;
    }

    &.p-button-pink {
      overflow: visible;
      background: radial-gradient(398.51% 296.03% at 40.13% -147.32%, #FFD0CA 0%, #FFEBF0 100%);
      color: var(--te-secondary);
      border: none;
    }

    &.p-button-text {
      background: transparent!important;
      border: none;
      @apply text-white !py-[1.4rem];
    }

    .pi {
        font-size: inherit;
    }
   }

  /* .p-button {
    // Apply severity styles
    &.p-button-primary {
      @apply bg-blue-600 text-white hover:bg-blue-700;
    }

    &.p-button-secondary {
      @apply bg-gray-100 text-gray-900 hover:bg-gray-200;
    }

    &.p-button-success {
      @apply bg-green-600 text-white hover:bg-green-700;
    }

    &.p-button-info {
      @apply bg-blue-400 text-white hover:bg-blue-500;
    }

    &.p-button-warning {
      @apply bg-yellow-500 text-white hover:bg-yellow-600;
    }

    &.p-button-help {
      @apply bg-purple-500 text-white hover:bg-purple-600;
    }

    &.p-button-danger {
      @apply bg-red-600 text-white hover:bg-red-700;
    }

    // States
    &:disabled {
      @apply opacity-50 cursor-not-allowed;
    }

    &.loading {
      @apply cursor-wait;
    }

    // Remove PrimeVue's focus styles
    &:focus {
      box-shadow: none;
    }

    // Remove PrimeVue's active styles
    &:active {
      box-shadow: none;
    }

    // Handle icon styles
  } */
  </style>