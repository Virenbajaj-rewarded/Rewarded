import { useState, useCallback } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { Typography } from '@/components';
import styles from './Selector.styles';

export interface SelectorOption<T = string> {
  value: T;
  label: string;
}

interface SelectorProps<T = string> {
  value?: T;
  onValueChange: (value: T) => void;
  options: SelectorOption<T>[];
  label?: string;
  placeholder?: string;
  error?: string;
  style?: any;
  required?: boolean;
}

export default function Selector<T = string>({
  value,
  onValueChange,
  options,
  label,
  placeholder = 'Select an option',
  error,
  style,
  required,
}: SelectorProps<T>) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find(option => option.value === value);

  const handleSelect = useCallback(
    (option: SelectorOption<T>) => {
      onValueChange(option.value);
      setIsOpen(false);
    },
    [onValueChange]
  );

  const toggleDropdown = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  return (
    <View style={[styles.container, style]}>
      {label && (
        <View style={styles.labelContainer}>
          {required && (
            <Typography fontVariant="regular" fontSize={14} color="#FF4D4F">
              {'*'}
            </Typography>
          )}
          <Typography fontVariant="regular" fontSize={14} color="#FFFFFF" style={styles.label}>
            {label}
          </Typography>
        </View>
      )}

      <View style={styles.inputContainer}>
        <TouchableOpacity
          style={[styles.input, error && styles.inputError, isOpen && styles.inputFocused]}
          onPress={toggleDropdown}
          activeOpacity={0.7}
        >
          <Typography
            fontVariant="regular"
            fontSize={16}
            color={selectedOption ? '#FFFFFF' : '#4D4D4D'}
            style={styles.inputText}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </Typography>

          <Typography fontVariant="regular" fontSize={16} color="#4D4D4D">
            {isOpen ? '▲' : '▼'}
          </Typography>
        </TouchableOpacity>
      </View>

      {isOpen && (
        <View style={styles.dropdown}>
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {options.map(option => (
              <TouchableOpacity
                key={String(option.value)}
                style={[styles.option, value === option.value && styles.selectedOption]}
                onPress={() => handleSelect(option)}
                activeOpacity={0.7}
              >
                <Typography
                  fontVariant="regular"
                  fontSize={16}
                  color={value === option.value ? '#007AFF' : '#FFFFFF'}
                >
                  {option.label}
                </Typography>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {error && (
        <Typography fontVariant="regular" fontSize={12} color="#FF6B6B" style={styles.errorText}>
          {error}
        </Typography>
      )}
    </View>
  );
}
