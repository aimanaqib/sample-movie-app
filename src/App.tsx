import * as React from "react";
import { createStaticNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import HomeScreen from "./screens/HomeScreen";
import MovieDetailsScreen from "./screens/MovieDetailsScreen";
import SearchScreen from "./screens/SearchScreen";
import PopularMoviesScreen from "./screens/PopularMoviesScreen";
import { StatusBar } from "expo-status-bar";

const RootStack = createNativeStackNavigator<RootStackParamList>({
  screenOptions: {
    headerStyle: { backgroundColor: "#1c1c1cff" },
    headerTintColor: "#ffff",
    headerTitleStyle: { color: "#ffff" },
    headerBackButtonDisplayMode: "minimal",
    headerTitle: "",
  },
  screens: {
    Home: {
      screen: HomeScreen,
      options: { headerShown: false },
    },
    PopularMovies: {
      screen: PopularMoviesScreen,
      options: { headerTitle: "Popular Movies" },
    },
    MovieDetails: {
      screen: MovieDetailsScreen,
      options: { headerTitle: "Details" },
    },
    Search: {
      screen: SearchScreen,
      options: { headerShown: false },
    },
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return (
    <>
      <Navigation />
      <StatusBar style="light" />
    </>
  );
}
