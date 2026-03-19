import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, TouchableOpacity } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function AstroRunner() {
  const playerSize = 50;
  const obstacleSize = 50;
  const gameSpeed = 3; // Speed of falling obstacles

  const [playerY, setPlayerY] = useState(height / 2);
  const [obstacles, setObstacles] = useState([{ x: width, y: Math.random() * (height - obstacleSize) }]);
  const [score, setScore] = useState(0);
  const animationRef = useRef();

  const movePlayer = (direction) => {
    setPlayerY((prev) => {
      let next = prev + (direction === 'up' ? -30 : 30);
      if (next < 0) next = 0;
      if (next > height - playerSize) next = height - playerSize;
      return next;
    });
  };

  const checkCollision = (obs) => {
    return (
      obs.x < playerSize &&
      obs.x + obstacleSize > 0 &&
      obs.y < playerY + playerSize &&
      obs.y + obstacleSize > playerY
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setObstacles((prev) => {
        const newObs = prev.map((obs) => ({ x: obs.x - gameSpeed, y: obs.y }));
        const passed = newObs.filter((obs) => obs.x < 0).length;
        if (passed > 0) {
          setScore((s) => s + passed);
        }
        // Remove off-screen obstacles
        let updatedObs = newObs.filter((obs) => obs.x + obstacleSize > 0);
        // Add new obstacles
        while (updatedObs.length < 1) {
          updatedObs.push({ x: width, y: Math.random() * (height - obstacleSize) });
        }
        // Check collision
        for (let obs of updatedObs) {
          if (checkCollision(obs)) {
            clearInterval(interval);
            alert('Game Over! Score: ' + score);
            setObstacles([{ x: width, y: Math.random() * (height - obstacleSize) }]);
            setScore(0);
            setPlayerY(height / 2);
          }
        }
        return updatedObs;
      });

    }, 30);

    animationRef.current = interval;
    return () => clearInterval(interval);
  }, [playerY, score]);

  return (
    <View style={styles.container}>
      <View style={[styles.player, { top: playerY }]} />
      {obstacles.map((obs, index) => (
        <View key={index} style={[styles.obstacle, { left: obs.x, top: obs.y }]} />
      ))}
      <Text style={styles.score}>Score: {score}</Text>
      <View style={styles.controls}>
        <TouchableOpacity onPress={() => movePlayer('up')} style={styles.button}><Text>Up</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => movePlayer('down')} style={styles.button}><Text>Down</Text></TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  player: {
    position: 'absolute',
    left: 20,
    width: 50,
    height: 50,
    backgroundColor: 'cyan',
    borderRadius: 25,
  },
  obstacle: {
    position: 'absolute',
    width: 50,
    height: 50,
    backgroundColor: 'red',
    borderRadius: 5,
  },
  score: {
    position: 'absolute',
    top: 50,
    left: 20,
    color: 'white',
    fontSize: 24,
  },
  controls: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    backgroundColor: 'gray',
    padding: 20,
    borderRadius: 10,
  },
});