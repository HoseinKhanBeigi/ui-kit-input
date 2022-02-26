<template>
  <label class="input">
    <div class="form-group">
      <span v-if="prefix">{{ prefix }}</span>
      <input
        class="form-field input__field"
        :id="computedId"
        ref="input"
        :class="classes"
        :value="inputValue"
        :name="name"
        :form="form || undefined"
        :type="localType"
        :disabled="disabled"
        :placeholder="handleAutofocus2 ? placeholder : ''"
        :required="required"
        :autocomplete="autocomplete || undefined"
        :readonly="readonly || plaintext"
        :aria-invalid="computedAriaInvalid"
        @input="handleChange1"
        @blur="onBlur($event)"
        @focus="focus()"
      />
      <div class="input__label">{{ label }}</div>
      <span v-if="suffix">{{ suffix }}</span>
    </div>
    <p class="help-message" v-show="errorMessage">
      {{ errorMessage }}
    </p>
  </label>
</template>

<script lang="ts">
import { computed, defineComponent, toRef, Ref } from "vue";
import { useField } from "vee-validate";
import useFormInput, {
  COMMON_INPUT_PROPS,
} from "../features/composables/useFormInput";

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

export default defineComponent({
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
      input,
      computedId,
      computedAriaInvalid,
      onInput,
      onChange,
      onBlur,
      focus,
      blur,
      handleAutofocus2,
    } = useFormInput(props, emit);

    function handleInput(event: any) {
      emit("input", event);
    }

    handleAutofocus2();
    const name: any = toRef(props, "name");

    const {
      value: inputValue,
      errorMessage,
      handleBlur,
      handleChange,
      meta,
    } = useField(name.value, undefined, {
      initialValue: props.modelValue,
    });

    function handleChange1(event: any) {
      handleChange(event);
    }

    function handleFocus() {
      focus();
    }

    console.log(focus(), "focus");

    // console.log(inputValue, "props.modelValue,");

    return {
      classes,
      localType,
      input,
      computedId,
      computedAriaInvalid,
      errorMessage,
      handleChange1,
      handleAutofocus2,
      handleFocus,
      inputValue,
      onInput,
      onChange,
      onBlur,
      focus,
      blur,
    };
  },
});
</script>

<style lang="scss">
:root {
  --input-color: #99a3ba;
  --input-border: #cdd9ed;
  --input-background: #fff;
  --input-placeholder: #cbd1dc;

  --input-border-focus: #275efe;

  --group-color: var(--input-color);
  --group-border: var(--input-border);
  --group-background: #eef4ff;

  --group-color-focus: #fff;
  --group-border-focus: var(--input-border-focus);
  --group-background-focus: #678efe;

  --color-light: white;
  --color-dark: #212121;
  --color-signal: #fab700;

  --color-background: var(--color-light);
  --color-text: var(--color-dark);
  --color-accent: var(--color-signal);

  --size-bezel: 0.5rem;
  --size-radius: 4px;

  line-height: 1.4;
}

.form__label:focus ~ label,
.form__label:valid ~ label {
  top: -20px;
  font-size: 14px;
  color: #5264ae;
}

.input {
  position: relative;

  &__label {
    position: absolute;
    left: 0;
    top: 0;
    padding: calc(var(--size-bezel) * 0.75) calc(var(--size-bezel) * 0.5);
    margin: calc(var(--size-bezel) * 0.75 + 3px) calc(var(--size-bezel) * 0.5);
    white-space: nowrap;
    transform: translate(0, 0);
    transform-origin: 0 0;
    background: var(--color-background);
    transition: transform 120ms ease-in;
    font-weight: bold;
    line-height: 0.9;
    z-index: 99990;
  }
  &__field {
    box-sizing: border-box;
    display: block;
    width: 100%;
    border: 3px solid currentColor;
    padding: calc(var(--size-bezel) * 1.5) var(--size-bezel);
    color: currentColor;

 &:focus,
    &:not(:placeholder-shown) {
      & + .input__label {
        transform: translate(0.25rem, -65%) scale(0.8);
        // color: var(--color-accent);
      }
    }
  }
}
.input__field:not(:focus)::placeholder {
  color: transparent;
}

.form-field {
  display: block;
  width: 100%;
  padding: 8px 16px;
  line-height: 25px;
  font-size: 14px;
  font-weight: 500;
  font-family: inherit;
  border-radius: 6px;
  -webkit-appearance: none;
  color: var(--input-color);
  border: 1px solid var(--input-border);
  background: var(--input-background);
  transition: border 0.3s ease;
  &::placeholder {
    color: var(--input-placeholder);
  }
  &:focus {
    outline: none;
    border-color: var(--input-border-focus);
  }
}

.form-group {
  position: relative;
  display: flex;
  width: 100%;
  & > span,
  .form-field {
    white-space: nowrap;
    display: block;
    &:not(:first-child):not(:last-child) {
      border-radius: 0;
    }
    &:first-child {
      border-radius: 6px 0 0 6px;
    }
    &:last-child {
      border-radius: 0 6px 6px 0;
    }
    &:not(:first-child) {
      margin-left: -1px;
    }
  }
  .form-field {
    position: relative;
    z-index: 1;
    flex: 1 1 auto;
    width: 1%;
    margin-top: 0;
    margin-bottom: 0;
  }
  & > span {
    text-align: center;
    padding: 8px 12px;
    font-size: 14px;
    line-height: 25px;
    color: var(--group-color);
    background: var(--group-background);
    border: 1px solid var(--group-border);
    transition: background 0.3s ease, border 0.3s ease, color 0.3s ease;
  }
  &:focus-within {
    & > span {
      color: var(--group-color-focus);
      background: var(--group-background-focus);
      border-color: var(--group-border-focus);
    }
  }
}
</style>
