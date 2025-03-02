import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Button from '@/components/buttons';
import ButtonSecondary from '@/components/buttonSecondary';
import { useRouter } from 'expo-router';

const WelcomeScreen: React.FC = () => {
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.logoContainer}>
        <Image
          source={require('@/assets/images/the_Stylo_Icon.png')}
          style={styles.logo}
          accessibilityLabel="The Stylo Logo"
        />
      </ThemedView>

      <Button
        title="LOGIN"
        onPress={() => router.push('/login')}
        filled
        style={{
          marginTop: 18,
          marginBottom: 4,
        }}>

        </Button>

      <ButtonSecondary
        title="SIGN UP"
        onPress={() => router.push('/register')}
        filled
        style={{
          marginTop: 18,
          marginBottom: 4,
        }}
      >

      </ButtonSecondary>

      <ThemedView style={styles.footer}>
        <ThemedText style={styles.footerText}>
          Powered by{' '}
          <ThemedText style={styles.footerTextBold}>ZephyrCode</ThemedText>
        </ThemedText>

        <Image
          source={require('@/assets/images/zephyrcode_icon.png')}
          style={styles.footerLogo}
          resizeMode="contain"
          accessibilityLabel="ZephyrCode Logo"
        />
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 50,
    justifyContent: 'center',
    marginRight: 60,
  },
  logo: {
    width: 300,
    height: 300,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    color: '#7F8C8D',
    fontSize: 15,
    marginLeft: 100,
  },
  footerTextBold: {
    fontWeight: 'bold',
    color: '#2F4F4F',
  },
  footerLogo: {
    width: 100,
    height: 190,
    aspectRatio: 2,
    marginRight: 15,
  },
});

export default WelcomeScreen;

