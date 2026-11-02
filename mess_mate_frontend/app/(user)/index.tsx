import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { PublicMess, searchMesses } from '../../src/api/publicApi';
import MessCard from '../../src/components/MessCard';



export default function ExploreScreen() {
  const router = useRouter();

  const [query, setQuery] = useState('');
  const [messes, setMesses] = useState<PublicMess[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      loadMesses(query);
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  const loadMesses = async (search: string) => {
    try {
      setError('');
      setLoading(true);
      const data = await searchMesses(search);
      setMesses(data);
    }
     catch {
      setError('Could not load messes. Check your connection and try again.');
    }
    //  catch (err: any) {
    // console.log('Load messes error:', err.response?.status, err.response?.data, err.message);
    // setError('Could not load messes. Check your connection and try again.');
    // }
     finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const refresh = async () => {
    setRefreshing(true);
    await loadMesses(query);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Find your next meal</Text>
        <Text style={styles.subtitle}>
          Discover messes around your area
        </Text>

        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={21} color="#777777" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search mess name or locality"
            placeholderTextColor="#888888"
            style={styles.input}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <Ionicons
              name="close-circle"
              size={20}
              color="#777777"
              onPress={() => setQuery('')}
            />
          )}
        </View>
      </View>

      {loading && !refreshing ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#16845B" />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.message}>{error}</Text>
          <Text style={styles.retry} onPress={() => loadMesses(query)}>
            Try again
          </Text>
        </View>
      ) : (
        <FlatList
          data={messes}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refresh} />
          }
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
              No verified messes found. Try another search.
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  greeting: {
    fontSize: 26,
    fontWeight: '800',
    color: '#202620',
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: '#747A74',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    marginTop: 20,
    height: 50,
    borderWidth: 1,
    borderColor: '#E4E7E2',
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#202620',
  },
  list: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
    flexGrow: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  message: {
    textAlign: 'center',
    color: '#747A74',
    fontSize: 15,
  },
  retry: {
    color: '#16845B',
    fontWeight: '700',
    marginTop: 14,
  },
});

