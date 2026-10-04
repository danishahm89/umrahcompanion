import React, { useEffect, useRef } from 'react';
import { ScrollView, View, Animated, Platform, ScrollViewProps } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Header } from './Header';
import { useTheme } from '../theme/ThemeContext';

interface ScreenScaffoldProps extends ScrollViewProps {
  title: string;
  children: React.ReactNode;
  scroll?: boolean;
}

export function ScreenScaffold({ title, children, scroll = true, contentContainerStyle, ...rest }: ScreenScaffoldProps) {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(18)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 320, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 60, friction: 10, useNativeDriver: true }),
    ]).start();
  }, []);

  const header = <Header title={title} canBack={navigation.canGoBack()} onBack={() => navigation.goBack()} />;

  if (!scroll) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        {header}
        <Animated.View style={{ flex: 1, opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          {children}
        </Animated.View>
      </View>
    );
  }
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      {header}
      <Animated.View style={{ flex: 1, opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={[{ flexGrow: 1 }, contentContainerStyle]}
          {...rest}
        >
          {children}
        </ScrollView>
      </Animated.View>
    </View>
  );
}
