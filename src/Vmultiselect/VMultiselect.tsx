import { computed, defineComponent, PropType, h, onMounted } from "vue";
import useFormMultiSelect, { COMMON_INPUT_PROPS } from "./useFormMultiSelect"
import "@/style.scss"

function isEmpty(opt: any) {
  if (opt === 0) return false;
  if (Array.isArray(opt) && opt.length === 0) return true;
  return !opt;
}


const customLabelType = (option: any, label: String | any): any => {
  if (isEmpty(option)) return "";
  return label ? option[label] : option;
};
const emptyArray = () => [];


export const VMultiselect = defineComponent({
  name: "VMultiselect",
  props: {
    // ...COMMON_INPUT_PROPS,
    name: { type: String, default: '' },
    selectLabel: { type: String, default: 'Press enter to select' },
    selectGroupLabel: { type: String, default: 'Press enter to select group' },
    selectedLabel: { type: String, default: 'Selected' },
    deselectLabel: { type: String, default: 'Press enter to remove' },
    deselectGroupLabel: { type: String, default: 'Press enter to deselect group' },
    showLabels: { type: Boolean, default: true },
    limit: { type: Number, default: 99999 },
    maxHeight: { type: Number, default: 300 },
    loading: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    openDirection: { type: String, default: '' },
    showNoOptions: { type: Boolean, default: true },
    showNoResults: { type: Boolean, default: true },
    tabindex: { type: Number, default: 0 },
    internalSearch: { type: Boolean, default: true },
    options: { type: Array, required: true },
    multiple: { type: Boolean, default: false },
    value: { type: null, default: [] },
    trackBy: { type: String },
    label: { type: String },
   
    searchable: { type: Boolean, default: true },
    clearOnSelect: { type: Boolean, default: true },
    hideSelected: { type: Boolean, default: false },
    placeholder: { type: String, default: "select option" },
    allowEmpty: { type: Boolean, default: true },
    closeOnSelect: { type: Boolean, default: true },
    resetAfter: { type: Boolean, default: false },
    closeSelect: { type: Boolean, default: true },
    customLabel: { type: Function, default: typeof customLabelType },
    taggable: { type: Boolean, default: false },
    tagPlaceholder: { type: String, default: "Press enter to create a tag" },
    tagPosition: { type: String, default: "top" },
    max: { type: [Number, Boolean], default: false },
    id: { default: null },
    groupValues: { type: String },
    optionsLimit: { type: Number, default: 1000 },
    groupLabel: { type: String },
    groupSelect: { type: Boolean, default: false },
    blockKeys: { type: Array, default: typeof emptyArray },
    preserveSearch: { type: Boolean, default: false },
    preselectFirst: { type: Boolean, default: false },

    showPointer: {
      type: Boolean,
      default: true,
    },
    optionHeight: {
      type: Number,
      default: 40,
    },
  },
  emits: ["update:modelValue", "change", "blur", "input"],
  setup(props, { emit }: any) {


    const { activate } = useFormMultiSelect(props, emit)
    console.log(activate())


    return () => (
      <>
        <div tabindex={props.searchable ? -1 : props.tabindex} class= {`${isOpen && 'multiselect--active'} ${disabled && 'multiselect--disabled'} ${isAbove && 'multiselect--above'} `}></div>
      </>
    );
  }
});
