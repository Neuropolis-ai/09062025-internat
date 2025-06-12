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
        outputRange: ['#666666', '#8B2439'],
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
          <Text style={styles.headerTitle}>Вход в личный кабинет</Text>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          <View style={styles.authBlock}>
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
              <Text style={styles.buttonText}>
                {isLoading ? 'Вход...' : 'Войти'}
              </Text>
            </TouchableOpacity>

            {/* Reset Password Button */}
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => setShowResetPassword(!showResetPassword)}
              activeOpacity={0.7}
            >
              <Text style={styles.secondaryButtonText}>Сбросить пароль</Text>
            </TouchableOpacity>
          </View>

          {/* Reset Password Form */}
          {showResetPassword && (
            <View style={styles.resetContainer}>
              <Text style={styles.resetTitle}>Сбросить пароль</Text>
              
              <View style={styles.resetInputContainer}>
                <TextInput
                  style={styles.resetInput}
                  placeholder="Email"
                  placeholderTextColor="#666666"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                />
              </View>
              
              <TouchableOpacity
                style={styles.resetButton}
                onPress={handleResetPassword}
                activeOpacity={0.8}
              >
                <Text style={styles.resetButtonText}>Сбросить пароль</Text>
              </TouchableOpacity>
            </View>
          )}
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
  },
  header: {
    backgroundColor: '#8B2439',
    paddingTop: height * 0.06,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  authBlock: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputContainer: {
    marginBottom: 20,
    position: 'relative',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  inputError: {
    borderColor: '#FF4444',
  },
  errorText: {
    color: '#FF4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 16,
  },
  button: {
    backgroundColor: '#8B2439',
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 10,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#8B2439',
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
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#8B2439',
    fontSize: 16,
    fontWeight: '500',
  },
  resetContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B2439',
    marginBottom: 16,
    textAlign: 'center',
  },
  resetInputContainer: {
    marginBottom: 16,
  },
  resetInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  resetButton: {
    backgroundColor: '#8B2439',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
}); 