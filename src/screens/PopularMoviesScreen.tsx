import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import MovieItem from "../components/MovieItem";
import { useNavigation } from "@react-navigation/native";
import { Movie } from "../models/Movie";
import { fetchFromTMDB } from "../config/api";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types";

export default function PopularMoviesScreen() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const fetchMovies = async (pageNumber = 1) => {
    try {
      if (pageNumber === 1) setLoading(true);
      else setLoadingMore(true);

      const data = await fetchFromTMDB("/movie/popular", `&page=${pageNumber}`);

      if (pageNumber === 1) setMovies(data.results);
      else setMovies((prev) => [...prev, ...data.results]);

      setTotalPages(data.total_pages);
    } catch (err) {
      alert(
        alert(
          "Error fetching the movies. \nError: " + err + "\nPlease try again"
        )
      );
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchMovies(1);
  }, []);

  const handleLoadMore = () => {
    if (page < totalPages && !loadingMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchMovies(nextPage);
    }
  };

  const renderItem = ({ item }: { item: Movie }) => (
    <MovieItem
      movie={item}
      onPress={(movie) => navigation.navigate("MovieDetails", { id: movie.id })}
    />
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={movies}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        contentContainerStyle={{ paddingBottom: 30 }}
        columnWrapperStyle={styles.row}
        extraData={movies.length}
        ListEmptyComponent={
          !loading && <Text style={styles.emptyText}>No results found</Text>
        }
        ListFooterComponent={
          page < totalPages ? (
            <View style={{ padding: 10 }}>
              {loadingMore ? (
                <ActivityIndicator size="small" color="#999999ff" />
              ) : (
                <TouchableOpacity
                  onPress={handleLoadMore}
                  style={styles.loadMoreButton}
                >
                  <Text style={styles.loadMoreText}>Load More</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <View style={{ padding: 20, alignItems: "center" }}>
              <Text style={{ color: "#999999ff" }}>No more movies</Text>
            </View>
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1c1c1cff",
    paddingTop: 10,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#1c1c1cff",
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  emptyText: {
    color: "#999999ff",
    fontSize: 16,
  },
  loadMoreButton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  loadMoreText: {
    color: "white",
    fontWeight: "bold",
  },
});
