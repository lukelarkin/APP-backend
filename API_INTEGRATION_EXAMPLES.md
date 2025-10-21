# API Integration Examples

Practical code examples for integrating the TARU backend API with the React Native frontend.

## Table of Contents

1. [Authentication](#authentication)
2. [User Profile](#user-profile)
3. [Check-Ins](#check-ins)
4. [Interventions](#interventions)
5. [Community](#community)
6. [Offline Support](#offline-support)

## Authentication

### Registration Screen

```typescript
// src/screens/RegisterScreen.tsx
import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import APIService from '../services/api';

export const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || !name) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await APIService.register(email, password, name);
      // Token is automatically stored by APIService
      
      Alert.alert('Success', 'Account created!', [
        { text: 'OK', onPress: () => navigation.navigate('Main') }
      ]);
    } catch (error) {
      Alert.alert('Registration Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />
      <Button 
        title={loading ? "Creating Account..." : "Register"} 
        onPress={handleRegister}
        disabled={loading}
      />
    </View>
  );
};
```

### Login Screen

```typescript
// src/screens/LoginScreen.tsx
import React, { useState } from 'react';
import { View, TextInput, Button, Alert, TouchableOpacity, Text } from 'react-native';
import APIService from '../services/api';

export const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await APIService.login(email, password);
      // Token is automatically stored
      navigation.navigate('Main');
    } catch (error) {
      Alert.alert('Login Failed', error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />
      <Button 
        title={loading ? "Logging in..." : "Login"} 
        onPress={handleLogin}
        disabled={loading}
      />
      <TouchableOpacity 
        onPress={() => navigation.navigate('Register')}
        style={{ marginTop: 20 }}
      >
        <Text style={{ textAlign: 'center', color: 'blue' }}>
          Don't have an account? Register
        </Text>
      </TouchableOpacity>
    </View>
  );
};
```

## User Profile

### Profile Screen with Edit

```typescript
// src/screens/ProfileScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, ActivityIndicator } from 'react-native';
import APIService from '../services/api';

export const ProfileScreen = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await APIService.getProfile();
      setProfile(data);
      setName(data.name);
      setBio(data.profile?.bio || '');
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await APIService.updateProfile({
        name,
        profile: { bio }
      });
      await loadProfile();
      setEditing(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Profile</Text>
      
      {editing ? (
        <>
          <TextInput
            placeholder="Name"
            value={name}
            onChangeText={setName}
            style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
          />
          <TextInput
            placeholder="Bio"
            value={bio}
            onChangeText={setBio}
            multiline
            numberOfLines={4}
            style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
          />
          <Button title="Save" onPress={handleSave} />
          <Button title="Cancel" onPress={() => setEditing(false)} />
        </>
      ) : (
        <>
          <Text>Name: {profile.name}</Text>
          <Text>Email: {profile.email}</Text>
          <Text>Bio: {profile.profile?.bio || 'No bio yet'}</Text>
          <Button title="Edit Profile" onPress={() => setEditing(true)} />
        </>
      )}
    </View>
  );
};
```

## Check-Ins

### Daily IFS Check-In Screen

```typescript
// src/screens/CheckInScreen.tsx
import React, { useState } from 'react';
import { View, Text, Button, Slider, TextInput, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import APIService from '../services/api';
import SyncManager from '../services/syncManager';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const CheckInScreen = ({ navigation }) => {
  const [partName, setPartName] = useState('');
  const [emotion, setEmotion] = useState('calm');
  const [quadrant, setQuadrant] = useState('centered');
  const [intensity, setIntensity] = useState(5);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const emotions = ['calm', 'anxious', 'sad', 'angry', 'happy', 'excited', 'confused'];
  const quadrants = ['centered', 'activated', 'challenged', 'overwhelmed'];

  const handleSubmit = async () => {
    if (!partName) {
      Alert.alert('Error', 'Please name your part');
      return;
    }

    const checkInData = {
      partName,
      emotion,
      quadrant,
      intensity,
      notes,
    };

    setLoading(true);
    try {
      // Save locally first for immediate feedback
      const localCheckIns = await AsyncStorage.getItem('checkIns') || '[]';
      const checkIns = JSON.parse(localCheckIns);
      checkIns.push({ ...checkInData, timestamp: new Date().toISOString() });
      await AsyncStorage.setItem('checkIns', JSON.stringify(checkIns));

      // Queue for backend sync
      await SyncManager.queueSync('CREATE_PARTS_CHECKIN', checkInData);

      Alert.alert('Success', 'Check-in recorded!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to save check-in');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Daily Check-In</Text>
      
      <Text>Part Name:</Text>
      <TextInput
        placeholder="e.g., Anxious Protector"
        value={partName}
        onChangeText={setPartName}
        style={{ borderWidth: 1, padding: 10, marginBottom: 15 }}
      />

      <Text>Emotion:</Text>
      <Picker
        selectedValue={emotion}
        onValueChange={setEmotion}
        style={{ marginBottom: 15 }}
      >
        {emotions.map(e => (
          <Picker.Item key={e} label={e} value={e} />
        ))}
      </Picker>

      <Text>Quadrant:</Text>
      <Picker
        selectedValue={quadrant}
        onValueChange={setQuadrant}
        style={{ marginBottom: 15 }}
      >
        {quadrants.map(q => (
          <Picker.Item key={q} label={q} value={q} />
        ))}
      </Picker>

      <Text>Intensity: {intensity}</Text>
      <Slider
        value={intensity}
        onValueChange={setIntensity}
        minimumValue={1}
        maximumValue={10}
        step={1}
        style={{ marginBottom: 15 }}
      />

      <Text>Notes (optional):</Text>
      <TextInput
        placeholder="How are you feeling?"
        value={notes}
        onChangeText={setNotes}
        multiline
        numberOfLines={3}
        style={{ borderWidth: 1, padding: 10, marginBottom: 15 }}
      />

      <Button 
        title={loading ? "Saving..." : "Submit Check-In"} 
        onPress={handleSubmit}
        disabled={loading}
      />
    </View>
  );
};
```

### Check-In History

```typescript
// src/screens/CheckInHistoryScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import APIService from '../services/api';
import { format } from 'date-fns';

export const CheckInHistoryScreen = () => {
  const [checkIns, setCheckIns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCheckIns();
  }, []);

  const loadCheckIns = async () => {
    try {
      const data = await APIService.getPartsCheckIns();
      setCheckIns(data);
    } catch (error) {
      console.error('Failed to load check-ins:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Check-In History</Text>
      <FlatList
        data={checkIns}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ 
            padding: 15, 
            marginBottom: 10, 
            backgroundColor: '#f5f5f5',
            borderRadius: 8
          }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
              {item.partName}
            </Text>
            <Text>Emotion: {item.emotion}</Text>
            <Text>Quadrant: {item.quadrant}</Text>
            <Text>Intensity: {item.intensity}/10</Text>
            {item.notes && <Text>Notes: {item.notes}</Text>}
            <Text style={{ marginTop: 5, color: '#666', fontSize: 12 }}>
              {format(new Date(item.createdAt), 'MMM d, yyyy h:mm a')}
            </Text>
          </View>
        )}
      />
    </View>
  );
};
```

## Interventions

### Letters Screen

```typescript
// src/screens/LettersScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, Alert } from 'react-native';
import APIService from '../services/api';

export const LettersScreen = ({ navigation }) => {
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLetters();
  }, []);

  const loadLetters = async () => {
    try {
      const data = await APIService.getLetters();
      setLetters(data);
    } catch (error) {
      console.error('Failed to load letters:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLetter = async (id) => {
    Alert.alert(
      'Delete Letter',
      'Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await APIService.deleteLetter(id);
              await loadLetters();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete letter');
            }
          }
        }
      ]
    );
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Loved One Letters</Text>
      <Button 
        title="Write New Letter" 
        onPress={() => navigation.navigate('WriteLetter', { onSave: loadLetters })} 
      />
      <FlatList
        data={letters}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ 
            padding: 15, 
            marginTop: 10, 
            backgroundColor: '#fff',
            borderRadius: 8,
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowRadius: 5,
          }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
              {item.senderName}
            </Text>
            <Text style={{ marginTop: 5 }}>{item.subject}</Text>
            <Text style={{ marginTop: 5, color: '#666' }}>
              {item.content.substring(0, 100)}...
            </Text>
            <Button 
              title="Delete" 
              onPress={() => handleDeleteLetter(item.id)}
              color="red"
            />
          </View>
        )}
      />
    </View>
  );
};
```

## Community

### Community Messages Screen

```typescript
// src/screens/CommunityScreen.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, Text, FlatList, TextInput, Button, 
  TouchableOpacity, ActivityIndicator 
} from 'react-native';
import APIService from '../services/api';

export const CommunityScreen = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadMessages();
    // Set up polling for new messages
    const interval = setInterval(loadMessages, 30000); // Every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadMessages = async () => {
    try {
      const data = await APIService.getCommunityMessages();
      setMessages(data);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    setSending(true);
    try {
      await APIService.createCommunityMessage({
        content: newMessage,
        type: 'support',
        isAnonymous: false,
      });
      setNewMessage('');
      await loadMessages();
    } catch (error) {
      Alert.alert('Error', 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleLike = async (id) => {
    try {
      await APIService.likeCommunityMessage(id);
      await loadMessages();
    } catch (error) {
      console.error('Failed to like message:', error);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Community</Text>
      
      <View style={{ marginBottom: 20 }}>
        <TextInput
          placeholder="Share something with the community..."
          value={newMessage}
          onChangeText={setNewMessage}
          multiline
          numberOfLines={3}
          style={{ 
            borderWidth: 1, 
            padding: 10, 
            marginBottom: 10,
            borderRadius: 8 
          }}
        />
        <Button 
          title={sending ? "Sending..." : "Send Message"} 
          onPress={handleSendMessage}
          disabled={sending || !newMessage.trim()}
        />
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        refreshing={refreshing}
        onRefresh={() => {
          setRefreshing(true);
          loadMessages();
        }}
        renderItem={({ item }) => (
          <View style={{ 
            padding: 15, 
            marginBottom: 10, 
            backgroundColor: '#f9f9f9',
            borderRadius: 8
          }}>
            <Text style={{ fontWeight: 'bold' }}>
              {item.user?.name || 'Anonymous'}
            </Text>
            <Text style={{ marginTop: 5 }}>{item.content}</Text>
            <View style={{ 
              flexDirection: 'row', 
              justifyContent: 'space-between',
              marginTop: 10 
            }}>
              <TouchableOpacity onPress={() => handleLike(item.id)}>
                <Text>👍 {item.likesCount || 0} likes</Text>
              </TouchableOpacity>
              <Text style={{ color: '#666', fontSize: 12 }}>
                {new Date(item.createdAt).toLocaleDateString()}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};
```

## Offline Support

### Network Status Indicator

```typescript
// src/components/NetworkStatusBar.tsx
import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const NetworkStatusBar = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingSync, setPendingSync] = useState(0);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected ?? false);
    });

    checkPendingSync();
    const interval = setInterval(checkPendingSync, 5000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  const checkPendingSync = async () => {
    const queueStr = await AsyncStorage.getItem('sync_queue');
    const queue = queueStr ? JSON.parse(queueStr) : [];
    setPendingSync(queue.length);
  };

  if (isOnline && pendingSync === 0) {
    return null; // Don't show anything when everything is fine
  }

  return (
    <View style={{ 
      backgroundColor: isOnline ? '#ffa500' : '#ff4444',
      padding: 10,
      alignItems: 'center'
    }}>
      <Text style={{ color: 'white', fontWeight: 'bold' }}>
        {!isOnline ? 'Offline Mode' : `Syncing ${pendingSync} items...`}
      </Text>
    </View>
  );
};
```

### Usage in App

```typescript
// App.tsx
import React from 'react';
import { SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { NetworkStatusBar } from './src/components/NetworkStatusBar';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NetworkStatusBar />
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaView>
  );
}
```

## Complete Example: App Navigator with Auth

```typescript
// src/navigation/AppNavigator.tsx
import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ActivityIndicator, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { CheckInScreen } from '../screens/CheckInScreen';
import { CommunityScreen } from '../screens/CommunityScreen';
// ... other screens

const Stack = createStackNavigator();

const AppNavigator = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      setIsAuthenticated(!!token);
    } catch (error) {
      console.error('Failed to check auth status:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator>
      {!isAuthenticated ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="CheckIn" component={CheckInScreen} />
          <Stack.Screen name="Community" component={CommunityScreen} />
          {/* Add more authenticated screens */}
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
```

## Testing Your Integration

### Manual Test Checklist

1. **Register**: Create new account → Should save token
2. **Login**: Login with credentials → Should navigate to main app
3. **Create Check-In (Online)**: Submit check-in → Should appear immediately
4. **Create Check-In (Offline)**: 
   - Turn off WiFi
   - Submit check-in
   - Should save locally
   - Turn on WiFi
   - Should sync automatically
5. **Community**: Post message → Should appear in feed
6. **Profile**: Edit profile → Should update on backend

### Debug Tips

```typescript
// Add to APIService for debugging
private client: AxiosInstance;

constructor() {
  this.client = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
  });

  // Log all requests (remove in production)
  this.client.interceptors.request.use(config => {
    console.log('API Request:', config.method, config.url, config.data);
    return config;
  });

  // Log all responses (remove in production)
  this.client.interceptors.response.use(
    response => {
      console.log('API Response:', response.status, response.data);
      return response;
    },
    error => {
      console.error('API Error:', error.response?.status, error.response?.data);
      return Promise.reject(error);
    }
  );
}
```

These examples provide a complete foundation for integrating your frontend with the backend. Adjust styling and add more features as needed!
