import { View } from 'react-native';
import { styles } from './Tag.styles';
import { Typography } from '@/components';

export default function Tag({
  children,
  textColor = '#999999',
  backgroundColor = '#1F1F1F',
}: {
  children: React.ReactNode;
  textColor?: string;
  backgroundColor?: string;
}) {
  return (
    <View style={[styles.tag, { backgroundColor }]}>
      <Typography fontVariant="semibold" fontSize={14} color={textColor}>
        {children}
      </Typography>
    </View>
  );
}
