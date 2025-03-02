import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../../app/(tabs)/index';
import preferences from '../../app/preferences';

export type PreferencesStackParamList = {
HomeScreen: undefined;
preferences: {
    frontImage: string | null;
    sideImage: string | null;
    selectedGender: 'male' | 'female' | null;
  };
};

const Stack = createStackNavigator<PreferencesStackParamList>();

const PreferencesNavigation: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ title: 'Home' }} />
      <Stack.Screen name="preferences" component={preferences} options={{ title: 'Preferences' }} />
    </Stack.Navigator>
  );
};

export default PreferencesNavigation;
