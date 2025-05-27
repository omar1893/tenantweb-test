<template>
  <div class="flex flex-col h-screen relative">
    <div class="flex-1 overflow-y-auto p-6 pb-24 flex flex-col gap-3">
      <div
        v-for="(msg, i) in messages"
        :key="i"
        class="chat-message"
        :class="msg.from === 'bot' ? 'bot body-large' : 'user body-medium'"
      >
        <span>{{ msg.text }}</span>
      </div>
    </div>
    <div class="absolute left-0 right-0 bottom-0 bg-white flex items-center px-4 py-3 gap-2 border-t border-gray-200">
      <button class="bg-gray-100 rounded-full w-9 h-9 flex items-center justify-center text-xl">+</button>
      <input
        v-model="input"
        class="flex-1 border-none outline-none text-base bg-transparent px-3"
        type="text"
        placeholder="Ask me anything"
        @keyup.enter="send"
      >
      <button class="bg-gray-100 rounded-full w-9 h-9 flex items-center justify-center text-xl" @click="send">⮞</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const messages = ref([
  { from: 'bot', text: 'Hi there! Last time you were applying for La Perla, and you left off on watching the Property Requirements.' },
  { from: 'bot', text: 'Would you like to continue with this application? Or would you like to start a new one?' },
  { from: 'user', text: 'New application' },
  { from: 'bot', text: 'Please enter the 4-5 digit property code to get started' },
  { from: 'user', text: '3545' }
])

const input = ref('')

function send() {
  if (input.value.trim()) {
    messages.value.push({ from: 'user', text: input.value })
    input.value = ''
    // Aquí puedes agregar lógica para respuesta del bot
  }
}
</script>

<style scoped lang="scss">
.chat-message {
  max-width: 80%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  margin-bottom: 0.25rem;
  border: none
}

.bot {
  align-self: flex-start;

}

.user {
  align-self: flex-end;
  background: var(--te-light, #fdd5d1);
  padding: 1.2rem 1.6rem 1.2rem 2rem;
  border: 1px solid #3F39491A;
  border-radius: 4rem 2rem 0.6rem 4rem;
  background-color: #FFFFFF7A;
}
</style>
