import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createDeck } from '../storage/storage';
import AddCardForm from '../components/AddCardForm';
import CardList from '../components/CardList';

export default function CreateDeckScreen({ navigation }) {
  const [deckName, setDeckName] = useState('');
  const [cards, setCards] = useState([]);
  const [isCreating, setIsCreating] = useState(false);

  const handleAddCard = (card) => {
    setCards([...cards, { ...card, localId: Date.now().toString() }]);
  };

  const handleRemoveCard = (localId) => {
    setCards(cards.filter(card => card.localId !== localId));
  };

  const handleCreateDeck = async () => {
    if (!deckName.trim()) {
      Alert.alert('Error', 'Please enter a deck name');
      return;
    }

    if (cards.length === 0) {
      Alert.alert('Error', 'Please add at least one card to the deck');
      return;
    }

    setIsCreating(true);
    try {
      const newDeck = await createDeck(deckName);

      // Add cards to the deck
      const { addCard } = require('../storage/storage');
      for (const card of cards) {
        await addCard(newDeck.id, card.front, card.back);
      }

      Alert.alert('Success', `Deck "${deckName}" created with ${cards.length} cards!`);
      setDeckName('');
      setCards([]);
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Error', 'Failed to create deck');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          {/* Deck Name Input */}
          <View style={styles.section}>
            <Text style={styles.label}>Deck Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter deck name"
              placeholderTextColor="#999"
              value={deckName}
              onChangeText={setDeckName}
              editable={!isCreating}
            />
          </View>

          {/* Add Card Form */}
          <View style={styles.section}>
            <Text style={styles.label}>Add Cards</Text>
            <AddCardForm onAddCard={handleAddCard} disabled={isCreating} />
          </View>

          {/* Cards List */}
          {cards.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.label}>Cards ({cards.length})</Text>
              <CardList
                cards={cards}
                onRemoveCard={handleRemoveCard}
              />
            </View>
          )}

          {/* Create Button */}
          <TouchableOpacity
            style={[styles.createButton, isCreating && styles.createButtonDisabled]}
            onPress={handleCreateDeck}
            disabled={isCreating}
          >
            <MaterialCommunityIcons name="check" size={24} color="#fff" />
            <Text style={styles.createButtonText}>
              {isCreating ? 'Creating...' : 'Create Deck'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
  },
  createButton: {
    flexDirection: 'row',
    backgroundColor: '#6200ee',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  createButtonDisabled: {
    opacity: 0.6,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
