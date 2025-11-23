<template>
    <div class="top-bar" :class="{ macos: isMac }" :data-theme="theme">
        <div class="top-bar-left">
            <tabs />
        </div>

        <div class="top-bar-actions">
            <!-- Language Dropdown -->
            <div class="language-dropdown-wrapper" ref="languageDropdown">
                <button class="language-btn" @click.stop="showLanguageDropdown = !showLanguageDropdown">
                    <span class="flag-icon">{{ currentLanguage.flag }}</span>
                    <span class="language-text">{{ currentLanguage.code }}</span>
                    <i class="fa fa-chevron-down" :class="{ 'rotated': showLanguageDropdown }" />
                </button>
                <div v-if="showLanguageDropdown" class="language-dropdown" @click.stop>
                    <div
                        v-for="lang in languages"
                        :key="lang.code"
                        class="language-option"
                        :class="{ 'selected': currentLanguage.code === lang.code }"
                        @click="selectLanguage(lang)"
                    >
                        <span class="flag-icon">{{ lang.flag }}</span>
                        <span class="language-option-text">{{ lang.name }}</span>
                        <i v-if="currentLanguage.code === lang.code" class="fa fa-check" />
                    </div>
                </div>
            </div>

            <!-- Theme Toggle -->
            <button 
                class="theme-toggle" 
                :data-theme="theme" 
                @click="toggleTheme" 
                :title="theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
            >
                <i class="fa" :class="theme === 'dark' ? 'fa-sun' : 'fa-moon'" />
            </button>

            <!-- Separator -->
            <div class="action-separator"></div>

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
            showLanguageDropdown: false,
            languages: [
                { code: "EN-GB", name: "English (UK)", flag: "🇬🇧" },
                { code: "PT-BR", name: "Português (BR)", flag: "🇧🇷" },
            ],
            currentLanguage: { code: "EN-GB", name: "English (UK)", flag: "🇬🇧" },
        };
    },
    computed: {
        ...mapGetters("theme", ["isDark"]),
        theme() {
            return this.isDark ? "dark" : "light";
        },
    },
    created() {
        // Initialize theme
        this.$store.commit("theme/setTheme", this.isDark ? "dark" : "light");
        
        // Load saved language preference
        const savedLanguage = localStorage.getItem("app-language");
        if (savedLanguage) {
            const lang = this.languages.find((l: any) => l.code === savedLanguage);
            if (lang) {
                this.currentLanguage = lang;
            }
        }
    },
    mounted() {
        // Listen for window state changes
        if (window.electron) {
            window.electron.ipcRenderer.on("window-maximized", () => {
                this.isMaximized = true;
            });
            window.electron.ipcRenderer.on("window-unmaximized", () => {
                this.isMaximized = false;
            });
        }

        // Handle click outside for language dropdown
        document.addEventListener("click", this.handleClickOutside);
    },
    beforeUnmount() {
        document.removeEventListener("click", this.handleClickOutside);
    },
    methods: {
        ...mapActions("theme", ["toggleTheme"]),
        selectLanguage(lang: any) {
            this.currentLanguage = lang;
            localStorage.setItem("app-language", lang.code);
            this.showLanguageDropdown = false;
            // Emit event or update app language here if needed
        },
        handleClickOutside(event: MouseEvent) {
            const target = event.target as HTMLElement;
            const dropdown = this.$refs.languageDropdown as HTMLElement;
            if (dropdown && !dropdown.contains(target)) {
                this.showLanguageDropdown = false;
            }
        },
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
    gap: 4px;
    flex: 1;
    height: 100%;
    min-height: 32px;
    padding: 4px 4px 0 8px;
    -webkit-app-region: no-drag;
}

.theme-toggle {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #007acc;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.2s ease;
    -webkit-app-region: no-drag;
    color: white;
    margin: 0 4px;

    &:hover {
        background: #005f99;
        transform: scale(1.05);
    }

    &:active {
        transform: scale(0.95);
    }

    i {
        font-size: 14px;
        font-weight: 500;
    }
}

.language-dropdown-wrapper {
    position: relative;
    -webkit-app-region: no-drag;
    margin-right: 4px;
}

.language-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    background: transparent;
    border: 1px solid var(--border-color);
    border-radius: 2px;
    cursor: pointer;
    transition: all 0.2s ease;
    color: var(--text-primary);
    font-size: 12px;
    height: 32px;
    min-width: 80px;

    &:hover {
        background: var(--hover-bg);
        border-color: var(--accent-color);
    }

    .flag-icon {
        font-size: 16px;
        line-height: 1;
    }

    .language-text {
        font-weight: 500;
    }

    .fa-chevron-down {
        font-size: 10px;
        margin-left: auto;
        transition: transform 0.2s ease;

        &.rotated {
            transform: rotate(180deg);
        }
    }
}

.language-dropdown {
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 4px;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 2px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    min-width: 180px;
    z-index: 1000;
    overflow: hidden;
}

.language-option {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    cursor: pointer;
    transition: background 0.15s ease;
    color: var(--text-primary);
    font-size: 13px;

    &:hover {
        background: var(--hover-bg);
    }

    &.selected {
        background: var(--selected-bg);
        color: var(--accent-color);
    }

    .flag-icon {
        font-size: 18px;
        line-height: 1;
    }

    .language-option-text {
        flex: 1;
    }

    .fa-check {
        font-size: 11px;
        color: var(--accent-color);
    }
}

.action-separator {
    width: 1px;
    height: 20px;
    background: var(--border-color);
    margin: 0 4px;
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
