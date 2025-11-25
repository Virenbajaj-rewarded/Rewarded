import { View, TouchableOpacity, Modal as NativeModal } from 'react-native';
import { Typography, PrimaryButton } from '@/components';
import IconByVariant from '../atoms/IconByVariant';
import { styles } from './Modal.styles';
import { IModal } from './Modal.types';

export default function Modal({
  visible,
  title,
  description,
  submitButtonLabel,
  cancelButtonLabel,
  onSubmit,
  onCancel,
  onClose,
  submitButtonStyle,
  submitButtonTextStyle,
  cancelButtonStyle,
  cancelButtonTextStyle,
  submitButtonType = 'default',
  children,
}: IModal) {
  return (
    <NativeModal
      visible={visible}
      transparent={true}
      animationType="fade"
      statusBarTranslucent={true}
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity
          style={styles.modalContainer}
          activeOpacity={1}
          onPress={e => e.stopPropagation()}
        >
          <View style={styles.header}>
            <Typography fontVariant="medium" fontSize={20} color="#FFFFFF">
              {title}
            </Typography>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <IconByVariant path="close" />
            </TouchableOpacity>
          </View>

          {description && (
            <Typography
              fontVariant="regular"
              fontSize={14}
              color="#BFBFBF"
              style={styles.description}
            >
              {description}
            </Typography>
          )}

          {children}

          <View style={styles.buttonsContainer}>
            <PrimaryButton
              label={submitButtonLabel}
              onPress={onSubmit}
              style={[
                styles.submitButton,
                submitButtonStyle,
                submitButtonType === 'delete' && styles.submitDeleteButton,
              ]}
              textStyle={[styles.submitButtonText, submitButtonTextStyle]}
            />
            <PrimaryButton
              label={cancelButtonLabel}
              onPress={onCancel}
              style={[styles.cancelButton, cancelButtonStyle]}
              textStyle={[styles.cancelButtonText, cancelButtonTextStyle]}
            />
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </NativeModal>
  );
}
