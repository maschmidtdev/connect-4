<template>
    <topnav :user="user"></topnav>
    <router-view :user="user"></router-view>
</template>

<script>
import Topnav from '@/components/Topnav';
import socket from '@/socket';

export default {
    name: 'App',
    data() {
        return {
            socket,
        };
    },
    components: {
        Topnav,
    },
    computed: {
        user() {
            return this.$store.state.user;
        },
    },
};
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
}
</style>

<style>
* {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
}

:root {
    --player1: yellow;
    --player2: red;
    /* --background: ghostwhite; */
    --background: rgb(55, 97, 194);
    --linkhover: rgba(255, 255, 255, 0.3);
    --text-primary: black;
}
body {
    background-color: var(--background);
    font-family: Verdana, Geneva, Tahoma, sans-serif;
}

main {
    text-align: center;
    font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande',
        'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
}
ul {
    list-style-type: none;
}
a {
    text-decoration: none;
    color: var(--text-primary);
}
a:visited {
    color: var(--text-primary);
}
button {
    padding: 5px;
    margin: 5px auto;
}
img {
    border-radius: 50%;
    width: 50px;
    height: 50px;
    object-fit: cover;
}

.player-1 {
    color: yellow;
}
.player-2 {
    color: red;
}
</style>
