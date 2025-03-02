import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import AntDesign from '@expo/vector-icons/AntDesign';
import {useRouter} from 'expo-router';
import { RouteProp } from '@react-navigation/native';
import { PreferencesStackParamList } from '../components/navigation/preferencesnavigation';
import {  useRoute } from '@react-navigation/native';
import axiosInstance from '@/constants/axiosInstance';
import { useAuthStore } from '../store/useStore';
import { usefrontImage } from '../store/useStore'; // Import the Zustand store

type PreferencesRouteProp = RouteProp<PreferencesStackParamList, 'preferences'>;

// interface PreferencesPageProps {
//   route: PreferencesRouteProp;
// }
interface DropdownItem {
  label: string;
  value: string;
}

const ageRangeData: DropdownItem[] = [
  { label: 'Teen', value: 'teen' },
  { label: 'Adult', value: 'adult' },
  { label: 'Aged', value: 'aged' },
];

const dressCodeData: DropdownItem[] = [
  { label: 'Party', value: 'party' },
  { label: 'Casual', value: 'casual' },
  { label: 'Formal', value: 'formal' },
];

const hairLengthData: DropdownItem[] = [
  { label: 'Short', value: 'short' },
  { label: 'Medium', value: 'medium' },
  { label: 'Long', value: 'long' },
];

