<template>
  <div
    class="TextInput"
    :class="{ 'has-error': !!errorMessage }"
  >
    <input
      class="inputtext"
      :id="computedId"
      ref="input"
      :value="defaultValue"
      :class="classes"
      :name="name || undefined"
      :form="form || undefined"
      :type="localType"
      :disabled="disabled"
      :placeholder="placeholder"
      :required="required"
      :autocomplete="autocomplete || undefined"
      :readonly="readonly || plaintext"
      :list="type !== 'password' ? list : undefined"
      :aria-required="required ? 'true' : undefined"
      :aria-invalid="computedAriaInvalid"
      v-bind="$attrs"
      @input="onInput($event)"
      @change="handleChange($event)"
      @blur="onBlur($event)"
    />
    <p class="help-message" v-show="errorMessage">
      {{ errorMessage}}
    </p>
  </div>
</template>

<script lang="ts">
import { useField } from "vee-validate";
import { computed, defineComponent } from "vue";
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
    ...COMMON_INPUT_PROPS,
    loading: {
      type: Boolean,
      default: false,
    },
    hideDetailes: {
      type: Boolean,
      default: true,
    },
    label: {
      type: String,
      required: true,
    },
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
      focus,
      blur,
    } = useFormInput(props, emit);

    const name: any = props.name;
    const {
      value: defaultValue,
      errorMessage,
      handleBlur,
      handleChange,
    } = useField(name, undefined, {
      initialValue: props.modelValue,
    });

    return {
      localType,
      errorMessage,
      input,
      computedId,
      computedAriaInvalid,
      defaultValue,
      onInput,
      handleChange,
      onBlur,
      focus,
      blur,
    };
  },
});
</script>

<style  scoped>
.TextInput {
  position: relative;
  margin-bottom: calc(1em * 1.5);
  width: 100%;
}

label {
  display: block;
  margin-bottom: 4px;
  width: 100%;
}

input {
  border-radius: 5px;
  border: 2px solid transparent;
  padding: 15px 10px;
  outline: none;
  background-color: #f2f5f7;
  width: 100%;
  transition: border-color 0.3s ease-in-out, color 0.3s ease-in-out,
    background-color 0.3s ease-in-out;
}

input:focus {
  border-color: var(--primary-color);
}

.help-message {
  position: absolute;
  bottom: calc(-1.5 * 1em);
  left: 0;
  margin: 0;
  font-size: 14px;
}

.TextInput.has-error input {
  background-color: var(--error-bg-color);
  color: var(--error-color);
}

.TextInput.has-error input:focus {
  border-color: var(--error-color);
}

.TextInput.has-error .help-message {
  color: var(--error-color);
}

.TextInput.success input {
  background-color: var(--success-bg-color);
  color: var(--success-color);
}

.TextInput.success input:focus {
  border-color: var(--success-color);
}

.TextInput.success .help-message {
  color: var(--success-color);
}
</style>


