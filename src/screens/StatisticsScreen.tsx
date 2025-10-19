import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMovies } from '../context/MovieContext';
import { BarChart, PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

export default function StatisticsScreen() {
  const { stats, movies } = useMovies();

  // Prepare rating distribution data
  const ratingData = {
    labels: Object.keys(stats.ratingDistribution).map((r) => r.toString()),
    datasets: [
      {
        data: Object.values(stats.ratingDistribution),
      },
    ],
  };

  // Prepare genre data for pie chart
  const topGenresArray = Object.entries(stats.topGenres)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const genreColors = ['#007AFF', '#34C759', '#FF9500', '#FF3B30', '#AF52DE'];

  const genrePieData = topGenresArray.map(([genre, count], index) => ({
    name: genre,
    population: count,
    color: genreColors[index],
    legendFontColor: '#7F7F7F',
    legendFontSize: 12,
  }));

  // Calculate monthly stats for current year
  const currentYear = new Date().getFullYear();
  const monthlyData = new Array(12).fill(0);
  movies.forEach((movie) => {
    const date = movie.watchedDate.toDate();
    if (date.getFullYear() === currentYear) {
      monthlyData[date.getMonth()]++;
    }
  });

  const monthlyChartData = {
    labels: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
    datasets: [
      {
        data: monthlyData.map((v) => (v === 0 ? 0.1 : v)), // Avoid zero values
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
        <Text style={styles.title}>Statistics</Text>
        <Text style={styles.subtitle}>Your movie watching journey</Text>
      </View>

      {/* Overall Stats */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Overall Statistics</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.totalMovies}</Text>
            <Text style={styles.statLabel}>Total Movies</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.averageRating.toFixed(1)}</Text>
            <Text style={styles.statLabel}>Avg Rating</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.moviesThisYear}</Text>
            <Text style={styles.statLabel}>This Year</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.moviesThisMonth}</Text>
            <Text style={styles.statLabel}>This Month</Text>
          </View>
        </View>
      </View>

      {/* Monthly Progress */}
      {monthlyData.some((v) => v > 0) && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Movies Watched This Year</Text>
          <BarChart
            data={monthlyChartData}
            width={screenWidth - 48}
            height={220}
            chartConfig={chartConfig}
            style={styles.chart}
            yAxisLabel=""
            yAxisSuffix=""
            fromZero
          />
        </View>
      )}

      {/* Rating Distribution */}
      {Object.keys(stats.ratingDistribution).length > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your Rating Distribution</Text>
          <BarChart
            data={ratingData}
            width={screenWidth - 48}
            height={220}
            chartConfig={chartConfig}
            style={styles.chart}
            yAxisLabel=""
            yAxisSuffix=""
            fromZero
          />
        </View>
      )}

      {/* Genre Breakdown */}
      {genrePieData.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Top Genres</Text>
          <PieChart
            data={genrePieData}
            width={screenWidth - 48}
            height={220}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        </View>
      )}

      {/* Top Directors */}
      {movies.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Top Directors</Text>
          {getTopDirectors(movies).map(([director, count]) => (
            <View key={director} style={styles.listItem}>
              <Text style={styles.listItemText}>{director}</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{count}</Text>
              </View>
            </View>
          ))}
        </View>
      )}
      </ScrollView>
    </SafeAreaView>
  );
}

// Helper function to get top directors
const getTopDirectors = (movies: any[]) => {
  const directors: { [key: string]: number } = {};
  movies.forEach((movie) => {
    const directorList = movie.director.split(',').map((d: string) => d.trim());
    directorList.forEach((director: string) => {
      if (director && director !== 'N/A') {
        directors[director] = (directors[director] || 0) + 1;
      }
    });
  });
  return Object.entries(directors)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#007AFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 24,
    paddingTop: 16,
    paddingBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  card: {
    backgroundColor: '#fff',
    margin: 16,
    marginBottom: 0,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    color: '#1a1a1a',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  listItemText: {
    fontSize: 16,
    color: '#1a1a1a',
    flex: 1,
  },
  badge: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 32,
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
