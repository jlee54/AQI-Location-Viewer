export const determineAqiCategorizationDetails = (aqi) => {
  let details = {}

  if (aqi < 51) {
    details.aqi_categorization = "Good";
    details.aqi_color = "Green";
  } else if (aqi < 101) {
    details.aqi_categorization = "Moderate";
    details.aqi_color = "Yellow";
  } else if (aqi < 151) {
    details.aqi_categorization = "Unhealthy for Sensitive Groups";
    details.aqi_color = "Orange";
  } else if (aqi < 201) {
    details.aqi_categorization = "Unhealthy";
    details.aqi_color = "Red";
  } else if (aqi < 301) {
    details.aqi_categorization = "Very Unhealthy";
    details.aqi_color = "Purple";
  } else if (aqi >= 301) {
    details.aqi_categorization = "Hazardous";
    details.aqi_color = "Maroon";
  } else {
    details.aqi_categorization = "Unknown";
    details.aqi_color = "Grey";
  }

  return details;
}


export default { determineAqiCategorizationDetails };
