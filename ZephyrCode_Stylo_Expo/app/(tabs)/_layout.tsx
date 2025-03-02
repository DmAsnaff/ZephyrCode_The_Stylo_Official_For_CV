import { Tabs } from 'expo-router';
import React, {useState} from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import {useRouter} from 'expo-router';
import { Stack } from 'expo-router';
import FeedbackModal from '@/popupModals/FeedbackModal';
import axios from 'axios';
import axiosInstance from '@/constants/axiosInstance';
import { useAuthStore } from '../../store/useStore';


export default function TabLayout() {

  const email = useAuthStore((state) => state.email);

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  interface FeedbackData {
    userEmail: string;
    rating: number;
  }
  
 
  const handleCloseModal = () => {
    setModalVisible(false);
  };

const handleSubmitFeedback = (rating: number) => {
  // Replace with your actual backend API endpoint URL
  const apiUrl = '/feedback';

  // Example data to send to the backend
  const feedbackData = {
    rating: rating,
    email: email,
  };

  // Example of using Axios to send a POST request
  axiosInstance.post(apiUrl, feedbackData)
    .then(response => {
      console.log('Feedback submitted successfully:', response.data);
      // Handle success, e.g., show a success message to the user
      handleCloseModal(); // Close the modal after successful submission
    })
    .catch(error => {
      console.error('Error submitting feedback:', error);
      // Handle error, e.g., show an error message to the user
    });
};



  const colorScheme = useColorScheme();
  const router=useRouter();

  return (
    <>
    <FeedbackModal
isVisible={modalVisible}
onClose={handleCloseModal}
onSubmitFeedback={handleSubmitFeedback}
/>
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
    <StatusBar 
      style={colorScheme === 'dark' ? 'light' : 'light'} 
      backgroundColor={colorScheme === 'dark' ? '#FFF' : '#2C3E50'}
    />
    <Tabs
      screenOptions={{
        headerRight:()=>(
          <TouchableOpacity style={{flexDirection:'row',marginRight:22, gap:15}} >
          <MaterialIcons name="feedback" size={30} color="#9CA3AF"  onPress={() => setModalVisible(true)}/>
          <MaterialIcons name="help-outline" size={30} color="#9CA3AF" onPress={()=>router.push('../help1')} />

          </TouchableOpacity>
          
        ),
        
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerShown: true,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="forum"
        options={{
          title: 'Forum',
          headerShown: true,
          tabBarIcon: ({ color, focused }) => (
            //<MaterialCommunityIcons name="forum-outline" size={28} color="#007AFF" />
            <MaterialCommunityIcons name={focused ? 'forum-outline' : 'forum-outline'}  size={28} color={color} />
          ),
        }}
      />
  
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          headerShown:true,
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons name={focused ? 'history' : 'history'} size={28} color={color} />
            //<MaterialIcons name="history" size={24} color="black" />

          ),
        }}
      />
          <Tabs.Screen
        name="Profile"
        options={{
          title: 'Profile',
          headerShown: true,
          // headerStyle:{backgroundColor:'#2C3E50'},  headerTintColor: '#FFFFFF',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'person-outline' : 'person-outline'} color={color} />
          ),
        }}
      />
    </Tabs>
    {/* <Stack>
      <Stack.Screen name="temp"options={{ title:'temp',headerShown: true,   }}/>
    </Stack> */}

    </ThemeProvider>
    </>
  );
}
