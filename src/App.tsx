import { defineComponent, h, reactive } from "vue";

 const Hello = defineComponent({
  name: "Hello",
  render() {
    return h(
      "div",
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

const AnotherComponent = defineComponent({
  name: "Another",

  render() {
    function foo() {
      console.log("another");
    }
    return h("div", {
      class: ["foo", "bar"],
      style: { color: "red" },
      id: "foo",
      innerHTML: "sadasd",
      onClick: foo,
      key: "foo",
    });
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
        <AnotherComponent />
      </div>
    );
  },
});
