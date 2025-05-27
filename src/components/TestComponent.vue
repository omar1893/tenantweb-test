<template>
  <div>
    <div class="test-component-card">
      <div class="test-component-card-header">
        <h3>Test Component</h3>
      </div>
      <div class="test-component-card-body">
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
.test-component-card {
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #3F39491A;
}

.test-component-card-header {
  font-weight: 600;
  font-size: 1.2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.test-component-card-body {
  font-size: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
</style>
