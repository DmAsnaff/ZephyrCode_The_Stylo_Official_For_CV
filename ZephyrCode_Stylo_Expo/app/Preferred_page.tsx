// import React, { useState } from 'react';
// import { View, StyleSheet, Image, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
// import { useRouter, useLocalSearchParams } from 'expo-router';
// import { usefrontImage } from '../store/useStore'; // Import the Zustand store
// import * as FileSystem from 'expo-file-system'; // For file handling
// import axios from 'axios'; // Axios for API calls
// import FormData from 'form-data';
// import * as path from 'path';
// import * as fs from 'fs';
// import RNFetchBlob from 'rn-fetch-blob';
// import base64 from 'base64-js'; // for base64 encoding



// // Utility function to encode Firebase URLs
// const encodeFirebaseUrl = (url: string) => {
//   try {
//     const femalePath = url.indexOf('/o/female/');
//     if (femalePath === -1) return url;

//     const baseUrl = url.substring(0, femalePath + '/o/female'.length);
//     let remainingPath = url.substring(femalePath + '/o/female'.length);

//     const [pathPart, queryPart] = remainingPath.split('?');
//     const encodedPath = pathPart.split('/').join('%2F');
//     return `${baseUrl}${encodedPath}${queryPart ? `?${queryPart}` : ''}`;
//   } catch (error) {
//     console.error('URL encoding error:', error);
//     return url;
//   }
// };


// type FileUploadResponse = {
//   resultImage: string;
// };

// type FormDataFile = {
//   uri: string;
//   type: string;
//   name: string;
// };


// const PreferredPage: React.FC = () => {
//   const router = useRouter();
//   const params = useLocalSearchParams();
//   const frontImage = usefrontImage((state) => state.frontImage);

//   const [loading, setLoading] = useState(false); // For showing a loading state

//   // Extract the passed parameters
//   const imageLink = params.imageLink as string;
//   const howToAchieve = params.how_to_achieve as string;
//   const productsToAchieve = params.Products_to_achieve as string;

//   // Encode the image URL
//   const encodedImageLink = imageLink ? encodeFirebaseUrl(imageLink) : '';


  
//   const [imageUri, setImageUri] = useState<string | null>(null);

//  // Local asset image paths
// const faceImagePath = require('../assets/tempIages/11.jpg');
// const shapeImagePath = require('../assets/tempIages/oval (32).jpg');
// const colorImagePath = require('../assets/tempIages/oval (32).jpg');


// const uploadFiles = async (facePath: string, shapePath: string, colorPath: string) => {
//   setLoading(true);
//   const form = new FormData();

//   try {
//     // For local assets, append them directly to FormData
//     form.append('face', {
//       uri: Image.resolveAssetSource(faceImagePath).uri,
//       type: 'image/jpeg',
//       name: 'face.jpg',
//     });

//     form.append('shape', {
//       uri: Image.resolveAssetSource(shapeImagePath).uri,
//       type: 'image/jpeg',
//       name: 'shape.jpg',
//     });

//     form.append('color', {
//       uri: Image.resolveAssetSource(colorImagePath).uri,
//       type: 'image/jpeg',
//       name: 'color.jpg',
//     });

//     const response = await axios.post('https://0f7e-34-148-55-31.ngrok-free.app/upload', form, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//         'Accept': 'image/png',
//       },
//       responseType: 'arraybuffer',
//     });

//     if (response.data) {
//       // Convert binary response data to base64 string
//       const byteArray = new Uint8Array(response.data);
//       const base64Image = base64.fromByteArray(byteArray);
      
//       const savePath = FileSystem.documentDirectory + 'final_output.jpg';
      
