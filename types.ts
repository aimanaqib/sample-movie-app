import { Movie } from "./src/models/Movie";

export type RootStackParamList = {
  Home: undefined;
  PopularMovies: undefined;
  MovieDetails: { id: number };
  Search: undefined;
};
