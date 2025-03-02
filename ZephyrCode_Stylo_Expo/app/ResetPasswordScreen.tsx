import React from 'react';
import { TextInput, Alert } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import axiosInstance from '@/constants/axiosInstance';
import Button from '@/components/buttons';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { AxiosError } from 'axios';
import { useRouter,useLocalSearchParams } from 'expo-router';

const ResetPasswordScreen = ({ route }: any) => {
  const { email } = useLocalSearchParams(); // Extract query parameters
  const router = useRouter();

  const validationSchema = yup.object().shape({
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  });

  const handleResetPassword = async (values: { password: string }) => {
    try {
      await axiosInstance.post('/resetPassword', { email, password: values.password });
      Alert.alert('Success', 'Password reset successfully.');
      router.replace('/login'); // Redirect to login page
    } catch (err: unknown) {
      if (err instanceof AxiosError && err.response) {
        Alert.alert('Error', err.response.data.message || 'Failed to reset password.');
      } else {
        Alert.alert('Error', 'An unexpected error occurred.');
      }
    }
  };

  return (
    <Formik
      initialValues={{ password: '' }}
      validationSchema={validationSchema}
      onSubmit={handleResetPassword}
    >
      {({ values, handleChange, handleBlur, handleSubmit }) => (
        <ParallaxScrollView
          headerBackgroundColor={{ light: '#2C3E50', dark: '#353636' }}
          headerTitle="Reset Password"
          headerSubtitle="Enter your new password"
        >
          <>
            <TextInput
              placeholder="Enter new password"
              secureTextEntry
              value={values.password}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
            />
            <Button title="Reset Password" onPress={handleSubmit} />
          </>
        </ParallaxScrollView>
      )}
    </Formik>
  );
};

export default ResetPasswordScreen;
