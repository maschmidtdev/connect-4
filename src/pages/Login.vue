<template>
    <div class="login">
        <h1>Login</h1>
        <input
            type="text"
            name="email"
            v-model="email"
            placeholder="Email"
            required
        />
        <input
            type="password"
            name="password"
            v-model="password"
            placeholder="Password"
        />
        <button type="button" @click="login(email, password)">
            Login
        </button>
    </div>
</template>

<script>
import axios from '@/axios';

export default {
    name: 'Login',
    data() {
        return {
            email: '',
            password: '',
        };
    },
    methods: {
        login(email, password) {
            axios
                .post('/api/login', { email, password })
                .then(({ data }) => {
                    if (data) {
                        this.$store.commit('setAuthentication', true);
                        this.$store.commit('setUser', data);
                        this.$router.replace({ name: 'home' });
                    }
                })
                .catch((err) => {
                    console.log(err.response.data.error);
                });
        },
    },
};
</script>