// const preferences: React.FC<PreferencesPageProps> = ({ route }) => {
  const preferences: React.FC = () => {
    const route = useRoute<PreferencesRouteProp>();
    const { frontImage, sideImage, selectedGender } = route.params || {};
    const email = useAuthStore((state) => state.email);
    const [loading, setLoading] = useState(false);
    const setFrontImage = usefrontImage((state) => state.setFrontImage); // Zustand setter

  // const { frontImage, sideImage, selectedGender } = route.params;
  const [ageRange, setAgeRange] = useState<string | null>(null);
  const [dressCode, setDressCode] = useState<string | null>(null);
  const [hairLength, setHairLength] = useState<string | null>(null);
  const [openAgeRange, setOpenAgeRange] = useState(false);
  const [openDressCode, setOpenDressCode] = useState(false);
  const [openHairLength, setOpenHairLength] = useState(false);
  const [itemsAgeRange, setItemsAgeRange] = useState(ageRangeData);
  const [itemsDressCode, setItemsDressCode] = useState(dressCodeData);
  const [itemsHairLength, setItemsHairLength] = useState(hairLengthData);

  const router=useRouter();

  const handleRecommend = async () => {
    if (!ageRange || !dressCode || !hairLength) {
      alert('Please select all preferences!');
      return;
    }
  
    if (!email || !selectedGender || !frontImage || !sideImage) {
      alert('Missing required data. Please try again.');
      return;
    }
      // Save the frontImage to Zustand store
      if (frontImage) {
        setFrontImage(frontImage); // Store the frontImage in Zustand
      }
      
    setLoading(true); // Set loading only once at the start
  
    const formData = new FormData();
    formData.append('email', email);
    formData.append('gender', selectedGender);
    formData.append('ageRange', ageRange);
    formData.append('dressCode', dressCode);
    formData.append('hairLength', hairLength);
  
    // Append the images with correct field names
    formData.append('front_face', {
      uri: frontImage,
      type: 'image/jpeg',
      name: 'front_face.jpg',
    } as any);
  
    formData.append('side_face', {
      uri: sideImage,
      type: 'image/jpeg',
      name: 'side_face.jpg',
    } as any);
  
    try {
      console.log('Sending data:', formData);
  
      const response = await axiosInstance.post('/analyze-face', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      console.log('Response data from backend:', response.data);
  
      // Structure the data before passing
      const recommendationsData = {
        faceShape: response.data.faceShape,
        recommendations: response.data.recommendations || [],
      };
  
      // Pass the structured data
      router.push({
        pathname: '/RecommendationsScreen',
        params: {
          recommendations: JSON.stringify(recommendationsData) // Stringify the data
          // frontImage: frontImage // Pass frontImage as a parameter

        },
      });
   
    } catch (error) {
      console.error('Error sending preferences:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <View style={styles.container}>
      <StatusBar barStyle="default" />
      <View style={[styles.dropdownContainer, { zIndex: 3000, elevation: 1 }]}>
        <Text style={styles.label}>Age Range</Text>
        <DropDownPicker
          open={openAgeRange}
          value={ageRange}
          items={itemsAgeRange}
          setOpen={setOpenAgeRange}
          setValue={setAgeRange}
          setItems={setItemsAgeRange}
          containerStyle={{ height: 40 }}
          style={styles.dropdown}
          dropDownContainerStyle={{ backgroundColor: '#fafafa' }}
        />
      </View>
      <View style={[styles.dropdownContainer, { zIndex: 2000, elevation: 2 }]}>
        <Text style={styles.label}>Dress Code</Text>
        <DropDownPicker
          open={openDressCode}
          value={dressCode}
          items={itemsDressCode}
          setOpen={setOpenDressCode}
          setValue={setDressCode}
          setItems={setItemsDressCode}
          containerStyle={{ height: 40 }}
          style={styles.dropdown}
          dropDownContainerStyle={{ backgroundColor: '#fafafa' }}
        />
      </View>
      <View style={[styles.dropdownContainer, { zIndex: 1000, elevation: 3 }]}>
        <Text style={styles.label}>Hair Length</Text>
        <DropDownPicker
          open={openHairLength}
          value={hairLength}
          items={itemsHairLength}
          setOpen={setOpenHairLength}
          setValue={setHairLength}
          setItems={setItemsHairLength}
          containerStyle={{ height: 40 }}
          style={styles.dropdown}
          dropDownContainerStyle={{ backgroundColor: '#fafafa' }}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleRecommend} disabled={loading}>
      <Text style={styles.buttonText}>{loading ? 'Please wait...' : 'Recommend'}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default preferences;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
    paddingTop:40
  },
  dropdownContainer: {
    marginBottom: 35,
    position: 'relative', // Ensure stacking context
  },
  label: {
    marginBottom: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  dropdown: {
    backgroundColor: '#fafafa',
    borderColor: '#16A085',
    borderWidth: 1,
    borderRadius: 8,
    height: 40,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#16A085',
    paddingVertical: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 40,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});


// mockData.


export const sampleImageLinks = [
  'https://firebasestorage.googleapis.com/v0/b/zephyrcode.appspot.com/o/1.jpg?alt=media&token=7c1b1803-26b4-4035-9b2a-e53605987584',
  'https://firebasestorage.googleapis.com/v0/b/zephyrcode.appspot.com/o/2.jpg?alt=media&token=b462c590-1eed-4658-9f4a-20e8aecaaf68',
  'https://firebasestorage.googleapis.com/v0/b/zephyrcode.appspot.com/o/3.jpg?alt=media&token=00c90c08-764c-4754-a6fd-d42f298ad976',
  'https://firebasestorage.googleapis.com/v0/b/zephyrcode.appspot.com/o/4.jpg?alt=media&token=e4362494-433d-4424-9985-08750826d914',
  'https://firebasestorage.googleapis.com/v0/b/zephyrcode.appspot.com/o/5.jpg?alt=media&token=b402d24b-8e9a-4fc0-bd55-1d5cd3a19a5d',
];

export const mockRecommendations = Array.from({ length: 5 }).map((_, index) => ({
  id: index + 1,
  imageLink: sampleImageLinks[index % sampleImageLinks.length],
  how_to_achieve: `Step ${index + 1}: Apply styling cream, Step ${index + 2}: Blow-dry with a round brush`,
  Products_to_achieve: `Product ${index + 1}, Product ${index + 2}`,
  faceShape: 'Round', // Replace 'Round' with the actual value of faceShape
}));
