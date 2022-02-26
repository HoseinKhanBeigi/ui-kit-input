<template>
  <div class="warp">
    <div class="form-group">
      <span v-if="prefix">{{ prefix }}</span>

      <input
        class="form-field input__field"
        :class="errorMessage ? 'validationError' : ''"
        :id="computedId"
        ref="input"
        :value="inputValue"
        :name="name"
        :form="form || undefined"
        :type="localType"
        :disabled="disabled"
        :placeholder="placeholder"
        :required="required"
        :autocomplete="autocomplete || undefined"
        :readonly="readonly || plaintext"
        :aria-invalid="computedAriaInvalid"
        @input="handleInput"
        @blur="onBlur($event)"
      />
      <div class="fname input__label">
        {{ label }}
      </div>
      <span v-if="suffix">{{ suffix }}</span>
    </div>
    <p class="help-message" v-show="errorMessage">
      {{ errorMessage }}
    </p>
  </div>
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
      blur,
    } = useFormInput(props, emit);

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

    function handleInput(event: any) {
      onInput(event);
      handleChange(event);
    }

    return {
      localType,
      input,
      computedId,
      computedAriaInvalid,
      errorMessage,
      handleInput,

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

  --input-border-focus: #a0a0a0;

  --group-color: var(--input-color);
  --group-border: var(--input-border);
  --group-background: #eef4ff;

  --group-color-focus: #fff;
  --group-border-focus: var(--input-border-focus);
  --group-background-focus: #929292;

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
  color: #797979;
}

// .input {
//   position: relative;

//   &__label {
//     position: absolute;
//     left: 0;
//     top: 0;
//     padding: calc(var(--size-bezel) * 0.75) calc(var(--size-bezel) * 0.5);
//     margin: calc(var(--size-bezel) * 0.75 + 3px) calc(var(--size-bezel) * 0.5);
//     white-space: nowrap;
//     transform: translate(0, 0);
//     transform-origin: 0 0;
//     background: var(--color-background);
//     transition: transform 120ms ease-in;
//     font-size: 0.95rem;
//     line-height: 0.9;
//     z-index: 1;
//   }
//   &__field {
//     box-sizing: border-box;
//     display: block;
//     &:focus,
//     &:not(:placeholder-shown) {
//       & + .input__label {
//         transform: translate(0.25rem, -65%) scale(0.8);
//         font-size: 0.75rem;
//       }
//     }
//   }
// }

.warp {
  position: relative;

  .fname {
    position: absolute;
    font-size: 0.95rem;
    left: 0;
    top: 0;
    padding: calc(var(--size-bezel) * 0.75) calc(var(--size-bezel) * 0.5);
    margin: calc(var(--size-bezel) * 0.75 + 3px) calc(var(--size-bezel) * 0.5);
    font-size: 12px;
    white-space: nowrap;
    // transform: translate(0, 0);
    // transform-origin: 0 0;
    background-color: rgb(255, 255, 255);
    transition: transform 120ms ease-in;
    z-index: 1;
    &:focus,
    &:not(:placeholder-shown) {
      & + .input__label {
        transform: translate(0.25rem, -65%) scale(0.8);
        font-size: 0.75rem;
        top:-51px;
      }
    }
  }
}

.inputValidation {
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
    font-size: 0.95rem;
    line-height: 0.9;
    z-index: 99990;
  }
  &__field {
    &:focus,
    &:not(:placeholder-shown) {
      & + .errorLabelValidation {
        transform: translate(0.25rem, -65%) scale(0.8);
        font-size: 0.75rem;
      }
    }
  }
}

.input__label {
  color: #969696;
  background: #ffffff;
}
.errorLabelValidation {
  color: rgb(255, 56, 99);
  background: #ffffff;
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
  color: black;
  border: 1px solid rgb(223, 221, 221);
  // background: var(--input-background);
  background-color: white;
  transition: border 0.3s ease;
  &::placeholder {
    color: transparent;
  }
  &:focus::placeholder {
    color: silver;
  }
  &:focus {
    background-color: transparent;
    outline: none;
    border-color: rgb(134, 133, 133);
    color: rgb(0, 0, 0);
  }
}

.help-message {
  margin: 0;
  color: rgb(255, 56, 99);
}

.validationError {
  border: 1px solid rgb(255, 56, 99);
  &:focus {
    background-color: transparent;
    outline: none;
    border-color: rgb(255, 56, 99);
    color: rgb(0, 0, 0);
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
    color: silver;

    background: rgb(231, 231, 231);
    border: 1px solid var(--group-border);
    transition: background 0.3s ease, border 0.3s ease, color 0.3s ease;
  }
  &:focus-within {
    & > span {
      color: rgb(82, 80, 80);
    }
  }
  &:invalid {
    & > span {
      color: rgb(212, 1, 1);
    }
  }
}
</style>
