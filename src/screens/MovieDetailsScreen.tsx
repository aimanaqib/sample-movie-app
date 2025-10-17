import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  FlatList,
} from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import type { MovieDetail } from "../models/MovieDetail";
import { LinearGradient } from "expo-linear-gradient";
import { RootStackParamList } from "../../types";
import { fetchFromTMDB } from "../config/api";
import dayjs from "dayjs";

const { width } = Dimensions.get("window");

type MovieDetailsRouteProp = RouteProp<RootStackParamList, "MovieDetails">;

export default function MovieDetailsScreen() {
  const route = useRoute<MovieDetailsRouteProp>();
  const { id } = route.params;

  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const data = await fetchFromTMDB(`/movie/${id}`, `&language=en-US`);
        setMovie(data);
      } catch (err) {
        alert(
          "Error getting data movies. \nError: " + err + "\nPlease try again"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#ffff" />
      </View>
    );
  }

  if (!movie) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "#ffff" }}>Movie not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Backdrop Image Section*/}
      {movie.backdrop_path && (
        <View style={styles.backdropContainer}>
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w780${movie.backdrop_path}`,
            }}
            style={styles.backdrop}
          />
          <LinearGradient
            colors={["transparent", "#1c1c1cff"]}
            style={styles.backdropOverlay}
          />
        </View>
      )}

      {/* Poster & Movie Info Section*/}
      <View
        style={[
          styles.headerContent,
          { marginTop: movie.backdrop_path ? -70 : 10 },
        ]}
      >
        {movie.poster_path && (
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            }}
            style={styles.poster}
          />
        )}
        <View
          style={[styles.movieInfo, { marginLeft: movie.poster_path ? 16 : 0 }]}
        >
          <Text style={styles.title}>{movie.title}</Text>
          <Text style={styles.subText}>
            ⭐ {movie.vote_average.toFixed(1)} ({movie.vote_count} votes)
          </Text>
          <Text style={styles.subText}>
            🗓 {dayjs(movie.release_date).format("DD MMM YYYY")}
          </Text>
          <Text style={styles.subText}>
            ⏱ {movie.runtime} min • {movie.original_language.toUpperCase()}
          </Text>
        </View>
      </View>

      {/* Genres Section */}
      {movie.genres?.length > 0 && (
        <View style={styles.genreContainer}>
          {movie.genres.map((genre) => (
            <View key={genre.id} style={styles.genreChip}>
              <Text style={styles.genreText}>{genre.name}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Overview Section */}
      <Text style={styles.sectionTitle}>Overview</Text>
      <Text style={styles.overview}>{movie.overview || "No overview."}</Text>

      {/* Budget & Revenue Section */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Budget</Text>
          <Text style={styles.statValue}>
            {movie.budget > 0 ? `$${movie.budget.toLocaleString()}` : "N/A"}
          </Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Revenue</Text>
          <Text style={styles.statValue}>
            {movie.revenue > 0 ? `$${movie.revenue.toLocaleString()}` : "N/A"}
          </Text>
        </View>
      </View>

      {/* Production Companies Section */}
      {movie.production_companies?.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Production Companies</Text>
          <FlatList
            data={movie.production_companies}
            horizontal
            keyExtractor={(item) => item.id.toString()}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.companyCard}>
                {item.logo_path ? (
                  <Image
                    source={{
                      uri: `https://image.tmdb.org/t/p/w200${item.logo_path}`,
                    }}
                    style={styles.companyLogo}
                    resizeMode="contain"
                  />
                ) : (
                  <View style={styles.companyPlaceholder}>
                    <Text style={{ color: "black", fontSize: 12 }}>
                      {item.name}
                    </Text>
                  </View>
                )}
              </View>
            )}
          />
        </>
      )}

      {/* Countries Section */}
      {movie.production_countries?.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Countries</Text>
          <Text style={[styles.subText, { paddingHorizontal: 16 }]}>
            {movie.production_countries.map((c) => c.name).join(", ")}
          </Text>
        </>
      )}

      {/* Languages Section */}
      {movie.spoken_languages?.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Languages</Text>
          <Text style={[styles.subText, { paddingHorizontal: 16 }]}>
            {movie.spoken_languages.map((l) => l.english_name).join(", ")}
          </Text>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1c1c1cff",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1c1c1cff",
  },
  backdropContainer: {
    position: "relative",
  },
  backdrop: {
    width: width,
    height: 250,
  },
  backdropOverlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 120,
  },
  headerContent: {
    flexDirection: "row",
    paddingHorizontal: 16,
  },
  poster: {
    width: 120,
    height: 180,
    borderRadius: 10,
  },
  movieInfo: {
    flex: 1,
    justifyContent: "flex-end",
  },
  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 6,
  },
  subText: {
    color: "#ccccccff",
    fontSize: 14,
    marginBottom: 3,
  },
  genreContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    marginTop: 10,
  },
  genreChip: {
    backgroundColor: "#2a2a2aff",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  genreText: {
    color: "#ffff",
    fontSize: 13,
  },
  sectionTitle: {
    color: "#ffff",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 6,
    paddingHorizontal: 16,
  },
  overview: {
    color: "#ccccccff",
    fontSize: 15,
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
  },
  statBox: {
    alignItems: "center",
  },
  statLabel: {
    color: "#bbbbbbff",
    fontSize: 13,
  },
  statValue: {
    color: "#ffff",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 4,
  },
  companyCard: {
    marginHorizontal: 10,
    backgroundColor: "lightgray",
    borderRadius: 10,
    padding: 10,
    width: 100,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  companyLogo: {
    width: 80,
    height: 40,
  },
  companyPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: 40,
  },
});
