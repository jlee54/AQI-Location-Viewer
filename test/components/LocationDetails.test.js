import { mount } from '@vue/test-utils'
import LocationDetails from '../../src/components/LocationDetails.vue'
import { test, assert, describe, expect, it } from 'vitest'

// Expect Reference
// https://vitest.dev/api/expect.html
// https://www.chakshunyu.com/blog/how-to-mock-the-return-value-of-an-imported-function-in-jest/

test("When the location is Tokyo", async () => {
  localStorage.setItem("aqi_details", JSON.stringify({}))

  const mockFetchDetails = vi.spyOn(LocationDetails.methods, "fetchDetails").mockReturnValue(JSON.parse(TokyoJson()).data)
  const wrapper = mount(LocationDetails, {
    propsData: {
      city: "Tokyo"
    }
  })

  expect(mockFetchDetails).toHaveBeenCalled()

  await wrapper.vm.$forceUpdate();

  expect(wrapper.props().city).toBe("Tokyo")
  expect(wrapper.vm.determined_city).toBe("Tokyo")
  expect(wrapper.vm.aqi_categorization).toBe("Moderate")
  expect(wrapper.vm.aqi_color).toBe("Yellow")
  expect(wrapper.vm.data_creation_date).not.toBe("")
})

test("When the location is Montreal", async () => {
	localStorage.setItem("aqi_details", JSON.stringify({}))

	const mockFetchDetails = vi.spyOn(LocationDetails.methods, "fetchDetails").mockReturnValue(JSON.parse(MontrealJson()).data)
	const wrapper = mount(LocationDetails, {
	  propsData: {
	    city: "Montreal"
	  }
	})

	expect(mockFetchDetails).toHaveBeenCalled()

	await wrapper.vm.$forceUpdate();

	expect(wrapper.props().city).toBe("Montreal")
	expect(wrapper.vm.determined_city).toBe("Montreal")
	expect(wrapper.vm.aqi_categorization).toBe("Good")
  expect(wrapper.vm.aqi_color).toBe("Green")
  expect(wrapper.vm.data_creation_date).not.toBe("")
})

test("When the location is Paris", async () => {
	localStorage.setItem("aqi_details", JSON.stringify({}))

	const mockFetchDetails = vi.spyOn(LocationDetails.methods, "fetchDetails").mockReturnValue(JSON.parse(ParisJson()).data)
	const wrapper = mount(LocationDetails, {
	  propsData: {
	    city: "Paris"
	  }
	})

	expect(mockFetchDetails).toHaveBeenCalled()

	await wrapper.vm.$forceUpdate();

	expect(wrapper.props().city).toBe("Paris")
	expect(wrapper.vm.determined_city).toBe("Paris")
	expect(wrapper.vm.aqi_categorization).toBe("Moderate")
  expect(wrapper.vm.aqi_color).toBe("Yellow")
	expect(wrapper.vm.data_creation_date).not.toBe("")
})

test("When the location is User IP Based", async () => {
	localStorage.setItem("aqi_details", JSON.stringify({}))

	const mockFetchUserCity = vi.spyOn(LocationDetails.methods, "fetchUserCity").mockReturnValue(JSON.parse(UserIpLocationInfo()).city)
	const mockFetchDetails = vi.spyOn(LocationDetails.methods, "fetchDetails").mockReturnValue(JSON.parse(LincolnJson()).data)
	const wrapper = mount(LocationDetails, {
	  propsData: {
	    city: "ip-location"
	  }
	})

	expect(mockFetchUserCity).toHaveBeenCalled()

	await wrapper.vm.$forceUpdate();
	await wrapper.vm.$forceUpdate();

	expect(wrapper.props().city).toBe("ip-location")
	expect(wrapper.vm.determined_city).toBe("Lincoln")

	// These are not being read back to the test correctly?
	expect(wrapper.vm.aqi_categorization).toBe("Moderate")
	expect(wrapper.vm.aqi_color).toBe("Yellow")
	expect(wrapper.vm.data_creation_date).not.toBe("")
})

