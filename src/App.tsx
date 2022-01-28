import { defineComponent, h, reactive, createApp } from "vue";

import { BFormInput } from "./input"

const A = (props: any, { slots }: any) => (
  <>
    <h1>{slots.default ? slots.default() : "foo"}</h1>
    <h2>{slots.bar?.()}</h2>
  </>
);

const A1 = (props: any, { slots }: any) => {
  console.log(props)
  return (
    <>
      <h1>{props.hamid}</h1>
      <h1>{slots.default()}</h1>
      <h2>{slots.bar()}</h2>
    </>
  );
}

const App23 = defineComponent({
  setup() {

    const slotss = {
      default: () => <div>aliA1</div>,
      bar: () => <span>rezaA1</span>,
    };
    return () => <A1 v-slots={slotss} hamid="aliiiiiasdadas" />;
    // return () => (
    //   <>
    //     <A1 hamid="aliiiiiasdadas">
    //       {{

    //         bar: () => <span>....</span>,
    //       }}
    //     </A1>
    //   </>
    // );
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
    );
  },
  props: {
    childType: {
      attributes: String,
      required: false,
    },
  },
});

const Child4 = defineComponent({
  name: "Child4",
  setup(props, { slots, attrs, emit }) {
    return h("div", [
      h("div", "header"),
      h("div", "header"),
      h("div", "header"),
    ]);
  },
});

const app4 = createApp({});

app4.component("blog-post", {
  render() {
    return h("div", [
      h("header", this.$slots.header()),
      h("main", this.$slots.default({ main: "manie" })),
      h("footer", this.$slots.footer()),
    ]);
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
    return () => <A>
      {{
        default: () => <div>ali</div>,
        bar: () => <span>reza</span>,
      }}</A>;
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
    console.log(emit);
    return () => (
      <div>
        <blog-post>
          {{
            default: () => <div>ali</div>,

          }}
        </blog-post>
        <Child3 />
        <App23 />
        <Child1 />
        <Child4 />
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
        <BFormInput placeholder="enter youe name"/>
        <Parent parentType="im a parent from contanier" />
      </div>
    );
  },
  emits: ["change"],
});
