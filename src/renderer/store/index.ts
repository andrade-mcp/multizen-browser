import { createStore } from "vuex";
import sessions from "./modules/sessions";
import theme from "./modules/theme";
import createPersistedState from "vuex-persistedstate";
import { IState } from "@renderer/interface/IStore";

export default createStore<IState>({
    modules: {
        sessions,
        theme,
    },
    strict: process.env.NODE_ENV !== "production",
    plugins: [
        createPersistedState({
            key: "multizen-browser-storage",
        }),
    ],
});