test("When the location has already been cached", async () => {
	localStorage.setItem("aqi_details", JSON.stringify({}))

	const mockFetchDetails = vi.spyOn(LocationDetails.methods, "fetchDetails").mockReturnValue(JSON.parse(ParisJson()).data)
	let wrapper = mount(LocationDetails, {
	  propsData: {
	    city: "Paris"
	  }
	})

	expect(mockFetchDetails).toHaveBeenCalled()

	await wrapper.vm.$forceUpdate();

	const data_creation_date_first_pass = wrapper.vm.data_creation_date

	wrapper.vm.setDetails()

	await wrapper.vm.$forceUpdate();

	const data_creation_date_second_pass = wrapper.vm.data_creation_date

	console.log(data_creation_date_second_pass)

	expect(wrapper.props().city).toBe("Paris")
	expect(wrapper.vm.determined_city).toBe("Paris")
	expect(wrapper.vm.aqi_categorization).toBe("Moderate")
  expect(wrapper.vm.aqi_color).toBe("Yellow")

  // The first pass equaling the second pass proves caching was utilized
	expect(data_creation_date_first_pass).toBe(data_creation_date_second_pass)
})


test("When the cached location is cache busted", async () => {
	localStorage.setItem("aqi_details", JSON.stringify({}))

	let altered_data = JSON.parse(ParisJson()).data
	altered_data["aqi"] = 250

	const mockFetchDetails = vi.spyOn(LocationDetails.methods, "fetchDetails")
		.mockResolvedValueOnce(JSON.parse(ParisJson()).data)
		.mockResolvedValueOnce(altered_data)
	let wrapper = mount(LocationDetails, {
	  propsData: {
	    city: "Paris"
	  }
	})

	expect(mockFetchDetails).toHaveBeenCalled()

	await wrapper.vm.setDetails(true)

	const data_creation_date_second_pass = wrapper.vm.data_creation_date

	expect(wrapper.props().city).toBe("Paris")
	expect(wrapper.vm.determined_city).toBe("Paris")

	// This recognized the change in AQI
	expect(wrapper.vm.aqi_categorization).toBe("Very Unhealthy")
  expect(wrapper.vm.aqi_color).toBe("Purple")
})


// Todo: Cover other aqi numbers for full test coverage


// Fixtures should typically belong in other files
function TokyoJson() {
	return "{\"status\":\"ok\",\"data\":{\"aqi\":64,\"idx\":5573,\"attributions\":[{\"url\":\"https://soramame.env.go.jp/\",\"name\":\"JapanAtmosphericEnvironmentalRegionalObservationSystem(環境省大気汚染物質広域監視システム)\",\"logo\":\"Japan-Soramame.png\"},{\"url\":\"https://www.kankyo.metro.tokyo.lg.jp/\",\"name\":\"Tokyo,JapanEnvironmentAgency(東京都環境局)\",\"logo\":\"Japan-Tokyo.png\"},{\"url\":\"https://waqi.info/\",\"name\":\"WorldAirQualityIndexProject\"}],\"city\":{\"geo\":[35.6414629,139.6981712],\"name\":\"Meguro(目黒)\",\"url\":\"https://aqicn.org/city/meguro\",\"location\":\"\"},\"dominentpol\":\"o3\",\"iaqi\":{\"co\":{\"v\":3.4},\"h\":{\"v\":36.5},\"no2\":{\"v\":12.1},\"o3\":{\"v\":63.5},\"p\":{\"v\":1008.9},\"pm10\":{\"v\":14},\"pm25\":{\"v\":1},\"so2\":{\"v\":2.9},\"t\":{\"v\":29.7},\"w\":{\"v\":4.5}},\"time\":{\"s\":\"2023-06-0515:00:00\",\"tz\":\"+09:00\",\"v\":1685977200,\"iso\":\"2023-06-05T15:00:00+09:00\"},\"forecast\":{\"daily\":{\"o3\":[{\"avg\":13,\"day\":\"2023-06-03\",\"max\":23,\"min\":4},{\"avg\":12,\"day\":\"2023-06-04\",\"max\":23,\"min\":3},{\"avg\":13,\"day\":\"2023-06-05\",\"max\":42,\"min\":1},{\"avg\":15,\"day\":\"2023-06-06\",\"max\":52,\"min\":1},{\"avg\":18,\"day\":\"2023-06-07\",\"max\":86,\"min\":6},{\"avg\":8,\"day\":\"2023-06-08\",\"max\":15,\"min\":3},{\"avg\":7,\"day\":\"2023-06-09\",\"max\":14,\"min\":6},{\"avg\":6,\"day\":\"2023-06-10\",\"max\":7,\"min\":6}],\"pm10\":[{\"avg\":27,\"day\":\"2023-06-04\",\"max\":28,\"min\":20},{\"avg\":28,\"day\":\"2023-06-05\",\"max\":38,\"min\":19},{\"avg\":31,\"day\":\"2023-06-06\",\"max\":46,\"min\":20},{\"avg\":58,\"day\":\"2023-06-07\",\"max\":90,\"min\":24},{\"avg\":37,\"day\":\"2023-06-08\",\"max\":46,\"min\":24},{\"avg\":24,\"day\":\"2023-06-09\",\"max\":37,\"min\":15},{\"avg\":40,\"day\":\"2023-06-10\",\"max\":47,\"min\":33},{\"avg\":71,\"day\":\"2023-06-11\",\"max\":100,\"min\":37}],\"pm25\":[{\"avg\":71,\"day\":\"2023-06-04\",\"max\":79,\"min\":68},{\"avg\":73,\"day\":\"2023-06-05\",\"max\":79,\"min\":58},{\"avg\":88,\"day\":\"2023-06-06\",\"max\":115,\"min\":68},{\"avg\":139,\"day\":\"2023-06-07\",\"max\":186,\"min\":76},{\"avg\":110,\"day\":\"2023-06-08\",\"max\":138,\"min\":78},{\"avg\":70,\"day\":\"2023-06-09\",\"max\":111,\"min\":53},{\"avg\":103,\"day\":\"2023-06-10\",\"max\":141,\"min\":89},{\"avg\":164,\"day\":\"2023-06-11\",\"max\":205,\"min\":112}],\"uvi\":[{\"avg\":1,\"day\":\"2022-10-24\",\"max\":2,\"min\":0}]}},\"debug\":{\"sync\":\"2023-06-05T15:25:17+09:00\"}}}"
}

