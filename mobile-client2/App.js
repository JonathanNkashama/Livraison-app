import ProfileScreen from './src/screens/Profile/ProfileScreen';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { CartProvider } from './src/context/CartContext';
import LoginScreen from './src/screens/Auth/LoginScreen';
import RegisterScreen from './src/screens/Auth/RegisterScreen';
import HomeScreen from './src/screens/Home/HomeScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator screenOptions={{ tabBarActiveTintColor: '#FF6B35', headerShown: false }}>
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Accueil', tabBarIcon: () => <Text style={{ fontSize: 20 }}>🏪</Text> }} />
      <Tab.Screen name="Orders" component={HomeScreen} options={{ tabBarLabel: 'Commandes', tabBarIcon: () => <Text style={{ fontSize: 20 }}>📦</Text> }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: 'Profil', tabBarIcon: () => <Text style={{ fontSize: 20 }}>👤</Text> }} />
    </Tab.Navigator>
  );
}

function Navigation() {
  const { user, loading } = useAuth();
  if (loading) return null;
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="Main" component={TabNavigator} />
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Navigation />
      </CartProvider>
    </AuthProvider>
  );
}