import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Cigarette, Clock } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { CircularTimer } from '@/components/CircularTimer';
import { MotivationalQuote } from '@/components/MotivationalQuote';
import { ConfirmationModal } from '@/components/ConfirmationModal';
import { CigaretteLogic } from '@/utils/cigarette-logic';

export default function HomeScreen() {
  const { state, addCigarette, remainingTime, canSmoke } = useApp();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const todaysStats = CigaretteLogic.getTodaysStats(state.records);
  const totalTime = state.currentDelay * 60 * 1000; // en millisecondes

  const handleSmokePress = () => {
    if (canSmoke) {
      addCigarette(false);
    } else {
      setShowConfirmModal(true);
    }
  };

  const handleForceSmoke = () => {
    addCigarette(true);
    setShowConfirmModal(false);
  };

  const getButtonStyle = () => {
    if (canSmoke) {
      return [styles.smokeButton, styles.smokeButtonEnabled];
    }
    return [styles.smokeButton, styles.smokeButtonDisabled];
  };

  const getButtonText = () => {
    if (canSmoke) {
      return "J'ai fumé 🚬";
    }
    return "Pas encore autorisé";
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#F0FDFA', '#FFFFFF']}
        style={styles.gradient}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Réduction Progressive</Text>
            <Text style={styles.subtitle}>
              Cigarette #{state.cigaretteCount + 1}
            </Text>
          </View>

          {/* Timer principal */}
          <View style={styles.timerSection}>
            {remainingTime > 0 ? (
              <CircularTimer
                remainingTime={remainingTime}
                totalTime={totalTime}
                size={240}
              />
            ) : (
              <View style={styles.readyContainer}>
                <View style={styles.readyIcon}>
                  <Cigarette size={48} color="#14B8A6" />
                </View>
                <Text style={styles.readyText}>Cigarette autorisée</Text>
                <Text style={styles.readySubtext}>Vous pouvez maintenant fumer</Text>
              </View>
            )}
          </View>

          {/* Stats du jour */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{todaysStats.count}</Text>
              <Text style={styles.statLabel}>Aujourd'hui</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {CigaretteLogic.formatTime(state.currentDelay * 60 * 1000)}
              </Text>
              <Text style={styles.statLabel}>Prochaine attente</Text>
            </View>
          </View>

          {/* Citation motivante */}
          <MotivationalQuote />

          {/* Bouton principal */}
          <TouchableOpacity
            style={getButtonStyle()}
            onPress={handleSmokePress}
            activeOpacity={0.8}
          >
            <Text style={styles.smokeButtonText}>{getButtonText()}</Text>
            {!canSmoke && (
              <Text style={styles.forceText}>
                Appuyez pour forcer (non recommandé)
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>

        {/* Modal de confirmation */}
        <ConfirmationModal
          visible={showConfirmModal}
          title="Forcer une cigarette ?"
          message="Vous n'avez pas encore atteint le temps d'attente requis. Êtes-vous sûr de vouloir fumer maintenant ?"
          confirmText="Oui, fumer"
          cancelText="Attendre"
          onConfirm={handleForceSmoke}
          onCancel={() => setShowConfirmModal(false)}
        />
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  timerSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  readyContainer: {
    alignItems: 'center',
    padding: 40,
  },
  readyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  readyText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#14B8A6',
    marginBottom: 8,
  },
  readySubtext: {
    fontSize: 16,
    color: '#6B7280',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#14B8A6',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 20,
  },
  smokeButton: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  smokeButtonEnabled: {
    backgroundColor: '#14B8A6',
  },
  smokeButtonDisabled: {
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  smokeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  forceText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
});