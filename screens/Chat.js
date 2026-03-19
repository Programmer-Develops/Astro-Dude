import React, { useState, useRef, useEffect } from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
  Platform,
  StatusBar,
  KeyboardAvoidingView,
} from 'react-native';
import { GoogleGenerativeAI } from '@google/generative-ai';

const { width, height } = Dimensions.get('window');

const generateStars = (count) =>
  Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 2 + 0.5,
    opacity: Math.random() * 0.7 + 0.2,
    twinkleDuration: 1200 + Math.random() * 2800,
  }));

const STARS = generateStars(80);

const TwinklingStar = ({ star }) => {
  const opacity = useRef(new Animated.Value(star.opacity)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.05,
          duration: star.twinkleDuration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: star.opacity,
          duration: star.twinkleDuration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);
  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: star.x,
        top: star.y,
        width: star.size,
        height: star.size,
        borderRadius: star.size / 2,
        backgroundColor: '#FFFFFF',
        opacity,
      }}
    />
  );
};

const TypingDots = () => {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = (dot, delay) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: -6,
            duration: 350,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 350,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.delay(600),
        ])
      );
    Animated.parallel([anim(dot1, 0), anim(dot2, 150), anim(dot3, 300)]).start();
  }, []);

  return (
    <View style={typing.wrapper}>
      <View style={typing.iconBubble}>
        <Text style={typing.icon}>🚀</Text>
      </View>
      <View style={typing.bubble}>
        {[dot1, dot2, dot3].map((dot, i) => (
          <Animated.View
            key={i}
            style={[typing.dot, { transform: [{ translateY: dot }] }]}
          />
        ))}
      </View>
    </View>
  );
};

