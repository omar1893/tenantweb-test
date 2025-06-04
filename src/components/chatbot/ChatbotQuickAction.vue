<template>
  <div class="chatbot-component">
    <div v-if="quickAction.component === EAgentQuickActionComponent.MULTIPLE_CHOICE" class="chatbot-component-multiple-choice">
      <div v-for="(item, index) in quickAction.items" :key="`multiple-choice-${index}`" class="chatbot-component-multiple-choice-item">
        <button
          class="chatbot-component-multiple-choice-item-button"
          @click="onActionClick(item)"
        >
          {{ item.label }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAgentStore } from '@/stores/AgentStore'
import type { IAgentQuickActionData, IAgentQuickActionItem } from '@/types/agent.d'
import { EAgentQuickActionComponent, EAgentQuickActionAction } from '@/enums/agent'

const agentStore = useAgentStore()

defineProps<{
  quickAction: IAgentQuickActionData
}>()

const onActionClick = (item: IAgentQuickActionItem) => {
  switch (item.action) {
    case EAgentQuickActionAction.COMMAND:
      agentStore.sendCommand(item, item.showMessage ? item.label : undefined)
      break
    default:
      console.error('Unknown action type', item.action)
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

.chatbot-component-multiple-choice {
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
