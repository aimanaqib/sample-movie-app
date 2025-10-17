import React from "react";
import { TouchableOpacity, Image, Text, StyleSheet, View } from "react-native";
import { Movie } from "../models/Movie";
import dayjs from "dayjs";
import * as Animatable from "react-native-animatable";

interface Props {
  movie: Movie;
  onPress: (movie: Movie) => void;
}

export default function MovieItem({ movie, onPress }: Props) {
  return (
    <Animatable.View
      animation="fadeInUp"
      delay={Math.random() * 300}
      duration={400}
      useNativeDriver
      style={styles.container}
    >
      <TouchableOpacity onPress={() => onPress(movie)} activeOpacity={0.8}>
        {movie.poster_path ? (
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            }}
            style={styles.poster}
          />
        ) : (
          <View style={[styles.poster, styles.placeholder]}>
            <Text style={styles.placeholderText}>No Image</Text>
          </View>
        )}
        <Text style={styles.movieTitle} numberOfLines={1}>
          {movie.title}
        </Text>
        <Text style={styles.movieInfo}>
          {dayjs(movie.release_date).format("YYYY")} • ⭐{" "}
          {movie.vote_average.toFixed(1)}
        </Text>
      </TouchableOpacity>
    </Animatable.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1 / 3,
    margin: 5,
    overflow: "hidden",
    backgroundColor: "#1c1c1eff",
  },
  poster: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    resizeMode: "cover",
  },
  placeholder: {
    backgroundColor: "#2c2c2cff",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#999999ff",
    fontSize: 12,
  },
  movieTitle: {
    color: "#ffff",
    fontWeight: "600",
  },
  movieInfo: {
    color: "#bbbbbbff",
    fontSize: 12,
  },
});
