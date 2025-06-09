import React from 'react'
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  View,
  Platform,
  StyleSheet,
} from 'react-native'

interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost'
  size: 'small' | 'medium' | 'large'
  disabled?: boolean
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  onPress: () => void
  children: string
  testID?: string
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  onPress,
  children,
  testID,
}) => {
  const handlePress = (): void => {
    if (!disabled && !loading) {
      // Haptic feedback для iOS
      if (Platform.OS === 'ios') {
        // Здесь можно добавить haptic feedback
      }
      onPress()
    }
  }

  const renderContent = (): React.ReactNode => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="small"
            color={
              variant === 'primary'
                ? '#FFFFFF'
                : '#FFFFFF'
            }
          />
          <Text style={[styles.text, styles[`${variant}Text`], styles[size]]}>
            {children}
          </Text>
        </View>
      )
    }

    return (
      <View style={styles.contentContainer}>
        {icon && iconPosition === 'left' && (
          <View style={styles.iconLeft}>{icon}</View>
        )}
        <Text style={[styles.text, styles[`${variant}Text`], styles[size]]}>
          {children}
        </Text>
        {icon && iconPosition === 'right' && (
          <View style={styles.iconRight}>{icon}</View>
        )}
      </View>
    )
  }

  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[variant],
        styles[`${size}Button`],
        disabled && styles.disabled,
      ]}
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      testID={testID}
    >
      {renderContent()}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  
  // Variants
  primary: {
    backgroundColor: '#8B2439',
  },
  secondary: {
    backgroundColor: '#4D8061',
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#8B2439',
    shadowOpacity: 0,
    elevation: 0,
  },
  
  // Sizes
  smallButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 36,
  },
  mediumButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    minHeight: 44,
  },
  largeButton: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    minHeight: 52,
  },
  
  // Text styles
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: '#FFFFFF',
  },
  ghostText: {
    color: '#8B2439',
  },
  
  // Text sizes
  small: {
    fontSize: 14,
    lineHeight: 20,
  },
  medium: {
    fontSize: 16,
    lineHeight: 24,
  },
  large: {
    fontSize: 18,
    lineHeight: 28,
  },
  
  // States
  disabled: {
    opacity: 0.5,
  },
  
  // Content layout
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
}) 