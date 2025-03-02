import React from 'react';
import { TextInput, Alert } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import axiosInstance from '@/constants/axiosInstance';
import Button from '@/components/buttons';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { AxiosError } from 'axios';
import { useNavigation } from '@react-navigation/native';
import { useRouter, useLocalSearchParams } from 'expo-router';


const VerifyCodeScreen = ({ navigation, route }: any) => {
    const { email } = useLocalSearchParams(); // Extract query parameters
    const router = useRouter();

    const emailString = Array.isArray(email) ? email[0] : email;


  const validationSchema = yup.object().shape({
    code: yup.string().required('Verification code is required'),
  });

  const handleVerifyCode = async (values: { code: string }) => {
    try {
      await axiosInstance.post('/verifyCode', { email, code: values.code });
      Alert.alert('Success', 'Code verified.');
      router.push(`/ResetPasswordScreen?email=${encodeURIComponent(emailString)}`);
    } catch (err: unknown) {
      if (err instanceof AxiosError && err.response) {
        Alert.alert('Error', err.response.data.message || 'Invalid verification code.');
      } else {
        Alert.alert('Error', 'An unexpected error occurred.');
      }
    }
  };

  return (
    <Formik
      initialValues={{ code: '' }}
      validationSchema={validationSchema}
      onSubmit={handleVerifyCode}
    >
      {({ values, handleChange, handleBlur, handleSubmit }) => (
        <ParallaxScrollView
          headerBackgroundColor={{ light: '#2C3E50', dark: '#353636' }}
          headerTitle="Verify Code"
          headerSubtitle="Enter the code sent to your email"
        >
          <>
            <TextInput
              placeholder="Enter the verification code"
              value={values.code}
              onChangeText={handleChange('code')}
              onBlur={handleBlur('code')}
            />
            <Button title="Verify Code" onPress={handleSubmit} />
          </>
        </ParallaxScrollView>
      )}
    </Formik>
  );
};

export default VerifyCodeScreen;
