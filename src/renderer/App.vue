<template>
    <div id="app" class="app">
        <top-bar />

        <div class="sessions-and-view">
            <side-bar />
            <content-view v-if="currentSession" />
        </div>

        <info-modal />
    </div>
</template>

<script lang="ts">
import SideBar from "./components/sidebar/bar.vue";
import TopBar from "./components/topbar/bar.vue";
import ContentView from "./components/view/index.vue";
import InfoModal from "./components/info-modal/index.vue";
import { EventBus } from "./utils/event-bus";
import { mapGetters, mapMutations } from "vuex";

export default {
    components: {
        SideBar,
        ContentView,
        TopBar,
        InfoModal,
    },

    computed: {
        ...mapGetters("sessions", ["currentSession", "currentSessionIndex"]),
        ...mapGetters("theme", ["isDark"]),
    },

    mounted() {
        // Initialize theme from store (which loads from localStorage)
        const currentTheme = this.$store.state.theme?.theme || "dark";
        this.$store.commit("theme/setTheme", currentTheme);
        
        window.electron.ipcRenderer.on("shortcut:ctrl+w", () => {
            if (
                this.currentSession &&
                this.currentSession.currentTabIndex > 0
            ) {
                this.removeTab({
                    sessionIndex: this.currentSessionIndex,
                    tabIndex: this.currentSession.currentTabIndex,
                });
            }
        });

        window.electron.ipcRenderer.on("shortcut:ctrl+t", () => {
            if (!this.currentSession) return;

            this.addTab({ sessionIndex: this.currentSessionIndex });
        });

        if (!localStorage.getItem("info-modal-shown")) {
            localStorage.setItem("info-modal-shown", "true");
            EventBus.emit("open-info-modal");
        }
    },

    beforeUnmount() {
        window.electron.ipcRenderer.removeAllListeners("shortcut:ctrl+w");
        window.electron.ipcRenderer.removeAllListeners("shortcut:ctrl+t");
    },

    methods: {
        ...mapMutations("sessions", ["addTab", "removeTab"]),
    },
};
</script>

<style lang="scss">
@import "./assets/scss/style";

// Theme CSS Variables
:root[data-theme="dark"] {
    --bg-primary: #1e1e1e;
    --bg-secondary: #252526;
    --bg-tertiary: #2d2d30;
    --bg-hover: #2a2d2e;
    --text-primary: #cccccc;
    --text-secondary: #858585;
    --text-tertiary: #6a6a6a;
    --border-color: #3e3e42;
    --border-light: #2d2d30;
    --accent-color: #007acc;
    --accent-hover: #1a8cd8;
    --accent-purple: #68217a;
    --accent-purple-hover: #7d2a92;
    --tab-accent: #ff6b35;
    --tab-accent-hover: #ff8c5a;
    --hover-bg: rgba(255, 255, 255, 0.1);
    --active-bg: rgba(0, 122, 204, 0.2);
    --selected-bg: rgba(0, 122, 204, 0.3);
    --panel-bg: #2d2d30;
    --input-bg: #3c3c3c;
    --button-bg: #0e639c;
    --button-hover: #1177bb;
}

:root[data-theme="light"] {
    --bg-primary: #ffffff;
    --bg-secondary: #f5f5f5;
    --bg-tertiary: #f0f0f0;
    --text-primary: #333;
    --text-secondary: #666;
    --text-tertiary: #999;
    --border-color: #e0e0e0;
    --border-light: #ddd;
    --accent-color: #4a90e2;
    --accent-hover: #5aa0f2;
    --hover-bg: rgba(0, 0, 0, 0.05);
    --active-bg: rgba(74, 144, 226, 0.1);
}

html,
body {
    padding: 0;
    margin: 0;
    height: 100%;

    * {
        box-sizing: border-box;
    }
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    line-height: 1.5;
    font-weight: 400;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: var(--bg-primary);
    color: var(--text-primary);
    transition: background-color 0.3s ease, color 0.3s ease;
}

#app {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;

    .app-views {
        width: 100%;
        background: var(--bg-primary);
        transition: background-color 0.3s ease;

        .app-views-container {
            height: 100%;
            background: var(--bg-primary);
        }
    }
}

.sessions-and-view {
    display: flex;
    flex-direction: row;
    flex: 1;
    overflow: auto;
}
</style>
