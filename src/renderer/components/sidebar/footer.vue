<template>
    <div class="side-footer" :class="{ expanded: expanded }">
        <button class="open-info-modal-btn" @click="openInfoModal" :title="!expanded ? 'Help' : ''">
            <i class="fa fa-question" />
            <span v-if="expanded" class="footer-label">Help</span>
        </button>
        <div class="version-info" v-if="expanded">
            <span>v{{ version }}</span>
        </div>
        <span v-else class="version-short">{{ versionShort }}</span>
    </div>
</template>

<script lang="ts">
import { EventBus } from "@renderer/utils/event-bus";
import { version } from "./../../../../package.json";

export default {
    props: {
        expanded: {
            type: Boolean,
            default: false,
        },
    },

    computed: {
        version() {
            return version;
        },
        versionShort() {
            return version.split(".").slice(0, 2).join(".");
        },
    },

    methods: {
        openInfoModal() {
            EventBus.emit("open-info-modal");
        },
    },
};
</script>

<style scoped lang="scss">
.side-footer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 50px;
    padding: 10px;
    font-size: 10px;
    text-align: center;
    color: #666;
    border-top: 1px solid #2d2d2d;

    &.expanded {
        align-items: flex-start;
        padding: 10px 16px;
    }

    a {
        margin: 2px 0;
        color: inherit;
        text-decoration: none;
        cursor: pointer;
        transition: 0.2s ease;

        &:hover {
            color: white;
        }
    }
}

.open-info-modal-btn {
    background-color: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    outline: 0;
    border-radius: 2px;
    margin-bottom: 5px;
    cursor: pointer;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    color: var(--text-primary);

    &:hover {
        background-color: var(--hover-bg);
        border-color: var(--accent-color);
        color: var(--accent-color);
    }

    .footer-label {
        margin-left: 8px;
        font-size: 12px;
        opacity: 0;
        transform: translateX(-10px);
        transition: all 0.3s ease;
    }
}

.side-footer.expanded {
    .open-info-modal-btn {
        width: 100%;
        justify-content: flex-start;
        padding: 8px 12px;

        .footer-label {
            opacity: 1;
            transform: translateX(0);
        }
    }
}

.version-info {
    width: 100%;
    text-align: left;
    font-size: 9px;
    color: #666;
    margin-top: 5px;
    opacity: 0;
    transform: translateX(-10px);
    transition: all 0.3s ease;
}

.side-footer.expanded {
    .version-info {
        opacity: 1;
        transform: translateX(0);
    }
}

.version-short {
    font-size: 8px;
    color: #666;
    margin-top: 2px;
}
</style>
