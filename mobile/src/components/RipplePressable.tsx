import React, { useRef } from 'react';
import { Animated, Pressable, PressableProps, StyleSheet, View } from 'react-native';

interface RipplePressableProps extends PressableProps {
  children: React.ReactNode;
  rippleColor?: string;
}

export function RipplePressable({ children, style, rippleColor = 'rgba(0,0,0,0.08)', onPress, ...rest }: RipplePressableProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 200,
      friction: 8,
    }).start();
  };

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }]}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        style={style}
        android_ripple={{ color: rippleColor }}
        {...rest}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}
