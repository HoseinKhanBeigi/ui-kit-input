<template>
  <div>
    <VSelect name="select" v-model="selected" :options="options">
      <VSelectoption :value="name1">Option D</VSelectoption>
      <VSelectoption :value="name2">Option C</VSelectoption>
    </VSelect>
    <VInput
      v-model="book.title"
      id="input-live"
      :state="nameState"
      aria-describedby="input-live-help input-live-feedback"
      placeholder="Enter your name"
      trim
      
      @input="handleInput"
      @change="handleChange"
      @onBlur="handleBlue"
    />
    <b-form-invalid-feedback id="input-live-feedback">
      Enter at least 3 letters
    </b-form-invalid-feedback>

    <b-form-text id="input-live-help" v-model="book.title"
      >Your full name.</b-form-text
    >
  </div>
</template>

<script>
import { ref, reactive, computed } from "vue";
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
    const book = reactive({ title: "ss", main: true });

    function handleInput(e) {
      console.log(e);
    }

    function handleChange(e) {
      console.log(e, "change");
    }

    const nameState = computed(() => {
      return book.title.length > 2 ? true : false;
    });

    function handleBlue() {}

    return {
      readersNumber,
      book,
      nameState,
      handleInput,
      handleChange,
    };
  },
};
</script>
