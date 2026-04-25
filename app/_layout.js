import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../constants/theme';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: Colors.deepTeal,
          },
          headerTintColor: Colors.white,
          headerTitleStyle: {
            fontWeight: '700',
            fontSize: 20,
            color: Colors.white,
          },
          headerShadowVisible: true,
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: 'CallShield',
            headerTitle: 'CallShield',
          }}
        />
        <Stack.Screen
          name="data"
          options={{
            title: 'Data',
            headerTitle: 'Call History',
          }}
        />
        <Stack.Screen
          name="permissions"
          options={{
            title: 'Permissions',
            headerTitle: 'App Permissions',
          }}
        />
      </Stack>
    </>
  );
}