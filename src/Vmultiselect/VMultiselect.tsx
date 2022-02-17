import { computed, defineComponent, PropType, h, onMounted } from "vue";
import composition from "./composition"
import "@/style.scss"


export const VMultiselect = defineComponent({
  name: "VMultiselect",
  mixins: [composition],
  props: {
   
  },
  emits: ["update:modelValue", "change", "blur", "input"],
  setup(props, { emit }) {
 

   
    return () => (
      <>
     <div tabindex={props.searchable ? -1 : props.tabindex}> </div>
      </>
    );
  }
});
