import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, Redirect  } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { Inputtextname,Colors,Buttoncolor } from '@/constants/Colors';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuthStore } from '../store/useStore';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });


  const { token, restoreToken } = useAuthStore();
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadToken = async () => {
      await restoreToken();
      setIsAuthLoaded(true);
    };
    loadToken();
  }, []);

  useEffect(() => {
    if (loaded && isAuthLoaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded, isAuthLoaded]);

  // useEffect(() => {
  //   if (isAuthLoaded) {
  //     if (token === null) {
  //       router.push('/');
  //     } else {
  //       router.push('/(tabs)');
  //     }
  //   }
  // }, [isAuthLoaded, token]);


  if (!loaded || !isAuthLoaded) {
    return null;
  }



  // useEffect(() => {
  //   if (loaded) {
  //     SplashScreen.hideAsync();
  //   }
  // }, [loaded]);

  // if (!loaded) {
  //   return null;
  // }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <StatusBar 
        style={colorScheme === 'dark' ? 'light' : 'dark'} 
        backgroundColor={colorScheme === 'dark' ? '#2C3E50' : '#FFFFFF'}
      />
      <Stack>
      <Stack.Screen name="login"  options={{title: 'Login' ,headerShown: false, headerStyle:{backgroundColor:'#fff'} }}/>
      <Stack.Screen name="register" options={{title: 'Register' ,headerShown: false, headerStyle:{backgroundColor:'#fff'} }}/>
      <Stack.Screen name="index" options={{ title: 'Welcome',headerShown: false, headerStyle:{backgroundColor:'#fff'} }}/>
        <Stack.Screen name="(tabs)" options={{ headerShown: false}} />
        <Stack.Screen name="+not-found" />
        <Stack.Screen name="help1"options={{ title:'Help',headerShown: true, headerStyle:{backgroundColor:'#2C3E50'} ,  headerTintColor: '#FFFFFF' }}/>
        <Stack.Screen name="help_2"options={{ title:'Help',headerShown: true, headerStyle:{backgroundColor:'#2C3E50'},  headerTintColor: '#FFFFFF'  }}/>
        <Stack.Screen name="help_3"options={{ title:'Help',headerShown: true, headerStyle:{backgroundColor:'#2C3E50'},  headerTintColor: '#FFFFFF'  }}/>
        <Stack.Screen name="help_4"options={{ title:'Help',headerShown: true, headerStyle:{backgroundColor:'#2C3E50'},  headerTintColor: '#FFFFFF'  }}/>
        <Stack.Screen name="try_on"options={{ title:'TryOn',headerShown: true, headerStyle:{backgroundColor:'#2C3E50'},  headerTintColor: '#FFFFFF'  }}/>
        <Stack.Screen name="Preferred_page"options={{ title:'PREFERRED_HAIRSTYLE',headerShown: true, headerStyle:{backgroundColor:'#2C3E50'},  headerTintColor: '#FFFFFF'  }}/>
        <Stack.Screen name="edit_profile"options={{ title:'Profile',headerShown: true,   }}/>
        <Stack.Screen name="ForgotPasswordScreen" options={{title: 'ForgotPasswordScreen' ,headerShown: false, headerStyle:{backgroundColor:'#fff'} }}/>
        <Stack.Screen name="ResetPasswordScreen" options={{title: 'ResetPasswordScreen' ,headerShown: false, headerStyle:{backgroundColor:'#fff'} }}/>
        <Stack.Screen name="VerifyCodeScreen" options={{title: 'VerifyCodeScreen' ,headerShown: false, headerStyle:{backgroundColor:'#fff'} }}/>
        <Stack.Screen name="preferences" options={{title: 'preferences' ,headerShown: false, headerStyle:{backgroundColor:'#fff'} }}/>
        <Stack.Screen name="RecommendationsScreen" options={{title: 'RecommendationsScreen' ,headerShown: false, headerStyle:{backgroundColor:'#fff'} }}/>
        
      </Stack>
      {/* {isAuthLoaded && (
        token === null ? <Redirect href="/" /> : <Redirect href="/(tabs)" />
      )} */}
        {isAuthLoaded && token !== null && <Redirect href="/help1" />}
    </ThemeProvider>
  );
}
