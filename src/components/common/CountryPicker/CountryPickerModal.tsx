import React, { useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  FlatList, 
  TouchableOpacity, 
  TextInput, 
  StyleSheet, 
  SafeAreaView 
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, SPACING, TYPOGRAPHY } from '@config/theme';
import { COUNTRY_CODES, Country } from '../../../data/CountryCodes';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelect: (country: Country) => void;
}

const CountryPickerModal: React.FC<Props> = ({ visible, onClose, onSelect }) => {
  const [search, setSearch] = useState('');

  // Filter countries based on search text (Optimized)
  const filteredCountries = useMemo(() => {
    return COUNTRY_CODES.filter(country => 
      country.name.toLowerCase().includes(search.toLowerCase()) || 
      country.dial_code.includes(search)
    );
  }, [search]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <SafeAreaView style={styles.container}>
          
          {/* Header with Close Button */}
          <View style={styles.header}>
            <Text style={styles.title}>Select Country</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="close" size={24} color={COLORS.black} />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Icon name="search" size={20} color={COLORS.gray500} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search country or code..."
              placeholderTextColor={COLORS.gray500}
              value={search}
              onChangeText={setSearch}
              autoCorrect={false}
            />
          </View>

          {/* Country List */}
          <FlatList
            data={filteredCountries}
            keyExtractor={(item) => item.code}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.item} 
                onPress={() => {
                  onSelect(item);
                  onClose();
                  setSearch(''); // Reset search
                }}
              >
                <Text style={styles.flag}>{item.flag}</Text>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.dialCode}>{item.dial_code}</Text>
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
          
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end', // Pushes modal to bottom
  },
  container: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '80%', // Takes up 80% of screen
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray200,
  },
  title: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontSize: 18,
    color: COLORS.black,
  },
  closeButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray100,
    margin: SPACING.md,
    paddingHorizontal: SPACING.md,
    height: 48,
    borderRadius: 12,
  },
  searchIcon: {
    marginRight: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    color: COLORS.black,
    fontSize: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    height: 60,
  },
  flag: {
    fontSize: 24,
    marginRight: SPACING.md,
  },
  name: {
    flex: 1,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    fontSize: 16,
    color: COLORS.black,
  },
  dialCode: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontSize: 16,
    color: COLORS.gray500,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.gray100,
    marginLeft: 50, // Indent separator
  },
});

export default CountryPickerModal;