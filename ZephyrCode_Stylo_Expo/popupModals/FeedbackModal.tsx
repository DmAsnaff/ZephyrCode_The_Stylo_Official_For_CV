import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // Replace with your icon library import
import { BlurView } from 'expo-blur';

interface FeedbackModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmitFeedback: (rating: number) => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isVisible, onClose, onSubmitFeedback }) => {
  const [rating, setRating] = useState<number>(0);

  const handleSubmit = () => {
    onSubmitFeedback(rating);
    onClose();
  };

  return (
    <Modal transparent visible={isVisible} animationType="slide">
      <BlurView intensity={70} style={styles.blurContainer}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Give Feedback</Text>
            <View style={styles.ratingContainer}>
              <Text>Rating:</Text>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setRating(star)}>
                  <MaterialIcons name={star <= rating ? 'star' : 'star-outline'} size={30} color="#FFD700" />
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BlurView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  blurContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent background
  },
  modalContainer: {
    width: '80%',
    borderRadius: 10,
    overflow: 'hidden',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#16A085',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  submitButtonText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default FeedbackModal;
