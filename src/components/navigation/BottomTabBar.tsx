import React from 'react'
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native'

interface TabItem {
  key: string
  label: string
  icon: string
  badge?: number
}

interface BottomTabBarProps {
  tabs: TabItem[]
  activeTab: string
  onTabPress: (tabKey: string) => void
  safeAreaBottom?: number
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  tabs,
  activeTab,
  onTabPress,
  safeAreaBottom = 0,
}) => {
  const animatedValues = React.useRef(
    tabs.reduce((acc, tab) => {
      acc[tab.key] = new Animated.Value(tab.key === activeTab ? 1 : 0)
      return acc
    }, {} as Record<string, Animated.Value>)
  ).current

  React.useEffect(() => {
    tabs.forEach((tab) => {
      const animatedValue = animatedValues[tab.key]
      if (animatedValue) {
        Animated.timing(animatedValue, {
          toValue: tab.key === activeTab ? 1 : 0,
          duration: 200,
          useNativeDriver: true,
        }).start()
      }
    })
  }, [activeTab, animatedValues, tabs])

  const handleTabPress = (tabKey: string) => {
    // Haptic feedback simulation (в реальном проекте использовать Haptics.impactAsync)
    onTabPress(tabKey)
  }

  return (
    <View style={[styles.container, { paddingBottom: safeAreaBottom }]}>
      <View style={styles.tabContainer}>
        {tabs.map((tab) => {
          const isActive = tab.key === activeTab
          const animatedValue = animatedValues[tab.key]

          if (!animatedValue) return null

          const iconScale = animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 1.2],
          })

          const labelOpacity = animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0.6, 1],
          })

          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.tab}
              onPress={() => handleTabPress(tab.key)}
              activeOpacity={0.7}
            >
              <View style={styles.tabContent}>
                {/* Icon */}
                <Animated.View 
                  style={[
                    styles.iconContainer,
                    { transform: [{ scale: iconScale }] }
                  ]}
                >
                  <Text style={[
                    styles.icon,
                    isActive && styles.activeIcon
                  ]}>
                    {tab.icon}
                  </Text>
                  
                  {/* Badge */}
                  {tab.badge && tab.badge > 0 && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>
                        {tab.badge > 99 ? '99+' : tab.badge.toString()}
                      </Text>
                    </View>
                  )}
                </Animated.View>

                {/* Label */}
                <Animated.Text 
                  style={[
                    styles.label,
                    isActive && styles.activeLabel,
                    { opacity: labelOpacity }
                  ]}
                  numberOfLines={1}
                >
                  {tab.label}
                </Animated.Text>

                {/* Active Indicator */}
                {isActive && (
                  <Animated.View 
                    style={[
                      styles.activeIndicator,
                      { opacity: animatedValue }
                    ]} 
                  />
                )}
              </View>
            </TouchableOpacity>
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingTop: 8,
    paddingBottom: 4,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    position: 'relative',
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 4,
  },
  icon: {
    fontSize: 24,
    color: '#666666',
  },
  activeIcon: {
    color: '#8B2439',
  },
  label: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
  },
  activeLabel: {
    color: '#8B2439',
    fontWeight: '600',
  },
  activeIndicator: {
    position: 'absolute',
    top: -6,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#8B2439',
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#E74C3C',
    borderRadius: 9999,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
})

export default BottomTabBar 