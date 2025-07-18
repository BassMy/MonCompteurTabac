import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const QUOTES = [
  "Chaque minute d'attente est une victoire sur votre addiction.",
  "Vous êtes plus fort que votre envie de fumer.",
  "Chaque cigarette évitée améliore votre santé.",
  "La liberté commence par dire non à la dépendance.",
  "Vous investissez dans votre santé future.",
  "Chaque pause est un pas vers une vie plus saine.",
  "Votre détermination est votre meilleur allié.",
];

export function MotivationalQuote() {
  const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];

  return (
    <View style={styles.container}>
      <Text style={styles.quote}>"{quote}"</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F3F4F6',
    padding: 20,
    borderRadius: 16,
    marginVertical: 20,
  },
  quote: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 24,
  },
});