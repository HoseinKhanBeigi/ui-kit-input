import { defineComponent, h, reactive, createApp } from "vue";

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

const Child4 = defineComponent({
  name: "Child4",
  setup(props, { slots, attrs, emit }) {
    return h("div", [
      h("header", slots.header ? slots.header() : ""),
      h("main", slots.default ? slots.default() : ""),
      h("footer", slots.footer ? slots.footer() : ""),
    ]);
  },
});

const app4 = createApp({});

app4.component("blog-post", {
  render() {
    return h("div", [
      h("header", this.$slots.header()),
      h("main", this.$slots.default()),
      h("footer", this.$slots.footer()),
    ]);
  },
});

const app = createApp({});

app.component("Anchor-Elf", {
  template: `
    <h1>
      asdasd
      asdad
    </h1>
    <h2>
    asdasd
      asdsad
    </h2>
    <h3>
    asdads
      asdasd
    </h3>
    <h4>
    asd
      asd
    </h4>
    <h5>
      asdasd
    </h5>
    <h6>
      asasda
      asd
    </h6>
  `,
  props: {
    level: {
      type: Number,
      required: true,
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
        <blog-post>
          <template v-slot:header>
            <h1>About Me</h1>
          </template>
        </blog-post>
        {/* <Anchor-Elf level="3" /> */}
        {/* <App23 /> */}
        {/* <App/> */}
        {/* <App1 /> */}
        {/* <Child3 /> */}
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
