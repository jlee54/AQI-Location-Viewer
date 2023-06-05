<template>
  <Navbar />
  <div id="content">
    <h1>Air Quality Details</h1>
    <div id="aqiDetails" :style="{'background-color': aqi_color}">
      <ul>
        <li>AQI: {{ aqi }}</li>
        <li>Categorization: {{ aqi_categorization }}</li>
        <li>City: {{ determined_city }}</li>
        <li>Time Pulled: {{ data_creation_date }}</li>
      </ul>
    </div>
    <br>
    <button @click="setDetails(true)">Refresh</button>
  </div>
</template>

<script>
  import { ref } from 'vue'
  import Navbar from './Nav.vue'
  import { determineAqiCategorizationDetails } from '../helpers/LocationDetails'

  export default {
    components: {
      Navbar
    },
    props: {
      city: {
        type: String,
        required: true
      }
    },
    setup() {
      const aqi = "";
      const aqi_categorization = "";
      const aqi_color = "";
      const data_creation_date = "";
      const determined_city = "";

      return {
        aqi,
        aqi_categorization,
        aqi_color,
        data_creation_date,
        determined_city,
      }
    },
    methods: {
      async fetchDetails() {
        let response = await fetch("https://api.waqi.info/feed/" + this.determined_city + "/?token=" + import.meta.env.VITE_AQI_API_TOKEN, {
          method: "GET",
        });

        response = await response.json();

        return response.data
      },
      async setDetails(cache_bust = false) {
        let stored_details = localStorage.getItem("aqi_details");

        stored_details = JSON.parse(stored_details);
        let details = stored_details[this.determined_city];
        let new_data = false;

        if (cache_bust || !details) {
          details = await this.fetchDetails();
          new_data = true;
        }

        details = this.formatDisplayInfo(details)

        if (new_data) {
          this.cacheContent(stored_details, details)
        }
      },
      formatDisplayInfo(info) {
        this.aqi = info.aqi;

        const categorization_details = determineAqiCategorizationDetails(this.aqi);
        this.aqi_categorization = categorization_details.aqi_categorization;
        this.aqi_color = categorization_details.aqi_color;

        this.data_creation_date = info.data_creation_date || new Date().toLocaleString();
        info.data_creation_date = this.data_creation_date;

        this.$forceUpdate();

        return info;
      },
      cacheContent(existing_cache, new_content) {
        existing_cache[this.determined_city] = new_content;

        existing_cache = JSON.stringify(existing_cache);
        localStorage.setItem("aqi_details", existing_cache)
      },
      // Determines a user's city by IP address
      async fetchUserCity() {
        let response = await fetch("https://ipapi.co/json/", {
          method: "GET",
        });

        response = await response.json();

        return response.city;
      }
    },
    async created() {
      if (this.city === "ip-location") {
        this.determined_city = await this.fetchUserCity();
      } else {
        this.determined_city = this.city;
      }

      await this.setDetails()
    }
  }
</script>


<style scoped lang="scss">

  #content {
    h1 {
      font-size: 3rem;
    }
  }

  #aqiDetails {
    width: 20rem;
    padding: 1rem;
    color: black;
  }
</style>
