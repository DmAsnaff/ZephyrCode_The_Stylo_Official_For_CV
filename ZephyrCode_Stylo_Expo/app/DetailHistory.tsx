import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, useColorScheme  } from 'react-native';
import { useRoute } from '@react-navigation/native'; // Import useRoute hook
import { RouteProp } from '@react-navigation/native'; // Import RouteProp for typing
import { RootStackParamList } from '../components/navigation/historynavigation'; // Adjust path if needed

const DetailHistory: React.FC = () => {
  // Use the useRoute hook to get the route object
  const route = useRoute<RouteProp<RootStackParamList, 'DetailHistory'>>(); 
  const { item } = route.params; // Destructure item from route.params
  const colorScheme = useColorScheme(); // Get the current theme (light or dark)


  

  // Define placeholder image for missing data
  const placeholderImage = 'https://via.placeholder.com/150'; 

  // Use the transferred image or fallback to placeholder image
  const hairstyleImage = item.hairstyle_transferred_image_link || placeholderImage;

  const textColor = colorScheme === 'dark' ? '#fff' : '#000';


  return (
    <ScrollView contentContainerStyle={styles.container}> 
     <Text style={[styles.details, { color: textColor }]}>History ID: <Text style={[{ color: "red" }]}>{item.id}</Text></Text>
      <Text style={[styles.details, { color: textColor }]}>Font & Side Images:</Text>


      {/* Display front and side images with updated style */}
      <View style={styles.imageRow}>
        <Image source={{ uri: item.front_image_link }} style={styles.image} />
        {item.side_image_link && (
          <Image source={{ uri: item.side_image_link }} style={styles.image} />
        )}
      </View>

      <Text style={[styles.details, { color: textColor }]}>Face Shape: <Text style={{ color: 'red' }}>{item.faceshape}</Text></Text>
      <Text style={[styles.details, { color: textColor }]}>Gender: <Text style={{ color: 'red' }}>{item.gender}</Text></Text>
      <Text style={[styles.details, { color: textColor }]}>Age Range: <Text style={{ color: 'red' }}>{item.agerange}</Text></Text>
      <Text style={[styles.details, { color: textColor } ]}>Dress Code: <Text style={{ color: 'red' }}>{item.dresscode}</Text></Text>
      <Text style={[styles.details, { color: textColor }]}>Hair Length: <Text style={{ color: 'red' }}>{item.hairlength}</Text></Text>
      <Text style={[styles.details, { color: textColor }]}>Hairstyle Hransferred Image: </Text>

      {/* Display hairstyle image centered */}
      <View style={styles.hairstyleImageContainer}>
        <Image source={{ uri: hairstyleImage }} style={styles.hairstyleImage} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40, // Ensures there's space at the bottom for the scrollable content
  },
  details: {
    fontSize: 16,
    marginVertical: 5,
  },
  boldText: {
    fontWeight: 'bold', 
    color: '#000',
  },
  imageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  image: {
    width: 140,
    height: 140,
    borderRadius: 75, // Make the image round
    borderWidth: 2,
    borderColor: '#ccc',
    marginBottom: 10,
  },
  hairstyleImageContainer: {
    alignItems: 'center', // Center the image horizontally
    justifyContent: 'center', // Center the image vertically (if required)
    marginTop: 20, // Add some margin for spacing
  },
  hairstyleImage: {
    width: 250, // Adjust width based on preference
    height: 250, // Adjust height based on preference
    borderRadius: 12, // Add rounded corners for the hairstyle image
    marginBottom: 20, // Add spacing from the next content
  },
});

export default DetailHistory;
