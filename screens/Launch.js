import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, FlatList, Image, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';

const LaunchScreen = () => {
  const [launches, setLaunches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [countdowns, setCountdowns] = useState({});

  const fetchLaunches = async () => {
    try {
      const response = await axios.get('https://ll.thespacedevs.com/2.2.0/launch/upcoming/');
      setLaunches(response.data.results.slice(0, 10)); // Limit to first 10 for performance
      setLoading(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch launch data');
      setLoading(false);
    }
  };

  const updateCountdowns = () => {
    const now = new Date();
    const newCountdowns = {};
    launches.forEach(launch => {
      const launchTime = new Date(launch.net);
      const diff = launchTime - now;
      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        newCountdowns[launch.id] = `${days}d ${hours}h ${minutes}m`;
      } else {
        newCountdowns[launch.id] = 'Launched';
      }
    });
    setCountdowns(newCountdowns);
  };

  useEffect(() => {
    fetchLaunches();
    const interval = setInterval(fetchLaunches, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    updateCountdowns();
    const countdownInterval = setInterval(updateCountdowns, 60000); // Update countdowns every minute
    return () => clearInterval(countdownInterval);
  }, [launches]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const renderLaunch = ({ item }) => (
    <View style={styles.launchCard}>
      {item.image && <Image source={{ uri: item.image }} style={styles.launchImage} />}
      <View style={styles.launchInfo}>
        <Text style={styles.launchName}>{item.name}</Text>
        <Text style={styles.launchDetail}>Provider: {item.launch_service_provider.name}</Text>
        <Text style={styles.launchDetail}>Rocket: {item.rocket.configuration.name}</Text>
        <Text style={styles.launchDetail}>Location: {item.pad.location.name}</Text>
        <Text style={styles.launchDetail}>Launch Time: {formatDate(item.net)}</Text>
        <Text style={styles.countdown}>Countdown: {countdowns[item.id] || 'Calculating...'}</Text>
        <Text style={styles.status}>Status: {item.status.name}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <ActivityIndicator size="large" color="#0000ff" />
          {/* <Text>Loading launches...</Text> */}
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Live Rocket Launch Dashboard</Text>
        <FlatList
          data={launches}
          keyExtractor={(item) => item.id}
          renderItem={renderLaunch}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  launchCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  launchImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  launchInfo: {
    padding: 15,
  },
  launchName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  launchDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  countdown: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff4500',
    marginTop: 5,
  },
  status: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#008000',
    marginTop: 5,
  },
});

export default LaunchScreen;