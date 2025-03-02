// Import necessary modules
import React, { createContext, useState, useContext } from 'react';

// Define types for user and context
interface User {
  email: string;
  token: string;
}

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  login: (email: string, token: string) => void;
  logout: () => void;
}

// Create the context
const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  login: () => {},
  logout: () => {},
});

// Custom hook to use UserContext
export const useUserContext = () => useContext(UserContext);

// Props interface for UserProvider
interface UserProviderProps {
  children: React.ReactNode; // Define children prop explicitly
}

// UserContext provider component
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Function to handle login
  const login = (email: string, token: string) => {
    setUser({ email, token });
    // Optionally, you can store user details in AsyncStorage or secure storage
  };

  // Function to handle logout
  const logout = () => {
    setUser(null);
    // Clear user data from AsyncStorage or secure storage
  };

  return (
    <UserContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
