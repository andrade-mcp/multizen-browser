export interface ITab {
    id: string;
    type?: "settings";
    favicon?: null;
    title: string;
    url?: string;
    session: string;
}

export interface ISession {
    tabs: ITab[];
    settings: {
        homePage: string;
        userAgent: string;
    };
    id: string;
    currentTabIndex: number;
    name?: string;
}

export interface IState {
    currentSessionIndex: number;
    sessions: ISession[];
}
