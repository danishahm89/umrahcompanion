import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts as useArchivo, Archivo_400Regular, Archivo_500Medium, Archivo_600SemiBold, Archivo_800ExtraBold } from '@expo-google-fonts/archivo';
import { useFonts as useDevanagari, NotoSansDevanagari_400Regular, NotoSansDevanagari_600SemiBold, NotoSansDevanagari_700Bold } from '@expo-google-fonts/noto-sans-devanagari';
import { useFonts as useNastaliq, NotoNastaliqUrdu_400Regular, NotoNastaliqUrdu_700Bold } from '@expo-google-fonts/noto-nastaliq-urdu';
import { useFonts as useNaskh, NotoNaskhArabic_400Regular, NotoNaskhArabic_700Bold } from '@expo-google-fonts/noto-naskh-arabic';
import { useFonts as usePlayfair, PlayfairDisplay_700Bold, PlayfairDisplay_900Black } from '@expo-google-fonts/playfair-display';

import { ThemeProvider, useTheme } from './src/theme/ThemeContext';
import { LanguageProvider } from './src/i18n/LanguageContext';
import { DirectionProvider } from './src/direction/DirectionContext';
import { RootNavigator } from './src/navigation/RootNavigator';

const queryClient = new QueryClient();

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
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <LanguageProvider>
            <DirectionProvider>
              <AppInner />
            </DirectionProvider>
          </LanguageProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
