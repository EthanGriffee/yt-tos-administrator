<template>
  <div>
    <div>
        <div class=mb-4>
          RECENT GAMES FROM {{playedGames[0].player.name}}
          <b-row>
            <b-col sm=6 v-for="played in playedGames" :key="played.username" v-bind:style="colorOfBox(played.role)" class="align-items-center">
              <font-awesome-icon v-if="determineWin(played)" icon="trophy" style="color:gold"/>
              <font-awesome-icon v-else icon="times" style="color:#990000"/>
              <div class="ml-3 mr-2" @click="goToGame(played.game.id)">{{played.game.id}} </div>
              {{played.role.name}}
            </b-col>
            <b-col sm=6>
              
            </b-col>
          </b-row>
        </div>
    </div>
    </div>
</template>

<script>
import determineWinMixin from '../mixins/determineWinMixin'
import goToGameMixin from '../mixins/goToGameMixin'

export default {
  data() {
    return {
        playedGames: "",
        name:this.$route.params.name 
    }
  },
  name: 'playerprofile',
  mixins: [determineWinMixin, goToGameMixin],
  created () {
    // fetch the data when the view is created and the data is
    // already being observed
    this.getPlayedGames()
  },
  watch: {
    // call again the method if the route changes
    '$route': 'getPlayedGames'
  },
  methods: {
    async getPlayedGames() {
        try {
            const response = await fetch(`${process.env.VUE_APP_API_URL}players/${this.name}/playedgames`)
            const data = await response.json()
            this.playedGames = data
        } catch (error) {
            console.error(error)
        }
    }
  }
}
</script>
