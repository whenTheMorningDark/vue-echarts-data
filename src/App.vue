<template>
  <div id="app">
    <Echarts></Echarts>
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vu
import Echarts from "./views/echarts"

export default {
  name: 'App',
  components: {
    Echarts
  }
}
</script>

<style>
#app,
body,
html {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}
</style>
