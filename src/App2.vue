<template>
  <VInput type="checkbox" />
  <VSelect name="select" />
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
