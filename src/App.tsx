import { defineComponent, h, reactive } from "vue";

const Hello = defineComponent({
  name: "Hello",
  props: ['modelValue','message'],
  emits: ['update:modelValue'],
  render() {
    return h(
      "div",
      
      {
        id: "app",
        modelValue: this.modelValue,
        'onUpdate:modelValue': (value:any) => this.$emit('update:modelValue', value)
        // onClick: $event => console.log('clicked', $event.target)
      },
      [h("span", this.$slots.default({
        text: this.message
      }))],
      
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
