<template>
  <div class=all>
      <div> GAME DETAILS: </div>
      <b-container fluid="lg">
        <b-row>
          <b-col lg="6" md="7"> 
            <ul class=black-border>
              <li class="white black-border" v-for="played in players" :key="played.username" v-bind:style="colorOfBox(played.role)">
                <b-row>
                  <b-col>
                    <font-awesome-icon class="ml-2" v-if="determineWin(played)" icon="trophy" style="color:gold"/>
                  </b-col>
                  <b-col>
                    <font-awesome-icon v-if="game.lvp.name == played.player.name" icon="poo" style="color:brown" spin/>
                    <font-awesome-icon v-if="game.mvp.name == played.player.name" icon="award" style="color:black"/>
                  </b-col>
                  <b-col sm=5 @click="goToPlayers(played.player.name)"> {{played.player.name}} </b-col>
                  <b-col sm=5> {{played.role.name}} </b-col>
                </b-row>
              </li>
            </ul>
          </b-col>
          <b-col lg="6" md="5"> 
            <iframe :src="youtubeURL" frameborder="0" allowfullscreen></iframe>
          </b-col>
        </b-row>
      </b-container>
    </div>
</template>

<script>
import determineWinMixin from '../mixins/determineWinMixin'

export default {
  name: 'game',
  data() {
    return {
        gameId:this.$route.params.id 
    }
  },
  mixins: [determineWinMixin],
  props: {
    game: Object,
    players: Array
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
  methods: {
    async getGames() {
        try {
            const response = await fetch(`${process.env.VUE_APP_API_URL}games/${this.gameId}/players`)
            const data = await response.json()
            this.players = data
            this.game = this.players[0].game;
        } catch (error) {
            console.error(error)
        }
    },
    goToPlayers(username) {
      this.$router.push({name:'playerProfile',params:{name:username}})
    }
  },
  computed: {
    // a computed getter
    youtubeURL: function () {
      // `this` points to the vm instance
      return "https://www.youtube.com/embed/" + this.game.youtubeID;
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