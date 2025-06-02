import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native'

export const SimpleHomeScreen: React.FC = () => {
  const handlePress = () => {
    Alert.alert('Демо', 'Приложение лицея работает!')
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏫 Лицей-интернат "Подмосковный"</Text>
      <Text style={styles.subtitle}>Мобильное приложение</Text>
      
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>2,450</Text>
          <Text style={styles.statLabel}>Лицейских баллов</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>4.8</Text>
          <Text style={styles.statLabel}>Средний балл</Text>
        </View>
      </View>

      <View style={styles.modulesContainer}>
        <TouchableOpacity style={styles.moduleButton} onPress={handlePress}>
          <Text style={styles.moduleIcon}>💳</Text>
          <Text style={styles.moduleText}>Лицейский банк</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.moduleButton} onPress={handlePress}>
          <Text style={styles.moduleIcon}>📊</Text>
          <Text style={styles.moduleText}>Успеваемость</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.moduleButton} onPress={handlePress}>
          <Text style={styles.moduleIcon}>🏛️</Text>
          <Text style={styles.moduleText}>Республика</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.moduleButton} onPress={handlePress}>
          <Text style={styles.moduleIcon}>🤖</Text>
          <Text style={styles.moduleText}>Нейрочат</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B2439',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 40,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 40,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B2439',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
  modulesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  moduleButton: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  moduleIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  moduleText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8B2439',
    textAlign: 'center',
  },
}) 