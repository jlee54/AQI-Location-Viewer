<script>
  export default {
    beforeMount() {
      // Initialize or clear aqi_details
      localStorage.setItem("aqi_details", JSON.stringify({}));

      this.$router.push("/location/ip-location");
    }
  }
</script>

<template>
  <router-view :key="$route.fullPath"></router-view>
</template>

<style scoped>
</style>
