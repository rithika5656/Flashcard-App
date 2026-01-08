import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function AddCardForm({ onAddCard, disabled }) {
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');

  const handleAddCard = () => {
    if (!front.trim()) {
      Alert.alert('Error', 'Please enter the front of the card');
      return;
    }
    if (!back.trim()) {
      Alert.alert('Error', 'Please enter the back of the card');
      return;
    }

    onAddCard({ front: front.trim(), back: back.trim() });
    setFront('');
    setBack('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Question/Front</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter question or front text"
          placeholderTextColor="#999"
          value={front}
          onChangeText={setFront}
          editable={!disabled}
          multiline
          numberOfLines={3}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Answer/Back</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter answer or back text"
          placeholderTextColor="#999"
          value={back}
          onChangeText={setBack}
          editable={!disabled}
          multiline
          numberOfLines={3}
        />
      </View>

      <TouchableOpacity
        style={[styles.addButton, disabled && styles.addButtonDisabled]}
        onPress={handleAddCard}
        disabled={disabled}
      >
        <MaterialCommunityIcons name="plus" size={20} color="#fff" />
        <Text style={styles.addButtonText}>Add Card</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
    color: '#333',
    backgroundColor: '#fff',
    textAlignVertical: 'top',
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#4caf50',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  addButtonDisabled: {
    opacity: 0.6,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
});
