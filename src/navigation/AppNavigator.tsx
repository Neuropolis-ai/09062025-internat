import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { StatusBar } from 'expo-status-bar'
import { Text } from 'react-native'
import { theme } from '../styles/unistyles'

// Экраны
import { SimpleHomeScreen } from '../screens/SimpleHomeScreen'

const Tab = createBottomTabNavigator()

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
          component={SimpleHomeScreen}
          options={{
            title: 'Главная',
            tabBarIcon: ({ color, size }: { color: string; size: number }) => (
              <TabIcon name="home" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen 
          name="Bank" 
          component={SimpleHomeScreen}
          options={{
            title: 'Банк',
            tabBarIcon: ({ color, size }: { color: string; size: number }) => (
              <TabIcon name="wallet" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen 
          name="Grades" 
          component={SimpleHomeScreen}
          options={{
            title: 'Успеваемость',
            tabBarIcon: ({ color, size }: { color: string; size: number }) => (
              <TabIcon name="chart" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen 
          name="Republic" 
          component={SimpleHomeScreen}
          options={{
            title: 'Республика',
            tabBarIcon: ({ color, size }: { color: string; size: number }) => (
              <TabIcon name="people" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen 
          name="Auth" 
          component={SimpleHomeScreen}
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