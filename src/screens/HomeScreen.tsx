import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Movie } from "../models/Movie";
import { fetchFromTMDB } from "../config/api";
import dayjs from "dayjs";
import * as Animatable from "react-native-animatable";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types";

const { height, width } = Dimensions.get("window");

export default function HomeScreen() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const data = await fetchFromTMDB(
        "/movie/popular",
        "&language=en-US&page=1"
      );
      setMovies(data.results);
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

  const onMoviePressed = (movie: Movie) => {
    navigation.navigate("MovieDetails", { id: movie.id });
  };

  const onViewAllPressed = () => {
    navigation.navigate("PopularMovies");
  };

  const renderMovieItem = ({ item, index }: { item: Movie; index: number }) => (
    <Animatable.View
      animation="fadeInLeft"
      delay={index * 100}
      duration={500}
      useNativeDriver
      style={styles.movieCard}
    >
      <TouchableOpacity
        onPress={() => onMoviePressed(item)}
        activeOpacity={0.8}
      >
        <Image
          source={{
            uri: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
          }}
          style={styles.poster}
        />
        <Text style={styles.movieTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.movieInfo}>
          {dayjs(item.release_date).format("YYYY")} • ⭐{" "}
          {item.vote_average.toFixed(1)}
        </Text>
      </TouchableOpacity>
    </Animatable.View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#999" />
      </View>
    );
  }

  const featuredMovie = movies[0];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Kloudius Movie</Text>
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => navigation.navigate("Search" as never)}
          >
            <Ionicons name="search" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Featured Movie Section */}
        {featuredMovie && (
          <Animatable.View
            animation="fadeInUp"
            duration={400}
            useNativeDriver
            style={styles.featuredContainer}
          >
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => onMoviePressed(featuredMovie)}
            >
              <Image
                source={{
                  uri: `https://image.tmdb.org/t/p/w500${featuredMovie.poster_path}`,
                }}
                style={styles.featuredPoster}
              />
            </TouchableOpacity>
          </Animatable.View>
        )}

        {/* Popular Movies List Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular Movies</Text>
          <TouchableOpacity onPress={onViewAllPressed}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          horizontal
          data={movies}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderMovieItem}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.movieListContainer}
          ListEmptyComponent={
            !loading && <Text style={styles.emptyText}>No results found</Text>
          }
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1c1c1c",
    paddingBottom: 10,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1c1c1c",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 20,
    marginVertical: 15,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ffff",
  },
  searchButton: {
    padding: 8,
  },
  featuredContainer: {
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 16,
    overflow: "hidden",
  },
  featuredPoster: {
    width: width - 40,
    height: height * 0.5,
    borderRadius: 16,
    resizeMode: "cover",
  },
  emptyText: {
    color: "#999999ff",
    fontSize: 16,
  },
  sectionHeader: {
    marginTop: 20,
    marginHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffff",
  },
  viewAllText: {
    fontSize: 14,
    color: "#007bffff",
  },
  movieListContainer: {
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  movieCard: {
    width: 120,
    marginRight: 15,
  },
  poster: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    marginBottom: 8,
  },
  movieTitle: {
    color: "#ffff",
    fontWeight: "600",
  },
  movieInfo: {
    color: "#bbbbbbbb",
    fontSize: 12,
  },
});
