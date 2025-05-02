<template>
  <InputText
    :class="inputClass"
    :type="type"
    :disabled="disabled"
    :placeholder="placeholder"
    :modelValue="modelValue"
    @update:modelValue="(value: string | undefined) => emit('update:modelValue', value)"
    @focus="(e: FocusEvent) => emit('focus', e)"
    @blur="(e: FocusEvent) => emit('blur', e)"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import InputText from 'primevue/inputtext'

interface Props {
  type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url'
  disabled?: boolean
  placeholder?: string
  modelValue?: string
  class?: string
  size?: 'small' | 'normal' | 'large'
}

const emit = defineEmits<{
  'update:modelValue': [value: string | undefined]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
  size: 'normal'
})

const inputClass = computed(() => {
  const classes = ['t-input']
  
  if (props.class) {
    classes.push(props.class)
  }

  return classes.join(' ')
})
</script>

<style lang="scss">
.p-inputtext {
  @apply w-full rounded-full border-gray-200 focus:ring-2 focus:ring-pink-200 focus:border-pink-200;
  
  &:disabled {
    @apply opacity-50 cursor-not-allowed;
  }
}
</style>
