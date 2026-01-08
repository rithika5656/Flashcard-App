import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { clearAllData } from '../storage/storage';

export default function SettingsScreen() {
  const handleClearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'Are you sure you want to delete all decks and cards? This cannot be undone.',
      [
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
        {
          text: 'Clear',
          onPress: async () => {
            try {
              await clearAllData();
              Alert.alert('Success', 'All data has been cleared');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear data');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleClearAllData}
          >
            <View style={styles.settingContent}>
              <MaterialCommunityIcons name="delete-alert" size={24} color="#d32f2f" />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Clear All Data</Text>
                <Text style={styles.settingDescription}>
                  Delete all decks and cards
                </Text>
              </View>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#999" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <MaterialCommunityIcons name="information" size={24} color="#6200ee" />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Flashcard App</Text>
                <Text style={styles.settingDescription}>Version 1.0.0</Text>
              </View>
            </View>
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <MaterialCommunityIcons name="heart" size={24} color="#d32f2f" />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Features</Text>
                <Text style={styles.settingDescription}>
                  Create decks • Flip cards • Local storage
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.infoBox}>
          <MaterialCommunityIcons name="lightbulb-on" size={20} color="#6200ee" />
          <Text style={styles.infoText}>
            All your data is stored locally on your device and never shared with anyone.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f5f5f5',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 16,
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  settingDescription: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#e8eaf6',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
    alignItems: 'flex-start',
  },
  infoText: {
    marginLeft: 12,
    flex: 1,
    fontSize: 13,
    color: '#333',
    lineHeight: 18,
  },
});
