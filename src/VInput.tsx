import { InputType } from "./features2/types";
import { computed, defineComponent, PropType, h, onMounted } from "vue";
// import "./input.scss"
import "@/style.scss"
import useFormInput, {
  COMMON_INPUT_PROPS,
} from "./features2/composables/useFormInput";

const allowedTypes = [
  "text",
  "number",
  "email",
  "password",
  "search",
  "url",
  "tel",
  "date",
  "time",
  "range",
  "color",
];

export const VInput= defineComponent({
  name: "VInput",
  props: {
    ...COMMON_INPUT_PROPS,
    max: { type: [String, Number], required: false },
    min: { type: [String, Number], required: false },
    step: { type: [String, Number], required: false },
    type: {
      type: String,
      default: "text",
      validator: (value: string) => allowedTypes.includes(value),
    },
  },
  emits: ["update:modelValue", "change", "blur", "input"],
  setup(props, { emit }) {
    const classes = computed(() => {
      const isRange = props.type === "range";
      const isColor = props.type === "color";
      return {
        "form-range": isRange,
        "form-control": isColor || (!props.plaintext && !isRange),
        "form-control-color": isColor,
        "form-control-plaintext": props.plaintext && !isRange && !isColor,
        [`form-control-${props.size}`]: props.size,
        "is-valid": props.state === true,
        "is-invalid": props.state === false,
      };
    });

    const localType = computed(() =>
      allowedTypes.includes(props.type) ? props.type : "text"
    );

    const {
      //   input,
      computedId,
      //   computedAriaInvalid,
      //   onInput,
      //   onChange,
      //   onBlur,
      //   focus,
      //   blur,
    } = useFormInput(props, emit);

    function handleInput(event: any) {
      emit("input", event);
      // return onInput(event)
    }
    function handleChange(event: any) {
      emit("change", event);
      // return onChange(event)
    }
    function handleBlur(event: any) {
      emit("blur");
      // return onBlur(event)
    }
    return () => (
      <div class="input-block">
        <input
          ref="input"
          value={props.modelValue}
          placeholder={props.placeholder}
          id={`${computedId.value}`}
          class={classes}
          name={props.name || undefined}
          form={props.form || undefined}
          type={`${localType.value}`}
          disabled={props.disabled}
          required={props.required}
          autocomplete={props.autocomplete || undefined}
          readonly={props.readonly || props.plaintext}
          min={props.min}
          max={props.max}
          step={props.step}
          list={props.type !== "password" ? props.list : undefined}
          aria-required={props.required ? "true" : undefined}
          // v-bind="$attrs"
          onInput={handleInput}
          onChange={handleChange}
          onBlur={handleBlur}

          // v-model={["val", ["modifier"]]}
        />
        <span class="placeholder">Placeholder</span>
      </div>
    );
  },
});
