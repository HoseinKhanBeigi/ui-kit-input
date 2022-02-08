import { defineComponent } from "vue";

export const VSelectoption = defineComponent({
  name: "VSelectoption",
  props: {
    value: { required: true },
    name: { required: false },
    disabled: { type: Boolean, default: false },
  },

  setup(props: any, { slots }: any) {
    return () => (
      <option value={props.value ?? ""} disabled={props.disabled}>
        {slots.default?.()}
      </option>
    );
  },
});
