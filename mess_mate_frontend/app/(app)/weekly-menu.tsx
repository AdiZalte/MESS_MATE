import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { COLORS } from '../../src/constants/colors';
import apiClient from '../../src/api/apiClient';

type MealType = 'LUNCH' | 'DINNER';

type MenuItem = {
  name: string;
  isVeg: boolean;
  mealType: MealType;
};

type Day = {
  dayOfWeek: string;
  items: MenuItem[];
};

const DAYS = [
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
  'SUNDAY',
];

export default function WeeklyMenuScreen() {
  const [days, setDays] = useState<Day[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadMenu();
  }, []);

  const loadMenu = async () => {
    try {
      const response = await apiClient.get('/owner/menu/week');

      const existing = response.data.days || [];

      const formatted = DAYS.map(day => {
        const found = existing.find(
          (item: Day) => item.dayOfWeek === day
        );

        return {
          dayOfWeek: day,
          items: found?.items || [],
        };
      });

      setDays(formatted);
    } catch (error: any) {
      if (error.response?.status === 404) {
        setDays(
          DAYS.map(day => ({
            dayOfWeek: day,
            items: [],
          }))
        );
      } else {
        Alert.alert('Error', 'Could not load weekly menu');
      }
    } finally {
      setLoading(false);
    }
  };

  const addItem = (dayIndex: number, mealType: MealType) => {
    setDays(prev =>
      prev.map((day, index) =>
        index === dayIndex
          ? {
              ...day,
              items: [
                ...day.items,
                {
                  name: '',
                  isVeg: true,
                  mealType,
                },
              ],
            }
          : day
      )
    );
  };

  const updateItem = (
    dayIndex: number,
    itemIndex: number,
    field: 'name' | 'isVeg',
    value: string | boolean
  ) => {
    setDays(prev =>
      prev.map((day, index) =>
        index === dayIndex
          ? {
              ...day,
              items: day.items.map((item, i) =>
                i === itemIndex
                  ? { ...item, [field]: value }
                  : item
              ),
            }
          : day
      )
    );
  };

  const removeItem = (dayIndex: number, itemIndex: number) => {
    setDays(prev =>
      prev.map((day, index) =>
        index === dayIndex
          ? {
              ...day,
              items: day.items.filter((_, i) => i !== itemIndex),
            }
          : day
      )
    );
  };

  const saveMenu = async () => {
    for (const day of days) {
      if (
        !day.items.some(item => item.mealType === 'LUNCH') ||
        !day.items.some(item => item.mealType === 'DINNER')
      ) {
        Alert.alert(
          'Incomplete Menu',
          `${day.dayOfWeek} needs both lunch and dinner.`
        );
        return;
      }

      if (day.items.some(item => !item.name.trim())) {
        Alert.alert(
          'Invalid Menu',
          'Every food item must have a name.'
        );
        return;
      }
    }

    try {
      setSaving(true);

      await apiClient.post('/owner/menu/week', {
        days,
      });

      Alert.alert('Success', 'Weekly menu saved');
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Could not save weekly menu'
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Weekly Menu</Text>

      {days.map((day, dayIndex) => (
        <View key={day.dayOfWeek} style={styles.dayCard}>
          <Text style={styles.dayTitle}>{day.dayOfWeek}</Text>

          {(['LUNCH', 'DINNER'] as MealType[]).map(meal => {
            const mealItems = day.items
              .map((item, index) => ({ item, index }))
              .filter(({ item }) => item.mealType === meal);

            return (
              <View key={meal} style={styles.mealSection}>
                <Text style={styles.mealTitle}>
                  {meal === 'LUNCH' ? 'Lunch' : 'Dinner'}
                </Text>

                {mealItems.map(({ item, index }) => (
                  <View key={index} style={styles.itemRow}>
                    <TextInput
                      value={item.name}
                      onChangeText={value =>
                        updateItem(dayIndex, index, 'name', value)
                      }
                      placeholder="Food name"
                      style={styles.input}
                    />

                    <TouchableOpacity
                      style={[
                        styles.vegButton,
                        item.isVeg && styles.selected,
                      ]}
                      onPress={() =>
                        updateItem(
                          dayIndex,
                          index,
                          'isVeg',
                          !item.isVeg
                        )
                      }
                    >
                      <Text>
                        {item.isVeg ? 'VEG' : 'NON-VEG'}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => removeItem(dayIndex, index)}
                    >
                      <Text style={styles.remove}>×</Text>
                    </TouchableOpacity>
                  </View>
                ))}

                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => addItem(dayIndex, meal)}
                >
                  <Text>+ Add food</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      ))}

      <TouchableOpacity
        style={styles.saveButton}
        onPress={saveMenu}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveText}>Save Weekly Menu</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  dayCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 14,
    borderRadius: 12,
  },
  dayTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  mealSection: {
    marginBottom: 16,
  },
  mealTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 8,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
  },
  vegButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  selected: {
    backgroundColor: '#d8f3dc',
  },
  remove: {
    fontSize: 24,
    color: 'red',
  },
  addButton: {
    padding: 10,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 30,
  },
  saveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});