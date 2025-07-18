import React from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, TrendingDown, Clock, TriangleAlert as AlertTriangle } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { CigaretteLogic } from '@/utils/cigarette-logic';
import { CigaretteRecord } from '@/types';

export default function HistoryScreen() {
  const { state } = useApp();

  const todaysStats = CigaretteLogic.getTodaysStats(state.records);
  const weekStats = CigaretteLogic.getWeekStats(state.records);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderCigaretteItem = ({ item }: { item: CigaretteRecord }) => (
    <View style={styles.recordItem}>
      <View style={styles.recordInfo}>
        <Text style={styles.recordDate}>
          {formatDate(item.timestamp)} à {formatTime(item.timestamp)}
        </Text>
        {item.forced && (
          <View style={styles.forcedBadge}>
            <AlertTriangle size={12} color="#F59E0B" />
            <Text style={styles.forcedText}>Forcée</Text>
          </View>
        )}
      </View>
      <Clock size={16} color="#9CA3AF" />
    </View>
  );

  const getAverageInterval = () => {
    if (state.records.length < 2) return 0;
    
    let totalInterval = 0;
    for (let i = 1; i < state.records.length; i++) {
      const interval = state.records[i].timestamp - state.records[i - 1].timestamp;
      totalInterval += interval;
    }
    
    return totalInterval / (state.records.length - 1);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Historique & Statistiques</Text>
        </View>

        {/* Statistiques générales */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Calendar size={24} color="#14B8A6" />
            <Text style={styles.statValue}>{todaysStats.count}</Text>
            <Text style={styles.statLabel}>Aujourd'hui</Text>
          </View>

          <View style={styles.statCard}>
            <TrendingDown size={24} color="#3B82F6" />
            <Text style={styles.statValue}>{weekStats.count}</Text>
            <Text style={styles.statLabel}>Cette semaine</Text>
          </View>

          <View style={styles.statCard}>
            <Clock size={24} color="#F97316" />
            <Text style={styles.statValue}>
              {CigaretteLogic.formatTime(getAverageInterval())}
            </Text>
            <Text style={styles.statLabel}>Intervalle moyen</Text>
          </View>

          <View style={styles.statCard}>
            <TrendingDown size={24} color="#10B981" />
            <Text style={styles.statValue}>{state.cigaretteCount}</Text>
            <Text style={styles.statLabel}>Total enregistré</Text>
          </View>
        </View>

        {/* Progression */}
        <View style={styles.progressCard}>
          <Text style={styles.progressTitle}>Progression actuelle</Text>
          <Text style={styles.progressValue}>
            Temps d'attente: {CigaretteLogic.formatTime(state.currentDelay * 60 * 1000)}
          </Text>
          <Text style={styles.progressDescription}>
            +{state.settings.incrementDelay} min à chaque cigarette
          </Text>
        </View>

        {/* Liste des cigarettes */}
        <View style={styles.recordsSection}>
          <Text style={styles.sectionTitle}>Cigarettes récentes</Text>
          
          {state.records.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Aucune cigarette enregistrée</Text>
              <Text style={styles.emptySubtext}>
                Commencez votre parcours en enregistrant votre première cigarette
              </Text>
            </View>
          ) : (
            <FlatList
              data={[...state.records].reverse().slice(0, 20)}
              renderItem={renderCigaretteItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    minWidth: 140,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  progressCard: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 16,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  progressValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#14B8A6',
    marginBottom: 4,
  },
  progressDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  recordsSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  recordItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  recordInfo: {
    flex: 1,
  },
  recordDate: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 4,
  },
  forcedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  forcedText: {
    fontSize: 10,
    color: '#F59E0B',
    marginLeft: 4,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#9CA3AF',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#D1D5DB',
    textAlign: 'center',
  },
});