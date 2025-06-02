import React, { useState, useRef } from 'react'
import {
  TextInput,
  View,
  Text,
  Animated,
  TouchableOpacity,
  TextInputProps,
  ViewStyle,
} from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string
  error?: string
  helperText?: string
  prefixIcon?: React.ReactNode
  suffixIcon?: React.ReactNode
  variant?: 'outlined' | 'filled'
  size?: 'small' | 'medium' | 'large'
  style?: ViewStyle
  disabled?: boolean
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  prefixIcon,
  suffixIcon,
  variant = 'outlined',
  size = 'medium',
  style,
  disabled = false,
  value,
  onFocus,
  onBlur,
  ...textInputProps
}) => {
  const { styles } = useStyles(stylesheet)
  const [isFocused, setIsFocused] = useState(false)
  const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current

  const handleFocus = (e: any): void => {
    setIsFocused(true)
    
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start()
    
    onFocus?.(e)
  }

  const handleBlur = (e: any): void => {
    setIsFocused(false)
    
    if (!value) {
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start()
    }
    
    onBlur?.(e)
  }

  const labelStyle = {
    position: 'absolute' as const,
    left: prefixIcon ? 44 : 16,
    top: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [20, 8],
    }),
    fontSize: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
    color: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [styles.labelInactive.color, styles.labelActive.color],
    }),
  }

  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.inputContainer,
          styles[variant],
          styles[`${size}Container`],
          isFocused && styles.focused,
          error && styles.error,
          disabled && styles.disabled,
        ]}
      >
        {prefixIcon && (
          <View style={styles.prefixIcon}>{prefixIcon}</View>
        )}
        
        <View style={styles.textInputWrapper}>
          {label && (
            <Animated.Text style={labelStyle}>
              {label}
            </Animated.Text>
          )}
          
          <TextInput
            style={[
              styles.textInput,
              styles[`${size}Text`],
              label && styles.textInputWithLabel,
              prefixIcon && styles.textInputWithPrefix,
              suffixIcon && styles.textInputWithSuffix,
            ]}
            value={value}
            onFocus={handleFocus}
            onBlur={handleBlur}
            editable={!disabled}
            placeholderTextColor={styles.placeholder.color}
            {...textInputProps}
          />
        </View>
        
        {suffixIcon && (
          <TouchableOpacity style={styles.suffixIcon}>
            {suffixIcon}
          </TouchableOpacity>
        )}
      </View>
      
      {(error || helperText) && (
        <Text style={[styles.helperText, error && styles.errorText]}>
          {error || helperText}
        </Text>
      )}
    </View>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    marginVertical: theme.spacing.xs,
  },
  
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.white,
    position: 'relative',
  },
  
  // Variants
  outlined: {
    borderWidth: 1,
    borderColor: theme.colors.divider,
  },
  filled: {
    backgroundColor: theme.colors.lightGray,
    borderWidth: 0,
  },
  
  // States
  focused: {
    borderColor: theme.colors.primary,
    borderWidth: 2,
  },
  error: {
    borderColor: theme.colors.error,
  },
  disabled: {
    opacity: 0.5,
    backgroundColor: theme.colors.ultraLight,
  },
  
  // Sizes
  smallContainer: {
    minHeight: 40,
  },
  mediumContainer: {
    minHeight: 48,
  },
  largeContainer: {
    minHeight: 56,
  },
  
  // Icons
  prefixIcon: {
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.sm,
  },
  suffixIcon: {
    paddingRight: theme.spacing.md,
    paddingLeft: theme.spacing.sm,
  },
  
  // Text input
  textInputWrapper: {
    flex: 1,
    position: 'relative',
  },
  textInput: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    color: theme.colors.charcoal,
    fontSize: theme.typography.sizes.body,
    lineHeight: theme.typography.lineHeights.body,
  },
  textInputWithLabel: {
    paddingTop: 24,
    paddingBottom: 8,
  },
  textInputWithPrefix: {
    paddingLeft: 0,
  },
  textInputWithSuffix: {
    paddingRight: 0,
  },
  
  // Text sizes
  smallText: {
    fontSize: theme.typography.sizes.bodySmall,
    lineHeight: theme.typography.lineHeights.bodySmall,
  },
  mediumText: {
    fontSize: theme.typography.sizes.body,
    lineHeight: theme.typography.lineHeights.body,
  },
  largeText: {
    fontSize: theme.typography.sizes.h5,
    lineHeight: theme.typography.lineHeights.h5,
  },
  
  // Labels and helper text
  labelActive: {
    color: theme.colors.primary,
  },
  labelInactive: {
    color: theme.colors.gray,
  },
  placeholder: {
    color: theme.colors.gray,
  },
  helperText: {
    fontSize: theme.typography.sizes.caption,
    lineHeight: theme.typography.lineHeights.caption,
    color: theme.colors.gray,
    marginTop: theme.spacing.xs,
    marginLeft: theme.spacing.md,
  },
  errorText: {
    color: theme.colors.error,
  },
})) 