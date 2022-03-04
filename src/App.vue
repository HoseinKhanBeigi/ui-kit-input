<template>
  <Form
    @submit.prevent="onSubmit({ name, email, password })"
    :validation-schema="schema"
  >
    <div class="VI">
      <Multiselect
        v-model="multiselectAsync.value"
        v-bind="multiselectAsync"
      ></Multiselect>

      <div class="output">Data: {{ example.value }}</div>

      <Multiselect
        v-model="example.value3"
  
        :options="[
          { value: 'v1', label: 'Batman1' },
          { value: 'v2', label: 'Robin1' },
          { value: 'v3', label: 'Joker1' },
        ]"
      />

      <!-- <Multiselect
  v-model="example.value"
  :options="['Batman', 'Robin', 'Joker']"
/> -->

      <!-- <Multiselect
        v-model="selectOption4.value"
        v-bind="selectOption4"
      ></Multiselect> -->

      <Multiselect
        v-model="example.value"
        mode="tags"
        :is_checkBox="true"
        :close-on-select="false"
        :is_search="true"
        :searchable="true"

        :options="[
          { value: 'batman', label: 'Batman' },
          { value: 'robin', label: 'Robin' },
          { value: 'joker', label: 'Joker' },
        ]"
      ></Multiselect>
      <!-- <Multiselect
        v-model="selectOption.value"
        v-bind="selectOption"
      ></Multiselect>
      <Multiselect
        v-model="selectOption2.value"
        v-bind="selectOption2"
      ></Multiselect> -->

      <!-- <div :class="{ invalid: isInvalid }">
        <Field name="selectOption3" :rules="isRequired">
          <Multiselect
            name="selectOption3"
            v-model="selectOption3.value"
            v-bind="selectOption3"
            @open="onTouch"
            @input="onChange1"
          ></Multiselect>
        </Field>
        <span>{{ errors.selectOption3 }}</span>
        <label class="typo__label form__label" v-show="isInvalid"
          >Must have at least one value</label
        >
      </div> -->

      <!-- <Multiselect
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
      ></Multiselect> -->
      <!-- <Multiselect
        v-model="value"
        mode="multiple"
        placeholder="Select your characters"
        :options="{
          batman: 'Batman',
          robin: 'Robin',
          joker: 'Joker',
        }"
      >
        <template v-slot:multiplelabel="{ values }">
          <div class="multiselect-multiple-label">
            {{ values.length }} characters selected
          </div>
        </template>
      </Multiselect> -->
      <!-- <Multiselect
    v-model="value"
    mode="tags"
    placeholder="Select employees"
    track-by="name"
    label="name"
    :close-on-select="false"
    :search="true"
    :options="[
      { value: 'judy', name: 'Judy', image: 'https://randomuser.me/api/portraits/med/women/1.jpg' },
      { value: 'jane', name: 'Jane', image: 'https://randomuser.me/api/portraits/med/women/2.jpg' },
      { value: 'john', name: 'John', image: 'https://randomuser.me/api/portraits/med/men/1.jpg' },
      { value: 'joe', name: 'Joe', image: 'https://randomuser.me/api/portraits/med/men/2.jpg' }
    ]"
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
 </Multiselect> -->
    </div>

    <!-- <Multiselect
  v-model="value"
  mode="multiple"
  :close-on-select="false"
  :options="{
    batman: 'Batman',
    robin: 'Robin',
    joker: 'Joker'
  }"
/> -->

    <!-- <div class="example">
      <div class="output">Data: {{ Vswitch.value }}</div>
      <VSwitch v-model="Vswitch.value" v-bind="Vswitch"></VSwitch>
    </div> -->

    <!-- <div>
      <VInput
        name="password"
        type="text"
        label="Password"
        placeholder="Your password"
      />
    </div> -->

    <!-- <div>
      <VRadio v-model="radioButton" name="some-radios" value="A"
        >Option A</VRadio
      >
      <VRadio v-model="radioButton" name="some-radios" value="B"
        >Option B</VRadio
      >
    </div> -->
    <!-- <VCheckBox
      id="checkbox-1"
      v-model="status"
      name="checkbox-1"
      value="accepted"
      unchecked-value="not_accepted"
    /> -->

    <VCheckBoxGroup
      id="checkbox-group-1"
      v-model="checkboxes.selected"
      :options="checkboxes.options"
    />
    <button class="submit-btn" type="submit">Submit</button>
  </Form>
</template>

<script>
import { Form } from "vee-validate";
import * as Yup from "yup";
import { ref, reactive, computed } from "vue";
import VInput from "./VInput/VInput.vue";
import VTextarea from "./VTextarea/VTextarea.vue";

