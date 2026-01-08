import React, { useState, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { getDecks, deleteDeck } from '../storage/storage';
import DeckCard from '../components/DeckCard';

export default function HomeScreen({ navigation }) {
  const [decks, setDecks] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadDecks = useCallback(async () => {
    try {
      const loadedDecks = await getDecks();
      setDecks(loadedDecks);
    } catch (error) {
      Alert.alert('Error', 'Failed to load decks');
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadDecks();
    }, [loadDecks])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadDecks();
    setRefreshing(false);
  }, [loadDecks]);

  const handleDeleteDeck = (deckId, deckName) => {
    Alert.alert(
      'Delete Deck',
      `Are you sure you want to delete "${deckName}"? This cannot be undone.`,
      [
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              await deleteDeck(deckId);
              await loadDecks();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete deck');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleStudyDeck = (deck) => {
    navigation.navigate('Study', { deckId: deck.id, deckName: deck.name });
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <MaterialCommunityIcons name="cards" size={80} color="#ccc" />
      <Text style={styles.emptyText}>No decks yet</Text>
      <Text style={styles.emptySubtext}>Create your first deck to get started!</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {decks.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={decks}
          renderItem={({ item }) => (
            <DeckCard
              deck={item}
              onPress={() => handleStudyDeck(item)}
              onDelete={() => handleDeleteDeck(item.id, item.name)}
            />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContent: {
    padding: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    color: '#333',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
});
