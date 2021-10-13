<template>
    <div class="home">
        <gamelist />
        <userlist />
    </div>
</template>

<script>
import Userlist from '@/components/Userlist';
import Gamelist from '@/components/Gamelist';

export default {
    props: ['user'],
    components: {
        Userlist,
        Gamelist,
    },
    mounted() {},
};
</script>

<style scoped>
.home {
    width: 90%;
    max-width: 1000px;
    display: flex;
    justify-content: space-around;
    margin: 0 auto;
    flex-wrap: wrap;
}
</style>
