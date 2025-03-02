import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HistoryPage from '../../app/(tabs)/history';
import DetailHistory from '../../app/DetailHistory';

export type RootStackParamList = {
  History: undefined;
  DetailHistory: {
    item: {
      id: string;
      front_image_link: string;
      side_image_link?: string;
      actionDateTime: string;
      gender: string;
      faceshape: string;
      hairstyle_transferred_image_link?: string;
      agerange: string;
      dresscode: string;
      hairlength: string;
    };
  };
};

const Stack = createStackNavigator<RootStackParamList>();

const HistoryNavigation: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="History" component={HistoryPage} options={{ title: 'History' }} />
      <Stack.Screen name="DetailHistory" component={DetailHistory} options={{ title: 'Detail History' }} />

    </Stack.Navigator>
  );
};

export default HistoryNavigation;
