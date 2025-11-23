<template>
    <div class="top-bar" :class="{ macos: isMac }" :data-theme="theme">
        <div class="top-bar-left">
            <button class="theme-toggle" :data-theme="theme" @click="toggleTheme" :title="theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'">
                <i class="fa" :class="theme === 'dark' ? 'fa-sun' : 'fa-moon'" />
            </button>
            <tabs />
        </div>

        <div class="top-bar-actions">
            <template v-if="isMac">
                <button class="top-bar-close" @click="closeWindow">
                    <i class="fa fa-times" />
                </button>
                <button class="top-bar-minimize" @click="minimizeWindow">
                    <i class="fa fa-window-minimize" />
                </button>
                <button class="top-bar-maximize" @click="maximizeWindow">
                    <i class="fa fa-window-maximize" />
                </button>
            </template>

            <template v-else>
                <button class="top-bar-minimize" @click="minimizeWindow">
                    <i class="fa fa-minus" />
                </button>
                <button class="top-bar-maximize" @click="maximizeWindow">
                    <i class="fa" :class="isMaximized ? 'fa-window-restore' : 'fa-square'" />
                </button>
                <button class="top-bar-close" @click="closeWindow">
                    <i class="fa fa-times" />
                </button>
            </template>
        </div>
    </div>
</template>

<script lang="ts">
import Tabs from "./tabs.vue";
import { mapGetters, mapActions } from "vuex";

export default {
    components: {
        Tabs,
    },
    data() {
        return {
            isMac: process.platform === "darwin",
            isMaximized: false,
        };
    },
    computed: {
        ...mapGetters("theme", ["isDark"]),
        theme() {
            return this.isDark ? "dark" : "light";
        },
    },
    mounted() {
        // Initialize theme
        this.$store.commit("theme/setTheme", this.isDark ? "dark" : "light");
        
        // Listen for window state changes
        if (window.electron) {
            window.electron.ipcRenderer.on("window-maximized", () => {
                this.isMaximized = true;
            });
            window.electron.ipcRenderer.on("window-unmaximized", () => {
                this.isMaximized = false;
            });
        }
    },
    methods: {
        ...mapActions("theme", ["toggleTheme"]),
        minimizeWindow() {
            window.electron.ipcRenderer.send("minimize-window");
        },

        maximizeWindow() {
            window.electron.ipcRenderer.send("maximize-window");
        },

        closeWindow() {
            window.electron.ipcRenderer.send("close-window");
        },
    },
};
</script>

<style scoped lang="scss">
.top-bar {
    user-select: none;
    -webkit-app-region: drag;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    min-height: 32px;
    height: auto;
    padding: 0;
    transition: background-color 0.3s ease, border-color 0.3s ease;

    &[data-theme="dark"] {
        background-color: #2d2d30;
        border-bottom: 1px solid #3e3e42;
    }

    &[data-theme="light"] {
        background-color: #ffffff;
        border-bottom: 1px solid #e0e0e0;
    }

    &.macos {
        flex-direction: row-reverse;

        .top-bar-left {
            flex-direction: row-reverse;
        }

        .top-bar-actions {
            margin-left: 0;

            button {
                position: relative;
                width: 14px;
                height: 14px;
                outline: none;
                margin: 0 3px;
                border: 0;
                background: rgba(137, 150, 193, 0.22);
                border-radius: 50%;
                text-align: center;
                cursor: default;
                transition: 0.2s ease;
                color: rgb(0 0 0 / 31%);
                font-size: 8px;

                &:hover {
                    i {
                        opacity: 1;
                    }
                }

                &.top-bar-close {
                    background-color: #ff5f56;
                }

                &.top-bar-minimize {
                    background-color: #ffbd2e;
                }

                &.top-bar-maximize {
                    background-color: #27c93f;
                }

                i {
                    display: flex;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    opacity: 0;
                }
            }
        }
    }
}

.top-bar-left {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    flex: 1;
    height: 100%;
    min-height: 32px;
    padding: 4px 8px 0 8px;
    -webkit-app-region: no-drag;
}

.theme-toggle {
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    border-radius: 2px;
    cursor: pointer;
    transition: all 0.2s ease;
    -webkit-app-region: no-drag;
    margin-top: 2px;

    &[data-theme="dark"] {
        color: #ffa500;

        &:hover {
            background: rgba(255, 165, 0, 0.15);
            color: #ffb84d;
        }
    }

    &[data-theme="light"] {
        color: #007acc;

        &:hover {
            background: rgba(0, 122, 204, 0.15);
            color: #1a8cd8;
        }
    }

    i {
        font-size: 16px;
    }
}

.top-bar-actions {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 0;
    padding: 0;
    cursor: default;
    -webkit-app-region: no-drag;

    button {
        width: 46px;
        height: 32px;
        outline: none;
        border: none;
        text-align: center;
        cursor: pointer;
        transition: all 0.15s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        color: var(--text-primary);
        background: transparent;

        &:hover {
            background: var(--hover-bg);
        }

        &.top-bar-close {
            &:hover {
                background: #e81123;
                color: white;
            }
        }

        &.top-bar-minimize,
        &.top-bar-maximize {
            &:hover {
                background: var(--hover-bg);
            }
        }

        i {
            font-size: 11px;
            font-weight: 500;
        }
    }
}
</style>
