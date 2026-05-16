import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { colors } from './src/constants/theme';
import { useNotifications } from './src/hooks/useNotifications';
import { useSettings } from './src/hooks/useSettings';
import { ChartsScreen } from './src/screens/ChartsScreen';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';

const Tab = createBottomTabNavigator();
const queryClient = new QueryClient();

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  const icons: Record<string, string> = {
    Dashboard: '🌿',
    Charts: '📈',
    Settings: '⚙️',
  };
  return <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.4 }}>{icons[name]}</Text>;
}

function AppInner() {
  const { settings, saveSettings, loaded } = useSettings();
  const { expoPushToken } = useNotifications();

  if (!loaded) return null;

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
