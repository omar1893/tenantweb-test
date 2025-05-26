import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PropertyLanding from '../../src/views/PropertyLanding/PropertyLanding.vue'

describe('PropertyLanding.vue', () => {
  it('renders property name', async () => {
    const wrapper = mount(PropertyLanding, {
      global: {
        stubs: ['TAccordion', 'TLabel', 'TGoogleMaps', 'TButton'],
      }
    })
    if (wrapper.vm.$.exposed) {
      wrapper.vm.$.exposed.state.loading = false
      wrapper.vm.$.exposed.state.property = { name: 'Test Property', address: { street: '', city: '', state: '', zip_code: '' }, configuration: [] }
    }
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('Test Property')
  })

  it('matches snapshot', async () => {
    const wrapper = mount(PropertyLanding, {
      global: {
        stubs: ['TAccordion', 'TLabel', 'TGoogleMaps', 'TButton'],
      }
    })
    if (wrapper.vm.$.exposed) {
      wrapper.vm.$.exposed.state.loading = false
      wrapper.vm.$.exposed.state.property = { name: 'Test Property', address: { street: '', city: '', state: '', zip_code: '' }, configuration: [] }
    }
    await wrapper.vm.$nextTick()
    expect(wrapper.html()).toMatchSnapshot()
  })
})
