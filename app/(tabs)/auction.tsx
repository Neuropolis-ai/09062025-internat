import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

export default function AuctionScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Аукцион</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title}>🔨 Лицейский аукцион</Text>
        <Text style={styles.subtitle}>Скоро здесь начнутся торги</Text>
        <Text style={styles.description}>
          Участвуйте в аукционах, делайте ставки и выигрывайте ценные призы за L-Coin!
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    backgroundColor: '#8B2439',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B2439',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#666666',
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
  },
}); 