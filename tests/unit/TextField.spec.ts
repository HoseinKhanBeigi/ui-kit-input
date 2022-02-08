import { shallowMount } from '@vue/test-utils'
import { VInput } from '@/Vinput/VInput'

// describe('VSelect.tsx', () => {
//     it('renders props.msg when passed', () => {
//         const msg = 'new message'
//         const wrapper = shallowMount(VInput, {
//             props: { msg }
//         })
//         expect(wrapper.text()).toMatch(msg)
//     })
// })


describe('VInput.tsx', () => {
    it('is disabled when disabled=true', async () => {
        const wrapper = shallowMount(VInput, {
            props: {
                disabled: true,
            },
        })
        const $input = wrapper.find('input')
        expect($input.attributes('disabled')).toBeDefined()
        expect($input.element.disabled).toBe(true)
    })
})
