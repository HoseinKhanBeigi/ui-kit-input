<template>
  <optgroup :label="label">
    <slot name="first" />
    <!-- eslint-disable vue/no-v-html -->
    <b-form-select-option
      v-for="(option, index) in formOptions"
      :key="`option_${index}`"
      :value="option.value"
      :disabled="option.disabled"
      v-bind="$attrs"
      v-html="option.html || option.text"
    />
    <!--eslint-enable-->
    <slot />
  </optgroup>
</template>

<script lang="ts">
import {computed, defineComponent} from 'vue'
import VSelectOption from './VSelectOption.vue'
import {normalizeOptions} from '../features/composables/useFormSelect'

export default defineComponent({
  name: 'VSelectOptionGroup',
  components: {VSelectOption},
  props: {
    label: {type: String, required: true},
    disabledField: {type: String, default: 'disabled'},
    htmlField: {type: String, default: 'html'},
    options: {type: [Array, Object], default: () => []},
    textField: {type: String, default: 'text'},
    valueField: {type: String, default: 'value'},
  },
  setup(props) {
    const formOptions = computed(() =>
      normalizeOptions(props.options as any, 'VSelectOptionGroup', props)
    )

    return {
      formOptions,
    }
  },
})
</script>
