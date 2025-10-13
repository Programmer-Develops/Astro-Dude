import 'react-native-gesture-handler';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { ChatProvider } from './screens/ChatContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Chat from './screens/Chat';
import MeteorScreen from './screens/Meteors';
import HomeScreen from './screens/Home';
import DailyPicScreen from './screens/DailyPic';
import StarMapScreen from './screens/StarMap';
import SpaceCraftsScreen from './screens/SpaceCraft';
import Icon from 'react-native-vector-icons/FontAwesome';
import ChatIcon from './ChatIcon';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const tabIcons = {
  Home: 'home',
  Chat: 'comment',
};

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Meteors" component={MeteorScreen} />
      <Stack.Screen name="DailyPic" component={DailyPicScreen} />
      <Stack.Screen name="StarMap" component={StarMapScreen} />
      <Stack.Screen name="SpaceCraft" component={SpaceCraftsScreen} />
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
              tabBarIcon: ({ color, size }) => {
                const iconName = tabIcons[route.name];
                return <Icon name={iconName} size={size} color={color} />;
              },
            })}
          >
            <Tab.Screen name="Home" component={HomeStack} />
            <Tab.Screen name="Chat" component={Chat} />
          </Tab.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </ChatProvider>
  );
}

export default App;
