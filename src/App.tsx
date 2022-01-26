import { defineComponent, h, reactive } from "vue";

const A = (props: any, { slots }: any) => (
  <>
    <h1>{slots.default ? slots.default() : "foo"}</h1>
    <h2>{slots.bar?.()}</h2>
  </>
);

const A1 = (props: any, { slots }: any) => (
  <>
    <h1>{slots.default ? slots.default() : "foo"}</h1>
    <h2>{slots.bar?.()}</h2>
  </>
);

const App23 = defineComponent({
  setup() {
    return () => (
      <>
        <A1>
          {{
            default: () => <div>...</div>,
            bar: () => <span>....</span>,
          }}
        </A1>
      </>
    );
  },
});

const App1 = defineComponent({
  data() {
    return { visible: true };
  },
  render() {
    return <input v-show={this.visible} />;
  },
});

const placeholderText = "email";
const App = () => <input type="email" placeholder={placeholderText} />;

const Child2 = defineComponent({
  name: "Child2",
  setup(props, { slots, attrs, emit }) {
    // console.log(slots);
  },
  props: ["modelValue", "childType", "child2Props"],
  emits: ["update:modelValue"],
  render(props: any) {
    console.log(props);
    return h("div", {
      id: "app",
      innerHTML: "im a child1",
      modelValue: this.modelValue,
      "onUpdate:modelValue": (value: any) =>
        this.$emit("update:modelValue", value),
      // onClick: $event => console.log('clicked', $event.target),
    });
  },
});

const Child1 = defineComponent({
  name: "Child1",
  setup(props, { slots, attrs, emit }) {
    console.log(slots, "slotesss");
  },
  render() {
    const valueName: string = "hasan";
    return h(
      "div",
      {
        // class: ["foo", "bar"],
        // style: { color: "black" },
        // id: "foo",
        // innerHTML: "im a child1",
        // placeholder: "enter number",
        // attrs: "foo",
        onClick: () => {
          console.log();
        },
        key: "foo",
      },
      {
        default: () => [h("span", "Hello"), " world!"],
        bar: () => [h("span", "amir"), "rashti"],
        foo: () => [h("span", "hamid"), "fooo"],
      }
    );
  },
  props: {
    childType: {
      attributes: String,
      required: false,
    },
  },
});

const Child3 = defineComponent({
  name: "Child3",
  setup(props, { slots, attrs, emit }) {
    console.log(attrs.children);
    const slotss = {
      default: () => <div>ali</div>,
      bar: () => <span>reza</span>,
    };
    return () => <A v-slots={slotss} />;
  },
  props: {
    parentType: {
      attributes: String,
      required: false,
    },
  },
});

const Parent = defineComponent({
  name: "parent",
  setup(props, { slots, attrs, emit }) {
    console.log(slots);
    return () => (
      <div>
        <App23 />
        {/* <App/> */}
        {/* <App1 /> */}
        <Child3 />
        {/* <Child1 /> */}
      </div>
    );
  },
  props: {
    parentType: {
      attributes: String,
      required: true,
    },
  },
});

export default defineComponent({
  name: "Container",
  setup(props, { slots, attrs, emit }) {
    // console.log(slots);
    return () => (
      <div>
        <Parent parentType="im a parent from contanier" />
      </div>
    );
  },
  emits: ["change"],
});
