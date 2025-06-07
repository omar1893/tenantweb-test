<template>
  <div class="chatbot-component button-small">
    <div
      v-if="quickAction.component === EAgentQuickActionComponent.MULTIPLE_CHOICE || quickAction.component === EAgentQuickActionComponent.MULTIPLE_CHOICE_PLATINUM"
      class="chatbot-component-multiple-choice"
      :class="{ 'platinum': quickAction.component === EAgentQuickActionComponent.MULTIPLE_CHOICE_PLATINUM }"
    >
      <div v-for="(item, index) in quickAction.options" :key="`multiple-choice-${index}`" class="chatbot-component-multiple-choice-item">
        <button
          class="chatbot-component-multiple-choice-item-button"
          :class="{ 'orange button-large': item.style === 'Orange', 'empty': item.style === 'Empty' }"
          @click="onActionClick(item)"
        >
          {{ item.value }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAgentStore } from '@/stores/AgentStore'
import type { IAgentQuickActionData, IAgentQuickActionItem } from '@/types/agent.d'
import { EAgentQuickActionComponent, EAgentQuickActionAction } from '@/enums/agent'
import { onMounted } from 'vue'

const agentStore = useAgentStore()

const props = defineProps<{
  quickAction: IAgentQuickActionData
}>()

const onActionClick = (item: IAgentQuickActionItem) => {
  switch (item.action) {
    case EAgentQuickActionAction.COMMAND:
      agentStore.sendCommand(item, item.showMessage ? item.value : undefined)
      break
    default:
      console.error('Unknown action type', item.action)
      break
  }
}

onMounted(() => {
  console.log('Quick action', props.quickAction)
})
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

  &.platinum {
    flex-direction: column;
    width: 100%;
  }

  &-item {
    flex: 1;

    &-button {
      width: 100%;
      height: 100%;
      border-radius: 50rem;
      padding: 1.2rem 1.6rem 1.2rem 1.6rem;
      border: 1px solid var(--te-light);
      background-color: #3F39490F;

      &.orange {
        background: linear-gradient(to right, #FF5148, #FF7E6A);
        padding: 1.6rem;
        color: white;
        border: none;
      }

      &.empty {
        background-color: transparent;
        border: none;
        color: var(--te-dark);
      }
    }
  }
}
</style>
