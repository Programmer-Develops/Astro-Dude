import React, { useState } from 'react';
import { 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  ActivityIndicator, 
  StyleSheet 
} from 'react-native';
import { GoogleGenerativeAI } from '@google/generative-ai';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  
  const model = genAI.getGenerativeModel({ 
    model: 'gemini-2.5-flash',
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 1500,
      topP: 0.8,
      topK: 40,
    },
  });

  const sendUserInputToAI = async (userInput) => {
    try {
      setIsTyping(true);

      const prompt = `You are Astro Dude, a fun and enthusiastic astronomy assistant. Answer briefly and clearly in 2-3 sentences max. Be helpful and engaging.
      User: ${userInput}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      setIsTyping(false);
      return text;

    } catch (error) {
      setIsTyping(false);
      console.error('Gemini API Error:', error);
      
      if (error.message?.includes('API key')) {
        return 'API configuration issue. Please check your API key.';
      } else if (error.message?.includes('network')) {
        return 'Network error. Please check your internet connection.';
      } else {
        return 'Sorry, I encountered an issue. Please try again.';
      }
    }
  };

  const handleUserInput = async () => {
    if (!userInput.trim()) return;

    try {
      const newUserMessage = { text: userInput, type: 'user' };
      setMessages(prev => [...prev, newUserMessage]);
      
      const currentInput = userInput;
      setUserInput('');

      const aiResponse = await sendUserInputToAI(currentInput);

      const newAIMessage = { text: aiResponse, type: 'ai' };
      setMessages(prev => [...prev, newAIMessage]);

    } catch (error) {
      console.error('Error:', error);
      const errorMessage = { 
        text: 'Sorry, I encountered an unexpected error. Please try again.', 
        type: 'ai' 
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  const renderMessage = ({ item }) => (
    <View style={item.type === 'user' ? styles.userMessageContainer : styles.aiMessageContainer}>
      
      {item.type === 'ai' && (
        <View style={styles.botIconContainer}>
          <View style={styles.botIconWrapper}>
            <Text style={styles.botIcon}>🚀</Text>
          </View>
          <View style={styles.aiMessageWrapper}>
            <Text style={styles.botName}>ASTRO DUDE</Text>
            <Text style={styles.aiMessage}>{item.text}</Text>
          </View>
        </View>
      )}

      {item.type === 'user' && (
        <View style={styles.userInnerContainer}>
          <View style={styles.userMessageWrapper}>
            <Text style={styles.userMessage}>{item.text}</Text>
          </View>
          <View style={styles.userIconWrapper}>
            <Text style={styles.userIcon}>👤</Text>
          </View>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Astro Dude</Text>
        <Text style={styles.headerSubtitle}>Your Space & Astronomy Assistant</Text>
        <TouchableOpacity onPress={clearChat} style={styles.clearButton}>
          <Text style={styles.clearButtonText}>Clear Chat</Text>
        </TouchableOpacity>
      </View>

      {/* Chat Messages */}
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item, index) => `message-${index}`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.flatListContent}
      />
      
      {/* Typing Indicator */}
      {isTyping && (
        <View style={styles.typingIndicator}>
          <ActivityIndicator size="small" color="#4CAF50" />
          <Text style={styles.typingText}>Astro Dude is thinking...</Text>
        </View>
      )}
      
      {/* Input Area */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={userInput}
          onChangeText={setUserInput}
          placeholder="Ask about space, stars, planets..."
          placeholderTextColor="#888"
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          onPress={handleUserInput}
          style={[styles.sendButton, { opacity: userInput.trim() && !isTyping ? 1 : 0.5 }]}
          disabled={!userInput.trim() || isTyping}
        >
          <Text style={styles.sendButtonText}>↑</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#0F0F23',
    paddingHorizontal: 16,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A4A',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    color: '#888',
    fontSize: 14,
    marginBottom: 10,
  },
  clearButton: {
    backgroundColor: '#FF4757',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  clearButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  flatListContent: {
    paddingBottom: 20,
  },
  userMessageContainer: { 
    flexDirection: 'row', 
    justifyContent: 'flex-end', 
    marginBottom: 16,
  },
  aiMessageContainer: { 
    flexDirection: 'row', 
    justifyContent: 'flex-start',
    marginBottom: 16,
  },
  userInnerContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    maxWidth: '80%',
  },
  userMessageWrapper: { 
    marginRight: 8,
  },
  userMessage: { 
    backgroundColor: '#2A4A6A', 
    padding: 12, 
    borderRadius: 16, 
    color: '#FFFFFF',
    fontSize: 16,
    borderBottomRightRadius: 4,
  },
  aiMessageWrapper: { 
    maxWidth: '85%',
  },
  aiMessage: { 
    backgroundColor: '#1A1A2E', 
    padding: 12, 
    borderRadius: 16, 
    color: '#FFFFFF',
    fontSize: 16,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#2A2A4A',
  },
  botIconContainer: { 
    flexDirection: 'row', 
    alignItems: 'flex-start',
  },
  botIconWrapper: { 
    backgroundColor: '#4CAF50', 
    borderRadius: 20, 
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  botIcon: { 
    fontSize: 16,
  },
  botName: { 
    color: '#4CAF50', 
    fontSize: 12, 
    marginBottom: 4,
    fontWeight: 'bold',
  },
  userIconWrapper: { 
    backgroundColor: '#2A4A6A', 
    borderRadius: 20, 
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userIcon: { 
    fontSize: 16,
    color: '#FFF'
  },
  inputContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 20,
    marginTop: 10,
  },
  input: { 
    flex: 1, 
    borderWidth: 1, 
    borderColor: '#2A2A4A', 
    borderRadius: 24, 
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 8, 
    color: '#FFF',
    backgroundColor: '#1A1A2E',
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: { 
    backgroundColor: '#4CAF50', 
    borderRadius: 20, 
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: { 
    color: 'white', 
    fontWeight: 'bold',
    fontSize: 16,
  },
  typingIndicator: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  typingText: { 
    color: '#4CAF50', 
    marginLeft: 8,
    fontSize: 14,
    fontStyle: 'italic',
  },
});

export default Chat;