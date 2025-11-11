import { View } from 'react-native';
import { Typography, PrimaryButton, RadioList } from '@/components';
import { styles } from './SignupChooseRole.styles';
import { useChooseRole } from './useChooseRole';
import { ERole } from '@/enums';
import SafeScreen from '@/components/templates/SafeScreen';

const SignupChooseRole = () => {
  const { handleSelectRole, handleNavigateToSignup, selectedRole } = useChooseRole();

  const roleOptions = [
    {
      value: ERole.USER,
      label: 'User',
      description: 'Get your rewards program & pay with them at your favourite stores',
      icon: 'user',
    },
    {
      value: ERole.MERCHANT,
      label: 'Merchant',
      description: 'Set up your rewards program & payment system today',
      icon: 'merchant',
    },
  ];

  return (
    <SafeScreen style={styles.container}>
      <View style={styles.content}>
        <Typography textAlign="left" fontVariant="regular" fontSize={14} color="#BFBFBF">
          Set up your rewards program & payment system today
        </Typography>
        <View style={styles.buttonsContainer}>
          <RadioList
            value={selectedRole}
            onValueChange={value => handleSelectRole(value as ERole)}
            options={roleOptions}
            color="#3c83f6"
            uncheckedColor="#FFFFFF"
          />
        </View>
      </View>

      <PrimaryButton label="Next" onPress={handleNavigateToSignup} style={styles.button} />
    </SafeScreen>
  );
};

export default SignupChooseRole;
