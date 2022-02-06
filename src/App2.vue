<template>
  <VInput type="checkbox" />
  <VSelect name="select" v-model="selected" :options="options"/>
</template>

<script>
import { ref, reactive } from "vue";
import { VInput } from "./VInput.tsx";
import { VSelect } from "./VSelect";

export default {
  components: { VInput, VSelect },
  props: {
    // collectionName: String,
  },
  data() {
    return {
      selected: null,
      options: [
        { value: null, text: "Please select an option" },
        { value: "a", text: "This is First option" },
        { value: "b", text: "Selected Option" },
        { value: { C: "3PO" }, text: "This is an option with object value" },
        { value: "d", text: "This one is disabled", disabled: true },
      ],
    };
  },
  setup(props) {
    const readersNumber = ref(0);
    const book = reactive({ title: "Vue 3 Guide", main: true });

    function handleInput(e) {
      console.log(e.target.value);
    }

    function handleChange(e) {
      console.log(e.target.value);
    }

    // expose to template
    return {
      readersNumber,
      book,
      handleInput,
      handleChange,
    };
  },
};
</script>