function MontrealJson() {
	return "{\"status\":\"ok\",\"data\":{\"aqi\":18,\"idx\":5922,\"attributions\":[{\"url\":\"http://ville.montreal.qc.ca/portal/page?_pageid=7237,74495616\\u0026_dad=portal\\u0026_schema=PORTAL\",\"name\":\"VilledeMontreal-Réseaudesurveillancedelaqualitédel'air\",\"logo\":\"Canada-Montreal.png\"},{\"url\":\"https://waqi.info/\",\"name\":\"WorldAirQualityIndexProject\"}],\"city\":{\"geo\":[45.5086699,-73.5539925],\"name\":\"Montreal\",\"url\":\"https://aqicn.org/city/montreal\",\"location\":\"\"},\"dominentpol\":\"pm25\",\"iaqi\":{\"co\":{\"v\":6.4},\"d\":{\"v\":1},\"h\":{\"v\":83.6},\"no2\":{\"v\":11},\"o3\":{\"v\":12},\"p\":{\"v\":1017.4},\"pm25\":{\"v\":18},\"so2\":{\"v\":5.1},\"t\":{\"v\":11},\"w\":{\"v\":1},\"wd\":{\"v\":330}},\"time\":{\"s\":\"2023-06-0500:00:00\",\"tz\":\"-04:00\",\"v\":1685923200,\"iso\":\"2023-06-05T00:00:00-04:00\"},\"forecast\":{\"daily\":{\"o3\":[{\"avg\":12,\"day\":\"2023-06-03\",\"max\":19,\"min\":7},{\"avg\":11,\"day\":\"2023-06-04\",\"max\":16,\"min\":3},{\"avg\":4,\"day\":\"2023-06-05\",\"max\":19,\"min\":1},{\"avg\":9,\"day\":\"2023-06-06\",\"max\":20,\"min\":1},{\"avg\":8,\"day\":\"2023-06-07\",\"max\":12,\"min\":4},{\"avg\":8,\"day\":\"2023-06-08\",\"max\":12,\"min\":4},{\"avg\":7,\"day\":\"2023-06-09\",\"max\":15,\"min\":2}],\"pm10\":[{\"avg\":2,\"day\":\"2023-06-03\",\"max\":3,\"min\":2},{\"avg\":3,\"day\":\"2023-06-04\",\"max\":5,\"min\":2},{\"avg\":9,\"day\":\"2023-06-05\",\"max\":12,\"min\":5},{\"avg\":6,\"day\":\"2023-06-06\",\"max\":15,\"min\":5},{\"avg\":7,\"day\":\"2023-06-07\",\"max\":10,\"min\":4},{\"avg\":4,\"day\":\"2023-06-08\",\"max\":7,\"min\":2},{\"avg\":4,\"day\":\"2023-06-09\",\"max\":10,\"min\":3}],\"pm25\":[{\"avg\":5,\"day\":\"2023-06-03\",\"max\":11,\"min\":3},{\"avg\":8,\"day\":\"2023-06-04\",\"max\":12,\"min\":3},{\"avg\":27,\"day\":\"2023-06-05\",\"max\":38,\"min\":13},{\"avg\":20,\"day\":\"2023-06-06\",\"max\":58,\"min\":12},{\"avg\":24,\"day\":\"2023-06-07\",\"max\":37,\"min\":13},{\"avg\":13,\"day\":\"2023-06-08\",\"max\":25,\"min\":5},{\"avg\":13,\"day\":\"2023-06-09\",\"max\":27,\"min\":6}],\"uvi\":[{\"avg\":0,\"day\":\"2022-10-22\",\"max\":3,\"min\":0},{\"avg\":0,\"day\":\"2022-10-23\",\"max\":3,\"min\":0}]}},\"debug\":{\"sync\":\"2023-06-05T14:57:23+09:00\"}}}";
}

