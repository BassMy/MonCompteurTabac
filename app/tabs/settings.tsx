import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RotateCcw, Clock, Bell, Trash2, Info } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { ConfirmationModal } from '@/components/ConfirmationModal';

export default function SettingsScreen() {
  const { state, updateSettings, resetApp } = useApp();
  const [showResetModal, setShowResetModal] = useState(false);
  const [showDelayModal, setShowDelayModal] = useState(false);

  const handleNotificationToggle = (value: boolean) => {
    updateSettings({
      ...state.settings,
      notificationsEnabled: value,
    });
  };

  const changeInitialDelay = (newDelay: number) => {
    updateSettings({
      ...state.settings,
      initialDelay: newDelay,
    });
    setShowDelayModal(false);
  };

  const handleReset = () => {
    resetApp();
    setShowResetModal(false);
  };

  const DelayOption = ({ delay, label }: { delay: number; label: string }) => (
    <TouchableOpacity
      style={[
        styles.delayOption,
        state.settings.initialDelay === delay && styles.delayOptionSelected
      ]}
      onPress={() => changeInitialDelay(delay)}
    >
      <Text style={[
        styles.delayOptionText,
        state.settings.initialDelay === delay && styles.delayOptionTextSelected
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Paramètres</Text>
        </View>

        {/* Informations actuelles */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Info size={20} color="#3B82F6" />
            <Text style={styles.infoTitle}>Informations actuelles</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Délai initial:</Text>
            <Text style={styles.infoValue}>
              {Math.floor(state.settings.initialDelay / 60)}h {state.settings.initialDelay % 60}min
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Délai actuel:</Text>
            <Text style={styles.infoValue}>
              {Math.floor(state.currentDelay / 60)}h {state.currentDelay % 60}min
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Augmentation:</Text>
            <Text style={styles.infoValue}>+{state.settings.incrementDelay} min</Text>
          </View>
        </View>

        {/* Paramètres */}
        <View style={styles.settingsSection}>
          {/* Notifications */}
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Bell size={20} color="#14B8A6" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Notifications</Text>
                <Text style={styles.settingDescription}>
                  Recevoir une alerte quand vous pouvez fumer
                </Text>
              </View>
            </View>
            <Switch
              value={state.settings.notificationsEnabled}
              onValueChange={handleNotificationToggle}
              trackColor={{ false: '#E5E7EB', true: '#A7F3D0' }}
              thumbColor={state.settings.notificationsEnabled ? '#14B8A6' : '#9CA3AF'}
            />
          </View>

          {/* Délai initial */}
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => setShowDelayModal(true)}
          >
            <View style={styles.settingInfo}>
              <Clock size={20} color="#F97316" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Délai initial</Text>
                <Text style={styles.settingDescription}>
                  Temps d'attente de base entre deux cigarettes
                </Text>
              </View>
            </View>
            <Text style={styles.settingValue}>
              {Math.floor(state.settings.initialDelay / 60)}h {state.settings.initialDelay % 60}min
            </Text>
          </TouchableOpacity>
        </View>

        {/* Actions dangereuses */}
        <View style={styles.dangerSection}>
          <TouchableOpacity
            style={styles.dangerButton}
            onPress={() => setShowResetModal(true)}
          >
            <Trash2 size={20} color="#EF4444" />
            <Text style={styles.dangerButtonText}>Réinitialiser l'application</Text>
          </TouchableOpacity>
        </View>

        {/* Informations */}
        <View style={styles.aboutSection}>
          <Text style={styles.aboutTitle}>À propos</Text>
          <Text style={styles.aboutText}>
            Cette application vous aide à réduire progressivement votre consommation de cigarettes 
            en augmentant automatiquement le temps d'attente entre chaque cigarette.
          </Text>
          <Text style={styles.aboutText}>
            Chaque cigarette enregistrée ajoute {state.settings.incrementDelay} minutes 
            d'attente supplémentaire, vous aidant à espacer naturellement vos pauses.
          </Text>
        </View>
      </ScrollView>

      {/* Modal de réinitialisation */}
      <ConfirmationModal
        visible={showResetModal}
        title="Réinitialiser l'application ?"
        message="Cette action supprimera définitivement toutes vos données et votre progression. Cette action est irréversible."
        confirmText="Réinitialiser"
        cancelText="Annuler"
        onConfirm={handleReset}
        onCancel={() => setShowResetModal(false)}
      />

      {/* Modal de changement de délai */}
      <ConfirmationModal
        visible={showDelayModal}
        title="Modifier le délai initial"
        message="Choisissez le temps d'attente de base entre deux cigarettes :"
        confirmText=""
        cancelText="Annuler"
        onConfirm={() => {}}
        onCancel={() => setShowDelayModal(false)}
      />

      {showDelayModal && (
        <View style={styles.delayModalContent}>
          <DelayOption delay={60} label="1h" />
          <DelayOption delay={90} label="1h30" />
          <DelayOption delay={120} label="2h" />
          <DelayOption delay={150} label="2h30" />
          <DelayOption delay={180} label="3h" />
        </View>
      )}
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
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  settingsSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    color: '#6B7280',
  },
  settingValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#14B8A6',
  },
  dangerSection: {
    marginBottom: 24,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 16,
    padding: 16,
  },
  dangerButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#EF4444',
    marginLeft: 8,
  },
  aboutSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  aboutText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  delayModalContent: {
    position: 'absolute',
    top: '40%',
    left: '10%',
    right: '10%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  delayOption: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  delayOptionSelected: {
    backgroundColor: '#ECFDF5',
    borderColor: '#14B8A6',
  },
  delayOptionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4B5563',
    textAlign: 'center',
  },
  delayOptionTextSelected: {
    color: '#14B8A6',
  },
});