# Configuring Environment

If not already installed, install yarn via npm: `npm install --global yarn`

# Configuring Application

Create a `.env` file at the base of the repo. Supply it with `VITE_AQI_API_TOKEN=123`, but with the value replaced with your AQI API token.

# Running Application

Run: `AQI_API_TOKEN=123 yarn run dev` but with the AQI_API_TOKEN value replaced with your AQI API token.

# Running Tests

Run: `AQI_API_TOKEN=123 yarn test` but with the AQI_API_TOKEN value replaced with your AQI API token.

# Todo

1. Error handling for fetch requests and other scenarios
2. Mobile support (no hamburger menu for nav)
3. Higher test coverage