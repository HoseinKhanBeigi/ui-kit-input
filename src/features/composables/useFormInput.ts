import { Size } from "../../features/types";
import {
  computed,
  ExtractPropTypes,
  nextTick,
  onActivated,
  onMounted,
  PropType,
  ref,
  watch,
} from "vue";
import useId from './useId'
import { string } from "yup/lib/locale";

export const COMMON_INPUT_PROPS = {
  ariaInvalid: {
    type: [Boolean, String],
    default: false,
  },
  prefix: { type: String, required: false },
  suffix: { type: String, required: false },
  label: { type: String, required: false },
  autocomplete: { type: String, required: false },
  autofocus: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  form: { type: String, required: false },
  formatter: { type: Function, required: false },
  id: { type: String, required: false },
  lazy: { type: Boolean, default: false },
  lazyFormatter: { type: Boolean, default: false },
  list: { type: String, required: false },
  modelValue: { type: [String, Number], default: "" },
  name: { type: String, required: false },
  number: { type: Boolean, default: false },
  placeholder: { type: String, required: false },
  plaintext: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
  size: { type: String, required: false },
  state: { type: Boolean, default: null },
  trim: { type: Boolean, default: false },
};

type InputProps = ExtractPropTypes<typeof COMMON_INPUT_PROPS>;
type InputEmitType = (
  event: "update:modelValue" | "change" | "blur" | "input",
  ...args: any[]
) => void;

function useFormInput(props: Readonly<InputProps>, emit: InputEmitType) {
  const input = ref<HTMLInputElement>();
  let inputValue: string | null = null;
  let neverFormatted = true;
  const computedId = useId(props.id, "input");

  const _formatValue = (value: unknown, event: any, force = false) => {
    value = String(value);
    if (
      typeof props.formatter === "function" &&
      (!props.lazyFormatter || force)
    ) {
      neverFormatted = false;
      return props.formatter(value, event);
    }
    return value;
  };

  const _getModelValue = (value: any) => {
    if (props.trim) return value.trim();
    if (props.number) return parseFloat(value);

    return value;
  };

  const handleAutofocus = () => {
    nextTick(() => {
      if (props.autofocus) input.value?.focus();
    });
  };

  onMounted(handleAutofocus);
  onMounted(() => {
    if (input.value) {
      var { value }: any = input.value;
      value = props.modelValue;
    }
  });

  onActivated(handleAutofocus);

  const computedAriaInvalid = computed(() => {
    if (props.ariaInvalid) {
      return props.ariaInvalid.toString();
    }
    return props.state === false ? "true" : undefined;
  });

  const onInput = (event: Event) => {
    const { value }: any = event.target;
    const formattedValue = _formatValue(value, event);
    if (formattedValue === false || event.defaultPrevented) {
      event.preventDefault();
      return;
    }

    if (props.lazy) return;
    emit("input", formattedValue);

    const nextModel = _getModelValue(formattedValue);

    if (props.modelValue !== nextModel) {
      inputValue = value;
      emit("update:modelValue", nextModel);
    }
  };

  const onChange = (event: Event) => {
    const { value }: any = event.target;
    const formattedValue = _formatValue(value, event);
    if (formattedValue === false || event.defaultPrevented) {
      event.preventDefault();
      return;
    }

    if (!props.lazy) return;
    inputValue = value;
    emit("update:modelValue", formattedValue);

    const nextModel = _getModelValue(formattedValue);
    if (props.modelValue !== nextModel) {
      emit("change", formattedValue);
    }
  };

  const onBlur = (event: FocusEvent) => {
    emit("blur", event);
    if (!props.lazy && !props.lazyFormatter) return;

    const { value }: any = event.target;
    const formattedValue = _formatValue(value, event, true);

    inputValue = value;
    emit("update:modelValue", formattedValue);
  };

  const focus = () => {
    if (!props.disabled) input.value?.focus();
  };

  const blur = () => {
    if (!props.disabled) {
      input.value?.blur();
    }
  };

  watch(
    () => props.modelValue,
    (newValue) => {
      if (!input.value) return;
      var { value }: any = input.value;
      value = inputValue && neverFormatted ? inputValue : newValue;
      inputValue = null;
      neverFormatted = true;
    }
  );

  return {
    input,
    computedId,
    computedAriaInvalid,
    onInput,
    onChange,
    onBlur,
    focus,
    blur,
  };
}

export default useFormInput;
