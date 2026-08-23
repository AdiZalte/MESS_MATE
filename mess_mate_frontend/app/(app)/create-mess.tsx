import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Image, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import CustomInput from '../../src/components/common/CustomInput';
import CustomButton from '../../src/components/common/CustomButton';
import { uploadImageToCloudinary } from '../../src/utils/imageUpload';
import { createMess } from '../../src/api/messApi';
import { COLORS } from '../../src/constants/colors';
import { getCurrentLocation, Coordinates, LocationPermissionDeniedError, openAppSettings } from '../../src/utils/location';


export default function CreateMessScreen() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [locality, setLocality] = useState('');
  const [avgPricePerMeal, setAvgPricePerMeal] = useState('');

  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);

  const [imageUris, setImageUris] = useState<string[]>([]);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [imageUploading, setImageUploading] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const handleGetLocation = async () => {
  setLocationLoading(true);
  try {
    const coords = await getCurrentLocation();
    setCoordinates(coords);
  } catch (err: any) {
    if (err instanceof LocationPermissionDeniedError) {
      Alert.alert(
        'Location Permission Needed',
        err.message,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: openAppSettings },
        ]
      );
    } else {
      Alert.alert('Location Error', 'Could not get your location. Please try again.');
    }
  } finally {
    setLocationLoading(false);
  }
};

  const handlePickImage = async () => {
    if (imageUris.length >= 3) {
      Alert.alert('Limit reached', 'You can upload up to 3 images');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7, // compress before upload — keeps file size reasonable
    });

    if (result.canceled) return;

    const uri = result.assets[0].uri;
    setImageUris((prev) => [...prev, uri]);

    setImageUploading(true);
    try {
      const url = await uploadImageToCloudinary(uri);
      setUploadedUrls((prev) => [...prev, url]);
    } catch (err) {
      Alert.alert('Upload failed', 'Could not upload this image, please try again');
      setImageUris((prev) => prev.filter((u) => u !== uri));
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!name || !address || !city) {
      Alert.alert('Missing info', 'Please fill in the required fields');
      return;
    }
    if (!coordinates) {
      Alert.alert('Location required', 'Please capture your mess location first');
      return;
    }

    setSubmitting(true);
    try {
      await createMess({
        name,
        description,
        address,
        city,
        locality,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        messType: 'BOTH',
        priceType: 'PER_MEAL',
        avgPricePerMeal: avgPricePerMeal ? parseFloat(avgPricePerMeal) : undefined,
        openingTime: '08:00:00',
        closingTime: '22:00:00',
        coverImageUrl1: uploadedUrls[0],
        coverImageUrl2: uploadedUrls[1],
        coverImageUrl3: uploadedUrls[2],
      });

      Alert.alert('Success', 'Your mess has been registered', [
        { text: 'OK', onPress: () => router.replace('/(app)/dashboard') },
      ]);
      } catch (err: any) {
      console.log('STATUS:', err.response?.status);
      console.log('FULL ERROR DATA:', JSON.stringify(err.response?.data, null, 2));

      const data = err.response?.data;
      let message = 'Something went wrong';

      if (data?.message) {
        message = data.message;
      } else if (data && typeof data === 'object') {
        const firstError = Object.values(data)[0];
        if (typeof firstError === 'string') {
          message = firstError;
        }
      }

      Alert.alert('Failed', message);
      }finally {
      setSubmitting(false);
      }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Register Your Mess</Text>
      <Text style={styles.subtitle}>This is a one-time setup — fill it carefully</Text>

      <CustomInput label="Mess Name" value={name} onChangeText={setName} placeholder="e.g. Sharma Tiffin Service" />
      <CustomInput label="Description" value={description} onChangeText={setDescription} placeholder="Short description" maxLength={50} />
      <CustomInput label="Address" value={address} onChangeText={setAddress} placeholder="Street address" />
      <CustomInput label="City" value={city} onChangeText={setCity} placeholder="City" />
      <CustomInput label="Locality" value={locality} onChangeText={setLocality} placeholder="Area/locality" />
      <CustomInput
        label="Avg Price Per Meal"
        value={avgPricePerMeal}
        onChangeText={setAvgPricePerMeal}
        placeholder="e.g. 80"
        keyboardType="numeric"
      />

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Location</Text>
        {coordinates ? (
          <Text style={styles.coordsText}>
            Captured: {coordinates.latitude.toFixed(6)}, {coordinates.longitude.toFixed(6)}
          </Text>
        ) : (
          <Text style={styles.coordsTextMuted}>No location captured yet</Text>
        )}
        <CustomButton
          title={coordinates ? 'Update Location' : 'Get Current Location'}
          onPress={handleGetLocation}
          loading={locationLoading}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Cover Images ({imageUris.length}/3)</Text>
        <View style={styles.imageRow}>
          {imageUris.map((uri, index) => (
            <Image key={index} source={{ uri }} style={styles.thumbnail} />
          ))}
        </View>
        <TouchableOpacity onPress={handlePickImage} style={styles.addImageButton} disabled={imageUploading}>
          <Text style={styles.addImageText}>{imageUploading ? 'Uploading...' : '+ Add Image'}</Text>
        </TouchableOpacity>
      </View>

      <CustomButton title="Register Mess" onPress={handleSubmit} loading={submitting} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, backgroundColor: COLORS.background },
  title: { fontSize: 24, fontWeight: '700', color: COLORS.text, marginBottom: 6 },
  subtitle: { fontSize: 14, color: COLORS.textLight, marginBottom: 24 },
  section: { marginTop: 8, marginBottom: 20 },
  sectionLabel: { fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 8 },
  coordsText: { fontSize: 13, color: COLORS.text, marginBottom: 8 },
  coordsTextMuted: { fontSize: 13, color: COLORS.textLight, marginBottom: 8 },
  imageRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  thumbnail: { width: 70, height: 70, borderRadius: 8 },
  addImageButton: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  addImageText: { color: COLORS.primary, fontWeight: '600' },
});