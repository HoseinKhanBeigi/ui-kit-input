import { defineComponent, computed } from "vue";
import { normalizeOptions } from "../features2/composables/useFormSelect";
import VseletOption from "./VseletOption";

export default defineComponent({
  name: "VSelectOptionGroup",
  components: { VseletOption },
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
      normalizeOptions(props.options, "VSelectOptionGroup", props)
    );
    return () => (
      <optgroup label={props.label}>
        {slots.name()}

        {[1, 2, 3].map((option: any, index: Number) => {
          return (
            <VseletOption
              //   v-for="(option, index) in formOptions"
              key={`option_${index}`}
              value={option.value}
              disabled={option.disabled}
              //   v-bind="$attrs"
              //   v-html="option.html || option.text"
            />
          );
        })}
        {slots.default()}
      </optgroup>
    );
  },
});
