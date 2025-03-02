import { StyleSheet, Image,Text,TextInput, useColorScheme } from 'react-native';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Inputtextname,Colors,Buttoncolor } from '@/constants/Colors';
import { useThemeColor } from '@/hooks/useThemeColor';
import { TouchableOpacity } from 'react-native';
import {Ionicons} from "@expo/vector-icons"
import { useState } from 'react';
import Checkbox from 'expo-checkbox';
import Button from '@/components/buttons';
import ButtonSecondary from '@/components/buttonSecondary';
import { Link,Stack, useRouter } from 'expo-router';
// import { useUserContext } from '@/constants/UserContext'; // Import UserContext
import { useAuthStore } from '@/store/useStore'; 
import axios from 'axios'; 
import axiosInstance from '@/constants/axiosInstance';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(6, '').required('Required'),
});

export default function TabTwoScreen() {
  const router = useRouter();
  // const { login } = useUserContext(); // Use login function from UserContext
  const login = useAuthStore((state) => state.login); //im taking this from zustand not usecontext
  const textColor = useThemeColor({ light: '#11181C', dark: '#ECEDEE' }, 'text');
  const checkcolor = useThemeColor({ light: Buttoncolor.bblue, dark: Buttoncolor.bgreen }, 'text');
  
  const [isPasswordShown, setIsPasswordShown] = useState(true);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false); // State for success message

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: LoginSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const apiUrl = '/login';
      try {
        const response = await axiosInstance.post(apiUrl, values);
        console.log('Login successful:', response.data);
        // const { email, token } = response.data;
        // login(email, token); // Set user context with email and token
        const { email, token, userName } = response.data;
        login(token, email, userName);
        router.replace('/help1'); // Redirect to the dashboard upon successful login
      } catch (error: any) {
        console.error('Error logging in:', error);
        if (axios.isAxiosError(error)) {
          console.error('Axios Error:', error.response?.data ?? error.message);
          alert('Login failed. Please check your credentials and try again.');

        } else {
          console.error('Unknown Error:', error);
          alert('An unexpected error occurred. Please try again later.');

        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#2C3E50', dark: '#353636' }}
      headerTitle="Welcome back,"
      headerSubtitle="sign in to continue"
    >
      <ThemedView style={{ marginBottom: -7 }}>
        <Text style={{ color: textColor, fontSize: 16, fontWeight: '400', marginVertical: 8 }}>Email Address</Text>
        <ThemedView
          style={{
            width: '100%',
            height: 48,
            borderColor: Inputtextname.coolgray,
            borderWidth: 1,
            borderRadius: 8,
            alignItems: 'center',
            justifyContent: 'center',
            paddingLeft: 22,
          }}
        >
          <TextInput
            placeholder="Enter your Email address"
            placeholderTextColor={Inputtextname.coolgray}
            keyboardType="email-address"
            style={{ width: '100%', color: textColor }}
            value={formik.values.email}
            onChangeText={formik.handleChange('email')}
            onBlur={formik.handleBlur('email')}
          />
          {formik.touched.email && formik.errors.email && (
            <Text style={{ color: 'red' }}>{formik.errors.email}</Text>
          )}
        </ThemedView>
      </ThemedView>

      <ThemedView style={{ marginBottom: 1 }}>
        <Text style={{ color: textColor, fontSize: 16, fontWeight: '400', marginVertical: 8 }}>Password</Text>
        <ThemedView
          style={{
            width: '100%',
            height: 48,
            borderColor: Inputtextname.coolgray,
            borderWidth: 1,
            borderRadius: 8,
            alignItems: 'center',
            justifyContent: 'center',
            paddingLeft: 22,
          }}
        >
          <TextInput
            placeholder="Enter password"
            placeholderTextColor={Inputtextname.coolgray}
            secureTextEntry={isPasswordShown}
            style={{ width: '100%', color: textColor }}
            value={formik.values.password}
            onChangeText={formik.handleChange('password')}
            onBlur={formik.handleBlur('password')}
          />
          {formik.touched.password && formik.errors.password && (
            <Text style={{ color: 'red' }}>{formik.errors.password}</Text>
          )}
          <TouchableOpacity
            onPress={() => setIsPasswordShown(!isPasswordShown)}
            style={{ right: 12, position: 'absolute' }}
          >
            {isPasswordShown ? (
              <Ionicons name="eye-off" size={24} color={textColor} />
            ) : (
              <Ionicons name="eye" size={24} color={textColor} />
            )}
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>

      <ThemedView style={{ marginBottom: 1 }}>
       <TouchableOpacity onPress={()=>router.push('/ForgotPasswordScreen')}>
        <Text
          style={{
            color: textColor,
            fontSize: 16,
            fontWeight: 600,
            marginVertical: 1,
            textAlign: 'right',
            paddingRight: 8,
          }}
        >
          Forgot Password?
        </Text>
        </TouchableOpacity>
      </ThemedView>

      <ThemedView style={{alignItems:'center'}}>
         <Button title="LOGIN" onPress={formik.handleSubmit as any} filled style={{ marginTop: 1, marginBottom: 4, alignContent:'center' }} />
      </ThemedView>
      <ThemedView style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 22 }}>
        <Text style={{ fontSize: 16, color: textColor }}>Don't have an Account?</Text>
        <Link style={{ color: "#16A085", fontSize: 16, fontWeight: '800', textDecorationLine: 'underline' }} href="/register">
          {' '}
          SIGN UP
        </Link>
      </ThemedView>
      {showSuccessMessage && (
            <Text style={{ color: '#16A085', fontSize: 16, textAlign: 'center', marginTop: 10 }}>
              Registration successful! Redirecting to login...
            </Text>
          )}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});