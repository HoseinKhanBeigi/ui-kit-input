<template>
  <div>
    <div class="test">
      <Multiselect v-model="example7.value" v-bind="example7"></Multiselect>
    </div>
    <VInput
      id="input-live"
      :state="nameState"
      aria-describedby="input-live-help input-live-feedback"
      placeholder="Enter your name"
      trim
      v-model="book.title"
      @input="handleInput"
      @change="handleChange"
      @onBlur="handleBlue"
    />
  </div>
</template>

<script>
import { ref, reactive, computed } from "vue";
import { VInput } from "./VInput/VInput.tsx";

import Multiselect from "./VSelect/Multiselect.vue";

const fetchLanguages = async (query) => {
  // From: https://www.back4app.com/database/paul-datasets/list-of-all-programming-languages/get-started/javascript/rest-api/fetch?objectClassSlug=dataset

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
  components: { VInput, Multiselect },
  props: {
    // collectionName: String,
  },
  data() {
    return {
      value: null,
    };
  },
  methods: {
    addTag(newTag) {
      const tag = {
        name: newTag,
        code: newTag.substring(0, 2) + Math.floor(Math.random() * 10000000),
      };
      this.options.push(tag);
      this.value.push(tag);
    },
  },
  setup(props) {
    console.log();
    // const state = reactive({
    //   optionss: [
    //     { name: "Vue.js", code: "vu" },
    //     { name: "Javascript", code: "js" },
    //     { name: "Open Source", code: "os" },
    //   ],
    // });
    const book = reactive({ title: "ss", main: true });
    // const value = ref([{ name: "Javascript", code: "js" }]);

    function handleInput(e) {
      console.log(e);
    }

    function handleChange(e) {
      console.log(e, "change");
    }

    const nameState = computed(() => {
      return book.title.length > 2 ? true : false;
    });

    const options = [
      { name: "Vue.js", code: "vu" },
      { name: "Javascript", code: "js" },
      { name: "Open Source", code: "os" },
    ];

    const value2 = [
      { name: "Vue.js", code: "vu" },
      { name: "Javascript", code: "js" },
      { name: "Open Source", code: "os" },
    ];

    console.log(options, "options");

    const example7 = {
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

    return {
      // options,
      example7,
      book,
      nameState,
      handleInput,
      handleChange,
    };
  },
};
</script>
<style src="./VMultiselect/themes/default.css"></style>
<style scoped>
.test {
  width: 30%;
  display: flex;
}
</style>
