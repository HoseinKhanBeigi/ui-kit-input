
import { computed, defineComponent } from "vue";
import useFormInput, { COMMON_INPUT_PROPS } from "../features/composables/useFormInput";



export const VTextarea = defineComponent({
    name: "VTextarea",
    props: {
        ...COMMON_INPUT_PROPS,
        noResize: { type: Boolean, default: false },
        rows: { type: [String, Number], required: false, default: 2 },
        wrap: { type: String, default: 'soft' },
    },
    emits: ["update:modelValue", "change", "blur", "input"],
    setup(props, { emit }) {
        const classes = computed(() => ({
            'form-control': !props.plaintext,
            'form-control-plaintext': props.plaintext,
            [`form-control-${props.size}`]: props.size,
            'is-valid': props.state === true,
            'is-invalid': props.state === false,
        }))

        const computedStyles = computed(() => (props.noResize ? { resize: 'none' } : undefined))

        const { input, computedId, computedAriaInvalid, onInput, onChange, onBlur, focus, blur } =
            useFormInput(props, emit)

        function handleInput(event: any) {
            onInput(event)
        }
        function handleChange(event: any) {
            onChange(event)

        }
        return () => (
            <div class="input-block">
                <textarea
                    ref={input}
                    value={props.modelValue}
                    placeholder={props.placeholder}
                    id={`${computedId.value}`}
                    class={classes}
                    name={props.name || undefined}
                    form={props.form || undefined}
                    disabled={props.disabled}
                    required={props.required}
                    autocomplete={props.autocomplete || undefined}
                    readonly={props.readonly || props.plaintext}
                    aria-required={props.required ? "true" : undefined}
                    onInput={handleInput}
                    onChange={handleChange}
                    on-Blur={blur()}
                    on-Focus={focus()}
                />
                <span class="placeholder">Placeholder</span>
            </div>
        );
    },
});