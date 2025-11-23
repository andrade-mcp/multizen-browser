<template>
    <div v-if="currentSession" class="tabs-container">
        <div
            v-for="(tab, index) in tabs"
            :key="tab.id"
            class="tab"
            :class="{ active: currentSession.currentTabIndex === index }"
            @click.stop="handleTabClick(index)"
        >
            <div v-if="tab.type === 'settings'" class="tab-name">
                <img class="tab-favicon" src="../../assets/icons/icon.png" alt="" />
                <span class="tab-title">{{ currentSession.name || tab.title || 'Session settings' }}</span>
            </div>

            <div v-if="tab.type !== 'settings'" class="tab-name">
                <img
                    v-if="tab.favicon"
                    class="tab-favicon"
                    :src="tab.favicon"
                    alt=""
                />
                <img
                    v-else
                    class="tab-favicon"
                    src="../../assets/icons/icon.png"
                    alt=""
                />
                <span class="tab-title">
                    {{ tab.title || "New Tab" }}
                </span>

                <button
                    class="tab-close-btn"
                    @click.stop="removeTabWithIndex(index)"
                    title="Close tab"
                >
                    <i class="fa fa-times" />
                </button>
            </div>
        </div>

        <button class="new-tab-btn" @click="newTab">
            <i class="fa fa-plus" />
        </button>
    </div>
</template>

<script lang="ts">
import { mapGetters, mapMutations } from "vuex";
import { EventBus } from "@renderer/utils/event-bus";

export default {
    computed: {
        ...mapGetters("sessions", [
            "currentSession",
            "currentTab",
            "sessions",
            "currentSessionIndex",
        ]),

        tabs() {
            return this.currentSession.tabs;
        },
    },

    methods: {
        ...mapMutations("sessions", ["addTab", "removeTab", "setActiveTab"]),

        newTab() {
            this.addTab({ sessionIndex: this.currentSessionIndex });
        },

        removeTabWithIndex(index: number) {
            this.removeTab({
                sessionIndex: this.currentSessionIndex,
                tabIndex: index,
            });
        },

        handleTabClick(index: number) {
            this.setActiveTab({
                sessionIndex: this.currentSessionIndex,
                tabIndex: index,
            });
            // Ensure we're in normal view when clicking a tab
            EventBus.emit("show-normal-view");
        },
    },
};
</script>

<style scoped lang="scss">
.tabs-container {
    display: flex;
    align-items: flex-end;
    color: var(--text-primary);
    padding: 0 8px 0 56px;
    height: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-app-region: no-drag;
    gap: 0;
    scrollbar-width: none;
    -ms-overflow-style: none;

    &::-webkit-scrollbar {
        display: none;
    }
}

.tab {
    display: flex;
    position: relative;
    align-items: center;
    background-color: var(--bg-tertiary);
    padding: 0 12px;
    height: 30px;
    min-height: 30px;
    max-height: 30px;
    margin-right: 0;
    border-radius: 0;
    transition: all 0.15s ease;
    border: none;
    border-left: 1px solid transparent;
    border-right: 1px solid transparent;
    cursor: pointer;
    font-size: 12px;
    font-weight: 400;
    color: var(--text-secondary);
    white-space: nowrap;
    user-select: none;

    &:hover {
        background-color: var(--bg-secondary);
        color: var(--text-primary);
    }

    &.active {
        background-color: var(--bg-primary);
        color: var(--text-primary);
        height: 32px;
        min-height: 32px;
        border-top: 1px solid var(--border-color);
        border-left: 1px solid var(--border-color);
        border-right: 1px solid var(--border-color);
        border-bottom: 2px solid var(--tab-accent);
        box-shadow: 0 -1px 0 0 var(--bg-primary);
        z-index: 1;
        font-weight: 500;
        margin-bottom: -1px;
    }

    .tab-name {
        display: flex;
        align-items: center;
        max-width: 200px;
        min-width: 0;
        height: 100%;
        gap: 6px;
    }

    .tab-favicon {
        width: 16px;
        height: 16px;
        flex-shrink: 0;
        object-fit: contain;
    }

    .tab-title {
        flex: 1;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 12px;
        line-height: 1.2;
        display: inline-block;
    }

    .tab-close-btn {
        position: absolute;
        right: 4px;
        top: 50%;
        transform: translateY(-50%);
        width: 18px;
        height: 18px;
        font-size: 11px;
        background-color: transparent;
        border: 0;
        outline: 0;
        color: var(--text-secondary);
        border-radius: 2px;
        transition: all 0.15s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        cursor: pointer;

        &:hover {
            background-color: var(--hover-bg);
            color: var(--text-primary);
        }
    }

    &:hover .tab-close-btn {
        opacity: 1;
    }

    &.active .tab-close-btn {
        opacity: 1;
    }
}

.new-tab-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 30px;
    height: 30px;
    min-height: 30px;
    background-color: transparent;
    border: 0;
    outline: 0;
    color: var(--text-secondary);
    border-radius: 2px;
    transition: all 0.15s ease;
    cursor: pointer;
    font-size: 14px;
    margin-left: 2px;

    &:hover {
        background-color: var(--hover-bg);
        color: var(--text-primary);
    }
}
</style>
