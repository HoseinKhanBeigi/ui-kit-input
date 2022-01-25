import { defineComponent, h, reactive } from "vue";

export default defineComponent({
  name: "App",
  setup(props, { slots, attrs, emit }) {
    const state = reactive({
      count: 0,
    });

    function increment() {
      state.count++;
    }
    return () => {
      return h(
        "div",
        {
          onClick: increment,
        },
        state.count
      );
    };
  },
});
