import React from 'react'
import { View, ViewStyle, TouchableOpacity } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

interface CardProps {
  variant?: 'standard' | 'elevated' | 'outlined'
  children: React.ReactNode
  style?: ViewStyle
  onPress?: () => void
  testID?: string
}

interface CardHeaderProps {
  children: React.ReactNode
  style?: ViewStyle
}

interface CardBodyProps {
  children: React.ReactNode
  style?: ViewStyle
}

interface CardFooterProps {
  children: React.ReactNode
  style?: ViewStyle
}

export const Card: React.FC<CardProps> & {
  Header: React.FC<CardHeaderProps>
  Body: React.FC<CardBodyProps>
  Footer: React.FC<CardFooterProps>
} = ({ variant = 'standard', children, style, onPress, testID }) => {
  const { styles } = useStyles(stylesheet)

  const CardContent = (
    <View
      style={[styles.card, styles[variant], style]}
      testID={testID}
    >
      {children}
    </View>
  )

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.95}
        style={styles.touchable}
      >
        {CardContent}
      </TouchableOpacity>
    )
  }

  return CardContent
}

const CardHeader: React.FC<CardHeaderProps> = ({ children, style }) => {
  const { styles } = useStyles(stylesheet)
  
  return (
    <View style={[styles.header, style]}>
      {children}
    </View>
  )
}

const CardBody: React.FC<CardBodyProps> = ({ children, style }) => {
  const { styles } = useStyles(stylesheet)
  
  return (
    <View style={[styles.body, style]}>
      {children}
    </View>
  )
}

const CardFooter: React.FC<CardFooterProps> = ({ children, style }) => {
  const { styles } = useStyles(stylesheet)
  
  return (
    <View style={[styles.footer, style]}>
      {children}
    </View>
  )
}

Card.Header = CardHeader
Card.Body = CardBody
Card.Footer = CardFooter

const stylesheet = createStyleSheet((theme) => ({
  touchable: {
    borderRadius: theme.borderRadius.lg,
  },
  card: {
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.white,
    overflow: 'hidden',
  },
  
  // Variants
  standard: {
    ...theme.shadows.small,
  },
  elevated: {
    ...theme.shadows.medium,
  },
  outlined: {
    borderWidth: 1,
    borderColor: theme.colors.divider,
    shadowOpacity: 0,
    elevation: 0,
  },
  
  // Layout components
  header: {
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  body: {
    padding: theme.spacing.lg,
  },
  footer: {
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.divider,
  },
})) 