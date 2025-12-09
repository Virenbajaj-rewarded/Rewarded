import Modal from '@/components/Modal/Modal';
import { StyleSheet } from 'react-native';

interface StopProgramModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  description: string;
}

export const StopProgramModal = ({
  visible,
  onClose,
  onConfirm,
  description,
  isLoading = false,
}: StopProgramModalProps) => {
  return (
    <Modal
      visible={visible}
      title="Stop This Program?"
      description={description}
      submitButtonLabel={isLoading ? 'Stopping...' : 'Stop Program'}
      cancelButtonLabel="Cancel"
      onSubmit={onConfirm}
      onCancel={onClose}
      onClose={onClose}
      submitButtonType="delete"
      submitButtonStyle={styles.stopButton}
      submitButtonTextStyle={styles.stopButtonText}
      cancelButtonStyle={styles.cancelButton}
      cancelButtonTextStyle={styles.cancelButtonText}
    />
  );
};

const styles = StyleSheet.create({
  stopButton: {
    backgroundColor: '#FF4D4F',
    borderRadius: 8,
  },
  stopButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    paddingVertical: 0,
  },
  cancelButtonText: {
    color: '#3C83F6',
    fontSize: 16,
  },
});
