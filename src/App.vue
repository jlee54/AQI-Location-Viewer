<script>
  export default {
    beforeMount() {
      localStorage.setItem("aqi_details", JSON.stringify({}));
    }
  }
</script>

<template>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <router-view :key="$route.fullPath"></router-view>
</template>

<style scoped>
</style>
