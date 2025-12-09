import { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  FlatList,
  Modal,
  Pressable,
  LayoutRectangle,
  findNodeHandle,
} from 'react-native';
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
  const [anchorLayout, setAnchorLayout] = useState<LayoutRectangle | null>(null);
  const anchorRef = useRef<View>(null);

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

  useEffect(() => {
    if (isOpen && anchorRef.current) {
      const handle = findNodeHandle(anchorRef.current);
      if (handle) {
        anchorRef.current.measureInWindow((x, y, width, height) => {
          setAnchorLayout({ x, y, width, height });
        });
      }
    }
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

      <View style={styles.inputContainer} ref={anchorRef}>
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

      {isOpen && anchorLayout && (
        <Modal transparent visible onRequestClose={toggleDropdown}>
          <Pressable style={styles.backdrop} onPress={toggleDropdown} />
          <View
            style={[
              styles.dropdownModal,
              {
                top: anchorLayout.y + anchorLayout.height,
                left: anchorLayout.x,
                width: anchorLayout.width,
              },
            ]}
          >
            <FlatList
              data={options}
              keyExtractor={item => String(item.value)}
              style={styles.scrollView}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              nestedScrollEnabled
              scrollEnabled
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.option, value === item.value && styles.selectedOption]}
                  onPress={() => handleSelect(item)}
                  activeOpacity={0.7}
                >
                  <Typography
                    fontVariant="regular"
                    fontSize={16}
                    color={value === item.value ? '#007AFF' : '#FFFFFF'}
                  >
                    {item.label}
                  </Typography>
                </TouchableOpacity>
              )}
            />
          </View>
        </Modal>
      )}

      {error && (
        <Typography fontVariant="regular" fontSize={12} color="#FF6B6B" style={styles.errorText}>
          {error}
        </Typography>
      )}
    </View>
  );
}
