<template>
    <div class="view-settings">
        <div v-if="currentSession" class="settings-wrap">
            <h1>{{ currentSession.name || `Session${currentSessionIndex + 1}` }}</h1>
            <div class="session-info">
                <p>Session ID: {{ currentSession.id }}</p>
                <p>These settings apply to the current session only.</p>
                <button class="close-session-btn" @click="closeSession">
                    Close session
                </button>
            </div>
            <hr />
            <div class="settings-block">
                <h4>Session Name</h4>
                <div class="input-block">
                    <input
                        v-model="sessionName"
                        class="d-block"
                        type="text"
                        placeholder="Enter session name"
                        @blur="saveSessionName"
                        @change="saveSessionName"
                    />
                </div>
            </div>
            <hr />
            <div>
                <div class="settings-block">
                    <h4>Home page</h4>
                    <div class="input-block">
                        <input
                            v-model="homePage"
                            class="d-block"
                            type="url"
                            required
                            @blur="saveHomePage"
                            @change="saveHomePage"
                        />
                    </div>
                </div>
                <hr />
                <div class="settings-block">
                    <h4>User Agent</h4>
                    <div class="input-block">
                        <div class="d-flex">
                            <input
                                v-model="userAgent"
                                class="d-block"
                                type="text"
                                @blur="saveUserAgent"
                                @change="saveUserAgent"
                            />
                            <button
                                class="set-ua-btn"
                                @click="setDefaultUserAgent"
                            >
                                <i class="fa fa-globe" /> Set default
                            </button>

                            <button
                                class="set-ua-btn"
                                @click="setRandomUserAgent"
                            >
                                <i class="fa fa-refresh" /> Get random
                            </button>
                        </div>
                    </div>
                </div>
                <hr />

                <div class="settings-block">
                    <div class="input-block">
                        <label class="checkbox-block disabled">
                            <input type="checkbox" disabled />
                            <span
                                >Disable Ads
                                <span style="font-style: italic"
                                    >(COMING SOON!)</span
                                ></span
                            >
                        </label>
                    </div>
                </div>
                <hr />

                <div class="settings-block">
                    <div class="input-block">
                        <label class="checkbox-block disabled">
                            <input type="checkbox" disabled />
                            <span
                                >Enable Proxy
                                <span style="font-style: italic"
                                    >(COMING SOON!)</span
                                ></span
                            >
                        </label>
                    </div>
                </div>
                <hr />

                <div class="settings-block">
                    <div class="input-block">
                        <label class="checkbox-block disabled">
                            <input type="checkbox" disabled />
                            <span
                                >Default Search Engine
                                <span style="font-style: italic"
                                    >(COMING SOON!)</span
                                ></span
                            >
                        </label>
                    </div>
                </div>
                <hr />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { mapGetters, mapMutations } from "vuex";
import userAgents from "@renderer/user-agents/useragents.json";

const defaultUserAgent = window.navigator.userAgent;

export default {
    data() {
        return {
            userAgent: "",
            homePage: "",
            sessionName: "",
            defaultUserAgent,
        };
    },

    computed: {
        ...mapGetters("sessions", ["currentSession", "currentSessionIndex"]),
    },

    created() {
        this.userAgent = this.currentSession.settings.userAgent;
        this.homePage = this.currentSession.settings.homePage;
        this.sessionName = this.currentSession.name || `Session${this.currentSessionIndex + 1}`;
    },

    methods: {
        ...mapMutations("sessions", [
            "updateSessionSetting",
            "removeSession",
            "updateSessionName",
        ]),

        saveHomePage() {
            this.homePage = this.urlify(this.homePage.trim());
            this.updateSessionSetting({
                sessionIndex: this.currentSessionIndex,
                k: "homePage",
                v: this.homePage,
            });
        },

        setDefaultUserAgent() {
            this.userAgent = defaultUserAgent;
            this.saveUserAgent();
        },

        setRandomUserAgent() {
            this.userAgent = this.getRandomUserAgent();
            this.saveUserAgent();
        },

        saveUserAgent() {
            this.updateSessionSetting({
                sessionIndex: this.currentSessionIndex,
                k: "userAgent",
                v: this.userAgent,
            });
        },

        saveSessionName() {
            const name = this.sessionName.trim() || `Session${this.currentSessionIndex + 1}`;
            this.updateSessionName({
                sessionIndex: this.currentSessionIndex,
                name: name,
            });
            this.sessionName = name;
        },

        closeSession() {
            this.removeSession({ sessionIndex: this.currentSessionIndex });
        },

        urlify(url) {
            return url.indexOf("://") === -1 ? "https://" + url : url;
        },

        getRandomUserAgent() {
            return userAgents[Math.floor(Math.random() * userAgents.length)];
        },
    },
};
</script>

<style scoped lang="scss">
.view-settings {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: left;
    font-size: 16px;
    color: var(--text-primary);
    background: var(--bg-primary);
    overflow: auto;
    transition: background-color 0.3s ease, color 0.3s ease;
}

.settings-wrap {
    width: 100%;
    max-width: 800px;
    height: 100%;
    padding-top: 100px;
}

.close-session-btn {
    font-family: inherit;
    text-transform: uppercase;
    background-color: #4a2a2a;
    border: 1px solid #6a3a3a;
    border-radius: 2px;
    outline: 0;
    padding: 5px 9px;
    cursor: pointer;
    white-space: nowrap;
    font-weight: bold;
    color: #ff9999;
    transition: all 0.2s ease;

    &:hover {
        background-color: #5a3a3a;
        border: 1px solid #8a4a4a;
        color: #ffaaaa;
    }
}

.session-info {
    margin-bottom: 20px;
    font-size: 14px;
}

h4 {
    font-size: 13px;
    text-transform: uppercase;
    margin-bottom: 6px;
    color: var(--text-primary);
    transition: color 0.3s ease;
}

hr {
    width: 100%;
    height: 1px;
    display: block;
    background-color: var(--border-color);
    border: 0;
    margin: 16px 0;
    transition: background-color 0.3s ease;
}

.settings-block {
    text-align: left;
}

.input-block {
    label {
        color: var(--text-primary);
        font-size: 14px;
        transition: color 0.3s ease;
    }

    input[type="text"],
    input[type="url"] {
        width: 100%;
        padding: 6px;
        outline: 0;
        border: 1px solid var(--border-color);
        border-radius: 2px;
        transition: all 0.3s ease;
        background-color: var(--input-bg);
        color: var(--text-primary);

        &:read-only {
            cursor: default;
            color: var(--text-tertiary);
            border: 1px solid var(--border-light);
            background-color: var(--bg-tertiary);
        }

        &:focus {
            border: 1px solid var(--accent-color);
            background-color: var(--bg-tertiary);
        }
    }

    .radio-block {
        margin: 7px 0;
        display: block;
    }

    .checkbox-block {
        font-size: 13px;
        font-weight: bold;
        text-transform: uppercase;

        &.disabled {
            color: #999;
            cursor: not-allowed;
        }
    }
}

.set-ua-btn {
    font-family: inherit;
    text-transform: uppercase;
    background-color: var(--button-bg);
    border: 1px solid var(--accent-color);
    border-radius: 2px;
    outline: 0;
    padding: 5px 9px;
    margin-left: 12px;
    cursor: pointer;
    white-space: nowrap;
    color: white;
    transition: all 0.2s ease;

    &:hover {
        background-color: var(--button-hover);
        border: 1px solid var(--accent-hover);
        color: #ffffff;

        i {
            transform: rotate(360deg);
        }
    }

    i {
        transition: 0.5s ease;
    }
}
</style>
