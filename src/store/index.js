import { createStore } from 'vuex';

export default createStore({
    state: {
        authenticated: false,
        user: {},
        game: {},
    },
    getters: {},
    mutations: {
        setAuthentication(state, status) {
            state.authenticated = status;
        },
        setUser(state, user) {
            state.user = user;
        },
        setGame(state, game) {
            state.game = game;
        },
    },
    actions: {},
});
