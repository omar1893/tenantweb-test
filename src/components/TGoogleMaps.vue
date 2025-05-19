<template>
    <label class="t-label">
        <img
            src="@/assets/icons/google-maps.svg?inline"
            alt="Google maps icon"
            class="logo"
        >
        See on Google Maps
    </label>
</template>

<script setup lang="ts">
defineProps<{
    label: string,
    address: string
}>()
</script>

<style scoped lang="scss">
.t-label {
    font-size: 14px;
    font-weight: 600;
    color: #000000;
    padding: 0.4rem 2rem;
    border-radius: 0.5rem;
    background-color: #FFFFFF;
    border-radius: 1.2rem;
    display: flex;
    align-items: center;
    gap: 0.8rem;
}
</style>