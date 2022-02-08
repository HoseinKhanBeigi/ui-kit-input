import { shallowMount } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import HelloWorld from '@/components/HelloWorld.vue'

// describe('HelloWorld.vue', () => {
//   it('renders props.msg when passed', () => {
//     const msg = 'new message'
//     const wrapper = shallowMount(HelloWorld, { 
//       props: { msg }
//     })
//     expect(wrapper.text()).toMatch(msg)
//   })
// })

test('displays message', () => {
  const wrapper = mount(HelloWorld, {
    props: {
      msg: 'Hello world'
    }
  })
  expect(wrapper.text()).toContain('Hello world')
})
