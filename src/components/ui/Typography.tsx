import React from 'react'
import { Text, TextProps, TextStyle, StyleSheet } from 'react-native'
import { theme } from '../../styles/unistyles'

type TypographyVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'body' | 'bodySmall' | 'caption'
type TypographyColor = 'primary' | 'secondary' | 'muted' | 'error' | 'white' | 'default'
type TextAlign = 'left' | 'center' | 'right' | 'justify'

interface TypographyProps extends Omit<TextProps, 'style'> {
  variant?: TypographyVariant
  color?: TypographyColor
  align?: TextAlign
  weight?: 'normal' | 'medium' | 'bold'
  underline?: boolean
  italic?: boolean
  style?: TextStyle
  children: React.ReactNode
}

export const Typography: React.FC<TypographyProps> = ({
  variant = 'body',
  color = 'default',
  align = 'left',
  weight = 'normal',
  underline = false,
  italic = false,
  style,
  children,
  ...textProps
}) => {
  return (
    <Text
      style={[
        styles.base,
        styles[variant],
        styles[`${color}Color`],
        styles[`${align}Align`],
        styles[`${weight}Weight`],
        underline && styles.underline,
        italic && styles.italic,
        style,
      ]}
      {...textProps}
    >
      {children}
    </Text>
  )
}

// Specialized components
export const Heading: React.FC<Omit<TypographyProps, 'variant'> & { level: 1 | 2 | 3 | 4 | 5 }> = ({
  level,
  ...props
}) => {
  const variant = `h${level}` as TypographyVariant
  return <Typography variant={variant} weight="bold" {...props} />
}

export const Paragraph: React.FC<Omit<TypographyProps, 'variant'>> = (props) => {
  return <Typography variant="body" {...props} />
}

export const Label: React.FC<Omit<TypographyProps, 'variant'>> = (props) => {
  return <Typography variant="bodySmall" weight="medium" {...props} />
}

export const Caption: React.FC<Omit<TypographyProps, 'variant'>> = (props) => {
  return <Typography variant="caption" color="muted" {...props} />
}

const styles = StyleSheet.create({
  base: {
    fontFamily: theme.typography.fonts.regular,
  },
  
  // Variants (sizes)
  h1: {
    fontSize: theme.typography.sizes.h1,
    lineHeight: theme.typography.lineHeights.h1,
  },
  h2: {
    fontSize: theme.typography.sizes.h2,
    lineHeight: theme.typography.lineHeights.h2,
  },
  h3: {
    fontSize: theme.typography.sizes.h3,
    lineHeight: theme.typography.lineHeights.h3,
  },
  h4: {
    fontSize: theme.typography.sizes.h4,
    lineHeight: theme.typography.lineHeights.h4,
  },
  h5: {
    fontSize: theme.typography.sizes.h5,
    lineHeight: theme.typography.lineHeights.h5,
  },
  body: {
    fontSize: theme.typography.sizes.body,
    lineHeight: theme.typography.lineHeights.body,
  },
  bodySmall: {
    fontSize: theme.typography.sizes.bodySmall,
    lineHeight: theme.typography.lineHeights.bodySmall,
  },
  caption: {
    fontSize: theme.typography.sizes.caption,
    lineHeight: theme.typography.lineHeights.caption,
  },
  
  // Colors
  defaultColor: {
    color: theme.colors.charcoal,
  },
  primaryColor: {
    color: theme.colors.primary,
  },
  secondaryColor: {
    color: theme.colors.secondary,
  },
  mutedColor: {
    color: theme.colors.gray,
  },
  errorColor: {
    color: theme.colors.error,
  },
  whiteColor: {
    color: theme.colors.white,
  },
  
  // Alignment
  leftAlign: {
    textAlign: 'left' as const,
  },
  centerAlign: {
    textAlign: 'center' as const,
  },
  rightAlign: {
    textAlign: 'right' as const,
  },
  justifyAlign: {
    textAlign: 'justify' as const,
  },
  
  // Weight
  normalWeight: {
    fontWeight: '400' as const,
    fontFamily: theme.typography.fonts.regular,
  },
  mediumWeight: {
    fontWeight: '500' as const,
    fontFamily: theme.typography.fonts.medium,
  },
  boldWeight: {
    fontWeight: '700' as const,
    fontFamily: theme.typography.fonts.bold,
  },
  
  // Decorations
  underline: {
    textDecorationLine: 'underline' as const,
  },
  italic: {
    fontStyle: 'italic' as const,
  },
}) 