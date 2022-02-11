const isEmpty = (opt: any) => {
  if (opt === 0) return false;
  if (Array.isArray(opt) && opt.length === 0) return true;
  return !opt;
};

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

export default {
  data() {
    return {
      search: "",
      isOpen: false,
      preferredOpenDirction: "below",
      optimizadHeight: (this as any).someProperty,
    };
  },
  props: {
    internalSearch: { type: Boolean, default: true },
    options: { type: Array, required: true },
    multiple: { type: Boolean, default: false },
    value: {
      type: null,
      default() {
        return [];
      },
    },
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
    customLabel: {
      type: Function,
      default(option: any, label: string) {
        if (isEmpty(option)) return "";
        return label ? option[label] : option;
      },
    },
    taggable: {
      type: Boolean,
      default: false,
    },
    tagPlaceholder: {
      type: String,
      default: "Press enter to create a tag",
    },
    tagPosition: {
      type: String,
      default: "top",
    },
    max: {
      type: [Number, Boolean],
      default: false,
    },
    id: { default: null },
    groupValues: { type: String },
    optionsLimit: {
      type: Number,
      default: 1000,
    },
    groupLabel: {
      type: String,
    },
    groupSelect: {
      type: Boolean,
      default: false,
    },
    blockKeys: {
      type: Array,
      default() {
        return [];
      },
    },
    preserveSearch: {
      type: Boolean,
      default: false,
    },
    preselectFirst: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    if (!(this as any).multiple && (this as any).max) {
      console.warn(
        "[Vmultiselect warn]: Max prop should not be used when prop Multiple equals false."
      );
    }
    if (
      (this as any).preselectFirst &&
      !(this as any).internalValue.length &&
      (this as any).options.length
    ) {
      (this as any).select((this as any).filteredOptions[0]);
    }
  },
  computed: {
    internalValue() {
      return (this as any).value || (this as any).value === 0
        ? Array.isArray((this as any).value)
          ? (this as any).value
          : [(this as any).value]
        : [];
    },
    filteredOptions() {
      const search = (this as any).search || "";
      const normalizadSearch = search.toLowerCase().trim();

      let options = (this as any).options.concat();

      if ((this as any).internalSearch) {
        options = (this as any).groupValues
          ? (this as any).filterAndFlat(
              options,
              normalizadSearch,
              (this as any).label
            )
          : filterOptions(
              options,
              normalizadSearch,
              (this as any).label,
              (this as any).customLabel
            );
      } else {
        options = (this as any).groupValues
          ? flattenOptions(
              (this as any).groupValues,
              (this as any).groupLabel
            )(options)
          : options;
      }

      options = (this as any).hideSelected
        ? options.filter(not((this as any).isSelected))
        : options;
      if (
        (this as any).taggable &&
        normalizadSearch.length &&
        !(this as any).isExistingOption(normalizadSearch)
      ) {
        if ((this as any).tagPosition === "bottom") {
          options.push({ isTag: true, label: search });
        } else {
          options.unshift({ isTag: true, label: search });
        }
      }

      return options.slice(0, (this as any).optionsLimit);
    },
    valueKeys() {
      if ((this as any).trackBy) {
        return (this as any).internalValue.map(
          (element: any) => element[(this as any).trackBy]
        );
      } else {
        return (this as any).internalValue;
      }
    },
  },
  watch: {
    internalValue() {
      if ((this as any).resetAfter && (this as any).internalValue.length) {
        (this as any).search = "" || null;
        (this as any).$emit("input", (this as any).multiple ? [] : null);
      }
    },
    search() {
      (this as any).$emit(
        "search-change",
        (this as any).search,
        (this as any).id
      );
    },
  },
  methods: {
    getValue() {
      return (this as any).multiple
        ? (this as any).internalValue
        : (this as any).internalValue.length === 0
        ? null
        : (this as any).internalValue[0];
    },
    filterAndFlat(options: Array<any>, search: any, label: any) {
      return pipe(
        filterGroups(
          search,
          label,
          (this as any).groupValues,
          (this as any).groupLabel,
          (this as any).customLabel
        ),
        flattenOptions((this as any).groupValues, (this as any).groupLabel)
      )(options);
    },
    flatAndStrip(options: Array<any>) {
      return pipe(
        flattenOptions((this as any).groupValues, (this as any).groupLabel),
        strapiGroups
      )(options);
    },
    updateSearch(query: string) {
      (this as any).search = query;
    },
    isExistingOption(query: string) {
      return !(this as any).option
        ? false
        : (this as any).optionKeys.indexOf(query) > -1;
    },
    isSelected(option: any) {
      const opt = (this as any).trackBy
        ? option[(this as any).trackBy]
        : option;
      return (this as any).valueKeys.indexOf(opt) > -1;
    },
    isOptionDisabled(option: any) {
      return !!option.$isDisabled;
    },
    getOptionLabel(option: any) {
      if (isEmpty(option)) return "";
      if (option.isTag) return option.label;
      if (option.$isLabel) return option.$groupLabel;

      let label = (this as any).customLabel(option, (this as any).label);
      if (isEmpty(label)) return "";
      return label;
    },
    select(option: any, key: any) {
      if (option.$isLabel && (this as any).groupSelect) {
        (this as any).selectGroup(option);
        return;
      }
      if (
        (this as any).blockKeys.indexOf(key) !== -1 ||
        (this as any).disabled ||
        option.$isDisabled ||
        option.$isLabel
      )
        return;

      if (
        (this as any).max &&
        (this as any).multiple &&
        (this as any).internalValue.length === (this as any).max
      )
        return;

      if (key === "Tab" && !(this as any).pointerDirty) return;
      if (option.isTag) {
        (this as any).$emit(
          "tag",
          option.label,
          (this as any).id
        )(this as any).search = "";
        if ((this as any).closeOnSelect && !(this as any).multiple)
          (this as any).deactivate();
      } else {
        const isSelected = (this as any).isSelected(option);

        if (isSelected) {
          if (key !== "Tab") (this as any).removeElement(option);
          return;
        }

        (this as any).$emit("select", option, (this as any).id);

        if ((this as any).multiple) {
          (this as any).$emit(
            "input",
            (this as any).internalValue.concat([option]),
            (this as any).id
          );
        } else {
          (this as any).$emit("input", option, (this as any).id);
        }

        if ((this as any).clearOnSelect) (this as any).search = "";
      }

      if ((this as any).closeOnSelect) (this as any).deactivate();
    },

    selectGroup(selectedGroup: any) {
      const group = (this as any).options.find((option: any) => {
        return option[(this as any).groupLabel] === selectedGroup.$groupLabel;
      });

      if (!group) return;

      if ((this as any).wholeGroupSelected(group)) {
        (this as any).$emit(
          "remove",
          group[(this as any).groupValues],
          (this as any).id
        );

        const newValue: any = (this as any).internalValue.filter(
          (option: any) =>
            group[(this as any).groupValues].indexOf(option) === -1
        );
        (this as any).$emit("input", newValue, (this as any).id);
      } else {
        const optionsToAdd = group[(this as any).groupValues].filter(
          (option: any) =>
            !(
              (this as any).isOptionDisabled(option) ||
              (this as any).isSelected(option)
            )
        );

        (this as any)
          .$emit(
            "select",
            optionsToAdd,
            (this as any).id
          )(this as any)
          .$emit(
            "input",
            (this as any).internalValue.concat(optionsToAdd),
            (this as any).id
          );
      }

      if ((this as any).closeOnSelect) (this as any).deactivate();
    },
    wholeGroupSelected(group: any) {
      return group[(this as any).groupValues].every(
        (option: any) =>
          (this as any).isSelected(option) ||
          (this as any).isOptionDisabled(option)
      );
    },

    wholeGroupDisabled(group: any) {
      return group[(this as any).groupValues].every(
        (this as any).isOptionDisabled
      );
    },

    removeElement(option: any, shouldClose = true) {
      
      if ((this as any).disabled) return;
      
      if (option.$isDisabled) return;
      
      if (
        !(this as any).allowEmpty &&
        (this as any).internalValue.length <= 1
      ) {
        (this as any).deactivate();
        return;
      }

      const index =
        typeof option === "object"
          ? (this as any).valueKeys.indexOf(option[(this as any).trackBy])
          : (this as any).valueKeys
              .indexOf(option)(this as any)
              .$emit("remove", option, (this as any).id);
      if ((this as any).multiple) {
        const newValue = (this as any).internalValue
          .slice(0, index)
          .concat((this as any).internalValue.slice(index + 1));

        (this as any).$emit("input", newValue, (this as any).id);
      } else {
        (this as any).$emit("input", null, (this as any).id);
      }

      
      if ((this as any).closeOnSelect && shouldClose)
        (this as any).deactivate();
    },

    removeLastElement () {
        
        if ((this as any).blockKeys.indexOf('Delete') !== -1) return;
        
        if ((this as any).search.length === 0 && Array.isArray((this as any).internalValue) && (this as any).internalValue.length) {
          this.removeElement((this as any).internalValue[(this as any).internalValue.length - 1], false)
        }
      },

      activate () {
        if ((this as any).isOpen || (this as any).disabled) return
  
        (this as any).adjustPosition()
        
        if ((this as any).groupValues && (this as any).pointer === 0 && (this as any).filteredOptions.length) {
          (this as any).pointer = 1
        }
  
        (this as any).isOpen = true
        
        if ((this as any).searchable) {
          if (!(this as any).preserveSearch) (this as any).search = '';
          (this as any).$nextTick(() => (this as any).$refs.search && (this as any).$refs.search.focus())
        } else {
          (this as any).$el.focus()
        }
        (this as any).$emit('open', (this as any).id)
      },

      deactivate () {
        if (!(this as any).isOpen) return
        (this as any).isOpen = false
        if ((this as any).searchable) {
          (this as any).$refs.search && (this as any).$refs.search.blur()
        } else {
          (this as any).$el.blur()
        }
        if (!(this as any).preserveSearch) (this as any).search = '';
        (this as any).$emit('close', (this as any).getValue(), (this as any).id)
      },

      toggle () {
        (this as any).isOpen
          ? (this as any).deactivate()
          : (this as any).activate()
      },

      adjustPosition () {
        if (typeof window === 'undefined') return
  
        const spaceAbove = (this as any).$el.getBoundingClientRect().top
        const spaceBelow = window.innerHeight - (this as any).$el.getBoundingClientRect().bottom
        const hasEnoughSpaceBelow = spaceBelow > (this as any).maxHeight
  
        if (hasEnoughSpaceBelow || spaceBelow > spaceAbove || (this as any).openDirection === 'below' || (this as any).openDirection === 'bottom') {
          (this as any).preferredOpenDirection = 'below';
          (this as any).optimizedHeight = Math.min(spaceBelow - 40, (this as any).maxHeight)
        } else {
          (this as any).preferredOpenDirection = 'above';
          (this as any).optimizedHeight = Math.min(spaceAbove - 40, (this as any).maxHeight)
        }
      }
  },
};
