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
  setup(props,{ slots, attrs, emit }) {
    console.log(props,"<=======>")
    emit("change")
  },
  render() {
    return h("input", {
      class: ["foo", "bar"],
      style: { color: "red" },
      id: "foo",
      innerHTML: "sadasd",
      placeholder: "enter number",
      attrs: "foo",
      onClick: () => {
        console.log()
      },
      key: "foo",
    });
  },
  props: {
    elementtype: {
      attributes: String,
      required: true,
    },
  },
});

const Child = defineComponent({
  name: "Container1",
  setup(props, { slots, attrs, emit }) {
    const state = reactive({
      count: 0,
    });

    

    function increment() {
      state.count++;
    }

    return () => (
      <div>
        {state.count}
        {props.elementtype}
        <Hello />
      </div>
    );
  },
  props:{
    elementtype: {
      attributes: String,
      required: true,
    },
  }
});

export default defineComponent({
  name: "Container",
  setup(props, { slots, attrs, emit }) {
    const state = reactive({
      count: 0,
    });

    

    function increment() {
      emit("change")
      // state.count++;
    }

    return () => (
      <div  onClick={increment}>
         <AnotherComponent elementtype="anotherComponent" />
         <Child elementtype="child from parent"/>
      </div>
     
    );
  },
  emits: ['change'],
});
