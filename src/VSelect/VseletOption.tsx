import { defineComponent } from "vue";

export default defineComponent({
  name: "VSelectOption",
  props: {
    value: { required: true },
    disabled: { type: Boolean, default: false },
  },

  setup(props: any, { slots }: any) {
    return () => (
      <div>
        <option value={props.value ?? ""} disabled={props.disabled}>
          <div>{slots.default()}</div>
        </option>
      </div>
    );
  },
});
