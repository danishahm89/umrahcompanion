import React, { useState } from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { navigationRef } from './navigationRef';
import { sectionForRoute, type RootStackParamList } from './types';
import { BottomTabBar } from './BottomTabBar';
import { useTheme } from '../theme/ThemeContext';

import { HomeScreen } from '../screens/HomeScreen';
import { GuideHubScreen } from '../screens/GuideHubScreen';
import { FirstTimeScreen } from '../screens/FirstTimeScreen';
import { DuasScreen } from '../screens/DuasScreen';
import { PackingScreen } from '../screens/PackingScreen';
import { VaccineScreen } from '../screens/VaccineScreen';
import { NewsScreen } from '../screens/NewsScreen';
import { NusukScreen } from '../screens/NusukScreen';
import { FaqScreen } from '../screens/FaqScreen';
import { PackagesScreen } from '../screens/PackagesScreen';
import { PackageDetailScreen } from '../screens/PackageDetailScreen';
import { CustomizeScreen } from '../screens/CustomizeScreen';
import { ServicesScreen } from '../screens/ServicesScreen';
import { MoreScreen } from '../screens/MoreScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { GalleryScreen } from '../screens/GalleryScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { colors } = useTheme();
  const [section, setSection] = useState(sectionForRoute('Home'));

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ flex: 1 }}>
        <NavigationContainer
          ref={navigationRef}
          onReady={() => setSection(sectionForRoute(navigationRef.getCurrentRoute()?.name))}
          onStateChange={() => setSection(sectionForRoute(navigationRef.getCurrentRoute()?.name))}
        >
          <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="GuideHub" component={GuideHubScreen} />
            <Stack.Screen name="FirstTime" component={FirstTimeScreen} />
            <Stack.Screen name="Duas" component={DuasScreen} />
            <Stack.Screen name="Packing" component={PackingScreen} />
            <Stack.Screen name="Vaccine" component={VaccineScreen} />
            <Stack.Screen name="News" component={NewsScreen} />
            <Stack.Screen name="Nusuk" component={NusukScreen} />
            <Stack.Screen name="Faq" component={FaqScreen} />
            <Stack.Screen name="Packages" component={PackagesScreen} />
            <Stack.Screen name="PackageDetail" component={PackageDetailScreen} />
            <Stack.Screen name="Customize" component={CustomizeScreen} />
            <Stack.Screen name="Services" component={ServicesScreen} />
            <Stack.Screen name="More" component={MoreScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="Gallery" component={GalleryScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
      <BottomTabBar active={section} />
    </View>
  );
}
