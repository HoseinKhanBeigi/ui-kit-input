<template>

 
    <div>
      <VInput
      suffix="ee"
        class="VInput"
        :onInput="(e) => handleInput(e)"
        name="name"
        type="text"
        label="Full Name"
        placeholder="Your Name"
      />
    </div>

</template>

<script>
import { Form } from "vee-validate";
import * as Yup from "yup";
import { ref, reactive, computed } from "vue";
import VInput from "./VInput.vue";

export default {
  components: {
    VInput,
  },
  setup() {
    return {};
  },
};
</script>

<style scoped>
.fieldSetClass {
  border-collapse: collapse;
  border: 1px solid;
  border-radius: var(--border-radius-3);
  bottom: 0;
  left: 0;
  line-height: 22px;
  padding-left: 8px;
  pointer-events: none;
  position: absolute;
  right: 0;
  top: -5px;
  transition-duration: 0.15s;
  transition-property: color;
  /* transition-timing-function: ; */
}

.vc_input {
  color: inherit;
  display: flex;
  align-items: stretch;
  position: relative;
  transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
  border-radius: 4px;
  width: 100%;
  min-height: 40px;
  cursor: text;
  background: transparent;
}

.vc-input-slot{

        display: flex;
    flex: 1 1 auto;
    position: relative;
    align-items: center;
    max-width: 80%;
    
}

.legendClass {
  width: 50px;
  /* margin-left: 12px; */
}
</style>
