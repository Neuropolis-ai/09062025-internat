import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import { Header } from './components/Header';

const { width } = Dimensions.get('window');

interface AdminLoginProps {
  onLoginSuccess?: () => void;
}

export default function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Ошибка', 'Пожалуйста, заполните все поля');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Ошибка', 'Пароли не совпадают');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Ошибка', 'Пароль должен содержать минимум 6 символов');
      return;
    }

    setIsLoading(true);
    try {
      // Здесь будет логика авторизации админа
      console.log('Авторизация админа:', { email, password });
      
      // Симуляция запроса
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Alert.alert(
        'Успех', 
        'Вход в админ-портал выполнен успешно',
        [
          {
            text: 'Продолжить',
            onPress: () => {
              if (onLoginSuccess) {
                onLoginSuccess();
              }
              console.log('Переход в админ-панель');
            }
          }
        ]
      );
      
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось войти в систему');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Восстановление пароля',
      'Обратитесь к системному администратору для восстановления доступа',
      [{ text: 'Понятно', style: 'default' }]
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Header 
        title="Вход в личный кабинет"
        showNotificationButton={false}
        showBackButton={false}
      />
      
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.loginContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.welcomeTitle}>Добро пожаловать в</Text>
            <Text style={styles.adminTitle}>Админ-портал</Text>
            <Text style={styles.subtitle}>Лицей-интернат "Подмосковный"</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={[styles.input, !email && styles.inputEmpty]}
                placeholder="Введите ваш email"
                placeholderTextColor="#999999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Пароль</Text>
              <TextInput
                style={[styles.input, !password && styles.inputEmpty]}
                placeholder="Введите пароль"
                placeholderTextColor="#999999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Повторите пароль</Text>
              <TextInput
                style={[styles.input, !confirmPassword && styles.inputEmpty]}
                placeholder="Повторите пароль"
                placeholderTextColor="#999999"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={true}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />
            </View>

            <TouchableOpacity
              style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <Text style={styles.loginButtonText}>
                {isLoading ? 'Выполняется вход...' : 'Войти'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.forgotPasswordButton}
              onPress={handleForgotPassword}
            >
              <Text style={styles.forgotPasswordText}>Забыли пароль?</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footerContainer}>
            <View style={styles.securityBadge}>
              <Text style={styles.securityIcon}>🔒</Text>
              <Text style={styles.securityText}>Защищенное соединение</Text>
            </View>
            
            <Text style={styles.footerText}>
              Только для администраторов лицея
            </Text>
            <Text style={styles.helpText}>
              При возникновении проблем обратитесь к системному администратору
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  welcomeTitle: {
    fontSize: 18,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 8,
  },
  adminTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#8B2439',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    fontWeight: '500',
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B2439',
    marginBottom: 8,
  },
  input: {
    borderWidth: 2,
    borderColor: '#E5E5EA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    color: '#333333',
    minHeight: 50,
  },
  inputEmpty: {
    borderColor: '#E5E5EA',
  },
  loginButton: {
    backgroundColor: '#8B2439',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 12,
    shadowColor: '#8B2439',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  loginButtonDisabled: {
    backgroundColor: '#CCCCCC',
    shadowOpacity: 0,
    elevation: 0,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  forgotPasswordButton: {
    alignItems: 'center',
    marginTop: 16,
    paddingVertical: 8,
  },
  forgotPasswordText: {
    color: '#8B2439',
    fontSize: 14,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  footerContainer: {
    alignItems: 'center',
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  securityIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  securityText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
  },
  footerText: {
    fontSize: 14,
    color: '#8B2439',
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 8,
  },
  helpText: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 18,
  },
});

// Адаптивные стили для планшетов и больших экранов
const tabletStyles = StyleSheet.create({
  loginContainer: {
    maxWidth: width > 768 ? 500 : 400,
  },
  formContainer: {
    padding: width > 768 ? 32 : 24,
  },
  adminTitle: {
    fontSize: width > 768 ? 32 : 28,
  },
});

// Применяем адаптивные стили для больших экранов
if (width > 768) {
  Object.assign(styles.loginContainer, tabletStyles.loginContainer);
  Object.assign(styles.formContainer, tabletStyles.formContainer);
  Object.assign(styles.adminTitle, tabletStyles.adminTitle);
} 