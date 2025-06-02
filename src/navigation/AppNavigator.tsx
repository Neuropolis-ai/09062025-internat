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

// Стек для домашнего экрана с дополнительными экранами
const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeMain" component={HomeScreen} />
    <Stack.Screen name="Chat" component={ChatScreen} />
    <Stack.Screen name="Notifications" component={NotificationsScreen} />
    <Stack.Screen name="FAQ" component={FAQScreen} />
    <Stack.Screen name="Rules" component={RulesScreen} />
    <Stack.Screen name="Shop" component={ShopScreen} />
    <Stack.Screen name="Auction" component={AuctionScreen} />
  </Stack.Navigator>
)

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <StatusBar style="dark" backgroundColor={theme.colors.white} />
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
          name="Bank" 
          component={BankScreen}
          options={{
            title: 'Банк',
            tabBarIcon: ({ color, size }: { color: string; size: number }) => (
              <TabIcon name="wallet" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen 
          name="Grades" 
          component={GradesScreen}
          options={{
            title: 'Успеваемость',
            tabBarIcon: ({ color, size }: { color: string; size: number }) => (
              <TabIcon name="chart" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen 
          name="Republic" 
          component={RepublicScreen}
          options={{
            title: 'Республика',
            tabBarIcon: ({ color, size }: { color: string; size: number }) => (
              <TabIcon name="people" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen 
          name="Profile" 
          component={AuthScreen}
          options={{
            title: 'Профиль',
            tabBarIcon: ({ color, size }: { color: string; size: number }) => (
              <TabIcon name="person" color={color} size={size} />
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
    wallet: '💳',
    chart: '📊',
    people: '👥',
    person: '👤',
  }

  return (
    <Text style={{ fontSize: size, color }}>
      {iconMap[name] || '❓'}
    </Text>
  )
} 