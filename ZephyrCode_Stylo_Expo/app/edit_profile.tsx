import React, { useEffect, useState } from 'react';
import { View, SafeAreaView, StyleSheet, Alert, Image, TouchableOpacity } from 'react-native';
import { TextInput, Title } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../store/useStore';
import axiosInstance from '@/constants/axiosInstance';
import { Formik } from 'formik';
import * as Yup from 'yup';
import * as ImagePicker from 'expo-image-picker';
import Button from '@/components/buttons';

const EditProfile: React.FC = () => {
  const router = useRouter();
  const email = useAuthStore((state) => state.email);
  const [showOptions, setShowOptions] = useState(false);
  const [picture, setPicture] = useState<string | null>(null);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [initialValues, setInitialValues] = useState({
    fullName: '',
    userName: '',
    address: '',
    phoneNumber: '',
  });

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axiosInstance.post('/userProfile', { email });
        setInitialValues({
          fullName: response.data.fullName || '',
          userName: response.data.userName || '',
          address: response.data.address || '',
          phoneNumber: response.data.phoneNumber || '',
        });
        // setProfilePicture(response.data.profilePicture || null);
      } catch (error) {
        // console.error('Error fetching user details:', error);
        // Alert.alert('Error', 'Failed to load user details.');
      }
    };

    fetchUserDetails();
  }, [email]);

  const handleUpdateProfile = async (values: typeof initialValues) => {
    try {
      // await axiosInstance.put('/updateUserProfile', { email, ...values, profilePicture });
      const response = await axiosInstance.post('/updateUserProfile', { email, ...values });

      if (response.status === 200) {
        Alert.alert('Success', response.data.message);
        router.replace('/(tabs)/Profile');
      } else {
        Alert.alert('Error', 'Failed to update profile. Please try again.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setProfilePicture(uri);
    }
  };

  const validationSchema = Yup.object({
    fullName: Yup.string().required('Full name is required'),
    userName: Yup.string().required('User name is required'),
    address: Yup.string().required('Address is required'),
    phoneNumber: Yup.string().required('Phone number is required'),
  });

  return (
    <SafeAreaView style={styles.container}>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleUpdateProfile}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View style={styles.form}>
            <View style={styles.profileSection}>
              <TouchableOpacity onPress={pickImage}>
                <Image
                  source={profilePicture ? { uri: profilePicture } : require('@/assets/images/profile.png')}
                  style={styles.profilePic}
                  accessibilityLabel="Profile Picture"
                />
              </TouchableOpacity>
              
              <Title style={styles.emailText}>{email}</Title>
            </View>

            <TextInput
              label="Full Name"
              value={values.fullName}
              onChangeText={handleChange('fullName')}
              onBlur={handleBlur('fullName')}
              style={styles.input}
              error={touched.fullName && !!errors.fullName}
            />
            <TextInput
              label="User Name"
              value={values.userName}
              onChangeText={handleChange('userName')}
              onBlur={handleBlur('userName')}
              style={styles.input}
              error={touched.userName && !!errors.userName}
            />
            <TextInput
              label="Address"
              value={values.address}
              onChangeText={handleChange('address')}
              onBlur={handleBlur('address')}
              style={styles.input}
              error={touched.address && !!errors.address}
            />
            <TextInput
              label="Phone Number"
              value={values.phoneNumber}
              onChangeText={handleChange('phoneNumber')}
              onBlur={handleBlur('phoneNumber')}
              style={styles.input}
              keyboardType="phone-pad"
              error={touched.phoneNumber && !!errors.phoneNumber}
            />
      <Button
        title="Submit"
        onPress={() => {
          handleSubmit(); // Call handleSubmit
          // router.push('/(tabs)/Profile'); // Navigate after submission
        }}
        filled
        style={styles.button}
      />
          </View>
        )}
      </Formik>
    </SafeAreaView>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  form: {
    flex: 0,
    justifyContent: 'center',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  emailText: {
    fontSize: 18,
    color: '#2C3E50',
  },
  input: {
    marginBottom: 15,
  },
  submitButton: {
    marginTop: 70,
    marginBottom: 4,
  },
  button: {
    marginTop: 20,
    borderColor: '#2C3E50',
    backgroundColor: '#2C3E50',
  },
});
