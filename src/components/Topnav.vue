<template>
    <div v-if="$store.state.authenticated" class="topnav">
        <h1>Welcome {{ user.username }} !</h1>
        <ul>
            <li><router-link :to="{ name: 'home' }">Home</router-link></li>
            <li>
                <router-link :to="{ name: 'profile' }">Profile</router-link>
            </li>
            <li>
                <button @click="handleClick">
                    Logout
                </button>
            </li>
            <img :src="user.image_url" :alt="user.username" />
        </ul>
    </div>
</template>

<script>
export default {
    props: ['user'],
    methods: {
        handleClick() {
            this.$store.commit('setAuthentication', false);
            this.$store.commit('setUser', null);
            this.$router.replace({ name: 'login' });
        },
    },
};
</script>

<style scoped>
.topnav {
    display: flex;
    justify-content: space-between;
    background-color: rgba(255, 255, 255, 0.5);
    padding: 1rem;
}
ul {
    display: flex;
    justify-content: space-between;
}

ul li {
    padding: 1rem;
}
</style>
