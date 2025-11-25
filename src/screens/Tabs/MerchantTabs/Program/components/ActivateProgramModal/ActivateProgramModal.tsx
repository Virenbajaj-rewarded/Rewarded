import { View } from 'react-native';
import { Modal, Typography } from '@/components';
import IconByVariant from '@/components/atoms/IconByVariant';
import { IProgram } from '@/interfaces';
import { EProgramStrategy, EProgramStrategyDisplayNames } from '@/enums';
import { styles } from './ActivateProgramModal.styles';

export interface ActivateProgramModalProps {
  visible: boolean;
  onClose: () => void;
  onCancel: () => void;
  onSubmit: () => void;
  program: IProgram;
}

export default function ActivateProgramModal({
  visible,
  onClose,
  onCancel,
  onSubmit,
  program,
}: ActivateProgramModalProps) {
  const getStrategyText = () => {
    if (program.strategy === EProgramStrategy.PERCENT_BACK) {
      return `${EProgramStrategyDisplayNames[program.strategy]} ${program.percentBack}%`;
    }
    return EProgramStrategyDisplayNames[program.strategy];
  };

  return (
    <Modal
      visible={visible}
      title="Activate Program?"
      description="Once the program is activated it can't be changed. If you want to activate this program later save this program as a draft."
      submitButtonLabel="Activate Program"
      cancelButtonLabel="Save as Draft"
      onSubmit={onSubmit}
      onCancel={onCancel}
      onClose={onClose}
    >
      <View style={styles.programDetailsContainer}>
        <View style={styles.programDetailItem}>
          <IconByVariant path="star" width={20} height={20} color="#FFFFFF" />
          <Typography fontVariant="regular" fontSize={16} color="#FFFFFF" style={styles.detailText}>
            {program.name}
          </Typography>
        </View>
        <View style={styles.programDetailItem}>
          <IconByVariant path="usd" width={20} height={20} color="#FFFFFF" />
          <Typography fontVariant="regular" fontSize={16} color="#FFFFFF" style={styles.detailText}>
            ${program.budget.toFixed(2)}
          </Typography>
        </View>
        <View style={styles.programDetailItem}>
          <IconByVariant path="fire" width={20} height={20} color="#FFFFFF" />
          <Typography fontVariant="regular" fontSize={16} color="#FFFFFF" style={styles.detailText}>
            {getStrategyText()}
          </Typography>
        </View>
      </View>
    </Modal>
  );
}

