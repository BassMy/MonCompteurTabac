import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

interface CircularTimerProps {
  remainingTime: number;
  totalTime: number;
  size?: number;
}

export function CircularTimer({ remainingTime, totalTime, size = 200 }: CircularTimerProps) {
  const progress = totalTime > 0 ? ((totalTime - remainingTime) / totalTime) * 100 : 0;
  
  const formatTime = (ms: number) => {
    const totalMinutes = Math.floor(ms / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}`;
    }
    return `${minutes}min`;
  };

  return (
    <View style={styles.container}>
      <AnimatedCircularProgress
        size={size}
        width={8}
        fill={progress}
        tintColor="#14B8A6"
        backgroundColor="#E5E7EB"
        rotation={0}
        lineCap="round"
      />
      <View style={[styles.centerContent, { width: size - 40, height: size - 40 }]}>
        <Text style={styles.timeText}>{formatTime(remainingTime)}</Text>
        <Text style={styles.labelText}>restant</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
  },
  labelText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
});