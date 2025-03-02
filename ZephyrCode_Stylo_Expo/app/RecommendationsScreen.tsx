import React from 'react';
import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

// // Helper function to encode the Firebase URL
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
// Helper function to encode the Firebase URL
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

const RecommendationsScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Parse the stringified recommendations data
  const recommendationsData = params.recommendations ? 
    JSON.parse(params.recommendations as string) : 
    { faceShape: '', recommendations: [] };
  
  const { faceShape, recommendations } = recommendationsData;
  
  const windowWidth = Dimensions.get('window').width;
  const imageSize = windowWidth - 40;  // Set image size to fit full width (with padding)

  const handleImageClick = (item: any) => {
    const encodedImageLink = encodeFirebaseUrl(item.imageLink);
    router.push({
      pathname: '/Preferred_page',
      params: {
        imageLink: encodedImageLink,
        how_to_achieve: item.how_to_achieve,
        Products_to_achieve: item.Products_to_achieve,
      },
    });
  };

  if (!recommendations || recommendations.length === 0) {
    return (
      <View style={styles.container}>
<Text style={{
    fontSize: 28,
    color: '#3CB371', // Use a calm, soothing green color
    textAlign: 'justify',
    margin: 10,
}}>
    <Text style={{color:'#11181C'}}>Some signs of baldness detected.</Text> Embrace your unique style – it’s what truly makes you shine!
</Text>      
</View>
    );
  }

  return (
    <View style={styles.container}>
        <Text style={styles.header}>
        Face Shape: <Text style={styles.faceShape}>{faceShape || 'Unknown'}</Text>
      </Text>
      <FlatList
        data={recommendations}
        keyExtractor={(item, index) => item.hairstyleID?.toString() || index.toString()}
        numColumns={1} // Set to 1 column for single column view
        renderItem={({ item }) => {
          const encodedImageLink = encodeFirebaseUrl(item.imageLink);
          return (
            <TouchableOpacity
              onPress={() => handleImageClick(item)}
              style={styles.imageContainer}
            >
              <Image
                source={{ uri: encodedImageLink }}
                style={[styles.image, { width: imageSize, height: imageSize }]}
                onError={(error) => console.log('Image loading error:', encodedImageLink, error)}
              />
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 40,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  faceShape: {
    color: '#16A085',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  imageContainer: {
    marginBottom: 10,
    padding: 5,
  },
  image: {
    borderRadius: 8,
  },
});

export default RecommendationsScreen;

// import React from 'react';
// import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity, Dimensions } from 'react-native';
// import { useRouter, useLocalSearchParams } from 'expo-router';

// // Helper function to encode the Firebase URL
// const encodeFirebaseUrl = (url: string) => {
//   try {
//     // Find the segment that starts with '/o/female/'
//     const femalePath = url.indexOf('/o/female/');
//     if (femalePath === -1) return url;

//     // Split the URL into parts
//     const baseUrl = url.substring(0, femalePath + '/o/female'.length);
//     let remainingPath = url.substring(femalePath + '/o/female'.length);

//     // Split into path and query
//     const [pathPart, queryPart] = remainingPath.split('?');

//     // Encode only the path part after 'female'
//     const encodedPath = pathPart.split('/').join('%2F');

//     // Reconstruct the URL
//     return `${baseUrl}${encodedPath}${queryPart ? `?${queryPart}` : ''}`;
//   } catch (error) {
//     console.error('URL encoding error:', error);
//     return url;
//   }
// };

// const RecommendationsScreen = () => {
//   const router = useRouter();
//   const params = useLocalSearchParams();
  
//   // Parse the stringified recommendations data
//   const recommendationsData = params.recommendations ?
//     JSON.parse(params.recommendations as string) :
//     { faceShape: '', recommendations: [] };
  
//   const { faceShape, recommendations } = recommendationsData;
  
//   const windowWidth = Dimensions.get('window').width;
//   const numColumns = 3;
//   const imageSize = (windowWidth - 40 - (numColumns - 1) * 10) / numColumns;

//   const handleImageClick = (item: any) => {
//     const encodedImageLink = encodeFirebaseUrl(item.imageLink);
//     router.push({
//       pathname: '/Preferred_page',
//       params: {
//         imageLink: encodedImageLink,
//         how_to_achieve: item.how_to_achieve,
//         Products_to_achieve: item.Products_to_achieve,
//       },
//     });
//   };

//   if (!recommendations || recommendations.length === 0) {
//     return (
//       <View style={styles.container}>
//         <Text>No recommendations available</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Face Shape: {faceShape || 'Unknown'}</Text>
//       <FlatList
//         data={recommendations}
//         keyExtractor={(item, index) => item.hairstyleID?.toString() || index.toString()}
//         numColumns={numColumns}
//         renderItem={({ item }) => {
//           const encodedImageLink = encodeFirebaseUrl(item.imageLink);
//           console.log('ik:',encodedImageLink )
//           return (
//             <TouchableOpacity
//               onPress={() => handleImageClick(item)}
//               style={styles.imageContainer}
//             >
//               <Image
//                 source={{ uri: encodedImageLink }}
//                 style={[styles.image, { width: imageSize, height: imageSize }]}
//                 onError={(error) => console.log('Image loading error:', encodedImageLink, error)}
//               />
//             </TouchableOpacity>
//           );
//         }}
//         columnWrapperStyle={styles.row}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     padding: 20,
//     marginTop: 40,
//   },
//   header: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   imageContainer: {
//     marginBottom: 10,
//     padding: 5,
//   },
//   row: {
//     justifyContent: 'space-between',
//   },
//   image: {
//     borderRadius: 8,
//   },
// });

// export default RecommendationsScreen;