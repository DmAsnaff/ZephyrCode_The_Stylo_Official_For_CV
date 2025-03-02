import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal, TouchableWithoutFeedback,Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { usefrontImage } from '../store/useStore';
import axiosInstance from '@/constants/axiosInstance';
import { useAuthStore } from '../store/useStore'; // Zustand store for managing global state


const TryOn: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { email } = useAuthStore();

  const [showAlert, setShowAlert] = useState(false);

  const frontImage = usefrontImage((state) => state.frontImage); // Local file path
  const { imageUri } = useLocalSearchParams();  // Retrieving the file URI passed via params
  const uriToUse = Array.isArray(imageUri) ? imageUri[0] : imageUri;

  const handleSharePress = () => {
    setShowAlert(true);
  };

  // const handleConfirmShare = () => {
  //   setShowAlert(false);
  //   router.push('./(tabs)/forum');
  // };

  const handleConfirmShare = async () => {
    try {
      // Assuming `email` is from Zustand and `imageUrl` is from state
      const response = await axiosInstance.post('/posts', {
        email,
        imageUri,
      });
  
      if (response.status === 201) {
        Alert.alert('Success', 'Your post has been shared successfully.');
        setShowAlert(false);
        router.push('./(tabs)/forum'); // Navigate to forum after success
      } else {
        Alert.alert('Error', 'Failed to share post. Please try again.');
      }
    } catch (error) {
      console.error('Error sharing post:', error);
      Alert.alert('Error', 'An error occurred while sharing the post.');
    }
  };
  
  const handleCancelShare = () => {
    setShowAlert(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          style={styles.imagePlaceholder}
          source={frontImage ? { uri: frontImage } : require('../assets/images/facepic.png')}
        />
        <Text style={styles.arrowMark}>⬇</Text>
        <Image
          style={styles.imagePlaceholder}
          source={imageUri ? { uri: imageUri } : require('../assets/images/facepic.png')}
        />
        {/* {imageUri && (
        <Image 
          source={{ uri: uriToUse }}  // Displaying the local image
          style={styles.image}
        />
      )} */}
        <TouchableOpacity
          style={[styles.buttonContainer, { marginTop: 40 }]}
          onPress={handleSharePress}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>Share to Social Forum</Text>
        </TouchableOpacity>
      </View>

      {/* Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showAlert}
        onRequestClose={() => setShowAlert(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowAlert(false)}>
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Ionicons name="alert-circle-outline" size={60} color="#16A085" />
              <Text style={styles.modalText}>
                Are you sure you want to share to the social forum?
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={handleCancelShare}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.confirmButton]}
                  onPress={handleConfirmShare}
                >
                  <Text style={[styles.buttonText, { color: '#fff' }]}>OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 50,
    backgroundColor: '#fff',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  imagePlaceholder: {
    width: 200,
    height: 200,
    backgroundColor: '#ddd',
  },
  arrowMark: {
    fontSize: 40,
    marginTop: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    marginTop: 20,
    width: 250,
    backgroundColor: '#16A085',
    paddingVertical: 12,
    borderRadius: 5,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 18,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    width: '80%',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    minWidth: 100,
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  confirmButton: {
    backgroundColor: '#16A085',
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
});


export default TryOn;
