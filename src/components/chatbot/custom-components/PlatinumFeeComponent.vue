<template>
  <div class="platinum-service-card">
    <!-- Best option badge -->
    <div class="best-option-badge ml-8 text-te-light button-small">
      Best option
    </div>

    <!-- Header -->
    <div class="header flex flex-row justify-between items-center text-te-light">
      <div class="title-section">
        <h2 class="text-medium">Platinum Service</h2>
        <p class="label-subtitle">Fastest Application Processing</p>
      </div>
      <div class="avatar">
        <img src="@/assets/call-center-lady.svg" alt="Call center lady" class="w-[46px] h-[50px]">
      </div>
    </div>

    <!-- Main content -->
    <div class="content text-te-secondary">
      <h3 class="mb-4 button-small">It becomes our top priority!</h3>

      <p class="mb-6 label">
        With this exclusive service, your application won't just be
        another number - Ensure you get that swift completion
        you urgently need.
      </p>

      <!-- Main benefits -->
      <div class="benefits-section">
        <h4 class="mb-4 label-subtitle">You will get</h4>
        <ul class="mb-6 label">
          <li>24h application processing time</li>
          <li>Priority document and background processing</li>
          <li>Express Verifications</li>
        </ul>
      </div>

      <!-- Exclusive bonus -->
      <div class="bonus-section">
        <h4 class="mb-4 ml-2 label-subtitle flex items-center gap-2">
          <img src="@/assets/icons/star-orange.svg" alt="Star" class="w-[16px] h-[16px]">
          Exclusive bonus
        </h4>
        <ul class="mb-6 label">
          <li>Dedicated phone line support</li>
          <li>Instant copy of your final report</li>
          <li>Money back guaranteed</li>
        </ul>
      </div>

      <!-- Disclaimer -->
      <p class="disclaimer note">
        This service is optional: As part of the application process, applicants are
        required to pay an application fee associated with the property.
      </p>

      <!-- See more button -->
      <button class="see-more">
        See more
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface IProps {
  properties?: {
    // Add any properties that might be needed
  }
}

defineProps<IProps>()
</script>

<style scoped>
.best-option-badge {
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
  padding: 0.6rem 2rem;
  background: linear-gradient(to right, #FF5148 0%, #FF7E6A 100%);
  width: fit-content;
}

.header {
  background-color: #2E2939;
  border-radius: 2rem;
  padding: 1.6rem 1.6rem 3rem 1.6rem;
}

.content {
  background-color: var(--te-light);
  border-radius: 1.6rem;
  padding: 1.2rem 1.6rem;
  margin-top: -2.6rem;
}

ul {
  list-style: none;
  padding-left: 0;
}

li {
  position: relative;
  padding-left: 2rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
}

li::before {
  content: '';
  position: absolute;
  left: 0;
  width: 14px;
  height: 14px;
  background-image: url('@/assets/icons/checkmark.svg');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
</style>
