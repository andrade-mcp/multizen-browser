export default {
    namespaced: true,
    state: {
        theme: (localStorage.getItem("multizen-theme") || "dark") as "light" | "dark",
    },
    mutations: {
        setTheme(state: any, theme: "light" | "dark") {
            state.theme = theme;
            localStorage.setItem("multizen-theme", theme);
            // Apply theme to document root
            if (typeof document !== "undefined") {
                document.documentElement.setAttribute("data-theme", theme);
            }
        },
    },
    getters: {
        isDark: (state: any) => state.theme === "dark",
        isLight: (state: any) => state.theme === "light",
    },
    actions: {
        toggleTheme({ commit, state }: any) {
            const newTheme = state.theme === "dark" ? "light" : "dark";
            commit("setTheme", newTheme);
        },
    },
};

