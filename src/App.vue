<template>
  <div>
    <div class="test">
      <Multiselect
        v-model="multiselectAsync.value"
        v-bind="multiselectAsync"
      ></Multiselect>
      <Multiselect
        v-model="selectOption.value"
        v-bind="selectOption"
      ></Multiselect>
      <Multiselect
        v-model="selectOption2.value"
        v-bind="selectOption2"
      ></Multiselect>
      <Multiselect
        v-model="selectOption3.value"
        v-bind="selectOption3"
      ></Multiselect>
      <Multiselect
        v-model="selectOption4.value"
        v-bind="selectOption4"
      ></Multiselect>
      <Multiselect
        v-model="selectOption5.value"
        v-bind="selectOption5"
      ></Multiselect>
       <Multiselect
        v-model="selectOption6.value"
        v-bind="selectOption6"
      ></Multiselect>
    <Multiselect
      v-model="selectOption7.value"
      v-bind="selectOption7"
    >
      <template v-slot:tag="{ option, handleTagRemove, disabled }">
        <div class="multiselect-tag is-user">
          <img :src="option.image">
          {{ option.name }}
          <span
            v-if="!disabled"
            class="multiselect-tag-remove"
            @mousedown.prevent="handleTagRemove(option, $event)"
          >
            <span class="multiselect-tag-remove-icon"></span>
          </span>
        </div>
      </template>

      <template v-slot:option="{ option }">
        <img class="user-image" :src="option.image"> {{ option.name }}
      </template>
    </Multiselect>
    </div>

    <div class="example">
      <div class="output">Data: {{ Vswitch.value }}</div>
      <VSwitch v-model="Vswitch.value" v-bind="Vswitch"></VSwitch>
    </div>
    <div>
      <VInput id="input-1" v-model="book.title" :name="book.title" placeholder="place enter you name"></VInput>
    </div>
    <div>
      <VTextarea id="textarea-2" v-model="book.main"></VTextarea>
    </div>
    <div>
      <VRadio
        v-model="radioButton"
        :aria-describedby="ariaDescribedby"
        name="some-radios"
        value="A"
        >Option A</VRadio
      >
      <VRadio
        v-model="radioButton"
        :aria-describedby="ariaDescribedby"
        name="some-radios"
        value="B"
        >Option B</VRadio
      >
    </div>

    <VCheckBoxGroup
      id="checkbox-group-1"
      v-model="checkboxes.selected"
      :options="checkboxes.options"
    />
  </div>
</template>

<script>
import { ref, reactive, computed } from "vue";
import { VInput } from "./VInput/VInput.tsx";
import { VTextarea } from "./VTextarea/VTextarea.tsx";

import Multiselect from "./VSelect/Multiselect.vue";
import VSwitch from "./VSwitch/VSwitch.vue";
import VCheckBoxGroup from "./VCheckbox/VCheckBoxGroup.vue";
import VRadio from "./VRadio/VRadio.vue";

const fetchLanguages = async (query) => {
  let where = "";
  if (query) {
    where =
      "&where=" +
      encodeURIComponent(
        JSON.stringify({
          ProgrammingLanguage: {
            $regex: `${query}|${query.toUpperCase()}|${
              query[0].toUpperCase() + query.slice(1)
            }`,
          },
        })
      );
  }

  const response = await fetch(
    "https://parseapi.back4app.com/classes/All_Programming_Languages?order=ProgrammingLanguage&keys=ProgrammingLanguage" +
      where,
    {
      headers: {
        "X-Parse-Application-Id": "XpRShKqJcxlqE5EQKs4bmSkozac44osKifZvLXCL", // This is the fake app's application id
        "X-Parse-Master-Key": "Mr2UIBiCImScFbbCLndBv8qPRUKwBAq27plwXVuv", // This is the fake app's readonly master key
      },
    }
  );

  const data = await response.json(); // Here you have the data that you need

  return data.results.map((item) => {
    return { value: item.ProgrammingLanguage, label: item.ProgrammingLanguage };
  });
};

