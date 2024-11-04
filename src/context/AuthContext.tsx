import React, {createContext, useContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthContextType = {
  apiKey: string | null;
  steamId: string | null;
  login: (apiKey: string, steamId: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [steamId, setSteamId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const storedApiKey = await AsyncStorage.getItem('apiKey');
        const storedSteamId = await AsyncStorage.getItem('steamId');
        if (storedApiKey && storedSteamId) {
          setApiKey(storedApiKey);
          setSteamId(storedSteamId);
        }
      } catch (error) {
        console.error('Failed to load auth data from storage', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadAuthData();
  }, []);

  const login = async (newApiKey: string, newSteamId: string) => {
    setApiKey(newApiKey);
    setSteamId(newSteamId);
    await AsyncStorage.setItem('apiKey', newApiKey);
    await AsyncStorage.setItem('steamId', newSteamId);
    console.log('authorization successful');
  };

  const logout = async () => {
    setApiKey(null);
    setSteamId(null);
    await AsyncStorage.removeItem('apiKey');
    await AsyncStorage.removeItem('steamId');
    console.log('logged out of the app');
  };

  return (
    <AuthContext.Provider value={{apiKey, steamId, isLoading, login, logout}}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth должен использоваться внутри AuthProvider');
  }
  return context;
};
