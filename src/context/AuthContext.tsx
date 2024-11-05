// Контекст для управления аутентификацией, используется AsyncStorage для хранения данных
import React, {createContext, useContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthContextType} from '../types/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [steamId, setSteamId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Происходит загрузка данных аутентификации из AsyncStorage. Если данные найдены, они сохраняются в состояние
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
        console.error('Не удалось загрузить данные из хранилища', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadAuthData();
  }, []);

  // Функция входа
  const login = async (newApiKey: string, newSteamId: string) => {
    setApiKey(newApiKey);
    setSteamId(newSteamId);
    await AsyncStorage.setItem('apiKey', newApiKey);
    await AsyncStorage.setItem('steamId', newSteamId);
    console.log('authorization successful');
  };

  // Функция выхода
  const logout = async () => {
    setApiKey(null);
    setSteamId(null);
    await AsyncStorage.removeItem('apiKey');
    await AsyncStorage.removeItem('steamId');
    console.log('logged out of the app');
  };

  // Предоставление контекста
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
