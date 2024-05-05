import axios from "axios";

const API_URL = "http://localhost:4000/api/locations";

// Get all locations
const getAllLocations = async (user) => {
  try {
    const startTime = new Date().getTime();
    const response = await axios.get(API_URL + "/all", {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    const endTime = new Date().getTime();
    const executionTime = endTime - startTime;
    console.log(`The function took ${executionTime} milliseconds to execute.`);
    return response?.data?.locations || [];
  } catch (error) {
    console.error("locationService getAllLocations:", error);
    throw error;
  }
};

// Get paginated locations
const getLocationsByPage = async (user, pageQuery) => {
  try {
    const response = await axios.get(API_URL + pageQuery, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    return response?.data || {};
  } catch (error) {
    console.error("locationService getLocationsByPage:", error);
    throw error;
  }
};

// Get locations with nearby score
const getLocationsByScore = async (user, pageQuery) => {
  try {
    const response = await axios.get(API_URL + "/search" + pageQuery, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    return response?.data?.suggestions || [];
  } catch (error) {
    console.error("locationService getLocationsByScore:", error);
    throw error;
  }
};

export { getAllLocations, getLocationsByPage, getLocationsByScore };