function ParisJson() {
	return "{\"status\":\"ok\",\"data\":{\"aqi\":53,\"idx\":5722,\"attributions\":[{\"url\":\"https://www.airparif.asso.fr/\",\"name\":\"AirParif-Associationdesurveillancedelaqualitédel'airenÎle-de-France\",\"logo\":\"Paris-Air-Parif.png\"},{\"url\":\"http://www.eea.europa.eu/themes/air/\",\"name\":\"EuropeanEnvironmentAgency\",\"logo\":\"Europe-EEA.png\"},{\"url\":\"https://waqi.info/\",\"name\":\"WorldAirQualityIndexProject\"}],\"city\":{\"geo\":[48.856614,2.3522219],\"name\":\"Paris\",\"url\":\"https://aqicn.org/city/paris\",\"location\":\"\"},\"dominentpol\":\"pm25\",\"iaqi\":{\"co\":{\"v\":0.1},\"h\":{\"v\":75.5},\"no2\":{\"v\":22.6},\"o3\":{\"v\":15.3},\"p\":{\"v\":1017.9},\"pm10\":{\"v\":21},\"pm25\":{\"v\":53},\"so2\":{\"v\":0.6},\"t\":{\"v\":14.9},\"w\":{\"v\":3.3}},\"time\":{\"s\":\"2023-06-0506:00:00\",\"tz\":\"+02:00\",\"v\":1685944800,\"iso\":\"2023-06-05T06:00:00+02:00\"},\"forecast\":{\"daily\":{\"o3\":[{\"avg\":32,\"day\":\"2023-06-04\",\"max\":46,\"min\":21},{\"avg\":34,\"day\":\"2023-06-05\",\"max\":48,\"min\":19},{\"avg\":34,\"day\":\"2023-06-06\",\"max\":50,\"min\":19},{\"avg\":35,\"day\":\"2023-06-07\",\"max\":51,\"min\":21},{\"avg\":39,\"day\":\"2023-06-08\",\"max\":39,\"min\":33}],\"pm10\":[{\"avg\":10,\"day\":\"2023-06-04\",\"max\":12,\"min\":8},{\"avg\":13,\"day\":\"2023-06-05\",\"max\":17,\"min\":10},{\"avg\":17,\"day\":\"2023-06-06\",\"max\":24,\"min\":11},{\"avg\":14,\"day\":\"2023-06-07\",\"max\":18,\"min\":11},{\"avg\":14,\"day\":\"2023-06-08\",\"max\":14,\"min\":14}],\"pm25\":[{\"avg\":34,\"day\":\"2023-06-04\",\"max\":44,\"min\":23},{\"avg\":45,\"day\":\"2023-06-05\",\"max\":59,\"min\":30},{\"avg\":53,\"day\":\"2023-06-06\",\"max\":68,\"min\":39},{\"avg\":47,\"day\":\"2023-06-07\",\"max\":56,\"min\":34},{\"avg\":47,\"day\":\"2023-06-08\",\"max\":47,\"min\":45}],\"uvi\":[{\"avg\":0,\"day\":\"2021-02-26\",\"max\":1,\"min\":0},{\"avg\":0,\"day\":\"2021-02-27\",\"max\":3,\"min\":0},{\"avg\":0,\"day\":\"2021-02-28\",\"max\":2,\"min\":0},{\"avg\":0,\"day\":\"2021-03-01\",\"max\":2,\"min\":0},{\"avg\":0,\"day\":\"2021-03-02\",\"max\":2,\"min\":0},{\"avg\":1,\"day\":\"2021-03-03\",\"max\":2,\"min\":0}]}},\"debug\":{\"sync\":\"2023-06-05T15:47:47+09:00\"}}}";
}

