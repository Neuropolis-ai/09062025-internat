import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { StatusBar } from 'expo-status-bar'
import { Text } from 'react-native'
import { theme } from '../styles/unistyles'

// Экраны
import { HomeScreen } from '../screens/HomeScreen'
import { BankScreen } from '../screens/BankScreen'
import { GradesScreen } from '../screens/GradesScreen'
import { RepublicScreen } from '../screens/RepublicScreen'
import { AuthScreen } from '../screens/AuthScreen'
import { ChatScreen } from '../screens/ChatScreen'
import { NotificationsScreen } from '../screens/NotificationsScreen'
import { FAQScreen } from '../screens/FAQScreen'
import { RulesScreen } from '../screens/RulesScreen'
import { ShopScreen } from '../screens/ShopScreen'
import { AuctionScreen } from '../screens/AuctionScreen'

const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()

// Главный стек с домашним экраном и всеми дополнительными экранами
const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeMain" component={HomeScreen} />
    {/* Основные экраны доступные через главную страницу */}
    <Stack.Screen name="Bank" component={BankScreen} />
    <Stack.Screen name="Grades" component={GradesScreen} />
    <Stack.Screen name="Republic" component={RepublicScreen} />
    {/* Дополнительные экраны */}
    <Stack.Screen name="Chat" component={ChatScreen} />
    <Stack.Screen name="Notifications" component={NotificationsScreen} />
    <Stack.Screen name="FAQ" component={FAQScreen} />
    <Stack.Screen name="Rules" component={RulesScreen} />
    <Stack.Screen name="Profile" component={AuthScreen} />
  </Stack.Navigator>
)

// Стек для магазина
const ShopStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ShopMain" component={ShopScreen} />
  </Stack.Navigator>
)

// Стек для аукциона
const AuctionStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="AuctionMain" component={AuctionScreen} />
  </Stack.Navigator>
)

// Стек для нейрочата
const ChatStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ChatMain" component={ChatScreen} />
  </Stack.Navigator>
)

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <StatusBar style="light" backgroundColor={theme.colors.primary} />
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.gray,
          tabBarStyle: {
            backgroundColor: theme.colors.white,
            borderTopWidth: 1,
            borderTopColor: theme.colors.divider,
            paddingTop: 8,
            paddingBottom: 8,
            height: 70,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
            marginTop: 4,
          },
        }}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeStack}
          options={{
            title: 'Главная',
            tabBarIcon: ({ color, size }: { color: string; size: number }) => (
              <TabIcon name="home" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen 
          name="Shop" 
          component={ShopStack}
          options={{
            title: 'L-shop',
            tabBarIcon: ({ color, size }: { color: string; size: number }) => (
              <TabIcon name="shop" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen 
          name="Auction" 
          component={AuctionStack}
          options={{
            title: 'Аукцион',
            tabBarIcon: ({ color, size }: { color: string; size: number }) => (
              <TabIcon name="auction" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen 
          name="Neuro" 
          component={ChatStack}
          options={{
            title: 'Нейрочат',
            tabBarIcon: ({ color, size }: { color: string; size: number }) => (
              <TabIcon name="chat" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  )
}

// Временная иконка компонент
interface TabIconProps {
  name: string
  color: string
  size: number
}

const TabIcon: React.FC<TabIconProps> = ({ name, color, size }) => {
  const iconMap: Record<string, string> = {
    home: '🏠',
    shop: '🛒',
    auction: '🔨',
    chat: '🤖',
  }

  return (
    <Text style={{ fontSize: size, color }}>
      {iconMap[name] || '❓'}
    </Text>
  )
} 