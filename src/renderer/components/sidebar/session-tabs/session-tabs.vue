<template>
    <div class="session-tabs">
        <slot />
    </div>
</template>

<style scoped lang="scss">
.session-tabs {
    -webkit-app-region: drag;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 5px 0;
    max-height: calc(100vh - 300px);
    overflow-y: auto;
    overflow-x: hidden;
    overflow-x: hidden;

    // Custom scrollbar
    &::-webkit-scrollbar {
        width: 4px;
    }

    &::-webkit-scrollbar-track {
        background: transparent;
    }

    &::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.2);
        border-radius: 2px;

        &:hover {
            background: rgba(255, 255, 255, 0.3);
        }
    }
}
</style>