function LincolnJson() {
	return "{\"status\":\"ok\",\"data\":{\"aqi\":59,\"idx\":7364,\"attributions\":[{\"url\":\"http://www.deq.state.ne.us/\",\"name\":\"NebraskaDepartmentofEnvironmentalQuality\"},{\"url\":\"http://www.airnow.gov/\",\"name\":\"AirNow-USEPA\"},{\"url\":\"https://waqi.info/\",\"name\":\"WorldAirQualityIndexProject\"}],\"city\":{\"geo\":[40.812558,-96.675733],\"name\":\"LlchdBam,Nebraska,USA\",\"url\":\"https://aqicn.org/city/usa/nebraska/llchd-bam\",\"location\":\"\"},\"dominentpol\":\"pm25\",\"iaqi\":{\"h\":{\"v\":79.5},\"p\":{\"v\":506.1},\"pm25\":{\"v\":59},\"t\":{\"v\":18.8},\"w\":{\"v\":0.1},\"wg\":{\"v\":0.9}},\"time\":{\"s\":\"2023-06-0500:00:00\",\"tz\":\"-06:00\",\"v\":1685923200,\"iso\":\"2023-06-05T00:00:00-06:00\"},\"forecast\":{\"daily\":{\"o3\":[{\"avg\":13,\"day\":\"2023-06-03\",\"max\":25,\"min\":6},{\"avg\":14,\"day\":\"2023-06-04\",\"max\":30,\"min\":5},{\"avg\":11,\"day\":\"2023-06-05\",\"max\":24,\"min\":2},{\"avg\":13,\"day\":\"2023-06-06\",\"max\":25,\"min\":1},{\"avg\":13,\"day\":\"2023-06-07\",\"max\":23,\"min\":2},{\"avg\":16,\"day\":\"2023-06-08\",\"max\":25,\"min\":5},{\"avg\":17,\"day\":\"2023-06-09\",\"max\":26,\"min\":10}],\"pm10\":[{\"avg\":10,\"day\":\"2023-06-03\",\"max\":13,\"min\":8},{\"avg\":16,\"day\":\"2023-06-04\",\"max\":18,\"min\":11},{\"avg\":9,\"day\":\"2023-06-05\",\"max\":18,\"min\":5},{\"avg\":10,\"day\":\"2023-06-06\",\"max\":11,\"min\":8},{\"avg\":8,\"day\":\"2023-06-07\",\"max\":12,\"min\":7},{\"avg\":7,\"day\":\"2023-06-08\",\"max\":10,\"min\":1},{\"avg\":8,\"day\":\"2023-06-09\",\"max\":9,\"min\":7}],\"pm25\":[{\"avg\":40,\"day\":\"2023-06-03\",\"max\":53,\"min\":30},{\"avg\":60,\"day\":\"2023-06-04\",\"max\":65,\"min\":48},{\"avg\":33,\"day\":\"2023-06-05\",\"max\":64,\"min\":18},{\"avg\":39,\"day\":\"2023-06-06\",\"max\":45,\"min\":30},{\"avg\":33,\"day\":\"2023-06-07\",\"max\":45,\"min\":28},{\"avg\":29,\"day\":\"2023-06-08\",\"max\":41,\"min\":4},{\"avg\":33,\"day\":\"2023-06-09\",\"max\":36,\"min\":28}]}},\"debug\":{\"sync\":\"2023-06-05T15:25:05+09:00\"}}}";
}

function UserIpLocationInfo() {
	return "{\"ip\":\"206.50.21.227\",\"network\":\"209.50.16.0/21\",\"version\":\"IPv4\",\"city\":\"Lincoln\",\"region\":\"Nebraska\",\"region_code\":\"NE\",\"country\":\"US\",\"country_name\":\"UnitedStates\",\"country_code\":\"US\",\"country_code_iso3\":\"USA\",\"country_capital\":\"Washington\",\"country_tld\":\".us\",\"continent_code\":\"NA\",\"in_eu\":false,\"postal\":\"68516\",\"latitude\":40.7597,\"longitude\":-96.6542,\"timezone\":\"America/Chicago\",\"utc_offset\":\"-0500\",\"country_calling_code\":\"+1\",\"currency\":\"USD\",\"currency_name\":\"Dollar\",\"languages\":\"en-US,es-US,haw,fr\",\"country_area\":9629091.0,\"country_population\":327167434,\"asn\":\"AS15108\",\"org\":\"ALLO-COMM\"}";
}