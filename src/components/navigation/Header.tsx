import React from 'react'
import { View, Text, TouchableOpacity, ViewStyle } from 'react-native'
import { StyleSheet } from 'react-native'

interface HeaderProps {
  title?: string
  subtitle?: string
  leftAction?: {
    icon: string
    onPress: () => void
    testID?: string
  }
  rightActions?: Array<{
    icon: string
    onPress: () => void
    badge?: number
    testID?: string
  }>
  style?: ViewStyle
  sticky?: boolean
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  leftAction,
  rightActions = [],
  style,
  sticky = false,
}) => {
  return (
    <View style={[styles.container, sticky && styles.sticky, style]}>
      {/* Gradient Background */}
      <View style={styles.gradientBackground} />
      
      {/* Content */}
      <View style={styles.content}>
        {/* Left Action */}
        <View style={styles.leftSection}>
          {leftAction && (
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={leftAction.onPress}
              testID={leftAction.testID}
            >
              <Text style={styles.actionIcon}>{leftAction.icon}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Center Content */}
        <View style={styles.centerSection}>
          {title && (
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
          )}
          {subtitle && (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>

        {/* Right Actions */}
        <View style={styles.rightSection}>
          {rightActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={styles.actionButton}
              onPress={action.onPress}
              testID={action.testID}
            >
              <Text style={styles.actionIcon}>{action.icon}</Text>
              {action.badge && action.badge > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {action.badge > 99 ? '99+' : action.badge.toString()}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    height: 88,
    zIndex: 1000,
  },
  sticky: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#8B2439',
    opacity: 0.95,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  leftSection: {
    width: 50,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  rightSection: {
    width: 100,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginLeft: 4,
    position: 'relative',
  },
  actionIcon: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
    textAlign: 'center',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#E74C3C',
    borderRadius: 9999,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    transform: [{ scale: 1 }],
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
})

export default Header 