# Flashcard App 📚

A simple flashcard app built with React Native (Expo) that helps you learn and memorize information effectively.

## Features

- **Create Decks**: Organize your flashcards into separate decks
- **Add Cards**: Each card has a front (question) and back (answer)
- **Flip to Reveal**: Tap cards to flip and see the answer
- **Local Storage**: All data is persisted locally using AsyncStorage
- **Progress Tracking**: See your position as you study through a deck
- **Delete Cards/Decks**: Remove individual cards or entire decks

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

## Tech Stack

- **React Native** with Expo
- **React Navigation** for screen navigation
- **AsyncStorage** for local data persistence
- **Expo Vector Icons** for icons

## Project Structure

```
flashcard-app/
├── App.js                    # Main app entry point
├── src/
│   ├── components/
│   │   ├── AddCardForm.js    # Form for adding new cards
│   │   ├── CardList.js       # List of cards in create mode
│   │   └── DeckCard.js       # Deck card component
│   ├── screens/
│   │   ├── HomeScreen.js     # Home screen with deck list
│   │   ├── CreateDeckScreen.js # Create new deck screen
│   │   ├── SettingsScreen.js # Settings screen
│   │   └── StudyScreen.js    # Study/flip cards screen
│   └── storage/
│       └── storage.js        # AsyncStorage utilities
└── package.json
```

## Usage

1. **Create a Deck**: Tap the "+" tab and enter a deck name
2. **Add Cards**: Add questions and answers to your deck
3. **Study**: Tap on a deck from the home screen to start studying
4. **Flip Cards**: Tap a card to flip it and see the answer
5. **Navigate**: Use the Previous/Next buttons to move between cards

## License

MIT License
