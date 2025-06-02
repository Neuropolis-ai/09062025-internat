import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export default function AuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  // Animated values for floating labels
  const emailLabelAnim = new Animated.Value(email ? 1 : 0);
  const passwordLabelAnim = new Animated.Value(password ? 1 : 0);
  const confirmPasswordLabelAnim = new Animated.Value(confirmPassword ? 1 : 0);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!email) {
      newErrors.email = 'Email обязателен';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Неверный формат email';
    }

    if (!password) {
      newErrors.password = 'Пароль обязателен';
    } else if (password.length < 6) {
      newErrors.password = 'Пароль должен содержать минимум 6 символов';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Подтверждение пароля обязательно';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputFocus = (field: string) => {
    const animValue = field === 'email' ? emailLabelAnim : 
                     field === 'password' ? passwordLabelAnim : confirmPasswordLabelAnim;
    
    Animated.timing(animValue, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleInputBlur = (field: string, value: string) => {
    if (!value) {
      const animValue = field === 'email' ? emailLabelAnim : 
                       field === 'password' ? passwordLabelAnim : confirmPasswordLabelAnim;
      
      Animated.timing(animValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    // Имитация API вызова
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert('Успех', 'Вход выполнен успешно!');
    }, 1500);
  };

  const handleResetPassword = () => {
    if (!email) {
      Alert.alert('Ошибка', 'Введите email для сброса пароля');
      return;
    }
    
    if (!validateEmail(email)) {
      Alert.alert('Ошибка', 'Введите корректный email');
      return;
    }

    Alert.alert(
      'Сброс пароля',
      `Инструкции по сбросу пароля отправлены на ${email}`,
      [{ text: 'OK', onPress: () => setShowResetPassword(false) }]
    );
  };

  const FloatingLabelInput = ({ 
    label, 
    value, 
    onChangeText, 
    onFocus, 
    onBlur, 
    secureTextEntry = false,
    error,
    animValue 
  }: {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    onFocus: () => void;
    onBlur: () => void;
    secureTextEntry?: boolean;
    error?: string | undefined;
    animValue: Animated.Value;
  }) => {
    const labelStyle = {
      position: 'absolute' as const,
      left: 16,
      top: animValue.interpolate({
        inputRange: [0, 1],
        outputRange: [20, -8],
      }),
      fontSize: animValue.interpolate({
        inputRange: [0, 1],
        outputRange: [16, 12],
      }),
      color: animValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['#666666', '#007AFF'],
      }),
      backgroundColor: '#F2F2F7',
      paddingHorizontal: 4,
      zIndex: 1,
    };

    return (
      <View style={styles.inputContainer}>
        <Animated.Text style={labelStyle}>{label}</Animated.Text>
        <TextInput
          style={[styles.input, error && styles.inputError]}
          value={value}
          onChangeText={onChangeText}
          onFocus={onFocus}
          onBlur={onBlur}
          secureTextEntry={secureTextEntry}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Лицей-интернат{'\n'}«Подмосковный»</Text>
          <Text style={styles.subtitle}>Добро пожаловать!</Text>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          <FloatingLabelInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            onFocus={() => handleInputFocus('email')}
            onBlur={() => handleInputBlur('email', email)}
            error={errors.email}
            animValue={emailLabelAnim}
          />

          <FloatingLabelInput
            label="Пароль"
            value={password}
            onChangeText={setPassword}
            onFocus={() => handleInputFocus('password')}
            onBlur={() => handleInputBlur('password', password)}
            secureTextEntry
            error={errors.password}
            animValue={passwordLabelAnim}
          />

          <FloatingLabelInput
            label="Подтвердите пароль"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            onFocus={() => handleInputFocus('confirmPassword')}
            onBlur={() => handleInputBlur('confirmPassword', confirmPassword)}
            secureTextEntry
            error={errors.confirmPassword}
            animValue={confirmPasswordLabelAnim}
          />

          {/* Login Button */}
          <TouchableOpacity 
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <View style={styles.buttonContent}>
              <Text style={styles.buttonText}>
                {isLoading ? 'Вход...' : 'Войти'}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Reset Password Button */}
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => setShowResetPassword(!showResetPassword)}
            activeOpacity={0.7}
          >
            <Text style={styles.secondaryButtonText}>Сбросить пароль</Text>
          </TouchableOpacity>

          {/* Reset Password Form */}
          {showResetPassword && (
            <View style={styles.resetContainer}>
              <Text style={styles.resetTitle}>Сброс пароля</Text>
              <Text style={styles.resetDescription}>
                Введите ваш email для получения инструкций по сбросу пароля
              </Text>
              
              <TouchableOpacity
                style={styles.resetButton}
                onPress={handleResetPassword}
                activeOpacity={0.8}
              >
                <Text style={styles.resetButtonText}>Отправить</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2025 Лицей-интернат «Подмосковный»
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    paddingTop: height * 0.08,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 18,
    color: '#666666',
    textAlign: 'center',
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    justifyContent: 'center',
  },
  inputContainer: {
    marginBottom: 24,
    position: 'relative',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 20,
    fontSize: 16,
    borderWidth: 2,
    borderColor: '#E5E5EA',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 16,
  },
  button: {
    marginTop: 32,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#007AFF',
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonContent: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
  },
  resetContainer: {
    marginTop: 24,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resetTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
    textAlign: 'center',
  },
  resetDescription: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  resetButton: {
    backgroundColor: '#34C759',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    paddingBottom: 20,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#999999',
    textAlign: 'center',
  },
}); 