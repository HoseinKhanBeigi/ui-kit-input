<template>
  <div :class="classList.wrapperContainer">
    <div :class="classList.activeLabelInput(iv, classList.dropdown)">
      {{ labelName }}
    </div>
    <div
      ref="multiselect"
      :tabindex="tabindex"
      :class="classList.container"
      :id="id"
      @focusin="activate"
      @focusout="deactivate"
      @keydown="handleKeydown"
      @focus="handleFocus"
    >
      <fieldset :class="classList.fieldSetClassSelect" :aria-hidden="true">
        <legend
          :class="classList.activeLegened(iv, classList.dropdown)"
        ></legend>
      </fieldset>
      <!-- Search -->
      <template v-if="mode !== 'tags' && searchable && !disabled">
        <input
          :type="inputType"
          :modelValue="search"
          :value="search"
          :class="classList.search"
          :autocomplete="autocomplete"
          v-bind="attrs"
          @input="handleSearchInput"
          @paste.stop="handlePaste"
          ref="input"
        />
      </template>

      <!-- Tags (with search) -->
      <template v-if="mode == 'tags'">
        <div :class="classList.tags">
          <slot
            v-for="(option, i, key) in iv"
            name="tag"
            :option="option"
            :handleTagRemove="handleTagRemove"
            :disabled="disabled"
          >
            <span :class="classList.tag" :key="key">
              {{ option[label] }}
              <span
                v-if="!disabled"
                :class="classList.tagRemove"
                @click="handleTagRemove(option, $event)"
              >
                <span :class="classList.tagRemoveIcon"></span>
              </span>
            </span>
          </slot>

          <div :class="classList.tagsSearchWrapper">
            <!-- Used for measuring search width -->
            <span :class="classList.tagsSearchCopy">{{ search }}</span>
          </div>
        </div>
      </template>

      <!-- Single label -->
      <template v-if="mode == 'single' && hasSelected && !search && iv">
        <slot name="singlelabel" :value="iv">
          <div :class="classList.singleLabel">
            <span :class="classList.singleLabelText">{{ iv[label] }}</span>
          </div>
        </slot>
      </template>

      <!-- Multiple label -->
      <template v-if="mode == 'multiple' && hasSelected && !search">
        <slot name="multiplelabel" :values="iv">
          <div :class="classList.multipleLabel">
            {{ multipleLabelText }}
          </div>
        </slot>
      </template>

      <!-- Placeholder -->
      <template
        v-if="placeholder && !hasSelected && !search && !classList.dropdown[1]"
      >
        <slot name="placeholder">
          <div :class="classList.placeholder">
            {{ placeholder }}
          </div>
        </slot>
      </template>

      <!-- Spinner -->
      <slot v-if="busy && isActive" name="spinner">
        <span :class="classList.spinner"></span>
      </slot>

      <!-- Clear -->
      <slot
        v-if="hasSelected && !disabled && canClear && !busy"
        name="clear"
        :clear="clear"
      >
        <span :class="classList.clear" @mousedown="clear">
          <svg class="icon-10">
            <use xlink:href="#icon-close" />
          </svg>
        </span>
      </slot>

      <!-- Caret -->
      <slot v-if="caret && showOptions" name="caret">
        <span @click="handleCaretClick">
          <svg class="icon-arrow icon-10">
            <use xlink:href="#icon-arrow-select" />
          </svg>
        </span>
      </slot>

      <!-- Options -->
      <div :class="classList.dropdown" tabindex="-1">
        <div v-if="searchable" :class="classList.inputOption">
          <input
            placeholder="Search Somethings..."
            class="form-fieldSelect"
            v-if="searchable && !disabled"
            :type="inputType"
            :modelValue="search"
            :value="search"
            :class="classList.tagsSearch"
            :autocomplete="autocomplete"
            @input="handleSearchInput"
            @paste.stop="handlePaste"
            ref="input"
          />
        </div>
        <slot name="beforelist" :options="fo"></slot>

        <ul :class="classList.options">
          <template v-if="groups">
            <li
              v-for="(group, i, key) in fg"
              :class="classList.group"
              :key="key"
            >
              <div
                :class="classList.groupLabel(group)"
                :data-pointed="isPointed(group)"
                @mouseenter="setPointer(group)"
                @click="handleGroupClick(group)"
              >
                <slot name="grouplabel" :group="group">
                  <span>{{ group[groupLabel] }}</span>
                </slot>
              </div>

              <ul :class="classList.groupOptions">
                <li
                  v-for="(option, i, key) in group.__VISIBLE__"
                  :class="classList.option(option, group)"
                  :key="key"
                  :data-pointed="isPointed(option)"
                  @mouseenter="setPointer(option)"
                  @click="handleOptionClick(option)"
                >
                  <slot name="option" :option="option" :search="search">
                    <span>{{ option[label] }}</span>
                  </slot>
                </li>
              </ul>
            </li>
          </template>
          <template v-else>
            <li
              v-for="(option, i, key) in fo"
              :class="classList.option(option)"
              :key="key"
              :data-pointed="isPointed(option)"
              @mouseenter="setPointer(option)"
              @click="!is_checkBox && handleOptionClick(option)"
            >
              <slot name="option" :option="option" :search="search">
                <VCheckBox
                  v-if="is_checkBox"
                  v-model="checkboxes.selected"
                  v-bind="option"
                  @click="handleOptionClick(option)"
                >
                  {{ option[label] }}
                </VCheckBox>

                <span v-else>{{ option[label] }}</span>
              </slot>
            </li>
          </template>
        </ul>

        <slot v-if="noOptions" name="nooptions">
          <div :class="classList.noOptions" v-html="noOptionsText"></div>
        </slot>

        <slot v-if="noResults" name="noresults">
          <div :class="classList.noResults" v-html="noResultsText"></div>
        </slot>

        <slot name="afterlist" :options="fo"></slot>
      </div>

      <!-- Hacky input element to show HTML5 required warning -->
      <input
        v-if="required"
        :class="classList.fakeInput"
        tabindex="-1"
        :value="textValue"
        required
      />

      <!-- Native input support -->
      <template v-if="nativeSupport">
        <input
          v-if="mode == 'single'"
          type="hidden"
          :name="name"
          :value="plainValue !== undefined ? plainValue : ''"
        />
        <template v-else>
          <input
            v-for="(v, i) in plainValue"
            type="hidden"
            :name="`${name}[]`"
            :value="v"
            :key="i"
          />
        </template>
      </template>

      <!-- Create height for empty input -->
      <div :class="classList.spacer"></div>
    </div>

    <svg xmlns="http://www.w3.org/2000/svg" style="display: none">
      <symbol
        id="icon-arrow-select"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g>
          <path
            d="M.357 5.826l9.773 9 9.527-9"
            fill="none"
            stroke="currentColor"
          />
        </g>
      </symbol>
      <symbol
        id="icon-close"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g fill="currentColor">
          <path
            d="M11.916 10.147a.208.208 0 0 1 0-.295l7.719-7.718a1.251 1.251 0 0 0-1.77-1.767l-7.718 7.714a.208.208 0 0 1-.295 0L2.134.367A1.25 1.25 0 1 0 .366 2.134l7.717 7.718a.208.208 0 0 1 0 .295L.366 17.866a1.25 1.25 0 0 0 1.768 1.767l7.718-7.719a.208.208 0 0 1 .295 0l7.718 7.719a1.25 1.25 0 1 0 1.768-1.767z"
          />
        </g>
      </symbol>
    </svg>
  </div>
