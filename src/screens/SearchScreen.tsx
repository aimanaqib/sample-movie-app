import { useState } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Movie } from "../models/Movie";
import MovieItem from "../components/MovieItem";
import { fetchFromTMDB } from "../config/api";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types";

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const searchMovies = async () => {
    if (!query.trim()) return;

    try {
      setLoading(true);
      Keyboard.dismiss();
      const data = await fetchFromTMDB(
        "/search/movie",
        `&language=en-US&query=${encodeURIComponent(query)}&page=1"`
      );

      const today = new Date();
      const releasedMovies = data.results.filter(
        (m: { release_date?: string }) =>
          m.release_date && new Date(m.release_date) <= today
      );

      setResults(releasedMovies);
    } catch (err) {
      alert(
        alert(
          "Error fetching the movies. \nError: " + err + "\nPlease try again"
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
  };

  const onMoviePressed = (movie: Movie) => {
    navigation.navigate("MovieDetails", { id: movie.id });
  };

  const renderItem = ({ item }: { item: Movie }) => (
    <MovieItem movie={item} onPress={(movie) => onMoviePressed(item)} />
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* 🔍 Search Bar */}
      <View style={styles.searchBar}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={26} color="#ffff" />
        </TouchableOpacity>

        <TextInput
          placeholder="Search movies..."
          placeholderTextColor="#888888ff"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={searchMovies}
          style={styles.input}
          returnKeyType="search"
        />

        {query.length > 0 && (
          <TouchableOpacity onPress={clearSearch} style={styles.iconButton}>
            <Ionicons name="close-circle" size={22} color="#ccccccff" />
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#ffff" />
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          numColumns={3}
          columnWrapperStyle={styles.row}
          contentContainerStyle={{ paddingBottom: 60 }}
          ListEmptyComponent={
            !loading && <Text style={styles.emptyText}>No results found</Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1c1c1cff",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 12,
    marginVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: "#2a2a2aff",
    borderRadius: 12,
  },
  iconButton: {
    paddingHorizontal: 6,
  },
  input: {
    flex: 1,
    color: "#ffff",
    fontSize: 16,
    paddingVertical: 8,
  },
  card: {
    flex: 1,
    margin: 4,
    borderRadius: 8,
    overflow: "hidden",
  },
  row: {
    justifyContent: "space-between",
    marginHorizontal: 8,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    textAlign: "center",
    color: "#888888ff",
    marginTop: 40,
    fontSize: 16,
  },
});
