// import React, { useEffect, useState } from 'react';
// import {
//   FlatList,
//   ActivityIndicator,
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Image,
//   Alert,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import axiosInstance from '@/constants/axiosInstance'; // Adjust path to your axios instance
// import { useAuthStore } from '../../store/useStore'; // Adjust path to your Zustand store

// interface Post {
//   id: number;
//   email: string;
//   imageUrl: string;
//   thumbsUp: number;
//   thumbsDown: number;
//   user: {
//     userName: string;
//     profilePicture?: string;
//   };
// }

// const ForumScreen: React.FC = () => {
//   const [posts, setPosts] = useState<Post[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);

//   // Access logged-in user's email from Zustand store
//   const { email } = useAuthStore();

//   useEffect(() => {
//     const fetchPosts = async () => {
//       try {
//         const response = await axiosInstance.get('/posts');
//         setPosts(response.data);
//       } catch (error) {
//         console.error('Error fetching posts:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPosts();
//   }, []);

//   const handleReaction = async (postId: number, reactionType: 'up' | 'down', currentReaction: 'up' | 'down' | null) => {
//     if (currentReaction === reactionType) {
//       Alert.alert('Info', `You already reacted with a thumbs-${reactionType}.`);
//       return;
//     }

//     try {
//       await axiosInstance.post(`/posts/${postId}/react`, {
//         email,
//         voteType: reactionType,
//       });

//       setPosts((prevPosts) =>
//         prevPosts.map((post) => {
//           if (post.id === postId) {
//             return {
//               ...post,
//               thumbsUp: reactionType === 'up' ? post.thumbsUp + 1 : post.thumbsUp - (currentReaction === 'up' ? 1 : 0),
//               thumbsDown: reactionType === 'down' ? post.thumbsDown + 1 : post.thumbsDown - (currentReaction === 'down' ? 1 : 0),
//             };
//           }
//           return post;
//         })
//       );
//     } catch (error) {
//       console.error('Error updating reaction:', error);
//       Alert.alert('Error', 'Unable to update your reaction. Please try again.');
//     }
//   };

//   const ForumCard = ({
//     postId,
//     imageUrl,
//     userName,
//     profilePicture,
//     initialThumbsUp,
//     initialThumbsDown,
//     userReaction,
//   }: {
//     postId: number;
//     imageUrl: string;
//     userName: string;
//     profilePicture?: string;
//     initialThumbsUp: number;
//     initialThumbsDown: number;
//     userReaction: 'up' | 'down' | null;
//   }) => {
//     const [thumbsUp, setThumbsUp] = useState<number>(initialThumbsUp);
//     const [thumbsDown, setThumbsDown] = useState<number>(initialThumbsDown);
//     const [reaction, setReaction] = useState<'up' | 'down' | null>(userReaction);

//     const handleCardReaction = (reactionType: 'up' | 'down') =>
//       handleReaction(postId, reactionType, reaction);

//     return (
//       <View style={styles.cardContainer}>
//         {/* Profile Section */}
//         <View style={styles.profileContainer}>
//           <Image
//             source={{ uri: profilePicture || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT87u6AYNvnFQ6GmynYRD9FAZ4bJNzdFXW9P4o-ujQSUFuDaVZCcCOE0dgQkhaXwLPYsS8&usqp=CAU' }}
//             style={styles.profilePicture}
//           />
//           <Text style={styles.userName}>{userName}</Text>
//         </View>

//         {/* Post Image */}
//         <Image source={{ uri: imageUrl }} style={styles.postImage} />

//         {/* Reaction Section */}
//         <View style={styles.actionsContainer}>
//           <TouchableOpacity onPress={() => handleCardReaction('up')}>
//             <Ionicons
//               name="thumbs-up"
//               size={24}
//               color={reaction === 'up' ? 'green' : 'gray'}
//             />
//             <Text>{thumbsUp}</Text>
//           </TouchableOpacity>
//           <TouchableOpacity onPress={() => handleCardReaction('down')}>
//             <Ionicons
//               name="thumbs-down"
//               size={24}
//               color={reaction === 'down' ? 'red' : 'gray'}
//             />
//             <Text>{thumbsDown}</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     );
//   };

//   if (loading) {
//     return (
//       <View style={styles.loaderContainer}>
//         <ActivityIndicator size="large" color="#000" />
//         <Text>Loading posts...</Text>
//       </View>
//     );
//   }

//   return (
// <FlatList
//   data={posts}
//   keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
//   renderItem={({ item }) => (
//     <ForumCard
//       postId={item.id}
//       imageUrl={item.imageUrl}
//       userName={item.user.userName}
//       profilePicture={item.user.profilePicture}
//       initialThumbsUp={item.thumbsUp}
//       initialThumbsDown={item.thumbsDown}
//       userReaction={null} // Replace with actual logic to fetch user's reaction
//     />
//   )}
//   contentContainerStyle={styles.listContainer}
// />

//   );
// };

