import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getCards, deleteCard } from '../storage/storage';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function StudyScreen({ route }) {
  const { deckId, deckName } = route.params;
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [flipValue] = useState(new Animated.Value(0));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCards();
  }, [deckId]);

  const loadCards = async () => {
    try {
      const loadedCards = await getCards(deckId);
      if (loadedCards.length === 0) {
        Alert.alert('No Cards', 'This deck has no cards yet');
      }
      setCards(loadedCards);
    } catch (error) {
      Alert.alert('Error', 'Failed to load cards');
    } finally {
      setLoading(false);
    }
  };

  const flipCard = () => {
    Animated.timing(flipValue, {
      toValue: isFlipped ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setIsFlipped(!isFlipped);
  };

  const nextCard = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
      flipValue.setValue(0);
    } else {
      Alert.alert('End of Deck', 'You have reviewed all cards in this deck!', [
        {
          text: 'Go Back',
          onPress: () => {
            setCurrentIndex(0);
            setIsFlipped(false);
            flipValue.setValue(0);
          },
        },
      ]);
    }
  };

  const previousCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
      flipValue.setValue(0);
    }
  };

  const handleDeleteCard = (cardId) => {
    Alert.alert(
      'Delete Card',
      'Are you sure you want to delete this card?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              await deleteCard(deckId, cardId);
              await loadCards();
              if (currentIndex > 0) {
                setCurrentIndex(currentIndex - 1);
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to delete card');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading cards...</Text>
      </View>
    );
  }

  if (cards.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialCommunityIcons name="cards-variant" size={80} color="#ccc" />
        <Text style={styles.emptyText}>No cards in this deck</Text>
      </View>
    );
  }

  const currentCard = cards[currentIndex];
  const frontRotate = flipValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });
  const backRotate = flipValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      {/* Progress */}
      <View style={styles.progress}>
        <Text style={styles.progressText}>
          Card {currentIndex + 1} of {cards.length}
        </Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${((currentIndex + 1) / cards.length) * 100}%` },
            ]}
          />
        </View>
      </View>

      {/* Flippable Card */}
      <View style={styles.cardContainer}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={flipCard}
          style={styles.flipZone}
        >
          {/* Front of Card */}
          <Animated.View
            style={[
              styles.card,
              styles.cardFront,
              { transform: [{ rotateY: frontRotate }] },
              { display: isFlipped ? 'none' : 'flex' },
            ]}
          >
            <Text style={styles.cardLabel}>Question</Text>
            <Text style={styles.cardText}>{currentCard.front}</Text>
            <View style={styles.tapHint}>
              <MaterialCommunityIcons
                name="gesture-tap"
                size={16}
                color="#999"
              />
              <Text style={styles.tapHintText}>Tap to reveal</Text>
            </View>
          </Animated.View>

          {/* Back of Card */}
          <Animated.View
            style={[
              styles.card,
              styles.cardBack,
              { transform: [{ rotateY: backRotate }] },
              { display: isFlipped ? 'flex' : 'none' },
            ]}
          >
            <Text style={styles.cardLabel}>Answer</Text>
            <Text style={styles.cardText}>{currentCard.back}</Text>
            <View style={styles.tapHint}>
              <MaterialCommunityIcons
                name="gesture-tap"
                size={16}
                color="#999"
              />
              <Text style={styles.tapHintText}>Tap to hide</Text>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </View>

      {/* Delete Button */}
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteCard(currentCard.id)}
      >
        <MaterialCommunityIcons name="delete" size={18} color="#d32f2f" />
        <Text style={styles.deleteButtonText}>Delete Card</Text>
      </TouchableOpacity>

      {/* Navigation Buttons */}
      <View style={styles.navigationButtons}>
        <TouchableOpacity
          style={[styles.navButton, currentIndex === 0 && styles.navButtonDisabled]}
          onPress={previousCard}
          disabled={currentIndex === 0}
        >
          <MaterialCommunityIcons name="chevron-left" size={24} color="#666" />
          <Text style={styles.navButtonText}>Previous</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={nextCard}
        >
          <Text style={styles.navButtonText}>Next</Text>
          <MaterialCommunityIcons name="chevron-right" size={24} color="#6200ee" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
  },
  progress: {
    marginBottom: 24,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6200ee',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    marginVertical: 16,
  },
  flipZone: {
    flex: 1,
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    borderWidth: 2,
    borderColor: '#f0f0f0',
  },
  cardFront: {
    backgroundColor: '#e8eaf6',
  },
  cardBack: {
    backgroundColor: '#c8e6c9',
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999',
    textTransform: 'uppercase',
    marginBottom: 8,
    letterSpacing: 1,
  },
  cardText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
  },
  tapHint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  tapHintText: {
    fontSize: 12,
    color: '#999',
    marginLeft: 4,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#ffebee',
    borderRadius: 8,
  },
  deleteButtonText: {
    color: '#d32f2f',
    fontWeight: '600',
    marginLeft: 6,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  navButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
});
