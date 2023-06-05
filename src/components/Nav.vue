<template>
  <aside id="nav">
    <h1>AQI Location Viewer</h1>
    <router-link to="/location/ip-location">Your Air Quality</router-link>
    <router-link to="/location/Tokyo">Tokyo</router-link>
    <router-link to="/location/Montreal">Montreal</router-link>
    <router-link to="/location/Paris">Paris</router-link>
  </aside>
</template>

<script>
  import { ref } from 'vue'
  export default {
    name: "Nav"
  }

</script>

<style scoped lang="scss">
  #nav {
    display: flex;
    flex-direction: column;

    * {
      background-color: rgb(17, 24, 39);
      color: white;
      border-bottom: 1px solid white;
      text-align: center;
    }

    h1 {
      padding: 4rem;
      margin: 0;
    }

    a {
      padding: 1.5rem 6rem;
      font-size: 1.2rem;

      &:hover {
        color: #dbdce4 !important;
      }
    }
  }
</style>
