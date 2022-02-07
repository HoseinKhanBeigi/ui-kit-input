import { defineComponent } from "vue";

export const VSelectoption = defineComponent({
  name: "VSelectoption",
  props: {
    value: { required: true },
    name: { required: false },
    disabled: { type: Boolean, default: false },
  },

  setup(props: any, { slots }: any) {
    console.log("hi im from vselectoptio")
    console.log(props, "propssss");

    return () => (
      <option value={props.value ?? ""} disabled={props.disabled}>
        {slots.default?.()}
      </option>
    );
  },
});
