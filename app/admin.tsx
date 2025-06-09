import React, { useState } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import AdminLogin from './admin-login';
import AdminPanel from './admin-panel';

interface AdminState {
  isAuthenticated: boolean;
  currentUser: string | null;
}

export default function Admin() {
  const [adminState, setAdminState] = useState<AdminState>({
    isAuthenticated: false,
    currentUser: null,
  });

  const handleLoginSuccess = () => {
    setAdminState({
      isAuthenticated: true,
      currentUser: 'admin', // В реальном приложении здесь будут данные пользователя
    });
  };

  const handleLogout = () => {
    setAdminState({
      isAuthenticated: false,
      currentUser: null,
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar 
        backgroundColor="#8B2439" 
        barStyle="light-content" 
        translucent={false}
      />
      
      {!adminState.isAuthenticated ? (
        <AdminLogin onLoginSuccess={handleLoginSuccess} />
      ) : (
        <AdminPanel onLogout={handleLogout} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
}); 