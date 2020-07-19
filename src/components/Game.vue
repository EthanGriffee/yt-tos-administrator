<template>
    <div class="container mt-2">
        <b-alert show variant="success" v-if="inserted == 1" @dismissed="inserted=0" dismissible> 
            Succesfully update game!
        </b-alert>
        <b-alert show variant="danger" v-if="inserted == 2" @dismissed="inserted=0" dismissible> 
            Failed to update game!
        </b-alert>
        <div class=row>
            <div class="col-2 d-flex justify-content-between mb-3">
                <font-awesome-icon icon="award" style="color:gold"/>
                <font-awesome-icon icon="poo" style="color:brown" spin/>
            </div>
        </div>
        <div v-for="x in 15" :key="x" class="row mb-1">
            <div class="col-2 d-flex justify-content-between">
                <input type="radio" v-model="game.mvp" :value="game.players[x - 1].player">
                <input type="radio" v-model="game.lvp" :value="game.players[x - 1].player">
            </div>
            <input class="mr-2" v-model="game.players[x - 1].player.name" placeholder="Player Username">
            <v-select select :clearable="false" v-model="game.players[x - 1].role.name" :options="possibleroles"/>
        </div>

        <div class=row>
            <div class="col-6 d-flex justify-content-between">
                <div>
                    <label class=mr-2> Winner :</label>
                    <select v-model="game.winner">
                        <option> TOWN </option>
                        <option> MAFIA </option>
                        <option>  NK </option>
                        <option> DRAW </option>
                    </select>
                </div>
                <div>
                    <label class=mr-2> NE Win? </label>
                    <select v-model="game.neWin">
                        <option> true </option>
                        <option> false </option>
                    </select>
                </div>
                <div>
                <input v-model="game.youtubeID" placeholder="WHDnGyzdUMI">
                </div>
            </div>
        </div>

        <button @click="onSubmit()" type="button" class="btn btn-primary mt-2"> SAVE </button>
    </div>
</template>

<script>
import vSelect from 'vue-select' 

export default {
  name: 'game',
  data() {
    return {
        gameId:this.$route.params.id , 
        game: {},
        inserted: 0
    }
  },
  created () {
    // fetch the data when the view is created and the data is
    // already being observed
    this.getGames()
  },
  watch: {
    // call again the method if the route changes
    '$route': 'getGames'
  },
  components: {
    vSelect
  },
  methods: {
    async getGames() {
        try {
            const response = await fetch(`${process.env.VUE_APP_API_URL}games/${this.gameId}/players`)
            const data = await response.json()
            const response2 = await fetch(`${process.env.VUE_APP_API_URL}games/${this.gameId}`)
            this.game = await response2.json();
            this.game.players = data;
        } catch (error) {
            console.error(error)
        }
    },
    async onSubmit() {
        const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${this.game.youtubeID}&key=${process.env.VUE_APP_YT_API_KEY}`, {
            method: 'GET',
            headers: {
                'content-type': 'application/json'
            }})
        const data = await response.json()
        if(data == null || data.items.length == 0) { this.inserted = 2; return;}
        this.game.videoTitle = data.items[0].snippet.title;
        console.log(this.game);
        console.log(`${process.env.VUE_APP_API_URL}games`);
        const response2 = await fetch(`${process.env.VUE_APP_API_URL}games`, {
                method: 'PUT',
                body: JSON.stringify(this.game),
                headers: {
                    'content-type': 'application/json'
                }})
        console.log("CHEETO");
        const data2 = await response2.json();
        console.log(data2);
        this.inserted = data2 == -1 ? 2 : 1;
    }
  }
}
</script>

<style scoped>
.all {
    background-image: url(../assets/tos-background.png);
    background-position: center;
    position: fixed;
    height: 100%;
    width:  100%;
}
.white {
    color: #fff;
}
ul {
  list-style-type: none;
  padding: 0;
  margin: 0 0 0 0;
}
iframe {
  width:100%; height:100%;
}
.black-border {
  border: 1px solid black;
}
</style>