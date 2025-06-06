<template>
  <div class="rounded-xl bg-white shadow p-6 w-full max-w-4xl mx-auto text-te-secondary fee-component">
    <!-- Application Type -->
    <div class="flex justify-between mb-4 te-text-sm">
      <span>Application Type</span>
      <span class="font-medium">{{ properties.applicationType }}</span>
    </div>

    <!-- Adults charged -->
    <div class="flex justify-between mb-4 te-text-sm">
      <span>Adults charged</span>
      <span class="font-medium">{{ properties.adultsChargedForBaseFee }}</span>
    </div>

    <!-- Application Fee -->
    <div class="flex justify-between mb-4 te-text-sm">
      <span>Application Fee</span>
      <span class="font-medium">${{ properties.feeSubtotal }}</span>
    </div>

    <!-- Expedite Fee -->
    <div class="flex justify-between mb-4 te-text-sm">
      <span>Expedite Fee</span>
      <span class="font-medium">${{ properties.tenatExpediteFee }}</span>
    </div>

    <hr class="my-6 opacity-20">

    <!-- Total -->
    <div class="flex justify-between items-center te-text-base">
      <span class="font-semibold">Total</span>
      <span class="font-bold">${{ totalAmount }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface IProps {
  properties: {
    applicationType: string
    adultsChargedForBaseFee: number
    applicationFeeDescription: string
    feeSubtotal: number
    finalTotalWithOptional: number
    profilingDescription: string
    tenatExpediteFee: number
  }
}

const props = defineProps<IProps>()

const totalAmount = computed(() => {
  return props.properties.feeSubtotal + props.properties.tenatExpediteFee
})
</script>
