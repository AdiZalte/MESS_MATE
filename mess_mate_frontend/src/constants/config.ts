import { Platform } from 'react-native';

const LAN_IP = '192.168.2.109'; // update this if your IP changes again

export const API_BASE_URL = Platform.OS === 'web'
  ? 'http://localhost:8080'
  : `http://${LAN_IP}:8080`;

export const CLOUDINARY_CLOUD_NAME = 'grcee7ls';
export const CLOUDINARY_UPLOAD_PRESET = 'mess-mate-images';