<template>
    <div class="userlist" v-if="!loading">
        <h2 v-if="challengers?.length > 0">Challengers</h2>
        <ul v-if="challengers">
            <li v-for="c in challengers" class="user" :key="c.id">
                <img :src="c.image_url" alt="" />
                <span>{{ c.username }}</span>
                <button @click="accept(c.id)">Accept challenge!</button>
            </li>
        </ul>

        <h2>Users</h2>
        <ul v-if="users">
            <li v-for="user in otherUsers" class="user" :key="user.id">
                <img :src="user.image_url" alt="" />
                <span>{{ user.username }}</span>
                <button @click="challenge(user.id)">Challenge!</button>
            </li>
        </ul>
    </div>

    <div v-else:>Loading...</div>
</template>

<script>
import axios from '@/axios';

export default {
    data: function() {
        return {
            loading: true,
            user_id: null,
            challengers: null,
            users: null,
        };
    },
    async mounted() {
        const user_id = await axios.get('/api/user_id');
        const { data } = await axios.get('/api/users');
        this.user_id = user_id.data;
        this.challengers = data.challengers;
        this.users = data.users;
        this.loading = false;
    },
    computed: {
        otherUsers() {
            return this.users
                ? this.users.filter((user) => user.id !== this.user_id)
                : null;
        },
    },
};
</script>

<style scoped>
.userlist {
    width: 40%;
    min-width: 350px;
}
li.user {
    margin: 0.4rem 0;
    padding: 0.5rem;
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 5px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    transition: all 0.3s ease;
}
li.game a h3 {
    display: flex;
    justify-content: center;
    align-items: center;
}
li.user *,
li.game a h3 * {
    margin: 0 0.5rem;
}
li.user img,
li.game img,
.top-nav img {
    border-radius: 50%;
    width: 50px;
    height: 50px;
    object-fit: cover;
}
li.user:hover {
    cursor: pointer;
    background-color: rgba(255, 255, 255, 0.5);
}
</style>