</template>

<script>
import useData from "./composables/useData";
import useValue from "./composables/useValue";
import useSearch from "./composables/useSearch";
import usePointer from "./composables/usePointer";
import useOptions from "./composables/useOptions";
import usePointerAction from "./composables/usePointerAction";
import useDropdown from "./composables/useDropdown";
import useMultiselect from "./composables/useMultiselect";
import useKeyboard from "./composables/useKeyboard";
import useClasses from "./composables/useClasses";
import VCheckBox from "../VCheckbox/VCheckBox.vue";
import VCheckBoxGroup from "../VCheckbox/VCheckBoxGroup.vue";

import { computed, reactive } from "vue";
import { boolean } from "yup/lib/locale";

export default {
  components: { VCheckBox },
  name: "Multiselect",
  emits: [
    "open",
    "close",
    "select",
    "deselect",
    "input",
    "search-change",
    "tag",
    "option",
    "update:modelValue",
    "change",
    "clear",
  ],
  props: {
    value: {
      required: false,
    },
    modelValue: {
      required: false,
    },
    options: {
      type: [Array, Object, Function],
      required: false,
      default: () => [],
    },
    id: {
      type: [String, Number],
      required: false,
    },
    name: {
      type: [String, Number],
      required: false,
      default: "multiselect",
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    label: {
      type: String,
      required: false,
      default: "label",
    },
    trackBy: {
      type: String,
      required: false,
      default: undefined,
    },
    valueProp: {
      type: String,
      required: false,
      default: "value",
    },
    placeholder: {
      type: String,
      required: false,
      default: null,
    },
    mode: {
      type: String,
      required: false,
      default: "single", // single|multiple|tags
    },
    searchable: {
      type: Boolean,
      required: false,
      default: false,
    },
    limit: {
      type: Number,
      required: false,
      default: -1,
    },
    hideSelected: {
      type: Boolean,
      required: false,
      default: false,
    },
    is_search: {
      type: Boolean,
      required: false,
      default: false,
    },
    createTag: {
      type: Boolean,
      required: false,
      default: undefined,
    },
    createOption: {
      type: Boolean,
      required: false,
      default: undefined,
    },
    appendNewTag: {
      type: Boolean,
      required: false,
      default: undefined,
    },
    appendNewOption: {
      type: Boolean,
      required: false,
      default: undefined,
    },
    addTagOn: {
      type: Array,
      required: false,
      default: undefined,
    },
    addOptionOn: {
      type: Array,
      required: false,
      default: undefined,
    },
    caret: {
      type: Boolean,
      required: false,
      default: true,
    },
    loading: {
      type: Boolean,
      required: false,
      default: false,
    },
    noOptionsText: {
      type: String,
      required: false,
      default: "The list is empty",
    },
    labelName: {
      type: String,
      required: false,
      default: "label",
    },
    noResultsText: {
      type: String,
      required: false,
      default: "No results found",
    },
    multipleLabel: {
      type: Function,
      required: false,
    },
    object: {
      type: Boolean,
      required: false,
      default: false,
    },
    delay: {
      type: Number,
      required: false,
      default: -1,
    },
    minChars: {
      type: Number,
      required: false,
      default: 0,
    },
    resolveOnLoad: {
      type: Boolean,
      required: false,
      default: true,
    },
    filterResults: {
      type: Boolean,
      required: false,
      default: true,
    },
    clearOnSearch: {
      type: Boolean,
      required: false,
      default: false,
    },
    clearOnSelect: {
      type: Boolean,
      required: false,
      default: true,
    },
    canDeselect: {
      type: Boolean,
      required: false,
      default: true,
    },
    canClear: {
      type: Boolean,
      required: false,
      default: true,
    },
    max: {
      type: Number,
      required: false,
      default: -1,
    },
    showOptions: {
      type: Boolean,
      required: false,
      default: true,
    },
    required: {
      type: Boolean,
      required: false,
      default: false,
    },
    openDirection: {
      type: String,
      required: false,
      default: "bottom",
    },
    nativeSupport: {
      type: Boolean,
      required: false,
      default: false,
    },
    classes: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    strict: {
      type: Boolean,
      required: false,
      default: true,
    },
    closeOnSelect: {
      type: Boolean,
      required: false,
      default: true,
    },
    autocomplete: {
      type: String,
      required: false,
    },
    groups: {
      type: Boolean,
      required: false,
      default: false,
    },
    groupLabel: {
      type: String,
      required: false,
      default: "label",
    },
    groupOptions: {
      type: String,
      required: false,
      default: "options",
    },
    groupHideEmpty: {
      type: Boolean,
      required: false,
      default: false,
    },
    groupSelect: {
      type: Boolean,
      required: false,
      default: true,
    },
    is_checkBox: {
      type: Boolean,
      required: false,
      default: false,
    },
    inputType: {
      type: String,
      required: false,
      default: "text",
    },
  },
  setup(props, context) {
    const value = useValue(props, context);
    const pointer = usePointer(props, context);
    const dropdown = useDropdown(props, context);
    const search = useSearch(props, context);

    const data = useData(props, context, {
      iv: value.iv,
    });

    const multiselect = useMultiselect(props, context, {
      input: search.input,
      open: dropdown.open,
      close: dropdown.close,
      clearSearch: search.clearSearch,
    });

    const options = useOptions(props, context, {
      ev: value.ev,
      iv: value.iv,
      search: search.search,
      clearSearch: search.clearSearch,
      update: data.update,
      pointer: pointer.pointer,
      clearPointer: pointer.clearPointer,
      blur: multiselect.blur,
      focus: multiselect.focus,
      deactivate: multiselect.deactivate,
    });

    const pointerAction = usePointerAction(props, context, {
      fo: options.fo,
      fg: options.fg,
      handleOptionClick: options.handleOptionClick,
      handleGroupClick: options.handleGroupClick,
      search: search.search,
      pointer: pointer.pointer,
      setPointer: pointer.setPointer,
      clearPointer: pointer.clearPointer,
      multiselect: multiselect.multiselect,
    });

    const keyboard = useKeyboard(props, context, {
      iv: value.iv,
      update: data.update,
      search: search.search,
      setPointer: pointer.setPointer,
      selectPointer: pointerAction.selectPointer,
      backwardPointer: pointerAction.backwardPointer,
      forwardPointer: pointerAction.forwardPointer,
      blur: multiselect.blur,
      fo: options.fo,
    });

    const classes = useClasses(props, context, {
      isOpen: dropdown.isOpen,
      isPointed: pointerAction.isPointed,
      canPointGroups: pointerAction.canPointGroups,
      isSelected: options.isSelected,
      isDisabled: options.isDisabled,
      isActive: multiselect.isActive,
      resolving: options.resolving,
      fo: options.fo,
    });

    const childUpdated = (optionsValue, checkedValue) => {
      console.log(optionsValue);
      const resp = optionsValue.value.filter((e) => e.value !== checkedValue);
      console.log(resp, "resppp");
    };

    const checkboxes = reactive({
      status: "accepted",
      selected: [],
      options: options.fo.value,
    });

    const handleClick = () => {
      console.log("hii");
    };

    return {
      handleClick,
      childUpdated,
      checkboxes,
      ...value,
      ...dropdown,
      ...multiselect,
      ...pointer,
      ...data,
      ...search,
      ...options,
      ...pointerAction,
      ...keyboard,
      ...classes,
    };
  },
};
</script>

<style lang="scss" scoped>
.fieldSetClassSelect {
  margin: 0;
  padding: 0;
  left: 0;
  right: 0;
  border-collapse: collapse;
  border: 1px solid silver;
  border-radius: var(--border-radius-3);
  height: 100%;
  position: absolute;
  transition-duration: 0.15s;
  transition-property: color;
}
.vInput {
  display: flex;
  width: 100%;
  align-items: center;
  height: 45px;
}
.legendClassSelect {
  display: table;
  white-space: normal;
  max-width: 100%;
  color: inherit;
  text-align: left;
  line-height: 11px;
  min-width: 28px;
  margin-left: 8px;
}
.legendClassSelectdeActive {
  display: none;
}
.warpSelect {
  display: flex;
  height: auto;
  flex-grow: 1;
  flex-wrap: wrap;
  position: relative;
  width: 100%;
  border-radius: inherit;
}

.form-fieldSelect {
  font-size: 14px;

  &::placeholder {
    font-size: 14px;
  }
}

.nameLabelForSelect {
  position: absolute;
  font-size: 30px;
  white-space: nowrap;
  transform: translate(0, 0);
  top: 0;
  left: 0;
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

.inputOption {
  padding: 12px;
}

.labelname {
  position: absolute;
  top: 8px;
  left: 10px;
  z-index: 10;
  color: silver;
}

.activelabel {
  animation: labelName 0.3s ease-in-out;
  transform: scale(0.8);
  color: rgb(150, 150, 150);
  font-size: 14px;
  position: absolute;
  top: -10px;
  left: 10px;
  z-index: 10;
}

@keyframes labelName {
  0% {
    top: 0;
  }
  100% {
    top: -12px;
    /* left: 30px; */
  }
}

.wrapper-container {
  position: relative;
}

.multiselect {
  position: relative;
  margin: 0 auto;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  box-sizing: border-box;
  cursor: pointer;
  outline: none;
  border: none;
  border-radius: var(--ms-radius, 4px);
  background: var(--ms-bg, #fff);
  font-size: var(--ms-font-size, 1rem);
  min-height: calc(
    var(--ms-border-width, 1px) * 2 + var(--ms-font-size, 1rem) *
      var(--ms-line-height, 1.375) + var(--ms-py, 0.5rem) * 2
  );
}
.multiselect.is-open {
  border-radius: var(--ms-radius, 4px) var(--ms-radius, 4px) 0 0;
}
.multiselect.is-open-top {
  border-radius: 0 0 var(--ms-radius, 4px) var(--ms-radius, 4px);
}
.multiselect.is-disabled {
  cursor: default;
  background: var(--ms-bg-disabled, #f3f4f6);
}

.multiselect-multiple-label,
.multiselect-placeholder,
.multiselect-single-label {
  display: flex;
  align-items: center;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  pointer-events: none;
  background: transparent;
  line-height: var(--ms-line-height, 1.375);
  padding-left: var(--ms-px, 0.875rem);
  padding-right: calc(1.25rem + var(--ms-px, 0.875rem) * 3);
  box-sizing: border-box;
  max-width: 100%;
}
.multiselect-placeholder {
  color: var(--ms-placeholder-color, #9ca3af);
}
.multiselect-single-label-text {
  overflow: hidden;
  display: block;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 100%;
}
.multiselect-search {
  width: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  outline: none;
  box-sizing: border-box;
  border: 0;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  font-size: inherit;
  font-family: inherit;
  background: var(--ms-bg, #fff);
  border-radius: var(--ms-radius, 4px);
  padding-left: var(--ms-px, 0.875rem);
}
.multiselect-search::-webkit-search-cancel-button,
.multiselect-search::-webkit-search-decoration,
.multiselect-search::-webkit-search-results-button,
.multiselect-search::-webkit-search-results-decoration {
  -webkit-appearance: none;
}
.multiselect-tags {
  flex-grow: 1;
  flex-shrink: 1;
  display: flex;
  flex-wrap: wrap;
  margin: var(--ms-tag-my, 0.25rem) 0 0;
  // padding-left: var(--ms-py, 0.5rem);
  align-items: center;
  padding: 1px 0 5px 9px;
}

.multiselect-dropdown {
  // height: 150px;
  overflow-y: auto;
}

.multiselect-dropdown::-webkit-scrollbar-track {
  background-color: #ffffff;
}

.multiselect-dropdown::-webkit-scrollbar {
  width: 5px;
  background-color: #ffffff;
}

.multiselect-dropdown::-webkit-scrollbar-thumb {
  background-color: #dedede;
}

.multiselect-tag {
  line-height: var(--ms-tag-line-height, 1.25rem);

  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 0 1 auto;
  border-radius: var(--border-radius-3);
  padding: 2px 5px;
  margin: 2.5px;
  min-width: fit-content;
  background: #f0f0f0;
  font-size: 12px;
  text-transform: capitalize;
  color: black;

  /* white-space: nowrap; */
}
.multiselect-tag.is-disabled {
  padding-right: var(--ms-tag-px, 0.5rem);
  background: var(--ms-tag-bg-disabled, #9ca3af);
  color: var(--ms-tag-color-disabled, #fff);
}
.multiselect-tag-remove {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--ms-tag-remove-py, 0.25rem) var(--ms-tag-remove-px, 0.25rem);
  margin: var(--ms-tag-remove-my, 0) var(--ms-tag-remove-mx, 0.125rem);
  border-radius: var(--ms-tag-remove-radius, 4px);
}
.multiselect-tag-remove:hover {
  background: rgba(0, 0, 0, 0.06274509803921569);
}
.multiselect-tag-remove-icon {
  -webkit-mask-image: url("data:image/svg+xml;charset=utf-8,%3Csvg viewBox='0 0 320 512' fill='currentColor' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M207.6 256l107.72-107.72c6.23-6.23 6.23-16.34 0-22.58l-25.03-25.03c-6.23-6.23-16.34-6.23-22.58 0L160 208.4 52.28 100.68c-6.23-6.23-16.34-6.23-22.58 0L4.68 125.7c-6.23 6.23-6.23 16.34 0 22.58L112.4 256 4.68 363.72c-6.23 6.23-6.23 16.34 0 22.58l25.03 25.03c6.23 6.23 16.34 6.23 22.58 0L160 303.6l107.72 107.72c6.23 6.23 16.34 6.23 22.58 0l25.03-25.03c6.23-6.23 6.23-16.34 0-22.58L207.6 256z'/%3E%3C/svg%3E");
  mask-image: url("data:image/svg+xml;charset=utf-8,%3Csvg viewBox='0 0 320 512' fill='currentColor' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M207.6 256l107.72-107.72c6.23-6.23 6.23-16.34 0-22.58l-25.03-25.03c-6.23-6.23-16.34-6.23-22.58 0L160 208.4 52.28 100.68c-6.23-6.23-16.34-6.23-22.58 0L4.68 125.7c-6.23 6.23-6.23 16.34 0 22.58L112.4 256 4.68 363.72c-6.23 6.23-6.23 16.34 0 22.58l25.03 25.03c6.23 6.23 16.34 6.23 22.58 0L160 303.6l107.72 107.72c6.23 6.23 16.34 6.23 22.58 0l25.03-25.03c6.23-6.23 6.23-16.34 0-22.58L207.6 256z'/%3E%3C/svg%3E");
  -webkit-mask-position: center;
  mask-position: center;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-size: contain;
  mask-size: contain;
  background-color: currentColor;
  opacity: 0.8;
  display: inline-block;
  width: 0.75rem;
  height: 0.75rem;
}
.multiselect-tags-search-wrapper {
  display: inline-block;
  position: relative;
  margin: 0 var(--ms-tag-mx, 4px) var(--ms-tag-my, 4px);
  flex-grow: 1;
  flex-shrink: 1;
  height: 100%;
}
.multiselect-tags-search-copy {
  visibility: hidden;
  white-space: pre-wrap;
  display: inline-block;
  height: 1px;
  width: 100%;
}
.multiselect-tags-search {
  border: 1px solid #eee;
  padding: 0 10px;
  position: relative;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;

  -webkit-appearance: none;
  -moz-appearance: none;
  outline: none;
  font-size: inherit;
  font-family: inherit;
  box-sizing: border-box;
  width: 100%;
  height: 40px;
  border-radius: 3px;
  appearance: none;
}
.multiselect-tags-search::-webkit-search-cancel-button,
.multiselect-tags-search::-webkit-search-decoration,
.multiselect-tags-search::-webkit-search-results-button,
.multiselect-tags-search::-webkit-search-results-decoration {
  -webkit-appearance: none;
}
.multiselect-spinner {
  -webkit-mask-image: url("data:image/svg+xml;charset=utf-8,%3Csvg viewBox='0 0 512 512' fill='currentColor' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M456.433 371.72l-27.79-16.045c-7.192-4.152-10.052-13.136-6.487-20.636 25.82-54.328 23.566-118.602-6.768-171.03-30.265-52.529-84.802-86.621-144.76-91.424C262.35 71.922 256 64.953 256 56.649V24.56c0-9.31 7.916-16.609 17.204-15.96 81.795 5.717 156.412 51.902 197.611 123.408 41.301 71.385 43.99 159.096 8.042 232.792-4.082 8.369-14.361 11.575-22.424 6.92z'/%3E%3C/svg%3E");
  mask-image: url("data:image/svg+xml;charset=utf-8,%3Csvg viewBox='0 0 512 512' fill='currentColor' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M456.433 371.72l-27.79-16.045c-7.192-4.152-10.052-13.136-6.487-20.636 25.82-54.328 23.566-118.602-6.768-171.03-30.265-52.529-84.802-86.621-144.76-91.424C262.35 71.922 256 64.953 256 56.649V24.56c0-9.31 7.916-16.609 17.204-15.96 81.795 5.717 156.412 51.902 197.611 123.408 41.301 71.385 43.99 159.096 8.042 232.792-4.082 8.369-14.361 11.575-22.424 6.92z'/%3E%3C/svg%3E");
  -webkit-mask-position: center;
  mask-position: center;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-size: contain;
  mask-size: contain;
  background-color: var(--ms-spinner-color, #7a7a7a);
  width: 1rem;
  height: 1rem;
  z-index: 10;
  margin: 0 var(--ms-px, 0.875rem) 0 0;
  -webkit-animation: multiselect-spin 1s linear infinite;
  animation: multiselect-spin 1s linear infinite;
  flex-shrink: 0;
  flex-grow: 0;
}
.multiselect-clear {
  padding: 0 var(--ms-px, 0.875rem) 0 0;
  position: relative;
  z-index: 10;
  opacity: 1;
  transition: 0.3s;
  flex-shrink: 0;
  flex-grow: 0;
  display: flex;
}
.multiselect-clear:hover .multiselect-clear-icon {
  background-color: var(--ms-clear-color-hover, #000);
}
.multiselect-clear-icon {
  -webkit-mask-image: url("data:image/svg+xml;charset=utf-8,%3Csvg viewBox='0 0 320 512' fill='currentColor' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M207.6 256l107.72-107.72c6.23-6.23 6.23-16.34 0-22.58l-25.03-25.03c-6.23-6.23-16.34-6.23-22.58 0L160 208.4 52.28 100.68c-6.23-6.23-16.34-6.23-22.58 0L4.68 125.7c-6.23 6.23-6.23 16.34 0 22.58L112.4 256 4.68 363.72c-6.23 6.23-6.23 16.34 0 22.58l25.03 25.03c6.23 6.23 16.34 6.23 22.58 0L160 303.6l107.72 107.72c6.23 6.23 16.34 6.23 22.58 0l25.03-25.03c6.23-6.23 6.23-16.34 0-22.58L207.6 256z'/%3E%3C/svg%3E");
  mask-image: url("data:image/svg+xml;charset=utf-8,%3Csvg viewBox='0 0 320 512' fill='currentColor' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M207.6 256l107.72-107.72c6.23-6.23 6.23-16.34 0-22.58l-25.03-25.03c-6.23-6.23-16.34-6.23-22.58 0L160 208.4 52.28 100.68c-6.23-6.23-16.34-6.23-22.58 0L4.68 125.7c-6.23 6.23-6.23 16.34 0 22.58L112.4 256 4.68 363.72c-6.23 6.23-6.23 16.34 0 22.58l25.03 25.03c6.23 6.23 16.34 6.23 22.58 0L160 303.6l107.72 107.72c6.23 6.23 16.34 6.23 22.58 0l25.03-25.03c6.23-6.23 6.23-16.34 0-22.58L207.6 256z'/%3E%3C/svg%3E");
  background-color: var(--ms-clear-color, #999);
  display: inline-block;
  transition: 0.3s;
}
.multiselect-caret,
.multiselect-clear-icon {
  -webkit-mask-position: center;
  mask-position: center;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-size: contain;
  mask-size: contain;
  width: 0.625rem;
  height: 1.125rem;
}
.multiselect-caret {
  transform: rotate(0deg);
  transition: transform 0.3s;
  -webkit-mask-image: url("data:image/svg+xml;charset=utf-8,%3Csvg viewBox='0 0 320 512' fill='currentColor' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z'/%3E%3C/svg%3E");
  mask-image: url("data:image/svg+xml;charset=utf-8,%3Csvg viewBox='0 0 320 512' fill='currentColor' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z'/%3E%3C/svg%3E");
  background-color: var(--ms-caret-color, #999);
  margin: 0 var(--ms-px, 0.875rem) 0 0;
  position: relative;
  z-index: 10;
  flex-shrink: 0;
  flex-grow: 0;
  pointer-events: none;
}
.multiselect-caret.is-open {
  transform: rotate(180deg);
  pointer-events: auto;
}

.icon-10 {
  width: 10px;
  height: 10px;
}
.icon-arrow {
  padding-right: 10px;
}
.multiselect-dropdown {
  position: absolute;
  // left: calc(var(--ms-border-width, 1px) * -1);
  // right: calc(var(--ms-border-width, 1px) * -1);
  left: 0;
  right: 0;
  bottom: 0;
  transform: translateY(100%);
  border: var(--ms-dropdown-border-width, 1px) solid
    var(--ms-dropdown-border-color, #d1d5db);
  margin-top: calc(var(--ms-border-width, 1px) * -1);
  max-height: 15rem;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  z-index: 100;
  background: var(--ms-dropdown-bg, #fff);
  display: flex;
  flex-direction: column;
  border-radius: 0 0 var(--ms-dropdown-radius, 4px)
    var(--ms-dropdown-radius, 4px);
  outline: none;
}
.multiselect-dropdown.is-top {
  transform: translateY(-100%);
  top: var(--ms-border-width, 1px);
  bottom: auto;
  flex-direction: column-reverse;
  border-radius: var(--ms-dropdown-radius, 4px) var(--ms-dropdown-radius, 4px) 0
    0;
}
.multiselect-dropdown.is-hidden {
  display: none;
}
.multiselect-options {
  padding: 0;
  margin: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  max-height: var(--ms-max-height, 10rem);
}
.multiselect-options.is-top {
  flex-direction: column-reverse;
}
.multiselect-group {
  padding: 0;
  margin: 0;
}
.multiselect-group-label {
  padding: var(--ms-group-label-py, 0.3rem) var(--ms-group-label-px, 0.75rem);
  font-size: 0.875rem;
  font-weight: 600;
  background: var(--ms-group-label-bg, #e5e7eb);
  color: var(--ms-group-label-color, #374151);
  cursor: default;
  line-height: var(--ms-group-label-line-height, 1.375);
  display: flex;
  box-sizing: border-box;
  text-decoration: none;
  align-items: center;
  justify-content: flex-start;
  text-align: left;
}
.multiselect-group-label.is-pointable {
  cursor: pointer;
}
.multiselect-group-label.is-pointed {
  background: var(--ms-group-label-bg-pointed, #d1d5db);
  color: var(--ms-group-label-color-pointed, #374151);
}
.multiselect-group-label.is-selected {
  /* background: var(--ms-group-label-bg-selected, #059669); */
  color: var(--ms-group-label-color-selected, rgb(148, 148, 148));
}
.multiselect-group-label.is-disabled {
  background: var(--ms-group-label-bg-disabled, #f3f4f6);
  color: var(--ms-group-label-color-disabled, #d1d5db);
  cursor: not-allowed;
}
.multiselect-group-label.is-selected.is-pointed {
  /* background: var(--ms-group-label-bg-selected-pointed, #0c9e70); */
  color: var(--ms-group-label-color-selected-pointed, #fff);
}
.multiselect-group-label.is-selected.is-disabled {
  background: var(--ms-group-label-bg-selected-disabled, #610005);
  color: var(--ms-group-label-color-selected-disabled, #d1fae5);
}
.multiselect-group-options {
  padding: 0;
  margin: 0;
}
.multiselect-option {
  padding: var(--ms-option-py, 0.5rem) var(--ms-option-px, 0.75rem);
  font-size: 13px;
  line-height: var(--ms-option-line-height, 1.375);
  cursor: pointer;
  display: flex;
  box-sizing: border-box;
  text-decoration: none;
  align-items: center;
  justify-content: flex-start;
  text-align: left;
}
.multiselect-option.is-pointed {
  background: var(--ms-option-bg-pointed, #f3f4f6);
  color: var(--ms-option-color-pointed, #1f2937);
}
.multiselect-option.is-selected {
  /* background: var(--ms-option-bg-selected, #10b981); */
  color: var(--ms-option-color-selected, #fff);
}
.multiselect-option.is-disabled {
  background: var(--ms-option-bg-disabled, #fff);
  color: var(--ms-option-color-disabled, #d1d5db);
  cursor: not-allowed;
}
.multiselect-option.is-selected.is-pointed {
  /* background: var(--ms-option-bg-selected-pointed, #26c08e); */
  color: var(--ms-option-color-selected-pointed, #fff);
}
.multiselect-option.is-selected.is-disabled {
  /* background: var(--ms-option-bg-selected-disabled, #87dcc0); */
  color: var(--ms-option-color-selected-disabled, #d1fae5);
}
.multiselect-no-options,
.multiselect-no-results {
  padding: var(--ms-option-py, 0.5rem) var(--ms-option-px, 0.75rem);
  color: var(--ms-empty-color, #4b5563);
}
.multiselect-fake-input {
  background: transparent;
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  width: 100%;
  height: 1px;
  border: 0;
  padding: 0;
  font-size: 0;
  outline: none;
}
.multiselect-fake-input:active,
.multiselect-fake-input:focus {
  outline: none;
}
.multiselect-spacer {
  display: none;
}
@-webkit-keyframes multiselect-spin {
  0% {
    transform: rotate(0);
  }
  to {
    transform: rotate(1turn);
  }
}
@keyframes multiselect-spin {
  0% {
    transform: rotate(0);
  }
  to {
    transform: rotate(1turn);
  }
}
</style>
