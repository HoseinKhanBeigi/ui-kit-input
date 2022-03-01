<template>
  <div class="warp">
    <span v-if="prefix" class="prefixClass" :class="sharingClass">{{
      prefix
    }}</span>
    <div class="vInput">
      <input
        class="form-field"
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
        @click="handleDeactive()"
        @keyup.page-down="onPageDown()"
        @input="handleInput"
      />
      <span v-if="suffix" class="suffixClass" :class="sharingClass"
        >{{ suffix }}
      </span>
        <div class="help-message" v-show="errorMessage">
        {{ errorMessage }}
      </div>
      <fieldset class="fieldSetClass"   :class="classesInput" :aria-hidden="true">
        <legend class="legendClass"></legend>
      </fieldset>
      <div class="nameLabel" :class="labelClass">
        {{ label }}
      </div>
    </div>
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

    const handleDeactive = ()=>{
      console.log("hello")
    }

    const classesInput = computed(() => {
      return {
        validationError: errorMessage.value,
        // inputBorder: props.suffixContext,
        "form-field-RadiusForSuffix": props.suffix,
        "form-field-RadiusForPrefix": props.prefix,
      };
    });

    const sharingClass = computed(() => {
      return {
        validationSuffixAndPrefix: errorMessage.value,
        prefixAndsuffixDefaultColor: !errorMessage.value,
        "suffixClass-Radius": props.suffix,
        "prefixClass-Radius": props.prefix,
      };
    });

    const classesSuffixContext = computed(() => {
      return {
        validationSuffixContext: errorMessage.value,
        suffixContextColor: props.suffixContext && !errorMessage.value,
      };
    });

    const onPageDown = ()=>{
      console.log("huiii")
    }

    return {
      onPageDown,
      handleDeactive,
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
      sharingClass,
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
  display: flex;
  height: auto;
  flex-grow: 1;
  flex-wrap: wrap;
  position: relative;
  width: 100%;
  border-radius: inherit;
}

.nameLabel {
  position: absolute;
  font-size: 0.95rem;
  white-space: nowrap;
  transform: translate(0, 0);
  transform-origin: 0 0;
  pointer-events: none;
  transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
  transition-property: all;
  transition-duration: 0.3s;
  transition-timing-function: cubic-bezier(0.25, 0.8, 0.5, 1);
  transition-delay: 0s;
  white-space: pre;
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
  transform: translate(0.25rem, -122%) scale(0.8);

  font-size: 0.85rem;
}
.form-field:focus ~ legend {
 display: none;
}


.input__label {
  color: #969696;
  background: transparent;
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
  margin-right: -3px;
  text-align: center;
  display: flex;
  height: 100%;
  width: 100px;
  border-radius: 3px;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: rgb(59, 59, 59);
  transition: background 0.3s ease, border 0.3s ease, color 0.3s ease;
}

.prefixClass {
  text-align: center;
  display: flex;
  border-radius: 3px;
  width: 50px;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: silver;
  transition: background 0.3s ease, border 0.3s ease, color 0.3s ease;
}

.prefixClass-Radius {
  border-radius: 3px 0px 0px 3px !important;
}

.suffixClass-Radius {
  border-radius: 0px 3px 3px 0px !important;
}
.form-field-RadiusForSuffix {
  border-radius: 3px 0px 0px 3px !important;
}

.form-field-RadiusForPrefix {
  border-radius: 0px 3px 3px 0px !important;
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
  height: 45px;
}

.form-field {
  display: block;
  width: 100%;
  padding-left: 16px;
  line-height: 25px;
  font-size: 14px;
  font-weight: 500;
  font-family: inherit;
  border-radius: 3px;
  -webkit-appearance: none;
  color: black;
  border: none;
  background-color: transparent;
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
    position: absolute;
    color: #ff3863;
    top: 46px;
    left: 2px;
}

.validationError {
  border: 1px solid rgb(255, 56, 99) !important;
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

.fieldSetClass {
  padding: 0;
  border-collapse: collapse;
  border: 1px solid silver;
  border-radius: var(--border-radius-3);
  height: 100%;
  line-height: 22px;
  pointer-events: none;
  position: absolute;
  width: 100%;
  transition-duration: 0.15s;
  transition-property: color;
}

.vc_input {
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

.vc-input-slot {
  display: flex;
  flex: 1 1 auto;
  position: relative;
  align-items: center;
  max-width: 80%;
}

.legendClass {
  width: 48px;
  margin-left: 8px;
}

.deactive{
  display: none;
}

// .form-group {
//   position: relative;
//   display: flex;
//   width: 100%;

//   &:focus-within {
//     .prefixAndsuffixDefaultColor {
//       background: rgb(121, 121, 121);
//     }
//   }
// }
</style>