import Multiselect from "./VSelect/Multiselect.vue";
import VSwitch from "./VSwitch/VSwitch.vue";
import VCheckBoxGroup from "./VCheckbox/VCheckBoxGroup.vue";
import VCheckBox from "./VCheckbox/VCheckBox.vue";
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
    // VInput,
    // VTextarea,
    Multiselect,
    // VSwitch,
    VCheckBoxGroup,
    // VRadio,
    Form,
  },
  // data: () => ({
  //   example4: {
  //   	mode: 'multiple',
  //     groups: true,
  //     value: [],
  //     closeOnSelect: false,
  //     options: [
  //     	{
  //       	label: 'DC',
  //         options: ['Batman', 'Robin', 'Joker'],
  //       },
  //     	{
  //       	label: 'Marvel',
  //         options: ['Spiderman', 'Iron Man', 'Captain America'],
  //       },
  //     ]
  //   }
  // }),
  setup() {
    function onSubmit(values) {
      console.log(book.title);
      console.log(values);
    }

    const example = reactive({ value: [],value3:[] });

    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().min(6).required(),
      selectOption3: Yup.array().length().min(1).required(),
      confirm_password: Yup.string()
        .required()
        .oneOf([Yup.ref("password")], "Passwords do not match"),
    });
    // console.log(schema);

    const book = reactive({ title: "ccc", main: "main" });
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
      // minChars: 3,
      resolveOnLoad: false,
      delay: 0,
      is_checkBox: false,
      labelName: "countries",
      searchable: true,
      options: async (query) => {
        return await fetchLanguages(query);
      },
      // options: [
      //   { value: "batman", label: "Batman" },
      //   { value: "robin", label: "Robin" },
      //   { value: "joker", label: "Joker" },
      // ],
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

    const selectOption4 = reactive({
      mode: "multiple",
      groups: true,
      value: [],
      // closeOnSelect: false,
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
    });
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
    const selectOption7 = reactive({
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
    });

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

    const isTouched = ref(false);
    const isInvalid = ref(false);
    const onTouch = () => {
      isTouched.value = true;
    };

    const onChange1 = (value) => {
      selectOption3.value = value;

      if (isTouched.value && selectOption3.value.length === 0) {
        isInvalid.value = true;
      } else {
        isInvalid.value = false;
      }
    };

    const getValues = (value) => {
      console.log(value);
    };

    const isRequired = (value) => {
      console.log(value, "hiiiiiii");
      return value ? true : "This field is required";
    };

    const handleInput = (evt) => {
      console.log(evt, "helooo");
    };
    return {
      Vswitch,
      name,
      isRequired,
      radioButton,
      selectOption,
      selectOption2,
      selectOption3,
      selectOption4,
      selectOption5,
      selectOption6,
      selectOption7,
      multiselectAsync,
      example,
      handleInput,
      onChange1,
      getValues,
      onTouch,
      isInvalid,
      book,
      checkboxes,
      onSubmit,
      schema,
    };
  },
};
</script>

<style scoped>
form {
  width: 300px;
}
.test {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.multiselect-tag.is-user {
  padding: 5px 8px;
  border-radius: 22px;
  background: #35495e;
  margin: 3px 3px 8px;
}

.multiselect-tag.is-user img {
  width: 18px;
  border-radius: 50%;
  height: 18px;
  margin-right: 8px;
  border: 2px solid #ffffffbf;
}

.multiselect-tag.is-user i:before {
  color: #ffffff;
  border-radius: 50%;
}

.user-image {
  margin: 0 6px 0 0;
  border-radius: 50%;
  height: 22px;
}

.submit-btn {
  outline: none;
  border: none;
  color: rgb(0, 0, 0);
  font-size: 18px;
  padding: 10px 15px;
  display: block;
  background-color: aqua;
  width: 100%;
  border-radius: 1px;
  margin-top: 40px;
  transition: transform 0.3s ease-in-out;
  cursor: pointer;
}

.submit-btn.invalid {
  animation: shake 0.5s;
  /* When the animation is finished, start again */
  animation-iteration-count: infinite;
}

.VI {
  margin-bottom: 120px;
}

@keyframes shake {
  0% {
    transform: translate(1px, 1px);
  }
  10% {
    transform: translate(-1px, -2px);
  }
  20% {
    transform: translate(-3px, 0px);
  }
  30% {
    transform: translate(3px, 2px);
  }
  40% {
    transform: translate(1px, -1px);
  }
  50% {
    transform: translate(-1px, 2px);
  }
  60% {
    transform: translate(-3px, 1px);
  }
  70% {
    transform: translate(3px, 1px);
  }
  80% {
    transform: translate(-1px, -1px);
  }
  90% {
    transform: translate(1px, 2px);
  }
  100% {
    transform: translate(1px, -2px);
  }
}

.submit-btn:hover {
  transform: scale(1.1);
}
</style>
