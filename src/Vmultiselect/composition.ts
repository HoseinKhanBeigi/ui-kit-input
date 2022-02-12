import { ref, computed, watch } from "vue";

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
  props: {
    internalSearch: { type: Boolean, default: true },
    options: { type: Array, required: true },
    multiple: { type: Boolean, default: false },
    value: { type: null, default: [] },
    trackBy: { type: String },
    label: { type: String },
    disabled: { type: Boolean, default: false },
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
    maxHeight: { type: Number, default: 300 },
  },

  setup(props: any, { slots, attrs, emit }: any) {
    let search = "";
    let isOpen = false;
    let preferredOpenDirection = "below";
    let optimizedHeight = props.maxHeight;
    let   pointer = 0;
    let    pointerDirty = false

    const internalValue = computed(() =>
      props.value || props.value === 0
        ? Array.isArray(props.value)
          ? props.value
          : [props.value]
        : []
    );

    const optionKeys = computed(() => {
      const options = props.groupValues
        ? flatAndStrip(props.options)
        : props.options;
      return options.map((element: any) =>
        props.customLabel(element, props.label).toString().toLowerCase()
      );
    });

    const valueKeys = computed(() => {
      if (props.trackBy) {
        return internalValue.value.map(
          (element: any) => element[props.trackBy]
        );
      } else {
        return internalValue.value;
      }
    });

 const  watch()

 const filteredOptions = computed(()=>{
  
    const normalizedSearch = search.toLowerCase().trim()
    let options = props.options.concat()

    if (props.internalSearch) {
      options = props.groupValues
        ? filterAndFlat(options, normalizedSearch, props.label)
        : filterOptions(options, normalizedSearch, props.label, props.customLabel)
    } else {
      options = props.groupValues ? flattenOptions(props.groupValues, props.groupLabel)(options) : options
    }

    options = props.hideSelected
      ? options.filter(not(isSelected))
      : options

    if (props.taggable && normalizedSearch.length && !isExistingOption(normalizedSearch)) {
      if (props.tagPosition === 'bottom') {
        options.push({ isTag: true, label: search })
      } else {
        options.unshift({ isTag: true, label: search })
      }
    }

    return options.slice(0, props.optionsLimit)
  
 }); 

 const currentOptionLabel = computed(() =>{
  return props.multiple
    ? props.searchable ? '' : props.placeholder
    : internalValue.value.length
      ? getOptionLabel(internalValue.value[0])
      : props.searchable ? '' : props.placeholder
})



 

    const getValue = () => {
      return props.multiple
        ? internalValue.value
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

    const flatAndStrip = (options: Array<any>) => {
      return pipe(
        flattenOptions(props.groupValues, props.groupLabel),
        strapiGroups
      )(options);
    };

    const updateSearch = (query: string) => {
      search = query;
    };
    const isExistingOption = (query: string) => {
      return !props.options ? false : optionKeys.value.indexOf(query) > -1;
    };

    const isOptionDisabled = (option: any) => {
      return !!option.isDisabled;
    };

    const isSelected = (option: any) => {
      const opt = props.trackBy ? option[props.trackBy] : option;
      return valueKeys.value.indexOf(opt) > -1;
    };

    const getOptionLabel = (option: any) => {
      if (isEmpty(option)) return "";
      if (option.isTag) return option.label;
      if (option.isLabel) return option.groupLabel;
      let label = props.customLabel(option, props.label);
      if (isEmpty(label)) return "";
      return label;
    };

    const select = (option: any, key: any) => {
      if (option.isLabel && props.groupSelect) {
        selectGroup(option);
        return;
      }
      if (
        props.blockKeys.indexOf(key) !== -1 ||
        option.isDisabled ||
        option.isLabel
      )
        return;

      if (
        props.max &&
        props.multiple &&
        internalValue.value.length === props.max
      )
        return;

      if (key === "Tab" && !pointerDirty) return;
      if (option.isTag) {
        emit("tag", option.label, props.id);
        search = "";
        if (props.closeOnSelect && !props.multiple) deactivate();
      } else {
        if (isSelected(option)) {
          if (key !== "Tab") removeElement(option);
          return;
        }

        emit("select", option, props.id);

        if (props.multiple) {
          emit("input", internalValue.value.concat([option]), props.id);
        } else {
          emit("input", option, props.id);
        }
        if (props.clearOnSelect) search = "";
      }

      if (props.closeOnSelect) deactivate();
    };

    const selectGroup = (selectedGroup: any) => {
      const group = props.options.find((option: any) => {
        return option[props.groupLabel] === selectedGroup.groupLabel;
      });

      if (!group) return;

      if (wholeGroupSelected(group)) {
        emit("remove", group[props.groupValues], props.id);

        const newValue = internalValue.value.filter(
          (option: any) => group[props.groupValues].indexOf(option) === -1
        );

        emit("input", newValue, props.id);
      } else {
        const optionsToAdd = group[props.groupValues].filter(
          (option: any) => !(isOptionDisabled(option) || isSelected(option))
        );

        emit("select", optionsToAdd, props.id);
        emit("input", internalValue.value.concat(optionsToAdd), props.id);
      }
      if (props.closeOnSelect) deactivate();
    };

    const wholeGroupSelected = (group: any) => {
      return group[props.groupValues].every(
        (option: any) => isSelected(option) || isOptionDisabled(option)
      );
    };

    const removeElement = (option: any, shouldClose = true) => {
      if (props.disabled) return;
      if (option.isDisabled) return;

      if (!props.allowEmpty && internalValue.value.length <= 1) {
        deactivate();
        return;
      }

      const index =
        typeof option === "object"
          ? valueKeys.value.indexOf(option[props.trackBy])
          : valueKeys.value.indexOf(option);

      emit("remove", option, props.id);
      if (props.multiple) {
        const newValue = internalValue.value
          .slice(0, index)
          .concat(internalValue.value.slice(index + 1));
        emit("input", newValue, props.id);
      } else {
        emit("input", null, props.id);
      }
      if (props.closeOnSelect && shouldClose) deactivate();
    };

  const  activate= ()=> {
     
      if (isOpen || props.disabled) return;

      adjustPosition();
    
      if (props.groupValues && pointer === 0 && filteredOptions.value.length) {
        pointer = 1;
      }

      isOpen = true;
    
      if (props.searchable) {
        if (!props.preserveSearch) search = '';
        // this.$nextTick(() => this.$refs.search && this.$refs.search.focus())
      } else {
        // this.$el.focus()
      }
      emit('open', props.id);
    };

   const toggle =  () => {
      isOpen
        ? deactivate()
        : activate()
    };
   
  const  adjustPosition = () =>{
      if (typeof window === 'undefined') return

      let myElement:HTMLElement | null = document.getElementById(`id`);
      var rect = myElement.getBoundingClientRect();

      // const spaceAbove = div.getBoundingClientRect().top
      // const spaceBelow = window.innerHeight - document.getBoundingClientRect().bottom
      // const hasEnoughSpaceBelow = spaceBelow > props.maxHeight

      // if (hasEnoughSpaceBelow || spaceBelow > spaceAbove || this.openDirection === 'below' || this.openDirection === 'bottom') {
      //   this.preferredOpenDirection = 'below'
      //   this.optimizedHeight = Math.min(spaceBelow - 40, this.maxHeight)
      // } else {
      //   this.preferredOpenDirection = 'above'
      //   this.optimizedHeight = Math.min(spaceAbove - 40, this.maxHeight)
      // }
    };

    const deactivate = () => {
      if (!isOpen) return;
      isOpen = false;
      if (props.searchable) {
        // this.$refs.search && this.$refs.search.blur()
      } else {
        emit("blur");
      }
      if (!props.preserveSearch) search = "";
      emit("close", getValue(), props.id);
    };
  },
};