// const styles = StyleSheet.create({
//   loaderContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   listContainer: {
//     paddingHorizontal: 10,
//     paddingVertical: 20,
//   },
//   cardContainer: {
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     marginVertical: 10,
//     padding: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     elevation: 3,
//   },
//   profileContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   profilePicture: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     marginRight: 10,
//   },
//   userName: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   postImage: {
//     width: '100%',
//     height: 200,
//     borderRadius: 10,
//     marginBottom: 10,
//   },
//   actionsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
// });

// export default ForumScreen;
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Icon library for UI
import axios from 'axios'; // For type checking and Axios utilities
import axiosInstance from '@/constants/axiosInstance'; // Adjust path to your Axios instance
import { useAuthStore } from '../../store/useStore'; // Zustand store for managing global state

interface Post {
  id: number;
  email: string;
  imageUrl: string;
  thumbsUp: number;
  thumbsDown: number;
  user: {
    userName: string;
    profilePicture?: string;
  };
}

const ForumScreen: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Access logged-in user's email from Zustand store
  const { email } = useAuthStore();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axiosInstance.get<Post[]>('/posts');
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleReaction = async (
    postId: number,
    reactionType: 'up' | 'down',
    currentReaction: 'up' | 'down' | null
  ) => {
    if (currentReaction === reactionType) {
      Alert.alert('Info', `You already reacted with a thumbs-${reactionType}.`);
      return;
    }
  
    try {
      const response = await axiosInstance.post(`/posts/${postId}/react`, {
        email,
        voteType: reactionType,
      });
  
      console.log('API Response:', response.data);
  
      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              thumbsUp:
                reactionType === 'up'
                  ? post.thumbsUp + 1
                  : post.thumbsUp - (currentReaction === 'up' ? 1 : 0),
              thumbsDown:
                reactionType === 'down'
                  ? post.thumbsDown + 1
                  : post.thumbsDown - (currentReaction === 'down' ? 1 : 0),
            };
          }
          return post;
        })
      );
    } catch (err) {
      // Use type guard to narrow error type
      if (axios.isAxiosError(err)) {
        console.error('Axios Error:', err.response?.data || err.message);
        Alert.alert('Error', err.response?.data?.message || 'Unable to update your reaction. Please try again.');
      } else if (err instanceof Error) {
        console.error('General Error:', err.message);
        Alert.alert('Error', err.message);
      } else {
        console.error('Unknown Error:', err);
        Alert.alert('Error', 'An unknown error occurred. Please try again.');
      }
    }
  };
  

  const ForumCard: React.FC<{
    postId: number;
    imageUrl: string;
    userName: string;
    profilePicture?: string;
    initialThumbsUp: number;
    initialThumbsDown: number;
    userReaction: 'up' | 'down' | null;
  }> = ({
    postId,
    imageUrl,
    userName,
    profilePicture,
    initialThumbsUp,
    initialThumbsDown,
    userReaction,
  }) => {
    const [thumbsUp, setThumbsUp] = useState<number>(initialThumbsUp);
    const [thumbsDown, setThumbsDown] = useState<number>(initialThumbsDown);
    const [reaction, setReaction] = useState<'up' | 'down' | null>(userReaction);

    const handleCardReaction = async (reactionType: 'up' | 'down') => {
      await handleReaction(postId, reactionType, reaction);
      setReaction(reactionType);
      setThumbsUp(
        reactionType === 'up' ? thumbsUp + 1 : thumbsUp - (reaction === 'up' ? 1 : 0)
      );
      setThumbsDown(
        reactionType === 'down' ? thumbsDown + 1 : thumbsDown - (reaction === 'down' ? 1 : 0)
      );
    };

    return (
      <View style={styles.cardContainer}>
        {/* Profile Section */}
        <View style={styles.profileContainer}>
          <Image
            source={{
              uri:
                profilePicture ||
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT87u6AYNvnFQ6GmynYRD9FAZ4bJNzdFXW9P4o-ujQSUFuDaVZCcCOE0dgQkhaXwLPYsS8&usqp=CAU', // Fallback profile picture
            }}
            style={styles.profilePicture}
          />
          <Text style={styles.userName}>{userName}</Text>
        </View>

        {/* Post Image */}
        <Image source={{ uri: imageUrl }} style={styles.postImage} />

        {/* Reaction Section */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity onPress={() => handleCardReaction('up')}>
            <Ionicons
              name="thumbs-up"
              size={24}
              color={reaction === 'up' ? 'green' : 'gray'}
            />
            <Text>{thumbsUp}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleCardReaction('down')}>
            <Ionicons
              name="thumbs-down"
              size={24}
              color={reaction === 'down' ? 'red' : 'gray'}
            />
            <Text>{thumbsDown}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#000" />
        <Text>Loading posts...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={posts}
      keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
      renderItem={({ item }) => (
        <ForumCard
          postId={item.id}
          imageUrl={item.imageUrl}
          userName={item.user.userName}
          profilePicture={item.user.profilePicture}
          initialThumbsUp={item.thumbsUp}
          initialThumbsDown={item.thumbsDown}
          userReaction={null} // Replace with actual logic to fetch user's reaction
        />
      )}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profilePicture: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default ForumScreen;
