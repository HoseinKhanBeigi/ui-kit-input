// import { Vue } from '../../vue'
import { defineComponent, h, reactive, createApp } from "vue";
import { NAME_FORM_INPUT } from "./features/constants/components";
import {
  PROP_TYPE_BOOLEAN,
  PROP_TYPE_NUMBER_STRING,
  PROP_TYPE_STRING,
} from "./features/constants/props";
import { arrayIncludes } from "./features/utils/array";
import { attemptBlur } from "./features/utils/dom";
import {
  eventOn,
  eventOff,
  eventOnOff,
  stopEvent,
} from "./features/utils/events";
import { sortKeys } from "./features/utils/object";
import { makeProp, makePropsConfigurable } from "./features/utils/props";
import {
  formControlMixin,
  props as formControlProps,
} from "./features/mixins/form-control";
import { formSelectionMixin } from "./features/mixins/form-selection";
import {
  formSizeMixin,
  props as formSizeProps,
} from "./features/mixins/form-size";
import {
  formStateMixin,
  props as formStateProps,
} from "./features/mixins/form-state";
import {
  formTextMixin,
  props as formTextProps,
} from "./features/mixins/form-text";
import { formValidityMixin } from "./features/mixins/form-validity";
import { idMixin, props as idProps } from "./features/mixins/id";
import { listenersMixin } from "./features/mixins/listeners";

// --- Constants ---

// Valid supported input types
const TYPES = [
  "text",
  "password",
  "email",
  "number",
  "url",
  "tel",
  "search",
  "range",
  "color",
  "date",
  "time",
  "datetime",
  "datetime-local",
  "month",
  "week",
];

// --- Props ---

export const props = makePropsConfigurable(
  sortKeys({
    ...idProps,
    ...formControlProps,
    ...formSizeProps,
    ...formStateProps,
    ...formTextProps,
    list: makeProp(PROP_TYPE_STRING),
    max: makeProp(PROP_TYPE_NUMBER_STRING),
    min: makeProp(PROP_TYPE_NUMBER_STRING),
    // Disable mousewheel to prevent wheel from changing values (i.e. number/date)
    noWheel: makeProp(PROP_TYPE_BOOLEAN, false),
    step: makeProp(PROP_TYPE_NUMBER_STRING),
    type: makeProp(PROP_TYPE_STRING, "text", (type) => {
      return arrayIncludes(TYPES, type);
    }),
  }),
  NAME_FORM_INPUT
);

// --- Main component ---

// @vue/component
export const BFormInput = defineComponent({
  name: NAME_FORM_INPUT,
  // Mixin order is important!
  mixins: [
    listenersMixin,
    idMixin,
    formControlMixin,
    formSizeMixin,
    formStateMixin,
    formTextMixin,
    formSelectionMixin,
    formValidityMixin,
  ],
  props,

  computed: {
    localType() {
      // We only allow certain types
      const { type } = this;
      return arrayIncludes(TYPES, type) ? type : "text";
    },
    computedAttrs() {
      const {
        localType: type,
        name,
        form,
        disabled,
        placeholder,
        required,
        min,
        max,
        step,
      } = this;

      return {
        id: this.safeId(),
        name,
        form,
        type,
        disabled,
        placeholder,
        required,
        autocomplete: this.autocomplete || null,
        readonly: this.readonly || this.plaintext,
        min,
        max,
        step,
        list: type !== "password" ? this.list : null,
        "aria-required": required ? "true" : null,
        "aria-invalid": this.computedAriaInvalid,
      };
    },
    computedListeners() {
      return {
        ...this.bvListeners,
        input: this.onInput,
        change: this.onChange,
        blur: this.onBlur,
      };
    },
  },
  watch: {
    noWheel(newValue) {
      this.setWheelStopper(newValue);
    },
  },
  mounted() {
    this.setWheelStopper(this.noWheel);
  },
  /* istanbul ignore next */
  deactivated() {
    // Turn off listeners when keep-alive component deactivated
    /* istanbul ignore next */
    this.setWheelStopper(false);
  },
  /* istanbul ignore next */
  activated() {
    // Turn on listeners (if no-wheel) when keep-alive component activated
    /* istanbul ignore next */
    this.setWheelStopper(this.noWheel);
  },
  beforeDestroy() {
    /* istanbul ignore next */
    this.setWheelStopper(false);
  },
  methods: {
    setWheelStopper(on) {
      const input = this.$el;
      eventOnOff(on, input, "focus", this.onWheelFocus);
      eventOnOff(on, input, "blur", this.onWheelBlur);
      if (!on) {
        eventOff(document, "wheel", this.stopWheel);
      }
    },
    onWheelFocus() {
      eventOn(document, "wheel", this.stopWheel);
    },
    onWheelBlur() {
      eventOff(document, "wheel", this.stopWheel);
    },
    stopWheel(event) {
      stopEvent(event, { propagation: false });
      attemptBlur(this.$el);
    },
  },
  render() {
    console.log(this.computedListeners);
    const {
      id,
      name,
      form,
      type,
      disabled,
      placeholder,
      required,
      autocomplete,
      readonly,
      min,
      max,
      step,
      list,
    } = this.computedAttrs;

    const { input, change, blur } = this.computedListeners;

    return h("input", {
      class: this.computedClass,
      id,
      name,
      form,
      type,
      disabled,
      placeholder,
      required,
      autocomplete,
      readonly,
      min,
      max,
      step,
      list,
      "aria-required": required ? "true" : null,
      value: this.localValue,
      ...this.computedListeners,
      ref: "input",
    });
  },
});
