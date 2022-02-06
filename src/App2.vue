<template>
  <VInput
    placeholder="enter youe name"
    type="text"
    v-model="book.title"
    :onInput="(e) => handleInput(e)"
    :onChange="(e) => handleChange(e)"
  />
</template>

<script>
import { ref, reactive } from "vue";
import { VInput } from "./VInput.tsx";

export default {
  components: { VInput },
  props: {
    collectionName: String,
  },
  setup(props) {
    const readersNumber = ref(0);
    const book = reactive({ title: "Vue 3 Guide" });

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
