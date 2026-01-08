import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function CardList({ cards, onRemoveCard }) {
  const renderCard = ({ item }) => (
    <View style={styles.cardItem}>
      <View style={styles.cardText}>
        <Text style={styles.front} numberOfLines={2}>
          {item.front}
        </Text>
        <Text style={styles.back} numberOfLines={1}>
          {item.back}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => onRemoveCard(item.localId)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <MaterialCommunityIcons name="close" size={20} color="#d32f2f" />
      </TouchableOpacity>
    </View>
  );

  return (
    <FlatList
      data={cards}
      renderItem={renderCard}
      keyExtractor={(item) => item.localId}
      scrollEnabled={false}
    />
  );
}

const styles = StyleSheet.create({
  cardItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderLeftWidth: 4,
    borderLeftColor: '#6200ee',
  },
  cardText: {
    flex: 1,
  },
  front: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  back: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  removeButton: {
    marginLeft: 8,
  },
});
