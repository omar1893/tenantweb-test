<template>
  <div class="chatbot-component">
    <div v-if="component.type === EAgentComponentType.MULTIPLE_BUTTONS" class="chatbot-component-multiple-buttons">
      <div v-for="(item, index) in component.items" :key="`multiple-buttons-${index}`" class="chatbot-component-multiple-buttons-item">
        <button
          class="chatbot-component-multiple-buttons-item-button"
          @click="onActionClick(item)"
        >
          {{ item.label }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAgentStore } from '@/stores/agentStore'
import type { IAgentComponent, IAgentComponentItem } from '@/types/agent.d'
import { EAgentComponentType, EAgentComponentActionType } from '@/enums/agent'

const agentStore = useAgentStore()

defineProps<{
  component: IAgentComponent
}>()

const onActionClick = (item: IAgentComponentItem) => {
  switch (item.action.type) {
    case EAgentComponentActionType.COMMAND:
      agentStore.sendCommand(item.action, item.action.showMessage ? item.label : undefined)
      break
    default:
      console.error('Unknown action type', item.action.type)
      break
  }
}
</script>

<style scoped lang="scss">
.chatbot-component {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.chatbot-component-multiple-buttons {
  display: flex;
  flex-direction: row;
  gap: 1rem;

  &-item {
    flex: 1;

    &-button {
      width: 100%;
      height: 100%;
      border-radius: 50rem;
      background-color: #c6c6c6;
      font-size: 1.2rem;
      font-weight: 600;
      padding: 1.2rem 1rem;
      border: none;
    }
  }
}
</style>
