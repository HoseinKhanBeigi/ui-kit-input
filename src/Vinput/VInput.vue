<template>
  <div class="input">
 
          <div class="form-group">
            <span v-if="prefix">{{ prefix }}</span>
            <input
              class="form-field input__field"
              :id="computedId"
              ref="input"
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
              @focus="handleFocus()"
            />
            <div class="input__label">{{ label }}</div>
     
      <span v-if="suffix" class="suffix__inner">{{ suffix }}</span>
    </div>
    <p class="help-message" v-show="errorMessage">
      {{ errorMessage }}
    </p>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, toRef, ref } from "vue";
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
    const localType = computed(() =>
      allowedTypes.includes(props.type) ? props.type : "text"
    );

    const active = ref(false);

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
      console.log(focus());
      if(focus()){
         active.value = true
      }
      active.value = false
      // return focus();
    }

    function handleActive() {
     
    }

    // console.log(inputValue, "props.modelValue,");

    return {
      localType,
      input,
      computedId,
      computedAriaInvalid,
      errorMessage,
      handleChange1,
      handleAutofocus2,
      handleFocus,
      inputValue,
      handleActive,
      active,
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
.help-message {
  margin: 0;
  color: rgb(248, 15, 104);
}

.input {
  position: relative;
  &__label {
    height: 20px;
    line-height: 10px;
    letter-spacing: normal;
    top: 0px;
    left: 0px;
    right: auto;
    position: absolute;
    transform-origin: top left;
    padding: calc(var(--size-bezel) * 0.75) calc(var(--size-bezel) * 1.3);
    margin: calc(var(--size-bezel) * 0.75 + 3px) calc(var(--size-bezel) * 0.5);
    font-family: sans-serif;
    color: #969696;
    pointer-events: none;
    transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
    transition-property: all;
    transition-duration: 0.3s;
    transition-timing-function: cubic-bezier(0.25, 0.8, 0.5, 1);
    transition-delay: 0s;
    white-space: pre;
    // z-index: 1;
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
        font-size: 0.75rem;
        color: #969696;
        background: #ffffff;
        padding: 0px 1px 1px 1px;
        margin-top: 10px;
        margin-left: 8px;

        // color: var(--color-accent);
      }
    }
  }
}
.input__field:not(:focus)::placeholder {
  color: transparent;
}

.input__label {
  font-size: 0.75rem;
  color: #969696;
  background: transparent;
  // color: var(--color-accent);
}

.vc_input__control {
  display: flex;
  height: auto;
  flex-grow: 1;
  flex-wrap: wrap;
  position: relative;
  min-width: 0;
  width: 100%;
  border-radius: inherit;
}

.vc-input {
  align-items: flex-start;
  align-items: center;
  display: flex;
  flex: 1 1 auto;
  font-size: 16px;
  letter-spacing: normal;
  max-width: 100%;
  text-align: left;
  border: 1px solid;
  padding: 0;
  position: relative;
  border-radius: 4px;
  color: #eeeeee;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  transition: border 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
}

.vc-input__slot {
  color: inherit;
  display: flex;
  align-items: stretch;
  position: relative;
  transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
  border-radius: 4px;
  width: 100%;
  min-height: 40px;
  cursor: text;
  background: transparent;
}

.active {
  color: rgb(160, 160, 160);
}

.form-field {
  flex: 1 1 auto;
  line-height: 20px;
  padding: 8px 0;
  margin-left: 10px;
  margin-right: 10px;
  max-width: 100%;
  min-width: 0;
  max-height: 32px;
  color: #212121;
  border:1px solid silver;
  width: 100%;
  background-color: transparent;
 transition: border 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
  &::placeholder {
    color: var(--input-placeholder);
  }
  &:focus {
    outline: none;
    border-color: rgb(124, 124, 124);
  }
}

.suffix__inner {
  text-align: center;
  padding: 8px 12px;
  font-size: 14px;
  line-height: 25px;
  color: #919191;
  background-color: #f0f0f0;
}

.form-group {
  display: flex;
  flex: 1 1 auto;
  position: relative;
  align-items: center;
  max-width: 80%;
  & > span,
  .form-field {
    white-space: nowrap;
    display: block;
    &:not(:first-child):not(:last-child) {
      border-radius: 0;
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
}
</style>
