import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { ChatProvider } from './screens/ChatContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Chat from './screens/Chat';
import MeteorScreen from './screens/Meteors';
import HomeScreen from './screens/Home';
import LaunchScreen from './screens/Launch';
import StarMapScreen from './screens/StarMap';
import SpaceCraftsScreen from './screens/SpaceCraft';
import AstroRunner from './screens/games/AstroRun';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabIcon = ({ emoji, label, focused }) => (
  <View style={[tabStyles.iconWrapper, focused && tabStyles.iconWrapperActive]}>
    {focused && <View style={tabStyles.glow} />}
    <Text style={tabStyles.emoji}>{emoji}</Text>
    {focused && <View style={tabStyles.activeDot} />}
  </View>
);

const tabStyles = StyleSheet.create({
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 52,
    height: 44,
    borderRadius: 14,
    position: 'relative',
  },
  iconWrapperActive: {
    backgroundColor: '#7B61FF18',
    borderWidth: 1,
    borderColor: '#7B61FF35',
  },
  glow: {
    position: 'absolute',
    width: 52,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#7B61FF',
    opacity: 0.08,
  },
  emoji: {
    fontSize: 20,
  },
  activeDot: {
    position: 'absolute',
    bottom: 3,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#7B61FF',
    shadowColor: '#7B61FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
});

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Meteors" component={MeteorScreen} />
      <Stack.Screen name="StarMap" component={StarMapScreen} />
      <Stack.Screen name="SpaceCraft" component={SpaceCraftsScreen} />
      <Stack.Screen name="Launch" component={LaunchScreen} />
      <Stack.Screen name="AstroGame" component={AstroRunner} />
    </Stack.Navigator>
  );
}

function App() {
  return (
    <ChatProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              headerShown: false,
              tabBarShowLabel: true,
              tabBarStyle: {
                backgroundColor: '#07061A',
                borderTopWidth: 1,
                borderTopColor: '#FFFFFF0A',
                // height: Platform.OS === 'ios' ? 82 : 64,
                // paddingBottom: Platform.OS === 'ios' ? 22 : 10,
                paddingTop: 8,
                paddingHorizontal: 20,
                // Subtle top shadow / glow line
                shadowColor: '#7B61FF',
                shadowOffset: { width: 0, height: -2 },
                shadowOpacity: 0.12,
                shadowRadius: 12,
                elevation: 20,
              },
              tabBarLabelStyle: {
                fontSize: 10,
                fontWeight: '700',
                letterSpacing: 1.5,
                marginTop: 10,
              },
              tabBarActiveTintColor: '#7B61FF',
              tabBarInactiveTintColor: '#FFFFFF30',
              tabBarIcon: ({ focused }) => {
                const icons = { Home: '🌍', Chat: '🚀' };
                return (
                  <TabIcon
                    emoji={icons[route.name]}
                    label={route.name}
                    focused={focused}
                  />
                );
              },
            })}
          >
            <Tab.Screen
              name="Home"
              component={HomeStack}
              options={{ tabBarLabel: 'EXPLORE' }}
            />
            <Tab.Screen
              name="Chat"
              component={Chat}
              options={{ tabBarLabel: 'ASTRO AI' }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </ChatProvider>
  );
}

export default App;