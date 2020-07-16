export default {
    methods: {
        determineWin: function(playedGame) {
            switch(playedGame.role.type) {
            case 'JAILOR':
                /* falls through */
            case 'TOWN_INVESTIGATIVE':
                /* falls through */
            case 'TOWN_KILLING':
                /* falls through */
            case 'TOWN_PROTECTIVE':
                /* falls through */
            case 'TOWN_SUPPORT':
                /* falls through */
                return playedGame.game.winner == "TOWN"
            case 'GODFATHER':
                /* falls through */
            case 'MAFIOSO':
                /* falls through */
            case 'RANDOM_MAFIA':
                /* falls through */
                return playedGame.game.winner == "MAFIA"
            case 'NEUTRAL_EVIL':
                return playedGame.game.neWin;
            case 'NEUTRAL_KILLING':
                return playedGame.game.winner == "NK"
            }
            return false
        },
        colorOfBox(role) {
            switch(role.type) {
            case 'JAILOR':
                /* falls through */
            case 'TOWN_INVESTIGATIVE':
                /* falls through */
            case 'TOWN_KILLING':
                /* falls through */
            case 'TOWN_PROTECTIVE':
                /* falls through */
            case 'TOWN_SUPPORT':
                /* falls through */
                return {backgroundColor: '#23de46'}
            case 'GODFATHER':
                /* falls through */
            case 'MAFIOSO':
                /* falls through */
            case 'RANDOM_MAFIA':
                /* falls through */
                return {backgroundColor: '#ff1f1f'} 
            case 'NEUTRAL_EVIL':
                switch(role.name) {
                case 'Jester':
                    return {backgroundColor: '#ff91e0'}
                case 'Witch':
                    return {backgroundColor: '#b240ff'}
                case 'Executioner':
                    return {backgroundColor: '#bdbdbd'}
                }
                break;
            case 'NEUTRAL_KILLING':
                switch(role.name) {
                case 'Arsonist':
                    return {backgroundColor: '#ff9a36'}
                case 'Werewolf':
                    return {backgroundColor: '#99773d'}
                case 'Serial Killer':
                    return {backgroundColor: '#263cff'}
                }
                break;
            }
            return {backgroundColor: 'black'}
        }
    }
}