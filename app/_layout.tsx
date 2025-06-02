import 'react-native-gesture-handler'
import React from 'react'
import { AppNavigator } from '../src/navigation/AppNavigator'
import '../src/styles/unistyles' // Инициализация Unistyles

export default function RootLayout() {
  return <AppNavigator />
} 