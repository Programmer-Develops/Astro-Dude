import React, { useState, useEffect } from 'react';
import { Text, View, TextInput, TouchableOpacity, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { useChat } from './ChatContext'; // Update the path accordingly
import axios from 'axios';

const Chat = () => {
  const { state, dispatch } = useChat();
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const apiEndpoint = 'https://api.openai.com/v1/chat/completions';
  const apiKey = 'MY_API_KEY';

  const sendUserInputToAI = async (userInput) => {
    try {
      setIsTyping(true);

      const response = await axios.post(
        apiEndpoint,
        {
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'You are a helpful assistant.' },
            { role: 'user', content: userInput },
          ],
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setIsTyping(false);

      return response.data.choices[0].message.content;
    } catch (error) {
      setIsTyping(false);
      console.error('Error calling the AI service:', error.response ? error.response.data : error.message);
      return 'AI service error';
    }
  };

  const handleUserInput = async () => {
    try {
      if (!userInput.trim()) {
        // Don't send empty messages
        return;
      }

      // Send user message to the AI service (GPT-3) and receive a response
      const aiResponse = await sendUserInputToAI(userInput);

      // Dispatch actions to update the chat context state
      dispatch({ type: 'ADD_USER_MESSAGE', payload: userInput });
      dispatch({ type: 'ADD_AI_MESSAGE', payload: aiResponse });
    } catch (error) {
      console.error('Error handling user input:', error);
    } finally {
      // Clear the userInput state
      setUserInput('');
    }
  };

  const renderMessage = ({ item }) => {
    return (
      <View style={item.type === 'user' ? styles.userMessageContainer : styles.aiMessageContainer}>
        {item.type === 'ai' && (
          <View style={styles.botIconContainer}>
            <View style={styles.botIconWrapper}>
              <Text style={styles.botIcon}>🤖</Text>
            </View>
            <View style={styles.aiMessageContainer}>
              <Text style={styles.botName}>ASTRO DUDE</Text>
              <Text style={styles.aiMessage}>
                {item.text}
              </Text>
            </View>
          </View>
        )}
  
        {item.type === 'user' && (
          <View style={styles.userMessageContainer}>

            <View style={styles.userMessageWrapper}>
              <Text style={styles.userMessage}>{item.text}</Text>
            </View>

            <View style={styles.userIconWrapper}>
              <Text style={styles.userIcon}>👤</Text>
              {/* <Text style={styles.userName}>You</Text> */}
            </View>
            
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={state.messages}
        renderItem={renderMessage}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
      />
      {isTyping && (
        <View style={styles.typingIndicator}>
          <ActivityIndicator size="small" color="#FFFFFF" />
          <Text style={{ color: '#FFFFFF', marginLeft: 8 }}>Typing...</Text>
        </View>
      )}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={userInput}
          onChangeText={(text) => setUserInput(text)}
          placeholder="Type a message..."
          placeholderTextColor="#B0B0B0"
        />
        <TouchableOpacity
          onPress={handleUserInput}
          style={[styles.sendButton, { opacity: userInput.trim() ? 1 : 0.2 }]}
          disabled={!userInput.trim()}
        >
          <Text style={styles.sendButtonText}>➔</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#1E1E1E', // Dark background color
  },
  userMessageContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width:'100%'
  },
  aiMessageContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  userMessage: {
    backgroundColor: '#3A3A3A',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
    alignSelf: 'flex-end',
    color: '#FFFFFF',
  },
  aiMessage: {
    backgroundColor: '#2C2C2C',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
    color: '#FFFFFF',
    // maxWidth: '70%', // Adjust the maximum width based on your design
    alignSelf: 'flex-start', // Align to the left side

  },
  aiMessageContainer:{
    width :'90%'
  },
  
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#555555',
    borderRadius: 8,
    padding: 8,
    marginRight: 8,
    color: '#FFFFFF',
  },
  sendButton: {
    backgroundColor: 'white',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  sendButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  botIconContainer: {
    flexDirection: 'row',
    marginRight: 10,
    alignItems: 'flex-start',
    paddingRight: 5,
  },
  botIconWrapper: {
    backgroundColor: '#4CAF50', // Green color
    borderRadius: 50,
    padding: 8,
    marginBottom: 4,
  },
  botIcon: {
    fontSize: 20,
    color: 'white',
  },
  botName: {
    color: '#B0B0B0',
    fontSize: 10,
    marginBottom: 4,
  },
  userMessageWrapper: {
    flex: 1, // Ensure the user message takes up remaining space
    marginRight: 20, // Add some margin to the right of the user message container
    marginBottom: 10, // Add some margin at the bottom to create a gap
  },
  userIconWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 50,
    padding: 8,
    marginBottom: 4,
    marginRight: 5,
    justifyContent: 'flex-end', // Align to the right
  },
  userIcon: {
    fontSize: 20,
    color: 'white',
    marginRight: 5, // Add some margin to separate the icon and text
  },
  userName: {
    color: 'black',
    fontSize: 10,
    marginBottom: 4,
  },
});

export default Chat;
