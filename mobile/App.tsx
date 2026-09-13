import React, { useEffect } from 'react';
import { ActivityIndicator, AppState, type AppStateStatus, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider, focusManager } from '@tanstack/react-query';
import { useFonts as useArchivo, Archivo_400Regular, Archivo_500Medium, Archivo_600SemiBold, Archivo_800ExtraBold } from '@expo-google-fonts/archivo';
import { useFonts as useDevanagari, NotoSansDevanagari_400Regular, NotoSansDevanagari_600SemiBold, NotoSansDevanagari_700Bold } from '@expo-google-fonts/noto-sans-devanagari';
import { useFonts as useNastaliq, NotoNastaliqUrdu_400Regular, NotoNastaliqUrdu_700Bold } from '@expo-google-fonts/noto-nastaliq-urdu';
import { useFonts as useNaskh, NotoNaskhArabic_400Regular, NotoNaskhArabic_700Bold } from '@expo-google-fonts/noto-naskh-arabic';
import { useFonts as usePlayfair, PlayfairDisplay_700Bold, PlayfairDisplay_900Black } from '@expo-google-fonts/playfair-display';

import { ThemeProvider, useTheme } from './src/theme/ThemeContext';
import { LanguageProvider } from './src/i18n/LanguageContext';
import { DirectionProvider } from './src/direction/DirectionContext';
import { LocationProvider } from './src/location/LocationContext';
import { RootNavigator } from './src/navigation/RootNavigator';

const queryClient = new QueryClient();

// React Query's window-focus refetching needs manual wiring on React Native (there's no
// browser focus event) — without this, a screen that already loaded once never refetches,
// so admin edits don't appear until the app is fully restarted.
function onAppStateChange(status: AppStateStatus) {
  focusManager.setFocused(status === 'active');
}

function LoadingScreen() {
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg }}>
      <ActivityIndicator color={colors.accent} />
    </View>
  );
}

function AppInner() {
  const [archivoLoaded] = useArchivo({ Archivo_400Regular, Archivo_500Medium, Archivo_600SemiBold, Archivo_800ExtraBold });
  const [devanagariLoaded] = useDevanagari({ NotoSansDevanagari_400Regular, NotoSansDevanagari_600SemiBold, NotoSansDevanagari_700Bold });
  const [nastaliqLoaded] = useNastaliq({ NotoNastaliqUrdu_400Regular, NotoNastaliqUrdu_700Bold });
  const [naskhLoaded] = useNaskh({ NotoNaskhArabic_400Regular, NotoNaskhArabic_700Bold });
  const [playfairLoaded] = usePlayfair({ PlayfairDisplay_700Bold, PlayfairDisplay_900Black });

  const fontsReady = archivoLoaded && devanagariLoaded && nastaliqLoaded && naskhLoaded && playfairLoaded;

  if (!fontsReady) return <LoadingScreen />;

  return (
    <>
      <StatusBar style="auto" />
      <RootNavigator />
    </>
  );
}

export default function App() {
  useEffect(() => {
    const subscription = AppState.addEventListener('change', onAppStateChange);
    return () => subscription.remove();
  }, []);

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <LanguageProvider>
            <DirectionProvider>
              <LocationProvider>
                <AppInner />
              </LocationProvider>
            </DirectionProvider>
          </LanguageProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
