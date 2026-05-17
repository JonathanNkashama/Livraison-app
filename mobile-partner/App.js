import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { AuthProvider, useAuth } from './src/context/AuthContext';

import LoginScreen from './src/screens/Auth/LoginScreen';
import RegisterScreen from './src/screens/Auth/RegisterScreen';
import DashboardScreen from './src/screens/Dashboard/DashboardScreen';
import OrdersScreen from './src/screens/Orders/OrdersScreen';
import CatalogScreen from './src/screens/Catalog/CatalogScreen';
import AddProductScreen from './src/screens/Catalog/AddProductScreen';
import WalletScreen from './src/screens/Wallet/WalletScreen';
import ProfileScreen from './src/screens/Profile/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator screenOptions={{ tabBarActiveTintColor: '#2ecc71', headerShown: false }}>
      <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ tabBarLabel: 'Accueil', tabBarIcon: () => <Text style={{ fontSize: 20 }}>🏠</Text> }} />
      <Tab.Screen name="Orders" component={OrdersScreen} options={{ tabBarLabel: 'Commandes', tabBarIcon: () => <Text style={{ fontSize: 20 }}>📦</Text> }} />
      <Tab.Screen name="Catalog" component={CatalogScreen} options={{ tabBarLabel: 'Catalogue', tabBarIcon: () => <Text style={{ fontSize: 20 }}>🍽️</Text> }} />
      <Tab.Screen name="Wallet" component={WalletScreen} options={{ tabBarLabel: 'Wallet', tabBarIcon: () => <Text style={{ fontSize: 20 }}>💰</Text> }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: 'Profil', tabBarIcon: () => <Text style={{ fontSize: 20 }}>👤</Text> }} />
    </Tab.Navigator>
  );
}

function Navigation() {
  const { partenaire, loading } = useAuth();
  if (loading) return null;
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {partenaire ? (
          <>
            <Stack.Screen name="Main" component={TabNavigator} />
            <Stack.Screen name="AddProduct" component={AddProductScreen} />
          </>
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
      <Navigation />
    </AuthProvider>
  );
}