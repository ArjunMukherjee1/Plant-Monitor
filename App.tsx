import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PlantPicker } from './src/components/PlantPicker';
import { colors, fontSize, spacing } from './src/constants/theme';
import { Plant } from './src/data/plants';
import { useNotifications } from './src/hooks/useNotifications';
import { useSettings } from './src/hooks/useSettings';
import { ChartsScreen } from './src/screens/ChartsScreen';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { PlantScreen } from './src/screens/PlantScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';

const Tab = createBottomTabNavigator();
const queryClient = new QueryClient();

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  const icons: Record<string, string> = {
    Dashboard: '🌿',
    Charts: '📈',
    Plant: '🌱',
    Settings: '⚙️',
  };
  return <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.4 }}>{icons[name]}</Text>;
}

function AppInner() {
  const { settings, saveSettings, loaded } = useSettings();
  const { expoPushToken } = useNotifications();

  if (!loaded) return null;

  // Force plant selection before anything else
  if (!settings.plantTypeId) {
    const handlePlantSelect = (plant: Plant) => {
      saveSettings({
        plantTypeId: plant.id,
        optimalMoistureMin: plant.optimalMoistureMin,
        optimalMoistureMax: plant.optimalMoistureMax,
        optimalTempMin: plant.optimalTempMin,
        optimalTempMax: plant.optimalTempMax,
      });
    };
    return (
      <>
        <StatusBar style="light" />
        <View style={onboardingStyles.bg}>
          <Text style={onboardingStyles.emoji}>🌱</Text>
          <Text style={onboardingStyles.title}>What are you growing?</Text>
          <Text style={onboardingStyles.subtitle}>Pick your plant to get personalised recommendations</Text>
        </View>
        <PlantPicker visible dismissable={false} onSelect={handlePlantSelect} onClose={() => {}} />
      </>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused }) => <TabIcon name={route.name} focused={focused} />,
          tabBarActiveTintColor: colors.good,
          tabBarInactiveTintColor: colors.textFaint,
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
          },
          headerStyle: { backgroundColor: colors.bg },
          headerTintColor: colors.text,
          headerShadowVisible: false,
        })}
      >
        <Tab.Screen name="Dashboard">
          {() => <DashboardScreen settings={settings} />}
        </Tab.Screen>
        <Tab.Screen name="Charts">
          {() => <ChartsScreen settings={settings} />}
        </Tab.Screen>
        <Tab.Screen name="Plant">
          {() => <PlantScreen settings={settings} onSave={saveSettings} />}
        </Tab.Screen>
        <Tab.Screen name="Settings">
          {() => (
            <SettingsScreen
              settings={settings}
              onSave={saveSettings}
              expoPushToken={expoPushToken}
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </>
  );
}

const onboardingStyles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  emoji: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: fontSize.xxl,
    color: colors.text,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default function App() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <AppInner />
        </NavigationContainer>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
