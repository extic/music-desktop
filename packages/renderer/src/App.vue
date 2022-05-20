<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import HelloWorld from "./components/HelloWorld.vue";
</script>

<template>
  <router-view />
  <!-- <div class="logo-box">
    <img style="height: 140px" src="./assets/electron.png" />
    <span />
    <img style="height: 140px" src="./assets/vite.svg" />
    <span />
    <img style="height: 140px" src="./assets/vue.png" />
  </div>
  <HelloWorld msg="Hello Vue 3 + TypeScript + Vite" />
  <div class="static-public">
    Place static files into the <code>src/renderer/public</code> folder
    <img style="width: 90px" :src="'./images/node.png'" />
  </div> -->
</template>

<style lang="scss">
html {
  width: 100%;
  height: 100%;
}

body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;

  @media (max-width: 1200px) {
    font-size: 11px;
  }

  @media (max-width: 780px) {
    font-size: 8px;
  }
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  height: 100%;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-button {
  width: 0;
  height: 0;
}

::-webkit-scrollbar-thumb {
  background: #69ccef;
  border: 0 double #ffffff;
  border-radius: 46px;
}

::-webkit-scrollbar-thumb:hover {
  background: #5da2bc;
}

::-webkit-scrollbar-thumb:active {
  background: #527988;
}

::-webkit-scrollbar-track {
  background: #ffffff;
  border: 0 double #ffffff;
  border-radius: 3px;
}

::-webkit-scrollbar-track:hover {
  background: #f9f9f9;
}

::-webkit-scrollbar-track:active {
  background: #f9f9f9;
}

::-webkit-scrollbar-corner {
  background: transparent;
}

/* >>> #cursorImg-1 {
  transition: all 0.2s ease-in-out;
} */

/* #app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.logo-box {
  display: flex;
  width: 100%;
  justify-content: center;
}

.logo-box span {
  width: 74px;
}

.static-public {
  display: flex;
  align-items: center;
  justify-content: center;
}

.static-public code {
  background-color: #eee;
  padding: 2px 4px;
  margin: 0 4px;
  border-radius: 4px;
  color: #304455;
} */
</style>
