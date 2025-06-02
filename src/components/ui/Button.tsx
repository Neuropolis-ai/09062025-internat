import React from 'react'
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  View,
  Platform,
} from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

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
  const { styles } = useStyles(stylesheet)

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
                ? styles.primaryText.color
                : styles.secondaryText.color
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

const stylesheet = createStyleSheet((theme) => ({
  button: {
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    ...theme.shadows.small,
  },
  
  // Variants
  primary: {
    backgroundColor: theme.colors.primary,
  },
  secondary: {
    backgroundColor: theme.colors.secondary,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.primary,
    shadowOpacity: 0,
    elevation: 0,
  },
  
  // Sizes
  smallButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    minHeight: 36,
  },
  mediumButton: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    minHeight: 44,
  },
  largeButton: {
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
    minHeight: 52,
  },
  
  // Text styles
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  primaryText: {
    color: theme.colors.white,
  },
  secondaryText: {
    color: theme.colors.white,
  },
  ghostText: {
    color: theme.colors.primary,
  },
  
  // Text sizes
  small: {
    fontSize: theme.typography.sizes.bodySmall,
    lineHeight: theme.typography.lineHeights.bodySmall,
  },
  medium: {
    fontSize: theme.typography.sizes.body,
    lineHeight: theme.typography.lineHeights.body,
  },
  large: {
    fontSize: theme.typography.sizes.h5,
    lineHeight: theme.typography.lineHeights.h5,
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
    gap: theme.spacing.sm,
  },
  iconLeft: {
    marginRight: theme.spacing.sm,
  },
  iconRight: {
    marginLeft: theme.spacing.sm,
  },
})) 