<template>
    <div class="sidebar-container" :class="{ expanded: isExpanded }">
        <!-- Toggle Button -->
        <div class="sidebar-toggle" @click="toggleSidebar">
            <i class="fa" :class="isExpanded ? 'fa-angle-left' : 'fa-angle-right'" />
        </div>

        <!-- Menu Items -->
        <div class="sidebar-menu">
            <div
                v-for="item in menuItems"
                :key="item.id"
                class="menu-item"
                :class="{ active: activeMenuItem === item.id }"
                @click="selectMenuItem(item.id)"
                :title="!isExpanded ? item.label : ''"
            >
                <i class="fa" :class="item.icon" />
                <span v-if="isExpanded" class="menu-label">{{ item.label }}</span>
                <span v-if="item.badge && isExpanded" class="menu-badge">{{ item.badge }}</span>
            </div>
        </div>


        <!-- Footer -->
        <side-footer :expanded="isExpanded" />
    </div>
</template>

<script lang="ts">
import SideFooter from "./footer.vue";
import { mapGetters } from "vuex";
import { EventBus } from "@renderer/utils/event-bus";

interface MenuItem {
    id: string;
    label: string;
    icon: string;
    badge?: string;
}

export default {
    components: {
        SideFooter,
    },

    data() {
        return {
            isExpanded: false,
            activeMenuItem: "dashboard",
            menuItems: [
                { id: "dashboard", label: "Dashboard", icon: "fa-tachometer" },
                { id: "browser-profiles", label: "Browser Profiles", icon: "fa-globe" },
                { id: "groups", label: "Groups", icon: "fa-folder" },
                { id: "proxy", label: "Proxy IP", icon: "fa-server" },
                { id: "extensions", label: "Extensions", icon: "fa-puzzle-piece" },
                { id: "settings", label: "Settings", icon: "fa-cog" },
                { id: "logs", label: "Operation Logs", icon: "fa-file-text-o" },
                { id: "help", label: "Help", icon: "fa-question-circle" },
            ] as MenuItem[],
        };
    },

    computed: {
        ...mapGetters("sessions", [
            "currentSession",
        ]),
    },

    mounted() {
        // Load sidebar state from localStorage
        const savedState = localStorage.getItem("sidebar-expanded");
        if (savedState !== null) {
            this.isExpanded = savedState === "true";
        }
    },

    methods: {
        toggleSidebar() {
            this.isExpanded = !this.isExpanded;
            localStorage.setItem("sidebar-expanded", String(this.isExpanded));
        },

        selectMenuItem(id: string) {
            this.activeMenuItem = id;
            
            // Emit event to change view based on menu selection
            if (id === "browser-profiles") {
                EventBus.emit("show-browser-profiles");
            } else if (id === "dashboard") {
                EventBus.emit("show-dashboard");
            } else {
                // For other menu items, show normal view
                EventBus.emit("show-normal-view");
            }
        },
    },
};
</script>

<style scoped lang="scss">
.sidebar-container {
    width: 56px;
    background: var(--bg-secondary);
    height: 100%;
    color: var(--text-primary);
    display: flex;
    flex-direction: column;
    user-select: none;
    transition: width 0.3s ease, background-color 0.3s ease;
    position: relative;
    overflow: hidden;
    border-right: 1px solid var(--border-color);

    &.expanded {
        width: 220px;
    }
}

.sidebar-toggle {
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background: transparent;
    border-bottom: 1px solid var(--border-color);
    transition: all 0.2s ease;

    &:hover {
        background: var(--hover-bg);
    }

    i {
        font-size: 14px;
        color: var(--text-primary);
    }
}

.sidebar-menu {
    flex: 1;
    padding: 10px 0;
    overflow-y: auto;
    overflow-x: hidden;
}

.menu-item {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
    color: var(--text-secondary);
    white-space: nowrap;

    &:hover {
        background: var(--hover-bg);
        color: var(--text-primary);
    }

    &.active {
        background: var(--selected-bg);
        color: var(--accent-color);
        border-left: 3px solid var(--accent-color);
    }

    i {
        font-size: 16px;
        width: 24px;
        text-align: center;
        flex-shrink: 0;
    }

    .menu-label {
        margin-left: 12px;
        font-size: 14px;
        opacity: 0;
        transform: translateX(-10px);
        transition: all 0.3s ease;
        flex: 1;
    }

    .menu-badge {
        margin-left: auto;
        background: var(--accent-color);
        color: white;
        padding: 2px 6px;
        border-radius: 2px;
        font-size: 10px;
        font-weight: bold;
        opacity: 0;
        transform: translateX(-10px);
        transition: all 0.3s ease;
    }
}

.sidebar-container.expanded {
    .menu-item {
        .menu-label,
        .menu-badge {
            opacity: 1;
            transform: translateX(0);
        }
    }
}


// Scrollbar styling for menu
.sidebar-menu::-webkit-scrollbar {
    width: 4px;
}

.sidebar-menu::-webkit-scrollbar-track {
    background: transparent;
}

.sidebar-menu::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 2px;

    &:hover {
        background: rgba(255, 255, 255, 0.3);
    }
}
</style>
