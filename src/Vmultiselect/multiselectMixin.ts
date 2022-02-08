

const isEmpty = (opt: any) => {
    if (opt === 0) return false
    if (Array.isArray(opt) && opt.length === 0) return true
    return !opt
}

const not = (fun: Function) => {
    return (...params: any) => !fun(...params)
}

const includes = (str: String | Boolean, query: String) => {
    if (str === undefined) str = 'undefined'
    if (str === null) str = "null"
    if (str === false) str = 'false'
    const text = str.toString().toLowerCase()
    return text.indexOf(query.trim()) !== -1
}

const filterOptions = (options: Array<any>, search: string, label: string, customLabel: Function) => {
    return options.filter((option: any) => includes(customLabel(option, label), search))
}

const strapiGroups = (options: Array<any>) => {
    return options.filter((option: any) => !option.$isLabel)
}

const flattenOptions = (values: any, label: any) => {
    return (options: Array<any>) =>
        options.reduce((prev, curr) => {
            if (curr[values] && curr[values].length) {
                prev.push({
                    $groupLabel: curr[label],
                    $isLabel: true
                })
                return prev.concat(curr[values])
            }
            return prev
        }, [])
}

const filterGroups = (search: any, label: any, values: any, groupLabel: any, customLabel: any) => {
    return (groups: any) =>
        groups.map((group: any) => {
            if (!group[values]) {
                console.warn(`option based to vue-multiselect do not contain groups, despite the config`)
                return []
            }
            const groupOptions = filterOptions(group[values], search, label, customLabel)

            return groupOptions.length ? { [groupLabel]: group[groupLabel], [values]: groupOptions } : []
        })
}

const flow = (...fns: any) => (x: any) => fns.reduce((v: any, f: any) => f(v), x)


export default {
    data() {
        return {
            search: '',
            isOpen: false,
            preferredOpenDirction: 'below',
            optimizadHeight: (this as any).someProperty
        }
    },
    props: {
        internalSearch: { type: Boolean, default: true },
        options: { type: Array, required: true },
        multiple: { type: Boolean, default: false },
        value: {
            type: null,
            default() {
                return []
            }
        },
        trackBy: { type: String },
        label: { type: String },
        searchable: { type: Boolean, default: true },
        clearOnSelect: { type: Boolean, default: true },
        hideSelected: { type: Boolean, default: false },
        placeholder: { type: String, default: 'select option' },
        allowEmpty: { type: Boolean, default: true },
        resetAfter: { type: Boolean, default: false },
        closeSelect: { type: Boolean, default: true },
        customLabel: {
            type: Function,
            default(option: any, label: string) {
                if (isEmpty(option)) return ''
                return label ? option[label] : option
            }
        },
        taggable: {
            type: Boolean,
            default: false
        },
        tagPlaceholder: {
            type: String,
            default: "Press enter to create a tag"
        },
        tagPosition: {
            type: String,
            default: 'top'
        },
        max: {
            type: [Number, Boolean],
            default: false
        },
        id: { default: null },
        groupValues: { type: String },
        optionsLimit: {
            type: Number,
            default: 1000
        },
        groupLabel: {
            type: String
        },
        groupSelect: {
            type: Boolean,
            default: false
        },
        blockKeys: {
            type: Array,
            default() {
                return []
            }
        },
        preserveSearch: {
            type: Boolean,
            default: false
        },
        preselectFirst: {
            type: Boolean,
            default: false
        }
    },
    mounted() {
        if (!(this as any).multiple && (this as any).max) {
            console.warn('[Vue-Multiselect warn]: Max prop should not be used when prop Multiple equals false.')
        }
        if ((this as any).preselectFirst && !(this as any).internalValue.length && (this as any).options.length) {
            (this as any).select((this as any).filteredOptions[0])
        }
    },
    computed: {
        internalValue() {
            return (this as any).value || (this as any).value === 0
                ? Array.isArray((this as any).value) ? (this as any).value : [(this as any).value]
                : []
        },
        filteredOptions() {
            const search = (this as any).search || ''
            const normalizadSearch = search.toLowerCase().trim()

            let options = (this as any).options.concat()

            if ((this as any).internalSearch) {
                options = (this as any).groupValues
                    ? (this as any).filterAndFlat(options, normalizadSearch, (this as any).label)
                    : filterOptions(options, normalizadSearch, (this as any).label, (this as any).customLabel)
            } else {
                options = (this as any).groupValues ? flattenOptions((this as any).groupValues, (this as any).groupLabel)(options) : options
            }

            options = (this as any).hideSelected
                ? options.filter(not((this as any).isSelected))
                : options
            if ((this as any).taggable && normalizadSearch.length && !(this as any).isExistingOption(normalizadSearch)) {
                options.push({ isTag: true, label: search })
            } else {
                options.unshift({ isTag: true, label: search })
            }
        }
    }

}

