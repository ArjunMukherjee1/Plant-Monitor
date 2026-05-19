import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { CATEGORIES, CategoryFilter, Plant, plants } from '../data/plants';
import { colors, fontSize, radius, spacing } from '../constants/theme';

interface Props {
  visible: boolean;
  onSelect: (plant: Plant) => void;
  onClose: () => void;
  dismissable?: boolean;
}

export function PlantPicker({ visible, onSelect, onClose, dismissable = true }: Props) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<CategoryFilter>('All');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return plants.filter((p) => {
      const matchesCategory = category === 'All' || p.category === category;
      const matchesQuery =
        q === '' ||
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

  function handleSelect(plant: Plant) {
    onSelect(plant);
    setQuery('');
    setCategory('All');
  }

  function handleClose() {
    onClose();
    setQuery('');
    setCategory('All');
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={dismissable ? handleClose : undefined}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Select Plant</Text>
          {dismissable && (
            <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>Done</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Search */}
        <View style={styles.searchRow}>
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            placeholder="Search plants…"
            placeholderTextColor={colors.textFaint}
            autoCapitalize="none"
            autoCorrect={false}
            clearButtonMode="while-editing"
          />
        </View>

        {/* Category chips */}
        <View style={styles.chipsRow}>
          <FlatList
            horizontal
            data={CATEGORIES as unknown as CategoryFilter[]}
            keyExtractor={(item) => item}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsContent}
            renderItem={({ item }) => {
              const active = item === category;
              return (
                <TouchableOpacity
                  style={[styles.chip, active && styles.chipActive]}
                  onPress={() => setCategory(item)}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>

        {/* Plant list */}
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No plants found</Text>
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.plantRow}
              onPress={() => handleSelect(item)}
            >
              <View style={styles.plantInfo}>
                <Text style={styles.plantName}>{item.name}</Text>
                <Text style={styles.plantCategory}>{item.category}</Text>
              </View>
              <Text style={styles.plantArrow}>›</Text>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: fontSize.xl,
    color: colors.text,
    fontWeight: '700',
  },
  closeBtn: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  closeBtnText: {
    fontSize: fontSize.md,
    color: colors.good,
    fontWeight: '600',
  },
  searchRow: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  searchInput: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    color: colors.text,
    fontSize: fontSize.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipsRow: {
    marginBottom: spacing.sm,
  },
  chipsContent: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.good + '22',
    borderColor: colors.good,
  },
  chipText: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    fontWeight: '500',
  },
  chipTextActive: {
    color: colors.good,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 60,
  },
  plantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  plantInfo: {
    flex: 1,
  },
  plantName: {
    fontSize: fontSize.md,
    color: colors.text,
    fontWeight: '500',
  },
  plantCategory: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    marginTop: 2,
  },
  plantArrow: {
    fontSize: fontSize.xl,
    color: colors.textFaint,
    marginLeft: spacing.sm,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
  },
  emptyContainer: {
    paddingTop: spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: fontSize.md,
    color: colors.textMuted,
  },
});
