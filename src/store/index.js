import { createStore } from 'vuex';

export default createStore({
    state: {
        authenticated: false,
        user: {},
    },
    getters: {},
    mutations: {
        setAuthentication(state, status) {
            state.authenticated = status;
        },
        setUser(state, user) {
            state.user = user;
        },
    },
    actions: {},
});
