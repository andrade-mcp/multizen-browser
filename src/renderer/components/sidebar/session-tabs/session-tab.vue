<template>
    <div class="session-tab" :class="{ active }" @click="handleClick">
        <slot>
            <img
                src="@renderer/assets/icons/icon.png"
                class="session-tab-icon"
            />
        </slot>
    </div>
</template>

<script lang="ts">
const props = {
    active: {
        type: Boolean,
        default: false,
    },
};

export default {
    props,
    methods: {
        handleClick(event: Event) {
            event.preventDefault();
            event.stopPropagation();
            this.$emit("click", event);
        },
    },
};
</script>

<style scoped lang="scss">
.session-tab {
    -webkit-app-region: no-drag;
    width: 48px;
    height: 48px;
    margin: 3px 0;
    padding: 8px;
    border: 1px solid transparent;
    cursor: pointer;
    transition: 0.2s ease;

    &:hover {
        background-color: var(--hover-bg);
        border-radius: 50%;
    }

    &.active {
        background-color: var(--selected-bg);
        border-radius: 50%;
        border: 1px solid var(--accent-color);
    }

    i {
        color: var(--text-secondary);
    }

    &.new-session {
        width: 42px;
        height: 42px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 10px 0;
        border: 1px solid var(--border-color);
        border-radius: 2px;
        color: var(--text-primary);
        font-size: 18px;
        transition: 0.5s ease;
        background-color: var(--bg-tertiary);

        &:hover {
            color: var(--accent-color);
            border-color: var(--accent-color);
            background-color: var(--active-bg);
        }

        i {
            color: var(--accent-color);
        }
    }

    .session-tab-icon {
        width: 100%;
        height: 100%;
    }
}
</style>
