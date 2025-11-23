<template>
    <div class="right-sessions-bar">
        <div class="sessions-header">
            <button class="new-session-btn" @click="setNewSession" title="New Session">
                <i class="fa fa-plus" />
            </button>
        </div>

        <div class="sessions-list">
            <div
                v-for="(s, k) in sessions"
                :key="s.id"
                class="session-item"
                :class="{ active: k === currentSessionIndex }"
                @click="handleSessionClick(k)"
                :title="s.name || `Session${k + 1}`"
            >
                <div class="session-icon">
                    <img
                        src="@renderer/assets/icons/icon.png"
                        class="session-icon-img"
                        :style="{ filter: `hue-rotate(${k * 42}deg)` }"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { mapGetters, mapMutations } from "vuex";
import { EventBus } from "@renderer/utils/event-bus";

export default {
    computed: {
        ...mapGetters("sessions", [
            "currentSession",
            "sessions",
            "currentSessionIndex",
        ]),
    },

    methods: {
        ...mapMutations("sessions", [
            "addSession",
            "setActiveSession",
        ]),

        handleSessionClick(index: number) {
            this.setActiveSession(index);
            EventBus.emit("session-selected");
        },

        setNewSession(event?: Event) {
            if (event) {
                event.preventDefault();
                event.stopPropagation();
            }
            
            const sessionName = `Session${this.sessions.length + 1}`;
            
            try {
                this.$store.commit("sessions/addSession", sessionName);
                EventBus.emit("session-selected");
            } catch (error) {
                console.error("Error creating session:", error);
            }
        },
    },
};
</script>

<style scoped lang="scss">
.right-sessions-bar {
    width: 48px;
    background: var(--bg-secondary);
    height: 100%;
    display: flex;
    flex-direction: column;
    border-left: 1px solid var(--border-color);
    user-select: none;
    transition: background-color 0.3s ease;
}

.sessions-header {
    padding: 8px;
    border-bottom: 1px solid var(--border-color);
    display: flex;
    justify-content: center;
    align-items: center;
}

.new-session-btn {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--button-bg);
    border: none;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.2s ease;
    color: white;
    font-size: 14px;

    &:hover {
        background: var(--button-hover);
        transform: scale(1.1);
    }

    &:active {
        transform: scale(0.95);
    }
}

.sessions-list {
    flex: 1;
    padding: 8px 0;
    overflow-y: auto;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
}

.session-item {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 4px;
    transition: all 0.2s ease;
    position: relative;

    &:hover {
        background: var(--hover-bg);
    }

    &.active {
        background: var(--selected-bg);
        
        &::after {
            content: '';
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 3px;
            height: 20px;
            background: var(--accent-color);
            border-radius: 0 2px 2px 0;
        }
    }
}

.session-icon {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    overflow: hidden;
    padding: 4px;
}

.session-icon-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

// Custom scrollbar
.sessions-list::-webkit-scrollbar {
    width: 4px;
}

.sessions-list::-webkit-scrollbar-track {
    background: transparent;
}

.sessions-list::-webkit-scrollbar-thumb {
    background: var(--border-color);
    border-radius: 2px;

    &:hover {
        background: var(--text-tertiary);
    }
}
</style>

