import { defineComponent } from "vue";

export const Test =  defineComponent({
  name: "Test",
  props: {
    name: { required: false },
  },


  //https://github.com/shentao/vue-multiselect
  setup(props: any, { slots }: any) {
      console.log("hello im from Test component")
    console.log(props, "=========>props");

    return () => <div>{slots.default?.()}</div>;
  },
});
