import React from 'react';
import { TextInput, Alert } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import axiosInstance from '@/constants/axiosInstance';
import Button from '@/components/buttons';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { AxiosError } from 'axios';
import { useRouter } from 'expo-router';

const ForgotPasswordScreen = () => {
  const router = useRouter();

  const validationSchema = yup.object().shape({
    email: yup.string().email('Invalid email').required('Email is required'),
  });

  const handleSendCode = async (values: { email: string }) => {
    try {
      await axiosInstance.post('/forgotPassword', values);
      Alert.alert('Success', 'Verification code sent to your email.');
      router.push(`/VerifyCodeScreen?email=${encodeURIComponent(values.email)}`);
    } catch (err: unknown) {
      if (err instanceof AxiosError && err.response) {
        Alert.alert('Error', err.response.data.message || 'Failed to send verification code.');
      } else {
        Alert.alert('Error', 'An unexpected error occurred.');
      }
    }
  };

  return (
    <Formik
      initialValues={{ email: '' }}
      validationSchema={validationSchema}
      onSubmit={handleSendCode}
    >
      {({ values, handleChange, handleBlur, handleSubmit }) => (
        <ParallaxScrollView
          headerBackgroundColor={{ light: '#2C3E50', dark: '#353636' }}
          headerTitle="Forgot Password?"
          headerSubtitle="Reset your password"
        >
          <>
            <TextInput
              placeholder="Enter your email"
              value={values.email}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
            />
            <Button title="Send Code" onPress={handleSubmit} />
          </>
        </ParallaxScrollView>
      )}
    </Formik>
  );
};

export default ForgotPasswordScreen;