//       // Write the base64 image to the file system
//       await FileSystem.writeAsStringAsync(savePath, base64Image, {
//         encoding: FileSystem.EncodingType.Base64,
//       });
//       setImageUri(savePath);
//       console.log('Image saved at:', savePath);
//     } else {
//       throw new Error('No data received from server');
//     }
//   } catch (error) {
//     console.error('Error uploading files:', error);
//     // Add error handling here - maybe set an error state to show to the user
//   } finally {
//     setLoading(false);
//   }
// };

  
//   return (
//     <View style={styles.container}>
//       <Image style={styles.imagePlaceholder} source={{ uri: encodedImageLink }} />
//       <Text style={[styles.requirementsText, { color: '#2F4F4F' }]}>VERBAL EXPLANATION</Text>
//       <View style={styles.textBox}>
//         <ScrollView
//           contentContainerStyle={{
//             alignItems: 'center',
//             justifyContent: 'center',
//             width: 300, // Adjust width as needed
//           }}
//         >
//           <Text style={[styles.textBoxContent, { color: '#2F4F4F', textAlign: 'center' }]}>
//             {howToAchieve || 'No explanation available.'}
//           </Text>
//         </ScrollView>
//       </View>
//       <View style={styles.additionalBox}>
//         <Text style={[styles.requirementsText, { color: '#2F4F4F' }]}>PRODUCT REQUIREMENT</Text>
//         <View style={styles.textBoxBelow}>
//           <ScrollView
//             contentContainerStyle={{
//               width: 300, // Adjust width as needed
//               alignItems: 'center',
//               justifyContent: 'center',
//             }}
//           >
//             <Text style={[styles.textBoxContent, { color: '#2F4F4F', textAlign: 'center' }]}>
//               {productsToAchieve || 'No product requirements available.'}
//             </Text>
//           </ScrollView>
//           {imageUri && (
//         <Image 
//           source={{ uri: imageUri }}
//           style={{ width: 300, height: 300, marginTop: 20 }}
//           resizeMode="contain"
//         />
//       )}
//         </View>
//         {/* <Text>{frontImage}</Text> */}
//         <TouchableOpacity style={[styles.button, { marginTop: 40 }]} 
//             onPress={async () => {
//               try {
//                 await uploadFiles(faceImagePath, shapeImagePath, colorImagePath);
//               } catch (error) {
//                 console.error('Error in button press handler:', error);
//               }
//             }}  
//         disabled={loading}>
//           <Text style={styles.buttonText}>{loading ? 'Processing...' : 'Try On'}</Text>
//         </TouchableOpacity>
//       </View>
      
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'flex-start',
//     paddingVertical: 20,
//   },
//   imagePlaceholder: {
//     width: 150,
//     height: 150,
//     marginVertical: 20,
//   },
//   textBox: {
//     height: 170,
//     width: '80%',
//     backgroundColor: '#e0e0e0',
//     borderRadius: 8,
//     justifyContent: 'center',
//     paddingHorizontal: 10,
//     marginTop: 10,
//   },
//   textBoxContent: {
//     fontSize: 16,
//     color: '#2F4F4F',
//     padding: 10,
//     textAlign: 'center',
//     marginVertical: 10,
//   },
//   requirementsText: {
//     fontSize: 16,
//     color: '#2F4F4F',
//   },
//   additionalBox: {
//     marginTop: 20,
//     alignItems: 'center',
//   },
//   textBoxBelow: {
//     height: 170,
//     width: '80%',
//     backgroundColor: '#e0e0e0',
//     borderRadius: 8,
//     justifyContent: 'center',
//     paddingHorizontal: 10,
//     marginTop: 10,
//   },
//   button: {
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//     borderWidth: 2,
//     borderColor: '#16A085',
//     backgroundColor: '#16A085',
//     borderRadius: 4,
//     alignItems: 'center',
//     justifyContent: 'center',
//     width: 350,
//     marginTop: 18,
//     marginBottom: 4,
//   },
//   buttonText: {
//     fontSize: 16,
//     color: '#fff',
//   },
// });

// export default PreferredPage;

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { usefrontImage } from '../store/useStore';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';
import FormData from 'form-data';
import base64 from 'base64-js';

// Utility function to encode Firebase URLs
const encodeFirebaseUrl = (url: string) => {
  try {
    // Check for both female and male paths
    const femalePath = url.indexOf('/o/female/');
    const malePath = url.indexOf('/o/male/');

    // If neither path exists, return original URL
    if (femalePath === -1 && malePath === -1) return url;

    // Determine which path exists and use its values
    const pathIndex = femalePath !== -1 ? femalePath : malePath;
    const pathType = femalePath !== -1 ? '/o/female' : '/o/male';

    const baseUrl = url.substring(0, pathIndex + pathType.length);
    let remainingPath = url.substring(pathIndex + pathType.length);

    const [pathPart, queryPart] = remainingPath.split('?');
    const encodedPath = pathPart.split('/').join('%2F');
    return `${baseUrl}${encodedPath}${queryPart ? `?${queryPart}` : ''}`;
  } catch (error) {
    console.error('URL encoding error:', error);
    return url;
  }
};

