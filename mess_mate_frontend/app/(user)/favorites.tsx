import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { PublicMess, getMessesByIds } from '../../src/api/publicApi';
import { useFavorites } from '../../src/context/FavoritesContext';
import MessCard from '../../src/components/MessCard';

export default function FavoritesScreen() {
  const router = useRouter();
  const { favoriteIds, isLoaded } = useFavorites();

  const [messes, setMesses] = useState<PublicMess[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoaded) return;

    let active = true;

    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getMessesByIds(favoriteIds);
        if (active) {
          const order = new Map(favoriteIds.map((id, index) => [id, index]));
          setMesses(
            data.sort(
              (a, b) =>
                (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0)
            )
          );
        }
      } catch {
        if (active) setError('Could not load your favorites.');
      } finally {
        if (active) setLoading(false);
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [favoriteIds, isLoaded]);

  if (!isLoaded || loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#16845B" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Your favorites</Text>

      {error ? (
        <Text style={styles.message}>{error}</Text>
      ) : (
        <FlatList
          data={messes}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <MessCard
              mess={item}
              onPress={() =>
                router.push({
                  pathname: '/(user)/mess/[id]',
                  params: { id: item.id },
                })
              }
            />
          )}
          ListEmptyComponent={
            <Text style={styles.message}>
              No favorites yet. Tap the heart on a mess to save it.
            </Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8F6',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#202620',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    flexGrow: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    color: '#747A74',
    textAlign: 'center',
    marginHorizontal: 24,
    marginTop: 30,
  },
});