<template>
  <div>
    <div class="warp">
      <div class="form-group">
        <span
          v-if="prefix"
          class="prefixClass"
          :class="prefixSuffixClass"
          >{{ prefix }}</span
        >
        <div class="vInput">
          <input
            class="form-field"
            :class="classesInput"
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
          <div class="nameLabel" :class="labelClass">
            {{ label }}
          </div>
          <span v-if="suffix" class="suffixClass" :class="prefixSuffixClass"
            >{{ suffix }}
          </span>
          <div class="suffixContextIcon" v-if="suffixContext">
            <svg class="icon-search">
              <use xlink:href="#icon-search" />
            </svg>
          </div>
        </div>
      </div>
      <p class="help-message" v-show="errorMessage">
        {{ errorMessage }}
      </p>
    </div>

    <svg style="display: none">
      <symbol
        id="icon-search"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g>
          <path
            d="M19.688 18.189l-5.541-5.541a7.879 7.879 0 1 0-1.5 1.5l5.541 5.541a1.074 1.074 0 0 0 1.5 0 1.062 1.062 0 0 0 0-1.5zM2.178 7.905a5.728 5.728 0 1 1 5.728 5.728 5.728 5.728 0 0 1-5.728-5.728z"
            fill="currentColor"
          />
        </g>
      </symbol>
    </svg>
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

    const labelClass = computed(() => {
      return {
        input__label: !errorMessage.value,
        errorLabelValidation: errorMessage.value,
        fnamePositionValidation: props.prefix,
        fnamePosition: !props.prefix,
      };
    });

    const classesInput = computed(() => {
      return {
        validationError: errorMessage.value,
        inputBorder: props.suffixContext,
      };
    });

    const prefixSuffixClass = computed(() => {
      return {
        validationSuffixAndPrefix: errorMessage.value,
        prefixAndsuffixDefaultColor: !errorMessage.value,
      };
    });

    const classesSuffixContext = computed(() => {
      return {
        validationSuffixContext: errorMessage.value,
        suffixContextColor: props.suffixContext && !errorMessage.value,
      };
    });

    return {
      classesInput,
      localType,
      input,
      computedId,
      computedAriaInvalid,
      errorMessage,
      handleInput,
      labelClass,
      inputValue,
      onInput,
      onChange,
      onBlur,
      classesSuffixContext,
      prefixSuffixClass,
      focus,
      blur,
    };
  },
});
</script>

<style lang="scss">
:root {
  --size-bezel: 0.5rem;
  --size-radius: 4px;
  line-height: 1.4;
}

.warp {
  position: relative;
}

.nameLabel {
  position: absolute;
  font-size: 0.95rem;
  white-space: nowrap;
  transform: translate(0, 0);
  transform-origin: 0 0;
  transition: transform 120ms ease-in;
  z-index: 1;
}

.fnamePosition {
  left: 10px;
}

.fnamePositionValidation {
  left: 50px;
}

.form-field:focus ~ .nameLabel,
.form-field:not(:placeholder-shown).form-field:not(:focus) ~ .nameLabel {
  transform: translate(0.25rem, -100%) scale(0.8);
  font-size: 0.85rem;
}

.input__label {
  color: #969696;
  background: #ffffff;
}
.errorLabelValidation {
  color: rgb(255, 56, 99);
  background: #ffffff;
}

.prefixAndsuffixDefaultColor {
  background: rgb(231, 231, 231);
}

.validationSuffixAndPrefix {
  background: #ff3863;
}

.suffixClass {
  text-align: center;
  display: flex;
  height: 100%;
  width: 50px;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: silver;
  transition: background 0.3s ease, border 0.3s ease, color 0.3s ease;
}

.prefixClass {
  text-align: center;
  display: flex;

  width: 50px;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: silver;
  transition: background 0.3s ease, border 0.3s ease, color 0.3s ease;
}

.suffixContextIcon {
  position: absolute;
  right: 14px;
  top: 12px;
}

.vInput {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: end;
}

.form-field {
  display: block;
  width: 100%;
  padding: 8px 16px;
  line-height: 25px;
  font-size: 14px;
  font-weight: 500;
  font-family: inherit;
  border-radius: 1px;
  -webkit-appearance: none;
  color: black;
  border: 1px solid rgb(223, 221, 221);
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

.icon-search {
  color: #d2d2d2;
  width: 16px;
  height: 16px;
}

.form-group {
  position: relative;
  display: flex;
  width: 100%;

  &:focus-within {
    .prefixAndsuffixDefaultColor {
      background: rgb(121, 121, 121);
    }
  }
}
</style>