const typing = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 14,
    paddingHorizontal: 4,
  },
  iconBubble: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: '#7B61FF20',
    borderWidth: 1,
    borderColor: '#7B61FF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  icon: { fontSize: 16 },
  bubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0E0E24',
    borderWidth: 1,
    borderColor: '#FFFFFF0D',
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 5,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#7B61FF',
  },
});

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef(null);
  const inputScale = useRef(new Animated.Value(1)).current;
  const headerFade = useRef(new Animated.Value(0)).current;

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

  useEffect(() => {
    Animated.timing(headerFade, {
      toValue: 1,
      duration: 900,
      useNativeDriver: true,
    }).start();
  }, []);

  const sendUserInputToAI = async (input) => {
    try {
      setIsTyping(true);
      const prompt = `You are Astro Dude, a fun and enthusiastic astronomy assistant. Answer briefly and clearly in 2-3 sentences max. Be helpful and engaging.\nUser: ${input}`;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      setIsTyping(false);
      return text;
    } catch (error) {
      setIsTyping(false);
      if (error.message?.includes('API key')) return 'API configuration issue. Please check your API key.';
      if (error.message?.includes('network')) return 'Network error. Please check your internet connection.';
      return 'Sorry, I encountered an issue. Please try again.';
    }
  };

  const handleUserInput = async () => {
    if (!userInput.trim()) return;

    // Button press micro-animation
    Animated.sequence([
      Animated.timing(inputScale, { toValue: 0.92, duration: 80, useNativeDriver: true }),
      Animated.timing(inputScale, { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start();

    const newUserMessage = { text: userInput, type: 'user', id: Date.now() };
    setMessages((prev) => [...prev, newUserMessage]);
    const currentInput = userInput;
    setUserInput('');

    const aiResponse = await sendUserInputToAI(currentInput);
    setMessages((prev) => [...prev, { text: aiResponse, type: 'ai', id: Date.now() + 1 }]);

    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const clearChat = () => setMessages([]);

  const renderMessage = ({ item, index }) => {
    const isUser = item.type === 'user';
    return (
      <View
        style={[
          msgStyles.row,
          isUser ? msgStyles.rowUser : msgStyles.rowAI,
        ]}
      >
        {!isUser && (
          <View style={msgStyles.aiBotIcon}>
            <Text style={{ fontSize: 16 }}>🚀</Text>
          </View>
        )}

        <View style={[msgStyles.bubble, isUser ? msgStyles.bubbleUser : msgStyles.bubbleAI]}>
          {!isUser && (
            <Text style={msgStyles.botLabel}>ASTRO DUDE</Text>
          )}
          <Text style={[msgStyles.text, isUser ? msgStyles.textUser : msgStyles.textAI]}>
            {item.text}
          </Text>
        </View>

        {isUser && (
          <View style={msgStyles.userIcon}>
            <Text style={{ fontSize: 15 }}>👤</Text>
          </View>
        )}
      </View>
    );
  };

  const hasMessages = messages.length > 0;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Starfield */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {STARS.map((s) => <TwinklingStar key={s.id} star={s} />)}
      </View>

      {/* Nebula blobs */}
      <View style={[styles.nebula, styles.nebula1]} pointerEvents="none" />
      <View style={[styles.nebula, styles.nebula2]} pointerEvents="none" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* ── HEADER ── */}
        <Animated.View style={[styles.header, { opacity: headerFade }]}>
          <View style={styles.headerLeft}>
            <View style={styles.headerIconRing}>
              <View style={styles.headerIconInner}>
                <Text style={{ fontSize: 20 }}>🚀</Text>
              </View>
            </View>
            <View>
              <Text style={styles.headerTitle}>ASTRO DUDE</Text>
              <View style={styles.onlineRow}>
                <View style={styles.onlineDot} />
                <Text style={styles.onlineText}>Online · Space Assistant</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity onPress={clearChat} style={styles.clearBtn}>
            <Text style={styles.clearBtnText}>✕ Clear</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* ── MESSAGES ── */}
        {!hasMessages ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🌌</Text>
            <Text style={styles.emptyTitle}>What's on your mind?</Text>
            <Text style={styles.emptySubtitle}>
              Ask me anything about space, stars,{'\n'}planets, or the cosmos.
            </Text>
            <View style={styles.suggestionRow}>
              {['Black holes 🕳️', 'Mars missions 🔴', 'Meteor showers ☄️'].map((s) => (
                <TouchableOpacity
                  key={s}
                  style={styles.suggestion}
                  onPress={() => setUserInput(s.split(' ')[0] + ' ' + s.split(' ')[1])}
                >
                  <Text style={styles.suggestionText}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => String(item.id)}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.flatListContent}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          />
        )}

        {/* Typing indicator */}
        {isTyping && (
          <View style={{ paddingHorizontal: 16 }}>
            <TypingDots />
          </View>
        )}

        {/* ── INPUT BAR ── */}
        <View style={styles.inputBar}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={userInput}
              onChangeText={setUserInput}
              placeholder="Ask about space, stars, planets..."
              placeholderTextColor="#FFFFFF30"
              multiline
              maxLength={500}
              onSubmitEditing={handleUserInput}
            />
          </View>
          <Animated.View style={{ transform: [{ scale: inputScale }] }}>
            <TouchableOpacity
              onPress={handleUserInput}
              style={[
                styles.sendBtn,
                { opacity: userInput.trim() && !isTyping ? 1 : 0.35 },
              ]}
              disabled={!userInput.trim() || isTyping}
            >
              <Text style={styles.sendIcon}>↑</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const msgStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 14,
  },
  rowUser: { justifyContent: 'flex-end' },
  rowAI: { justifyContent: 'flex-start' },

  aiBotIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: '#7B61FF20',
    borderWidth: 1,
    borderColor: '#7B61FF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  userIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: '#00C9A720',
    borderWidth: 1,
    borderColor: '#00C9A750',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },

  bubble: {
    maxWidth: width * 0.68,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  bubbleAI: {
    backgroundColor: '#0E0E24',
    borderWidth: 1,
    borderColor: '#FFFFFF0D',
    borderBottomLeftRadius: 4,
    shadowColor: '#7B61FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  bubbleUser: {
    backgroundColor: '#1A1240',
    borderWidth: 1,
    borderColor: '#7B61FF40',
    borderBottomRightRadius: 4,
    shadowColor: '#00C9A7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },

  botLabel: {
    fontSize: 10,
    color: '#7B61FF',
    letterSpacing: 2,
    fontWeight: '700',
    marginBottom: 5,
  },
  text: { fontSize: 15, lineHeight: 22 },
  textAI: { color: '#E8E8F0' },
  textUser: { color: '#FFFFFF' },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#03020F',
  },

  // Nebulae
  nebula: { position: 'absolute', borderRadius: 999 },
  nebula1: {
    width: 280,
    height: 280,
    top: -60,
    right: -80,
    backgroundColor: '#1A0A4A',
    opacity: 0.6,
  },
  nebula2: {
    width: 240,
    height: 240,
    bottom: 100,
    left: -60,
    backgroundColor: '#0A2A1A',
    opacity: 0.4,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 14 : 56,
    paddingBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIconRing: {
    width: 46,
    height: 46,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#7B61FF60',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#7B61FF15',
  },
  headerIconInner: { alignItems: 'center' },
  headerTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 4,
    textShadowColor: '#7B61FF',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  onlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 3,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00C9A7',
    shadowColor: '#00C9A7',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  onlineText: {
    fontSize: 11,
    color: '#FFFFFF40',
    letterSpacing: 0.5,
  },
  clearBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E6395040',
    backgroundColor: '#E6395015',
  },
  clearBtnText: {
    color: '#E63950',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    backgroundColor: '#FFFFFF08',
    marginHorizontal: 20,
  },

  // Messages
  flatListContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
  },

  // Empty state
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 52,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#FFFFFF40',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  suggestionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  suggestion: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#0E0E24',
    borderWidth: 1,
    borderColor: '#7B61FF30',
  },
  suggestionText: {
    color: '#7B61FF',
    fontSize: 13,
    fontWeight: '500',
  },

  // Input
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: Platform.OS === 'ios' ? 28 : 16,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#FFFFFF08',
    backgroundColor: '#03020F',
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: '#0E0E24',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#7B61FF30',
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 110,
  },
  input: {
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 22,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#7B61FF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#7B61FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  sendIcon: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
});

export default Chat;