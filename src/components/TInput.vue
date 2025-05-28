<template>
  <InputText
    :class="[inputClass, { 'p-invalid': error }]"
    :type="type"
    :disabled="disabled"
    :placeholder="placeholder"
    :modelValue="modelValue"
    @update:modelValue="(value: string | undefined) => emit('update:modelValue', value)"
    @focus="(e: FocusEvent) => emit('focus', e)"
    @blur="(e: FocusEvent) => emit('blur', e)"
  />
  <small v-if="error && errorMessage" class="p-error">{{ errorMessage }}</small>
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
  error?: boolean
  errorMessage?: string
}

const emit = defineEmits<{
  'update:modelValue': [value: string | undefined]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
  size: 'normal',
  error: false,
  errorMessage: ''
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
  display: flex;
  flex-direction: column;
  padding: 1.4rem 1.6rem;
  justify-content: center;
  align-items: center;
  gap: 13px;
  align-self: stretch;
  border-radius: 10px!important;
  border: 2px solid #726B7C;
  height: 5.2rem;

  &.p-invalid {
    border-color: var(--red-500)!important;
  }

  &:focus {
    border: 2px solid;
    border-color: #726B7C!important;
  }

  &::placeholder {
    color: var(--te-medium)!important;
    font-weight: 400!important;
  }
}

.p-error {
  color: var(--red-500);
  margin-top: 0.25rem;
  font-size: 0.875rem;
}
</style>
