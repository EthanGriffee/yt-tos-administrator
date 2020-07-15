<template>
    <div class="container mt-2">
        <b-alert show variant="success" v-if="inserted == 1" @dismissed="inserted=0" dismissible> 
            Succesfully inserted game!
        </b-alert>
        <b-alert show variant="danger" v-if="inserted == 2" @dismissed="inserted=0" dismissible> 
            Failed to insert game!
        </b-alert>
        <div class=row>
            <div class="col-1 d-flex justify-content-between mb-3">
                <font-awesome-icon icon="award" style="color:gold"/>
                <font-awesome-icon icon="poo" style="color:brown" spin/>
            </div>
        </div>
        <div class=row>
            <div class=col-6>
                <div v-for="x in 15" :key="x" class="row mb-1">
                    <div class="col-2 d-flex justify-content-between">
                        <input type="radio" v-model="newgame.mvp" :value="x - 1">
                        <input type="radio" v-model="newgame.lvp" :value="x - 1">
                    </div>
                    <input class="mr-2" v-model="newgame.players[x - 1]" placeholder="Player Username">
                    <v-select select :clearable="false" v-model="newgame.roles[x - 1]" :options="possibleroles"/>
                </div>
            </div>
            <div class=col-6>
                <picture-input
                    ref="pictureInput"
                    @change="onChanged"
                    :removable="false"
                    accept="image/png"
                    buttonClass="ui button primary"
                    :customStrings="{
                    upload: '<h1>Upload it!</h1>',
                    drag: 'Drop Game Screenshot Here'}">
                </picture-input>
            </div>
        </div>

        <div class=row>
            <div class="col-6 d-flex justify-content-between">
                <div>
                    <label class=mr-2> Winner :</label>
                    <select v-model="newgame.game.winner">
                        <option> TOWN </option>
                        <option> MAFIA </option>
                        <option>  NK </option>
                        <option> DRAW </option>
                    </select>
                </div>
                <div>
                    <label class=mr-2> NE Win? </label>
                    <select v-model="newgame.game.neWin">
                        <option> true </option>
                        <option> false </option>
                    </select>
                </div>
                <div>
                <input v-model="newgame.game.youtubeID" placeholder="WHDnGyzdUMI">
                </div>
                <div>
                    <label class=mr-2> Legacy </label>
                    <input type="checkbox" v-model="legacy"/>
                </div>
            </div>
        </div>

        <button @click="onSubmit()" type="button" class="btn btn-primary mt-2"> SUBMIT </button>
    </div>
</template>

<script>
import PictureInput from 'vue-picture-input'
import vSelect from 'vue-select' 
import AWS from 'aws-sdk'

export default {
  name: 'upload',
  data() {
    return {
        newgame: {
            game: {
                winner: "TOWN",
                neWin: false,
                youtubeID: "",
                videoTitle: ""

            },
            mvp: 0,
            lvp: 0,
            players: [],
            roles: []
        },
        possibleroles: [ "Jailor", "Sheriff", "Investigator", "Lookout", "Spy", "Vigilante", "Veteran", "Bodyguard", "Doctor", "Escort", "Mayor", "Medium", "Retributionist", "Transporter", "Godfather",  "Mafioso", "Disguiser", 
            "Forger",  "Framer",  "Janitor",  "Blackmailer",  "Consigliere",  "Consort",  "Jester",  "Witch",  "Executioner",  "Arsonist",  "Werewolf",  "Serial Killer"],
        legacy: false,
        inserted: 0
    }
  },
  components: {
    PictureInput,
    vSelect
  },
  methods: {
    onChanged() {
        const tex = require("aws-sdk/clients/textract");

        AWS.config.update({
            secretAccessKey: process.env.VUE_APP_AWS_SECRET_KEY,
            accessKeyId: process.env.VUE_APP_AWS_ACCESS_KEY,
            region: process.env.VUE_APP_AWS_REGION
        });

        var params = {
            Document: {
                S3Object: {
                    Bucket: 'peanutland',
                    Name: 'gameresult.png'
                }
            }
        }
        var textract = new tex({apiVersion: '2018-06-27'});

        var bucket = new AWS.S3({params: {Bucket: 'peanutland'}});
        // expected format for file input : index {optional Legacy} mvpIndex lvpIndex Winner neWin(true or false) idoFytvid 
        var partsArray = this.$refs.pictureInput.fileName.split(' ');
        var curr_check = 1;
        if (partsArray.length == 7 &&  partsArray[1] == "Legacy") {
            this.legacy = true;
            curr_check= 2;
        }
        if (partsArray.length - curr_check == 5) {
            this.newgame.mvp =  partsArray[curr_check];
            this.newgame.lvp =  partsArray[curr_check + 1];
            this.newgame.game.winner =  partsArray[curr_check + 2].toUpperCase();
            this.newgame.game.neWin = partsArray[curr_check + 3];
            this.newgame.game.youtubeID = partsArray[curr_check + 4].substring(0, partsArray[curr_check + 4].indexOf('.'));
        }

         var instance = this;


        var imageFile = {Key: 'gameresult.png', Body: this.$refs.pictureInput.file};
        bucket.upload(imageFile, function (err) {
            if (err) console.log(err, err.stack); // an error occurred
            else {
                textract.detectDocumentText(params, function (err, data) {
                if (err) console.log(err); // an error occurred
                else {
                    console.log(data);
                    var current_user = 0;
                    var count = 0;
                    var count_check = instance.legacy ? -1 : 1;
                    for(var block of data.Blocks) {
                        if (block.BlockType == "LINE") {
                            if (count == 0) {
                                instance.$set(instance.newgame.players, current_user, block.Text.replace(/\s+/g, ''))
                                count += 1;
                            }
                            else if (count == count_check) count += 1;
                            else {
                                instance.$set(instance.newgame.roles, current_user, block.Text)
                                count = 0;
                                current_user += 1;
                            }

                        }

                    }
                }});
            }
        })
        console.log(this.newgame);
      },
    async onSubmit() {

        console.log(this.newgame);
        const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${this.newgame.game.youtubeID}&key=${process.env.VUE_APP_YT_API_KEY}`, {
            method: 'GET',
            headers: {
                'content-type': 'application/json'
            }})
        const data = await response.json()
        console.log(data);
        if(data == null || data.items.length == 0) this.inserted = 2;
        this.newgame.game.videoTitle = data.items[0].snippet.title;
        const response2 = await fetch(`${process.env.VUE_APP_API_URL}games`, {
                method: 'POST',
                body: JSON.stringify(this.newgame),
                headers: {
                    'content-type': 'application/json'
                }})
        const data2 = await response2.json();
        this.inserted = data2 == null ? 2 : 1;
    }
  }
}
</script>

<style lang="scss">
    $vs-colors: (
            lightest: #DCDCDC,
            light: #D3D3D3,
            dark: #C0C0C0,
            darkest: #A9A9A9,
    );

    @import "vue-select/src/scss/vue-select.scss";

  .vs__dropdown-menu {
    background: #dfe5fb;
    border: none;
    color: #394066;
    text-transform: lowercase;
    font-variant: small-caps;
  }

    input[type="radio"] {
    margin-top: -1px;
    height: 100%;
    vertical-align: middle;
    }

</style>