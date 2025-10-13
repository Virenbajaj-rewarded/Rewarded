import { TextInput, TextInputProps } from 'react-native';
import { useTheme } from '@/theme';
import { styles } from './AuthTextInput.styles';

type Props = TextInputProps & {
  testID?: string;
};

export default function AuthTextInput({ style, ...rest }: Props) {
  const { colors } = useTheme();

  return (
    <TextInput placeholderTextColor={colors.gray400} style={[styles.input, style]} {...rest} />
  );
}