export default {
  components: {
    VInput,
    VTextarea,
    Multiselect,
    VSwitch,
    VCheckBoxGroup,
    VRadio,
  },
  setup(props) {
    const book = reactive({ title: "", main: "main" });
    const radioButton = ref("A");

    const optionsSelect = [
      { name: "Vue.js", code: "vu" },
      { name: "Javascript", code: "js" },
      { name: "Open Source", code: "os" },
    ];
    const multiselectAsync = {
      mode: "tags",
      closeOnSelect: false,
      value: [],
      placeholder: "Choose your stack",
      filterResults: false,
      minChars: 1,
      resolveOnLoad: false,
      delay: 0,
      searchable: true,
      options: async (query) => {
        return await fetchLanguages(query);
      },
    };

    const selectOption = {
      value: 0,
      options: ["Batman", "Robin", "Joker"],
    };

    const selectOption2 = {
      mode: "multiple",
      value: ["robin"],
      closeOnSelect: false,
      options: {
        batman: "Batman",
        robin: "Robin",
        joker: "Joker",
      },
    };

    const selectOption3 = {
      mode: "multiple",
      value: [],
      closeOnSelect: false,
      options: [
        { value: "batman", label: "Batman" },
        { value: "robin", label: "Robin", disabled: true },
        { value: "joker", label: "Joker" },
      ],
    };

    const selectOption4 = {
      mode: "multiple",
      groups: true,
      value: [],
      closeOnSelect: false,
      options: [
        {
          label: "DC",
          options: ["Batman", "Robin", "Joker"],
        },
        {
          label: "Marvel",
          options: ["Spiderman", "Iron Man", "Captain America"],
        },
      ],
    };
    const selectOption5 = {
      mode: "tags",
      value: ["batman"],
      closeOnSelect: false,
      options: [
        { value: "batman", label: "Batman" },
        { value: "robin", label: "Robin" },
        { value: "joker", label: "Joker" },
      ],
      searchable: true,
      createOption: true,
    };

    const selectOption6 = {
      mode: "multiple",
      value: null,
      placeholder: "Select your characters",
      closeOnSelect: false,
      options: {
        batman: "Batman",
        robin: "Robin",
        joker: "Joker",
      },
    };
    const selectOption7 = {
      mode: "tags",
      value: [],
      placeholder: "Select employees",
      closeOnSelect: false,
      search: true,
      trackBy: "name",
      label: "name",
      options: [
        {
          value: "judy",
          name: "Judy",
          image: "https://randomuser.me/api/portraits/med/women/1.jpg",
        },
        {
          value: "jane",
          name: "Jane",
          image: "https://randomuser.me/api/portraits/med/women/2.jpg",
        },
        {
          value: "john",
          name: "John",
          image: "https://randomuser.me/api/portraits/med/men/1.jpg",
        },
        {
          value: "joe",
          name: "Joe",
          image: "https://randomuser.me/api/portraits/med/men/2.jpg",
        },
      ],
    };

    const checkboxes = reactive({
      status: "accepted",
      selected: ["pineapple"],
      options: [
        { text: "Orange", value: "orange" },
        { text: "Apple", value: "apple" },
        { text: "Pineapple", value: "pineapple" },
        { html: "<b>Grape</b> (html content)", value: "grape" },
      ],
    });

    const Vswitch = reactive({
      value: false,
    });
    const name = reactive({});

    return {
      Vswitch,
      name,
      radioButton,
      selectOption,
      selectOption2,
      selectOption3,
      selectOption4,
      selectOption5,
      selectOption6,
      selectOption7,
      multiselectAsync,
      book,
      checkboxes,
    };
  },
};
</script>
<style src="./VSelect/themes/default.css"></style>
<style src="./VSwitch/themes/default.css"></style>
<style scoped>
.test {
  width: 15%;
  display: flex;
  flex-direction: column;
}
</style>
