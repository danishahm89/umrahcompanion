import React from 'react';
import { ScrollView, View, type ScrollViewProps } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Header } from './Header';
import { useTheme } from '../theme/ThemeContext';

interface ScreenScaffoldProps extends ScrollViewProps {
  title: string;
  children: React.ReactNode;
  scroll?: boolean;
}

/** Every screen shares this shell: the sticky header, then scrollable body. */
export function ScreenScaffold({ title, children, scroll = true, contentContainerStyle, ...rest }: ScreenScaffoldProps) {
  const navigation = useNavigation();
  const { colors } = useTheme();

  const header = <Header title={title} canBack={navigation.canGoBack()} onBack={() => navigation.goBack()} />;

  if (!scroll) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        {header}
        <View style={{ flex: 1 }}>{children}</View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      {header}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={[{ flexGrow: 1 }, contentContainerStyle]} {...rest}>
        {children}
      </ScrollView>
    </View>
  );
}
