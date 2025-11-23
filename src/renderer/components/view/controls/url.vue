<template>
    <input
        ref="urlInput"
        type="text"
        class="input-url"
        placeholder="Search or enter URL"
        spellcheck="false"
        :value="value"
        @focus="onFocus($event)"
        @keyup.enter="(e: any) => { e.preventDefault(); $emit('navigate', getWebUri(e.target?.value)); }"
        @keydown.enter.prevent
    />
</template>

<script lang="ts">
import URI from "urijs";
import { InputHTMLAttributes, ref } from "vue";
import { mapGetters } from "vuex";

const urlInput = ref<InputHTMLAttributes | null>(null);

const props = {
    value: {
        type: String,
        default: null,
    },
};

export default {
    props,
    emits: ["navigate"],
    computed: {
        ...mapGetters("sessions", ["currentSession"]),
    },

    mounted() {
        if (
            urlInput.value &&
            urlInput.value === this.currentSession.settings.homePage
        ) {
            urlInput.value.value.focus();
            urlInput.value.value.select();
        }
    },

    methods: {
        getWebUri(value: string) {
            if (!value || value.trim() === "") {
                return this.currentSession.settings.homePage;
            }

            const trimmedValue = value.trim();

            // Check if it's already a valid URL with protocol
            if (/^https?:\/\//i.test(trimmedValue)) {
                return trimmedValue;
            }

            // Check if it looks like a domain (contains dots and valid TLD pattern)
            // Examples: google.com, example.co.uk, localhost:8080
            const domainPattern = /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}(\/.*)?$/;
            const localhostPattern = /^localhost(:\d+)?(\/.*)?$/;
            const ipPattern = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(:\d+)?(\/.*)?$/;

            if (domainPattern.test(trimmedValue) || 
                localhostPattern.test(trimmedValue) || 
                ipPattern.test(trimmedValue)) {
                // It's a domain, add http:// protocol
                return URI(trimmedValue).protocol("http:").toString();
            }

            // Otherwise, treat it as a search query
            // Use DuckDuckGo as the default search engine
            const searchQuery = encodeURIComponent(trimmedValue);
            return `https://duckduckgo.com/?q=${searchQuery}`;
        },

        onFocus(event) {
            event.target.focus();
        },
    },
};
</script>

<style scoped lang="scss">
.input-url {
    height: 100%;
    width: 100%;
    padding: 12px;
    color: var(--text-primary);
    border: none;
    background-color: var(--input-bg);
    border-radius: 2px;
    font-family: inherit;
    transition: background-color 0.2s ease, color 0.3s ease;

    &::placeholder {
        color: var(--text-tertiary);
    }

    &:focus {
        outline: none;
        background-color: var(--bg-tertiary);
        border: 1px solid var(--accent-color);
    }
}
</style>
