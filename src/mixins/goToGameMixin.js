export default {
    methods: {
        goToGame: function(id) {
            this.$router.push({name:'gameItem',params:{id:id}})
          }
    }
}