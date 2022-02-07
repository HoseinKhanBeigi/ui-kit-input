import { defineComponent, computed } from "vue";
import { normalizeOptions } from "../features2/composables/useFormSelect";
import { VSelectoption } from "./VSelectoption";

export const VSelectoptiongroup =  defineComponent({
  name: "VSelectoptiongroup",
  components: { VSelectoption },
  props: {
    label: { type: String, required: true },
    disabledField: { type: String, default: "disabled" },
    htmlField: { type: String, default: "html" },
    options: { type: [Array, Object], default: () => [] },
    textField: { type: String, default: "text" },
    valueField: { type: String, default: "value" },
  },
  setup(props: any, { slots }: any) {
    const formOptions = computed(() =>
      normalizeOptions(props.options, "VSelectoptiongroup", props)
    );
    return () => (
      <optgroup label={props.label}>
        {slots.name?.()}
        {formOptions.value.map((option: any, index: Number) => {
          return (
            <VSelectoption
              key={`option_${index}`}
              value={option.value}
              disabled={option.disabled}
              //   v-bind="$attrs"
              //   v-html="option.html || option.text"
            />
          );
        })}
        {slots.default?.()}
      </optgroup>
    );
  },
});
