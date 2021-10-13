import { createRouter, createWebHistory } from 'vue-router';
// import { createRouter } from 'vue-router';
import store from './store';

import Login from '@/pages/Login';
// import Register from '@/pages/Register';
import Home from '@/pages/Home';
import Profile from '@/pages/Profile';
import Game from '@/pages/Game';

const routes = [
    { path: '/', redirect: 'login' },
    {
        path: '/login',
        name: 'login',
        component: Login,
        props: true,
        beforeEnter: (to, from, next) => {
            if (store.state.authenticated) {
                next('/home');
            } else {
                next();
            }
        },
    },
    {
        path: '/home',
        name: 'home',
        component: Home,
        props: true,
        beforeEnter: (to, from, next) => {
            if (!store.state.authenticated) {
                next('/login');
            } else {
                next();
            }
        },
    },
    {
        path: '/profile',
        name: 'profile',
        component: Profile,
        props: true,
        beforeEnter: (to, from, next) => {
            if (!store.state.authenticated) {
                next('/login');
            } else {
                next();
            }
        },
    },
    {
        path: '/game/:game_id',
        name: 'game',
        component: Game,
        props: true,
        beforeEnter: (to, from, next) => {
            if (!store.state.authenticated) {
                next('/login');
            } else {
                next();
            }
        },
    },
    {
        path: '/:catchAll(.*)',
        redirect: 'login',
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
