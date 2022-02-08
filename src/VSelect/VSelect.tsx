import { InputType, Size } from "../features2/types";
import {
  computed,
  defineComponent,
  nextTick,
  onActivated,
  onMounted,
  PropType,
  ref,
  watch,
} from "vue";
import "@/style.scss";

import { VSelectoption } from "./VSelectoption";
import { VSelectoptiongroup } from "./VSelectoptiongroup";
import useId from "../features2/composables/useId";

import { normalizeOptions } from "../features2/composables/useFormSelect";

export const VSelect = defineComponent({
  name: "VSelect",
  props: {
    autofocus: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    disabledField: { type: String, default: "disabled" },
    form: { type: String, required: false },
    htmlField: { type: String, default: "html" },
    id: { type: String, required: false },
    labelField: { type: String, default: "label" },
    multiple: { type: Boolean, default: false },
    name: { type: String, required: false },
    options: { type: [Array, Object], default: () => [] },
    optionsField: { type: String, default: "options" },
    plain: { type: Boolean, default: false },
    required: { type: Boolean, default: false },
    selectSize: { type: Number, default: 0 },
    size: { type: String, required: false },
    readOnly: { type: Boolean, required: false },
    state: {
      type: Boolean,
      default: null,
    },
    textField: { type: String, default: "text" },
    valueField: { type: String, default: "value" },
    modelValue: { type: [String, Array, Object, Number], default: "" },
  },
  components: { VSelectoption, VSelectoptiongroup },

  emits: ["update:modelValue", "change", "input"],
  setup(props, { slots, attrs, emit }) {
    const input = ref<HTMLElement>();
    const computedId = useId(props.id, "input");

    // lifecycle events
    const handleAutofocus = () => {
      nextTick(() => {
        if (props.autofocus) input.value?.focus();
      });
    };
    onMounted(handleAutofocus);
    onActivated(handleAutofocus);
    // /lifecycle events

    // computed
    const classes = computed(() => ({
      "form-control": props.plain,
      [`form-control-${props.size}`]: props.size && props.plain,
      "form-select": !props.plain,
      [`form-select-${props.size}`]: props.size && !props.plain,
      "is-valid": props.state === true,
      "is-invalid": props.state === false,
    }));

    const computedSelectSize: any = computed(() => {
      if (props.selectSize || props.plain) {
        return props.selectSize;
      }
      return null;
    });

    // const computedAriaInvalid = computed(() => {
    //   if (props.ariaInvalid) {
    //     return props.ariaInvalid.toString();
    //   }
    //   return props.state === false ? "true" : null;
    // });

    const formOptions = computed(() => {
      const res: any = props.options;
      return normalizeOptions(res, "BFormSelect", props);
    });

    const formValue = formOptions.value;
    const focus = () => {
      if (!props.disabled) input.value?.focus();
    };

    const blur = () => {
      if (!props.disabled) {
        input.value?.blur();
      }
    };
    // /methods

    watch(
      () => props.modelValue,
      (newValue) => {
        emit("input", newValue);
      }
    );

    function handleChange(event: any) {
      const { target } = event;
      const selectedVal = Array.from(target.options)
        .filter((e: any) => e.selected)
        .map((e: any) => ("_value" in e ? e._value : e.value));
      nextTick(() => {
        emit("change", target.multiple ? selectedVal : selectedVal[0]);
        emit(
          "update:modelValue",
          target.multiple ? selectedVal : selectedVal[0]
        );
      });
    }

    return () => (
      <div>
        <select
          id={`${computedId.value}`}
          ref="input"
          class={classes}
          multiple={props.multiple}
          size={computedSelectSize}
          name={props.name || undefined}
          form={props.form || undefined}
          disabled={props.disabled}
          required={props.required}
          aria-required={props.required ? "true" : undefined}
          //   v-bind="$attrs"
          value={props.modelValue}
          //   onInput={handleInput}
          onChange={handleChange}
        //   onBlur={handleBlur}
        >
          {slots.default?.()}
          {formValue.map((option: any, index: any) => {
            return (
              <>
                {Array.isArray(option.options) ? (
                  <VSelectoptiongroup
                    key={`option_${index}`}
                    label={option.label}
                    options={option.options}
                  />
                ) : (
                  <VSelectoption
                    key={`option2_${index}`}
                    value={option.value}
                    disabled={option.disabled}
                    v-html={option.html || option.text}
                  />
                )}
              </>
            );
          })}
        </select>
      </div>
    );
  },
});

// const A = (props: any, { slots }: any) => <>{slots.default()}</>;
