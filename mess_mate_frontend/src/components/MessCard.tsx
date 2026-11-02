import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PublicMess } from '../api/publicApi';
import { useFavorites } from '../context/FavoritesContext';

interface Props {
  mess: PublicMess;
  onPress: () => void;
}

export default function MessCard({ mess, onPress }: Props) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(mess.id);

  return (
    <Pressable style={styles.card} onPress={onPress}>
      {mess.coverImageUrl1 ? (
        <Image source={{ uri: mess.coverImageUrl1 }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.placeholder]}>
          <Ionicons name="restaurant-outline" size={34} color="#888" />
        </View>
      )}

      <Pressable
        style={styles.heart}
        onPress={(event) => {
          event.stopPropagation();
          toggleFavorite(mess.id);
        }}
        hitSlop={10}
      >
        <Ionicons
          name={favorite ? 'heart' : 'heart-outline'}
          size={23}
          color={favorite ? '#E5484D' : '#333'}
        />
      </Pressable>

      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {mess.name}
        </Text>

        <Text style={styles.location} numberOfLines={1}>
          {[mess.locality, mess.city].filter(Boolean).join(', ') ||
            mess.address ||
            'Location unavailable'}
        </Text>

        <View style={styles.footer}>
          <Text style={styles.rating}>
            ★ {mess.avgRating ?? 'New'}
            {mess.totalRatings ? ` (${mess.totalRatings})` : ''}
          </Text>

          {mess.avgPricePerMeal != null && (
            <Text style={styles.price}>
              ₹{mess.avgPricePerMeal}/meal
            </Text>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 175,
  },
  placeholder: {
    backgroundColor: '#F0F2F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heart: {
    position: 'absolute',
    right: 12,
    top: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 9,
  },
  content: {
    padding: 14,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#202620',
  },
  location: {
    color: '#747A74',
    marginTop: 5,
    fontSize: 13,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  rating: {
    color: '#333333',
    fontWeight: '600',
  },
  price: {
    color: '#16845B',
    fontWeight: '700',
  },
});