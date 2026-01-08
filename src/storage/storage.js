import AsyncStorage from '@react-native-async-storage/async-storage';

const DECKS_KEY = '@flashcard_decks';
const CARDS_KEY = '@flashcard_cards_';

// Initialize storage
export const initializeStorage = async () => {
  try {
    const decks = await AsyncStorage.getItem(DECKS_KEY);
    if (decks === null) {
      await AsyncStorage.setItem(DECKS_KEY, JSON.stringify([]));
    }
  } catch (error) {
    console.error('Error initializing storage:', error);
  }
};

// Get all decks
export const getDecks = async () => {
  try {
    const decks = await AsyncStorage.getItem(DECKS_KEY);
    return decks ? JSON.parse(decks) : [];
  } catch (error) {
    console.error('Error getting decks:', error);
    return [];
  }
};

// Create a new deck
export const createDeck = async (deckName) => {
  try {
    const decks = await getDecks();
    const newDeck = {
      id: Date.now().toString(),
      name: deckName,
      createdAt: new Date().toISOString(),
      cardCount: 0,
    };
    decks.push(newDeck);
    await AsyncStorage.setItem(DECKS_KEY, JSON.stringify(decks));
    await AsyncStorage.setItem(CARDS_KEY + newDeck.id, JSON.stringify([]));
    return newDeck;
  } catch (error) {
    console.error('Error creating deck:', error);
    throw error;
  }
};

// Delete a deck
export const deleteDeck = async (deckId) => {
  try {
    const decks = await getDecks();
    const filteredDecks = decks.filter(deck => deck.id !== deckId);
    await AsyncStorage.setItem(DECKS_KEY, JSON.stringify(filteredDecks));
    await AsyncStorage.removeItem(CARDS_KEY + deckId);
  } catch (error) {
    console.error('Error deleting deck:', error);
    throw error;
  }
};

// Get cards for a deck
export const getCards = async (deckId) => {
  try {
    const cards = await AsyncStorage.getItem(CARDS_KEY + deckId);
    return cards ? JSON.parse(cards) : [];
  } catch (error) {
    console.error('Error getting cards:', error);
    return [];
  }
};

// Add a card to a deck
export const addCard = async (deckId, front, back) => {
  try {
    const cards = await getCards(deckId);
    const newCard = {
      id: Date.now().toString(),
      front,
      back,
      createdAt: new Date().toISOString(),
    };
    cards.push(newCard);
    await AsyncStorage.setItem(CARDS_KEY + deckId, JSON.stringify(cards));

    // Update card count in deck
    const decks = await getDecks();
    const deckIndex = decks.findIndex(d => d.id === deckId);
    if (deckIndex !== -1) {
      decks[deckIndex].cardCount = cards.length;
      await AsyncStorage.setItem(DECKS_KEY, JSON.stringify(decks));
    }

    return newCard;
  } catch (error) {
    console.error('Error adding card:', error);
    throw error;
  }
};

// Delete a card from a deck
export const deleteCard = async (deckId, cardId) => {
  try {
    const cards = await getCards(deckId);
    const filteredCards = cards.filter(card => card.id !== cardId);
    await AsyncStorage.setItem(CARDS_KEY + deckId, JSON.stringify(filteredCards));

    // Update card count in deck
    const decks = await getDecks();
    const deckIndex = decks.findIndex(d => d.id === deckId);
    if (deckIndex !== -1) {
      decks[deckIndex].cardCount = filteredCards.length;
      await AsyncStorage.setItem(DECKS_KEY, JSON.stringify(decks));
    }
  } catch (error) {
    console.error('Error deleting card:', error);
    throw error;
  }
};

// Clear all data
export const clearAllData = async () => {
  try {
    await AsyncStorage.clear();
    await initializeStorage();
  } catch (error) {
    console.error('Error clearing data:', error);
    throw error;
  }
};
