// src/utils/location.ts
import * as Location from 'expo-location';
import { Linking, Platform } from 'react-native';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export const getCurrentLocation = async (): Promise<Coordinates> => {
  // Check current status first, without triggering a prompt
  const { status: existingStatus } = await Location.getForegroundPermissionsAsync();

  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    // Only actually request if we haven't been permanently blocked already
    const { status } = await Location.requestForegroundPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    throw new LocationPermissionDeniedError(
      'Location permission is required to set your mess location. Please enable it in your device settings.'
    );
  }

  const location = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });

  return {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
  };
};

// A distinct error type so the UI can tell "permission problem"
// apart from "GPS timed out" or other generic failures.
export class LocationPermissionDeniedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LocationPermissionDeniedError';
  }
}

export const openAppSettings = () => {
  if (Platform.OS === 'ios') {
    Linking.openURL('app-settings:');
  } else {
    Linking.openSettings();
  }
};