<template>
  <Navbar />
  <div id="content">
    <h1>Air Quality Details</h1>
    <div id="aqiDetails" :style="{'background-color': aqi_color}">
      <ul>
        <li>AQI: {{ aqi }}</li>
        <li>Categorization: {{ aqi_categorization }}</li>
        <li>City: {{ determined_city }}</li>
        <li>Time of Data: {{ data_creation_date }}</li>
      </ul>
    </div>
    <br>
    <button @click="setDetails(true)">Refresh</button>
  </div>
</template>

<script>
  import { ref } from 'vue'
  import Navbar from './Nav.vue'

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
      async getDetails() {
        let response = await fetch("https://api.waqi.info/feed/"+this.determined_city+"/?token=" + import.meta.env.VITE_AQI_API_TOKEN, {
          method: "GET",
        });

        response = await response.json();

        return response.data
      },
      async setDetails(cache_bust = false) {
        let stored_details = localStorage.getItem("aqi_details");

        stored_details = JSON.parse(stored_details);
        let details = stored_details[this.determined_city];

        if (cache_bust || !details) {
          details = await this.getDetails();
        }

        this.aqi = details.aqi;
        this.determineAqiCategorizationDetails();
        this.data_creation_date = new Date().toLocaleString();

        stored_details[this.determined_city] = details;
        stored_details = JSON.stringify(stored_details);
        localStorage.setItem("aqi_details", stored_details)

        this.$forceUpdate();
      },
      determineAqiCategorizationDetails() {
        const aqi = this.aqi;
        if (aqi < 51) {
          this.aqi_categorization = "Good";
          this.aqi_color = "Green";
        } else if (aqi < 101) {
          this.aqi_categorization = "Moderate";
          this.aqi_color = "Yellow";
        } else if (aqi < 151) {
          this.aqi_categorization = "Unhealthy for Sensitive Groups";
          this.aqi_color = "Orange";
        } else if (aqi < 201) {
          this.aqi_categorization = "Unhealthy";
          this.aqi_color = "Red";
        } else if (aqi < 301) {
          this.aqi_categorization = "Very Unhealthy";
          this.aqi_color = "Purple";
        } else if (aqi >= 301) {
          this.aqi_categorization = "Hazordous";
          this.aqi_color = "Maroon";
        } else {
          this.aqi_categorization = "Unknown";
          this.aqi_color = "Grey";
        }
      },
      // Determines a users city by IP address
      async getUserCity() {
        let response = await fetch("https://ipapi.co/json/", {
          method: "GET",
        });

        response = await response.json();

        return response.city;
      }
    },
    async created() {
      if (this.city === "ip-location") {
        this.determined_city = await this.getUserCity();
      } else {
        this.determined_city = this.city;
      }

      await this.setDetails()
    }
  }
</script>


<style scoped lang="scss">
  #aqiDetails {
    width: 20rem;
    padding: 1rem;
    color: black;
  }
</style>
