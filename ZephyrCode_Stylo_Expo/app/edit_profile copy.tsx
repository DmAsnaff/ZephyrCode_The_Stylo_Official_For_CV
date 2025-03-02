import React, { useState } from 'react';
import { View, SafeAreaView, StyleSheet, Image, TouchableOpacity, TextInput, Text, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Button from '@/components/buttons';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import {useRouter} from 'expo-router';

const EditProfile: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [dob, setDob] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const router = useRouter();


  const handleSubmit = () => {
    
    const userData = { fullName, username, email, address, dob, phoneNumber };
   
    // router.push('profile_screen', userData);
    router.push('/(tabs)/Profile');

  };

  const [showOptions, setShowOptions] = useState(false);
  const [picture, setPicture] = useState<string | null>(null);
  const navigation = useNavigation();

  const handleCameraIconPress = () => {
    setShowOptions(!showOptions);
  };

  const pickFromGallery = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("You need to give permission to access the gallery");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setPicture(result.assets[0].uri);
    }
  };

  const pickFromCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("You need to give permission to access the camera");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setPicture(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileContainer}>
        <TouchableOpacity style={styles.cameraIcon} onPress={handleCameraIconPress}>
          <FontAwesome name="camera" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        {showOptions && (
          <View style={styles.optionsContainer}>
            <TouchableOpacity style={styles.option} onPress={pickFromCamera}>
              <View style={styles.optionContent}>
                <FontAwesome name="camera" size={20} color="#000" />
                <Text style={styles.optionText}> Camera</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.option} onPress={pickFromGallery}>
              <View style={styles.optionContent}>
                <FontAwesome name="upload" size={20} color="#000" />
                <Text style={styles.optionText}>Upload</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.option} onPress={() => setShowOptions(false)}>
              <View style={styles.optionContent}>
                <FontAwesome name="times" size={20} color="#000" />
                <Text style={styles.optionText}>Cancel</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
        <View style={{paddingBottom:35}}>
        <Image
          source={picture ? { uri: picture } : require('@/assets/images/profile.png')}
          style={styles.profilePic}
          accessibilityLabel="Profile Picture"
        />
        </View>

        <View style={styles.action}>
          <FontAwesome name="user-o" color="#05375a" size={20} />
          <TextInput
            placeholder="Full Name"
            placeholderTextColor="#666666"
            autoCorrect={false}
            style={styles.textInput}
          />
        </View>
        <View style={styles.action}>
          <FontAwesome name="user-o" color="#05375a" size={20} />
          <TextInput
            placeholder="Username"
            placeholderTextColor="#666666"
            autoCorrect={false}
            style={styles.textInput}
          />
        </View>
        <View style={styles.action}>
          <FontAwesome name="envelope-o" color="#05375a" size={20} />
          <TextInput
            placeholder="Email"
            placeholderTextColor="#666666"
            autoCorrect={false}
            keyboardType="email-address"
            style={styles.textInput}
          />
        </View>
        <View style={styles.action}>
          <FontAwesome name="address-card-o" color="#05375a" size={20} />
          <TextInput
            placeholder="Address"
            placeholderTextColor="#666666"
            autoCorrect={false}
            style={styles.textInput}
          />
        </View>
        <View style={styles.action}>
          <FontAwesome name="calendar" color="#05375a" size={20} />
          <TextInput
            placeholder="Date of Birth"
            placeholderTextColor="#666666"
            autoCorrect={false}
            style={styles.textInput}
          />
        </View>
        <View style={styles.action}>
          <FontAwesome name="phone" color="#05375a" size={20} />
          <TextInput
            placeholder="Phone Number"
            placeholderTextColor="#666666"
            autoCorrect={false}
            keyboardType="phone-pad"
            style={styles.textInput}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
        </View>

        
      </View>
      <View style={{alignItems: 'center'}}>
      <Button
        title="Submit"
        onPress={() => router.push('/(tabs)/Profile')}
        filled
        style={styles.submitButton}
      />

      </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileContainer: {
    alignItems: 'center',
    paddingTop: 20,
      paddingHorizontal: 30,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cameraIcon: {
    position: 'absolute',
    top: '37%',
    left: '65%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 20,
    padding: 10,
    transform: [{ translateX: -6 }, { translateY: -5 }],
  },
  action: {
    flexDirection: 'row',
    marginTop: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: -1,
    paddingLeft: 10,
    color: '#05375a',
  },
  submitButton: {
    marginTop: 70,
    marginBottom: 4,
    
  },
  optionsContainer: {
    position: 'absolute',
    top: '45%',
    left: '45%',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    zIndex: 1,
  },
  option: {
    paddingVertical: 10,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    marginLeft: 10,
  },
});

export default EditProfile;


