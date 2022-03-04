<template>
    <div :class="classes">
        <label
            class="checkbox"
            v-if="$slots.default || !plain"
            :for="computedId"
            :class="[labelClasses, { active: isChecked, focus: isFocused }]"
        >
            <input
                :id="computedId"
                v-bind="$attrs"
                ref="input"
                :class="inputClasses"
                type="checkbox"
                :disabled="disabled"
                :required="name && required"
                :name="name"
                :form="form"
                :aria-label="ariaLabel"
                :aria-labelledby="ariaLabelledBy"
                :aria-required="name && required ? 'true' : null"
                :value="value"
                :indeterminate="indeterminate"
                :checked="isChecked"
                @click.stop="handleClick($event.target.checked)"
                @focus="focus()"
                @blur="blur()"
            />
            <span class="checkbox__checkmark checkbox__checkmark--small"></span>
            <slot />
        </label>
    </div>
</template>

<script lang="ts">
import {
    getClasses,
    getInputClasses,
    getLabelClasses,
} from "../features/composables/useFormCheck";
import {
    computed,
    defineComponent,
    onMounted,
    PropType,
    Ref,
    ref,
    watch,
} from "vue";
import { InputSize } from "../features/types";
import useId from "../features/composables/useId";

export default defineComponent({
    name: "VCheckbox",
    inheritAttrs: false,
    props: {
        id: { type: String, default: undefined },
        ariaLabel: { type: String },
        ariaLabelledBy: { type: String },
        autofocus: { type: Boolean, default: false },
        plain: { type: Boolean, default: false },
        button: { type: Boolean, default: false },
        switch: { type: Boolean, default: false },
        disabled: { type: Boolean, default: false },
        buttonVariant: { type: String, default: "secondary" },
        form: { type: String },
        indeterminate: { type: Boolean },
        inline: { type: Boolean, default: false },
        name: { type: String },
        required: { type: Boolean, default: undefined },
        size: { type: String, default: "md" },
        state: { type: Boolean, default: null },
        uncheckedValue: {
            type: [Boolean, String, Array, Object, Number],
            default: false,
        },
        value: {
            type: [Boolean, String, Array, Object, Number],
            default: true,
        },
        modelValue: {
            type: [Boolean, String, Array, Object, Number],
            default: null,
        },
    },
    emits: ["update:modelValue", "input", "change"],
    setup(props, { emit }) {
        const computedId = useId(props.id, "form-check");
        // const input: Ref<HTMLElement> = ref(null as unknown as HTMLElement)
        const input = ref<HTMLInputElement>();
        const isFocused = ref(false);

        const localChecked = computed({
            get: () => props.modelValue,
            set: (newValue: any) => {
                emit("input", newValue);
                emit("update:modelValue", newValue);
                emit("change", newValue);
            },
        });

        const isChecked = computed(() => {
            if (Array.isArray(props.modelValue)) {
                return props.modelValue.indexOf(props.value) > -1;
            }
            return (
                JSON.stringify(props.modelValue) === JSON.stringify(props.value)
            );
        });

        const classes = getClasses(props);
        const inputClasses = getInputClasses(props);
        const labelClasses = getLabelClasses(props);

        watch(
            () => props.modelValue,
            (newValue) => {
                emit("input", newValue);
            }
        );

        const focus = () => {
            isFocused.value = true;
            if (!props.disabled) input.value?.focus();
        };

        const blur = () => {
            isFocused.value = false;
            if (!props.disabled) {
                input.value?.blur();
            }
        };

        const handleClick = (checked: boolean) => {
            if (!Array.isArray(props.modelValue)) {
                localChecked.value = checked
                    ? props.value
                    : props.uncheckedValue;
            } else {
                const tempArray = props.modelValue;
                if (checked) {
                    const index = tempArray.indexOf(props.value);
                    if (index < 0) {
                        tempArray.push(props.value);
                    }
                } else {
                    const index = tempArray.indexOf(props.value);
                    if (index > -1) {
                        tempArray.splice(index, 1);
                    }
                }
                localChecked.value = tempArray;
            }
        };

        // TODO: make jest tests compatible with the v-focus directive
        if (props.autofocus) {
            onMounted(() => {
                input.value?.focus();
            });
        }

        return {
            input,
            computedId,
            classes,
            inputClasses,
            labelClasses,
            localChecked,
            isChecked,
            isFocused,
            handleClick,
            focus,
            blur,
        };
    },
});
</script>
<style lang="scss" scoped>
.checkbox {
    display: block;
    position: relative;
    padding-left: 21px;
    line-height: 16px;
    cursor: pointer;
    font-size: 12px;
    user-select: none;
    top: 2px;
    color: rgb(125, 125, 125);

    & input {
        position: absolute;
        opacity: 0;
        cursor: pointer;
        height: 0;
        width: 0;

        &:checked ~ .checkbox__checkmark {
            background-color: #fff;
            border: 1px solid #eee;

            &:after {
                display: block;
            }
        }
    }

    .checkbox__checkmark {
        position: absolute;
        top: 0;
        left: 0;
        height: 16px;
        width: 16px;
        border: 1px solid #eee;
        border-radius: 2px;

        &:after {
            content: "";
            position: absolute;
            display: none;
            left: 4px;
            top: -1px;
            width: 4px;
            height: 10px;
            border: solid #000;
            border-width: 0 2px 2px 0;
            transform: rotate(45deg);
        }

        &--small {
            width: 12px;
            height: 12px;
            margin-top: 2px;

            &:after {
                left: 3px;
                top: -0.5px;
                width: 2.5px;
                height: 7px;
                border: solid #000;
                border-width: 0 1.75px 1.75px 0;
                transform: rotate(45deg);
            }
        }
    }
}
</style>
