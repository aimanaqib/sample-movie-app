import Constants from "expo-constants";

export const TMDB_API_KEY = Constants.expoConfig?.extra?.TMDB_API_KEY;

export const BASE_URL = "https://api.themoviedb.org/3";

export const fetchFromTMDB = async (endpoint: string, params = "") => {
  const url = `${BASE_URL}${endpoint}?api_key=${TMDB_API_KEY}${params}`;
  const response = await fetch(url);
  return response.json();
};
