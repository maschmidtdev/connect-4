<template>
    <div class="game-cell" type="text/x-template">
        <div class="position">
            <div class="circle" :class="classObject">
                <!-- {{ position }} -->
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['position', 'game'],
    data() {
        return {};
    },
    mounted() {},
    computed: {
        classObject: function() {
            return {
                'player-1':
                    this.game.gamestate[this.position] ===
                    this.game.player_1.id,
                'player-2':
                    this.game.gamestate[this.position] ===
                    this.game.player_2.id,
                win:
                    this.game.winner &&
                    this.game.winner.includes(this.position),
            };
        },
    },
};
</script>

<style scoped>
.position {
    width: 100px;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
}
.circle {
    background-color: rgb(55, 97, 194);
    border-radius: 50%;
    width: 75%;
    height: 75%;
}

.win.circle {
    border: 10px solid green;
}

.player-1.circle {
    background-color: yellow;
}
.player-1 .circle {
    background-color: yellow;
}
.player-2.circle {
    background-color: red;
}
.player-2 .circle {
    background-color: red;
}
</style>
