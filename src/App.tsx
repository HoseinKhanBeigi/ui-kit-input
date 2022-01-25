import { defineComponent, h, reactive } from "vue";

 const Hello = defineComponent({
  name: "Hello",
  render() {
    return h(
      "div",
      // flat data structure
      {
        id: "app",
        onClick() {
          console.log("hello");
        },
      },
      [h("span", "child")]
    );
  },
});


export default defineComponent({
  name: "App",
  setup(props, { slots, attrs, emit }) {
    const state = reactive({
      count: 0,
    });

    function increment() {
      state.count++;
    }

    return () => (
      <div onClick={increment}>
        {state.count}
        <Hello />
      </div>
    );
  },
});