const PreferredPage: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const frontImage = usefrontImage((state) => state.frontImage); // Local file path

  const [loading, setLoading] = useState(false);
  const [shapeImagePath, setShapeImagePath] = useState<string | null>(null);
  const [colorImagePath, setColorImagePath] = useState<string | null>(null);

  // Extract passed parameters
  const imageLink = params.imageLink as string;
  const howToAchieve = params.how_to_achieve as string;
  const productsToAchieve = params.Products_to_achieve as string;

  // Encode the image URL
  const encodedImageLink = imageLink ? encodeFirebaseUrl(imageLink) : '';
  const [imageUri, setImageUri] = useState<string | null>(null);

  const downloadRemoteImages = async () => {
    try {
      if (encodedImageLink) {
        const tempDir = FileSystem.documentDirectory + 'tempImages/';
        await FileSystem.makeDirectoryAsync(tempDir, { intermediates: true });

        const shapePath = tempDir + 'shapeImage.jpg';
        const colorPath = tempDir + 'colorImage.jpg';

        // Download encodedImageLink for shape and color
        const shapeResponse = await FileSystem.downloadAsync(encodedImageLink, shapePath);
        const colorResponse = await FileSystem.downloadAsync(encodedImageLink, colorPath);

        setShapeImagePath(shapeResponse.uri);
        setColorImagePath(colorResponse.uri);
      }
    } catch (error) {
      console.error('Error downloading images:', error);
    }
  };

  const deleteTempImages = async () => {
    try {
      const tempDir = FileSystem.documentDirectory + 'tempImages/';
      await FileSystem.deleteAsync(tempDir, { idempotent: true });
      console.log('Temporary images deleted');
    } catch (error) {
      console.error('Error deleting temporary images:', error);
    }
  };

  const uploadFiles = async () => {
    setLoading(true); 
    const form = new FormData();

    try {
      // Append the local frontImage directly
      if (frontImage) {
        form.append('face', {
          uri: frontImage,
          type: 'image/jpeg',
          name: 'face.jpg',
        });
      }

      // Append downloaded remote files if available
      if (shapeImagePath) {
        form.append('shape', {
          uri: shapeImagePath,
          type: 'image/jpeg',
          name: 'shape.jpg',
        });
      }

      if (colorImagePath) {
        form.append('color', {
          uri: colorImagePath,
          type: 'image/jpeg',
          name: 'color.jpg',
        });
      }

      const response = await axios.post('https://934f-104-196-227-57.ngrok-free.app/upload', form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'arraybuffer',
      });

      if (response.data) {
        const byteArray = new Uint8Array(response.data);
        const base64Image = base64.fromByteArray(byteArray);
        const savePath = FileSystem.documentDirectory + 'final_output.jpg';
        await FileSystem.writeAsStringAsync(savePath, base64Image, {
          encoding: FileSystem.EncodingType.Base64,
        });
        setImageUri(savePath);

        console.log('Image saved at:', savePath);
         // Navigate to Try On page and pass `imageUri`
         router.push({
          pathname: './try_on',
          params: { imageUri: savePath },  // Passing the local file path
        });
        
      }
    } catch (error) {
      console.error('Error uploading filess:', error);
    } finally {
      // await deleteTempImages(); // Delete temp images after upload
      setLoading(false);
    }
  };

  useEffect(() => {
    downloadRemoteImages();
    // return () => {
    //   deleteTempImages(); // Cleanup when the component unmounts
    // };
  }, []);

  return (
    <View style={styles.container}>
      <Image style={styles.imagePlaceholder} source={{ uri: encodedImageLink }} />
      <Text style={[styles.requirementsText, { color: '#2F4F4F' }]}>VERBAL EXPLANATION</Text>
      <View style={styles.textBox}>
        <ScrollView contentContainerStyle={{ alignItems: 'center', justifyContent: 'center', width: 300 }}>
          <Text style={[styles.textBoxContent, { color: '#2F4F4F', textAlign: 'center' }]}>
            {howToAchieve || 'No explanation available.'}
          </Text>
        </ScrollView>
      </View>
      <View style={styles.additionalBox}>
        <Text style={[styles.requirementsText, { color: '#2F4F4F' }]}>PRODUCT REQUIREMENT</Text>
        <View style={styles.textBoxBelow}>
          <ScrollView contentContainerStyle={{ width: 300, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={[styles.textBoxContent, { color: '#2F4F4F', textAlign: 'center' }]}>
              {productsToAchieve || 'No product requirements available.'}
            </Text>
          </ScrollView>
          {imageUri && (
        <Image 
          source={{ uri: imageUri }}
          style={{ width: 300, height: 300, marginTop: 20 }}
          resizeMode="contain"
        />
      )}
        </View>
        {/* <Text>{frontImage}</Text> */}

        <TouchableOpacity
          style={[styles.button, { marginTop: 40 }]}
          onPress={uploadFiles}
          // onPress={() => router.push('./try_on')}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? 'Processing...' : 'Try On'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 20,
  },
  imagePlaceholder: {
    width: 150,
    height: 150,
    marginVertical: 20,
  },
  textBox: {
    height: 170,
    width: '80%',
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    justifyContent: 'center',
    paddingHorizontal: 10,
    marginTop: 10,
  },
  textBoxContent: {
    fontSize: 16,
    color: '#2F4F4F',
    padding: 10,
    textAlign: 'center',
    marginVertical: 10,
  },
  requirementsText: {
    fontSize: 16,
    color: '#2F4F4F',
  },
  additionalBox: {
    marginTop: 20,
    alignItems: 'center',
  },
  textBoxBelow: {
    height: 170,
    width: '80%',
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    justifyContent: 'center',
    paddingHorizontal: 10,
    marginTop: 10,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 2,
    borderColor: '#16A085',
    backgroundColor: '#16A085',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    width: 350,
    marginTop: 18,
    marginBottom: 4,
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
  },
});

export default PreferredPage;
