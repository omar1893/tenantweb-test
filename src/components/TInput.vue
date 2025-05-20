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
  display: flex;
flex-direction: column;
padding: 14px 16px;
justify-content: center;
align-items: center;
gap: 13px;
align-self: stretch;
border-radius: 10px!important;
border: 2px solid #726B7C;

&:focus {
    border: 2px solid;
    border-color: #726B7C!important;
  }
}
</style>
