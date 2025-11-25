import { useState } from 'react';
import { Modal, CircularRadioGroup } from '@/components';
import { EPaymentMethod, EPaymentMethodDisplayNames } from '@/enums';
import { styles } from './PaymentMethodModal.styles';

export interface PaymentMethodModalProps {
  visible: boolean;
  onClose: () => void;
  onCancel: () => void;
  onSubmit: (paymentMethod: EPaymentMethod) => void;
}

export default function PaymentMethodModal({
  visible,
  onClose,
  onCancel,
  onSubmit,
}: PaymentMethodModalProps) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<EPaymentMethod>(
    EPaymentMethod.POINT_BALANCE
  );

  const paymentMethodOptions = [
    {
      value: EPaymentMethod.POINT_BALANCE,
      label: EPaymentMethodDisplayNames[EPaymentMethod.POINT_BALANCE],
    },
    {
      value: EPaymentMethod.VISA_MASTERCARD,
      label: EPaymentMethodDisplayNames[EPaymentMethod.VISA_MASTERCARD],
    },
    {
      value: EPaymentMethod.USDC,
      label: EPaymentMethodDisplayNames[EPaymentMethod.USDC],
    },
  ];

  const handleSubmit = () => {
    onSubmit(selectedPaymentMethod);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      title="Choose Payment Method"
      submitButtonLabel="Pay"
      cancelButtonLabel="Cancel"
      onSubmit={handleSubmit}
      onCancel={onCancel}
      onClose={onClose}
    >
      <CircularRadioGroup
        value={selectedPaymentMethod}
        onValueChange={(value: string) => setSelectedPaymentMethod(value as EPaymentMethod)}
        options={paymentMethodOptions}
        color="#3c83f6"
        uncheckedColor="#FFFFFF"
        direction="vertical"
        style={styles.paymentMethodRadioGroup}
      />
    </Modal>
  );
}
