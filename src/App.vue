<template>
  <div id=app>
      <NavBar/>
      <router-view/>
    <div id=footer>
      COPYRIGHT 2020
    </div>
  </div>
</template>

<script>

import NavBar from './components/NavBar'

export default {
  name: 'App',
  components: {
    NavBar
  }
}
</script>

<style>

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  background-color:black;
  color: white;
  min-height: 100vh;
  border: solid 1px transparent;
}


#footer {
  bottom: 0%;
  position: fixed;
  width: 100%
}
</style>
