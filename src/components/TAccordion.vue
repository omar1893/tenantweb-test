<template>
  <Accordion :multiple="multiple" class="t-accordion">
    <AccordionPanel v-for="(item, index) in items" :key="index" :value="item.header">
      <AccordionHeader class="button-small">
        {{ item.header }}
      </AccordionHeader>
      <AccordionContent>
        <ul class="space-y-2 text-left">
          <li v-for="(requirement, reqIndex) in item.content" :key="reqIndex" class="text-white/80">
            {{ requirement }}
          </li>
        </ul>
      </AccordionContent>
    </AccordionPanel>
  </Accordion>
<!--     <Accordion
      :multiple="multiple"
      :activeIndex="activeIndex"
      class="t-accordion"
    >
      <AccordionTab
        v-for="(item, index) in items"
        :key="index"
        :header="item.header"
        :disabled="item.disabled"
      >
        <template #header>
          <span class="flex align-items-center gap-2">
            <i v-if="item.icon" :class="item.icon" />
            {{ item.header }}
          </span>
        </template>
        <template #default>
          <div v-if="Array.isArray(item.content)" class="space-y-2">
            <p v-for="(text, idx) in item.content" :key="idx">{{ text }}</p>
          </div>
          <p v-else>{{ item.content }}</p>
        </template>
      </AccordionTab>
    </Accordion> -->
</template>

<script setup lang="ts">
import Accordion from 'primevue/accordion'
import AccordionPanel from 'primevue/accordionpanel'
import AccordionHeader from 'primevue/accordionheader'
import AccordionContent from 'primevue/accordioncontent'

interface AccordionItem {
  header: string
  content: string[]
  disabled?: boolean
}

interface Props {
  items: AccordionItem[]
  multiple?: boolean
}

defineProps<Props>()
</script>

<style scoped lang="scss">
.t-accordion {
  @apply w-full;
  background-color: #171717;
  border-radius: 1.6rem;
  overflow: hidden;
}

:deep(.p-accordionheader), :deep(.p-accordioncontent-content), :deep(.p-icon.p-accordionheader-toggle-icon) {
    background-color: transparent!important;
    color: #ffffff!important;
}

:deep(.p-accordionpanel) {
    border: none!important;
}

:deep(.p-accordion-header-link) {
    padding: 1rem;
    font-weight: 500;
}

:deep(.p-accordion-content) {
    padding: 1rem;
}
</style>
