import { ref, computed } from "vue";

function isEmpty(opt: any) {
  if (opt === 0) return false;
  if (Array.isArray(opt) && opt.length === 0) return true;
  return !opt;
}

const not = (fun: Function) => {
  return (...params: any) => !fun(...params);
};

const includes = (str: String | Boolean, query: String) => {
  if (str === undefined) str = "undefined";
  if (str === null) str = "null";
  if (str === false) str = "false";
  const text = str.toString().toLowerCase();
  return text.indexOf(query.trim()) !== -1;
};

const filterOptions = (
  options: Array<any>,
  search: string,
  label: string,
  customLabel: Function
) => {
  return options.filter((option: any) =>
    includes(customLabel(option, label), search)
  );
};

const strapiGroups = (options: Array<any>) => {
  return options.filter((option: any) => !option.$isLabel);
};

const flattenOptions = (values: any, label: any) => {
  return (options: Array<any>) =>
    options.reduce((prev, curr) => {
      if (curr[values] && curr[values].length) {
        prev.push({
          $groupLabel: curr[label],
          $isLabel: true,
        });
        return prev.concat(curr[values]);
      }
      return prev;
    }, []);
};

const filterGroups = (
  search: any,
  label: any,
  values: any,
  groupLabel: any,
  customLabel: any
) => {
  return (groups: any) =>
    groups.map((group: any) => {
      if (!group[values]) {
        console.warn(
          `option based to vue-multiselect do not contain groups, despite the config`
        );
        return [];
      }
      const groupOptions = filterOptions(
        group[values],
        search,
        label,
        customLabel
      );

      return groupOptions.length
        ? { [groupLabel]: group[groupLabel], [values]: groupOptions }
        : [];
    });
};

const pipe =
  (...fns: any) =>
  (x: any) =>
    fns.reduce((v: any, f: any) => f(v), x);

const customLabelType = (option: any, label: String | any): any => {
  if (isEmpty(option)) return "";
  return label ? option[label] : option;
};
const emptyArray = () => [];

export default {
  props:{
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
    maxHeight: { type: Number, default: 300 }
  },

  setup(props:any) {
    let search = "";
    const isOpen = ref(false);
    const preferredOpenDirection = ref("below");
    const optimizedHeight = ref(props.maxHeight);

    const internalValue = computed(() =>
      props.value || props.value === 0
        ? Array.isArray(props.value)
          ? props.value
          : [props.value]
        : []
    );

    const flatAndStrip = (options: Array<any>) => {
      return pipe(
        flattenOptions(props.groupValues, props.groupLabel),
        strapiGroups
      )(options);
    };
    const optionKeys = computed(() => {
      const options = props.groupValues
        ? flatAndStrip(props.options)
        : props.options;
      return options.map((element: any) =>
        props.customLabel(element, props.label).toString().toLowerCase()
      );
    });

    const getValue = () => {
      return props.multiple
        ? internalValue
        : internalValue.value.length === 0
        ? null
        : internalValue.value[0];
    };

    const filterAndFlat = (options: Array<any>, search: any, label: any) => {
      return pipe(
        filterGroups(
          search,
          label,
          props.groupValues,
          props.groupLabel,
          props.customLabel
        ),
        flattenOptions(props.groupValues, props.groupLabel)
      )(options);
    };

    const updateSearch = (query: string) => {
      search = query;
    };
    const isExistingOption = (query: string) => {
      return !props.options ? false : optionKeys.value.indexOf(query) > -1;
    };
  },
};
