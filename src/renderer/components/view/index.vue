<template>
    <div class="app-views">
        <!-- Browser Profiles View -->
        <browser-profiles-view v-if="currentView === 'browser-profiles'" />

        <!-- Normal Content View -->
        <div v-else-if="currentTab && currentView === 'normal'" class="app-views-container">
            <web-view-container
                v-if="currentTab.type !== 'settings'"
                :key="currentSession.currentTabIndex"
            />

            <settings-view
                v-if="currentTab.type === 'settings'"
                :key="currentSessionIndex"
            />
        </div>
    </div>
</template>

<script lang="ts">
import SettingsView from "./pages/settings.vue";
import WebViewContainer from "./pages/webview.vue";
import BrowserProfilesView from "./pages/browser-profiles.vue";
import { mapGetters } from "vuex";
import { EventBus } from "@renderer/utils/event-bus";

export default {
    components: {
        SettingsView,
        WebViewContainer,
        BrowserProfilesView,
    },

    data() {
        return {
            currentView: "normal" as "normal" | "browser-profiles" | "dashboard",
        };
    },

    computed: {
        ...mapGetters("sessions", [
            "currentSession",
            "currentSessionIndex",
            "currentTab",
        ]),
    },

    mounted() {
        // Listen for view change events
        EventBus.on("show-browser-profiles", () => {
            this.currentView = "browser-profiles";
        });

        EventBus.on("show-dashboard", () => {
            this.currentView = "normal";
        });

        EventBus.on("show-normal-view", () => {
            this.currentView = "normal";
        });

        // Also listen for session selection to return to normal view
        EventBus.on("session-selected", () => {
            this.currentView = "normal";
        });
    },

    beforeUnmount() {
        EventBus.off("show-browser-profiles");
        EventBus.off("show-dashboard");
        EventBus.off("show-normal-view");
        EventBus.off("session-selected");
    },
};
</script>

<style scoped></style>
