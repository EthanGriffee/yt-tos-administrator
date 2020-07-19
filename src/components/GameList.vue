<template>
  <div>
    <b-container class=mt-2>
      <b-card-group columns>
        <b-card v-bind:style="colorCard(game)" v-for="game in games" :key="game.id">

          <font-awesome-icon @click="deleteGame(game)" icon="times" style="color:white"/>
            <b-card-text @click="goToGame(game.id)">
              Click : 
              {{game.videoTitle}}
            </b-card-text>
            <template v-slot:footer>
              <small>
                <div>
                  <font-awesome-icon icon="award" style="color:black"/>
                  <span class=gold>
                  {{game.mvp.name}}
                  </span>
                  <font-awesome-icon icon="award" style="color:black"/>
                </div>
                <div>
                    <font-awesome-icon icon="poo" style="color:brown"/>
                    <span class=brown>
                    {{game.lvp.name}}
                    </span>
                    <font-awesome-icon icon="poo" style="color:brown"/>
                </div>
              </small>
            </template>
        </b-card>
      </b-card-group>
    </b-container>
  </div>
</template>

<script>
import goToGameMixin from '../mixins/goToGameMixin'

export default {
  name: 'gamelist',
  mixins: [goToGameMixin],
  data() {
    return {
        games: []
    }
  },
  created () {
    // fetch the data when the view is created and the data is
    // already being observed
    this.getAllGames()
  },
  watch: {
    // call again the method if the route changes
    '$route': 'getAllGames'
  },
  methods: {
    async getAllGames() {
        try {
            const response = await fetch(`${process.env.VUE_APP_API_URL}games`)
            const data = await response.json()
            this.games = data
        } catch (error) {
            console.error(error)
        }
    },
    async deleteGame(game) {
        await fetch(`${process.env.VUE_APP_API_URL}games/${game.id}`, {
        method: 'DELETE',
        headers: {
            'content-type': 'application/json'
        }})
        this.games.splice(this.games.indexOf(game), 1);
    },
    colorCard(game) {
      switch(game.winner) {
        case 'TOWN':
          return {backgroundColor: '#23de46', color: '#fcfcfc'}
        case 'MAFIA':
          return {backgroundColor: '#ff1f1f', color: '#fcfcfc'}
        case 'NK':
          return {backgroundColor: '#263cff', color: '#fcfcfc'}
        case 'DRAW':
          return {backgroundColor: '#fcfcfc', color: '#170303'}
      }
    return {backgroundColor: 'black'}
    }
  }
}
</script>

<style>
.brown {
  color: #C19A6B;
  font-weight: bold;
}

.gold {
  color: #FFD700 ;
  font-weight: bold;
}
</style>