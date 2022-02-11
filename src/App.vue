<template>
  <div>
    <VSelect name="select" v-model="selected" :options="options">
      <VSelectoption :value="name1">Option D</VSelectoption>
      <VSelectoption :value="name2">Option C</VSelectoption>
    </VSelect>
    <VInput v-model="book.title" placeholder="pleace enter your name"/>
  </div>
</template>

<script>
import { ref, reactive } from "vue";
import { VInput } from "./Vinput/VInput.tsx";
import { VSelect } from "./VSelect/VSelect.tsx";
import { VSelectoption } from "./VSelect/VSelectoption.tsx";

export default {
  components: { VInput, VSelect, VSelectoption },
  props: {
    // collectionName: String,
  },
  data() {
    return {
      selected: null,
      name1: "D",
      name2: "C",
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
    console.log();
    const readersNumber = ref(0);
    const book = reactive({ title: "Vue 3 Guide", main: true });

    function handleInput(e) {
      console.log(e.target.value);
    }

    function handleChange(e) {
      console.log(e.target.value);
    }

    return {
      readersNumber,
      book,
      handleInput,
      handleChange,
    };
  },
};
</script>
