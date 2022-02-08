import { defineComponent } from "vue";

export const Test =  defineComponent({
  name: "Test",
  props: {
    name: { required: false },
  },
  setup(props: any, { slots }: any) {
    return () => <div>hello test</div>;
  },
});
