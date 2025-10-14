import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import MaterialIcons from '@react-native-vector-icons/material-design-icons';
import SafeScreen from '@/components/templates/SafeScreen';
import { RootScreenProps } from '@/navigation/types.ts';
import { Paths } from '@/navigation/paths.ts';
import IconByVariant from '@/components/atoms/IconByVariant';
import SliderButton from '@/components/atoms/SwipeButton';
import LottieView from 'lottie-react-native';
import { styles } from './styles';
import { useFetchCustomerById, useFetchMerchantBalanceQuery } from '@/services/user/useUser';
import { useCreateLedger } from '@/services/ledger/useLedger';
import uuid from 'react-native-uuid';
import { Skeleton } from '@/components/atoms/Skeleton';
import { useFocusEffect } from '@react-navigation/native';

const { width: screenWidth } = Dimensions.get('window');

export default function MerchantQRPayment({
  navigation,
  route,
}: RootScreenProps<Paths.MERCHANT_QR_PAYMENT>) {
  const { mutate: submitTransaction } = useCreateLedger();

  const {
    isLoading: isLoadingConsumer,
    isPending,
    data: consumer,
  } = useFetchCustomerById(route.params.consumerId);

  const [amount, setAmount] = useState('');
  const [comment, setComment] = useState('');
  const [warning, setWarning] = useState(false);
  const [isTopUp, setIsTopUp] = useState(true);

  const {
    isRefetching: isRefetchingBalance,
    isLoading: isLoadingBalance,
    data: balance,
  } = useFetchMerchantBalanceQuery();

  const amountInputRef = useRef<TextInput>(null);
  const commentInputRef = useRef<TextInput>(null);
  const confettiRef = useRef<LottieView>(null);

  const translateY = useSharedValue(50);

  useFocusEffect(
    React.useCallback(() => {
      confettiRef.current?.reset?.();
      confettiRef.current?.pause?.();
      return () => {
        confettiRef.current?.reset?.();
        confettiRef.current?.pause?.();
      };
    }, [])
  );

  useEffect(() => {
    translateY.value = withTiming(0, {
      duration: 400,
      easing: Easing.out(Easing.exp),
    });

    const timer = setTimeout(() => {
      amountInputRef.current?.focus();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const handleConfirm = async () => {
    const parsedAmount = parseFloat(amount);

    const type = isTopUp ? 'EARN' : 'REDEEM';
    submitTransaction(
      {
        type,
        value: {
          consumerId: consumer?.id || '',
          idempotencyKey: uuid.v4(),
          amount: type === 'EARN' ? parsedAmount * 100 : parsedAmount,
          comment,
        },
      },
      {
        onSuccess: tx => {
          confettiRef.current?.play(0);
          setTimeout(() => {
            navigation.goBack();
          }, 2000);
        },
        onError: e => {
          const error = e as Error;

          Alert.alert('Unexpected error', error?.message || 'Something went wrong');
        },
      }
    );
  };

  const handleInputChange = (text: string) => {
    if (!balance) {
      return;
    }
    let formatted = text.replace(',', '.');

    formatted = formatted.replace(/[^0-9.]/g, '');

    const firstDotIndex = formatted.indexOf('.');
    if (firstDotIndex !== -1) {
      formatted =
        formatted.slice(0, firstDotIndex + 1) +
        formatted.slice(firstDotIndex + 1).replace(/\./g, '');
    }

    let [intPart, decPart] = formatted.split('.');

    if (intPart) {
      intPart = intPart.slice(0, 8);
    }

    if (intPart && intPart.length > 1 && intPart.startsWith('0') && !decPart) {
      intPart = String(parseInt(intPart, 10));
    }

    if (decPart !== undefined) {
      decPart = decPart.slice(0, 2);
      formatted = decPart.length > 0 ? `${intPart}.${decPart}` : intPart + '.';
    } else {
      formatted = intPart ?? '';
    }

    if (formatted === '.') {
      formatted = '0.';
    }

    if (formatted === '0') {
      formatted = '';
    }

    setAmount(formatted);

    const numericValue = parseFloat(formatted);
    if (!isNaN(numericValue) && numericValue > balance!.balance && isTopUp) {
      setWarning(true);
    } else {
      setWarning(false);
    }
  };

  return (
    <>
      <SafeScreen>
        <KeyboardAvoidingView
          style={{ flex: 1, width: '100%' }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.headerWrapper}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              hitSlop={{ right: 10, left: 10, top: 10, bottom: 10 }}
            >
              <MaterialIcons name={'arrow-left'} size={24} color={'#ffffff'} />
            </TouchableOpacity>

            <View style={styles.userRow}>
              <Skeleton
                loading={isLoadingConsumer}
                width={40}
                height={40}
                style={{
                  borderRadius: 20,
                  marginRight: 12,
                }}
              >
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>ЮМ</Text>
                </View>
              </Skeleton>

              <Skeleton loading={isLoadingConsumer} height={24} width={135}>
                <Text style={styles.userEmail}>{consumer?.email}</Text>
              </Skeleton>
            </View>
          </View>
          <Animated.View style={[styles.content, animatedStyle]}>
            <View
              style={[
                styles.balanceContainer,
                warning && {
                  borderColor: '#ff0000',
                  backgroundColor: 'rgba(255,0,0,0.2)',
                },
              ]}
            >
              <MaterialIcons name={'wallet'} size={16} color={'#ffffff'} />
              <View style={styles.balanceLabelWrapper}>
                {isLoadingBalance || isRefetchingBalance ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text style={styles.balanceLabel}>{balance?.balance || 0}</Text>
                )}
                <IconByVariant path="coins" width={16} height={16} />
              </View>
            </View>
            <View style={styles.amountWrapper}>
              <TextInput
                ref={amountInputRef}
                style={styles.amountInput}
                keyboardType="numeric"
                value={amount}
                placeholderTextColor={'#FFFFFF'}
                allowFontScaling={false}
                onChangeText={handleInputChange}
                placeholder={'0'}
                caretHidden={true}
              />
              <IconByVariant path="coins" width={40} height={40} />
            </View>

            <View style={styles.switchContainer}>
              <TouchableOpacity
                style={[
                  styles.optionItem,
                  isTopUp && {
                    backgroundColor: '#3c83f6',
                  },
                ]}
                onPress={() => {
                  const numericValue = parseFloat(amount || '0');
                  if (!isNaN(numericValue) && numericValue > balance!.balance) {
                    setWarning(true);
                  }

                  setIsTopUp(true);
                }}
              >
                <Text style={styles.optionLabel}>Top up</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.optionItem,
                  !isTopUp && {
                    backgroundColor: '#3c83f6',
                  },
                ]}
                onPress={() => {
                  if (warning) {
                    setWarning(false);
                  }
                  setIsTopUp(false);
                }}
              >
                <Text style={styles.optionLabel}>Withdraw</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          <View style={styles.divider} />
          <View style={styles.confirmBtnWrapper}>
            <View style={styles.commentBox}>
              <TextInput
                ref={commentInputRef}
                style={styles.commentInput}
                value={comment}
                onChangeText={setComment}
                placeholder="Comment..."
                placeholderTextColor="#999"
                returnKeyType="done"
                multiline={true}
              />
            </View>

            <SliderButton
              onConfirm={handleConfirm}
              disabled={!amount || warning || isPending}
              buttonWidth={screenWidth - 32}
            />
          </View>
        </KeyboardAvoidingView>
      </SafeScreen>

      <LottieView
        ref={confettiRef}
        source={require('../../../assets/lottie/CONFETTI.json')}
        autoPlay={false}
        loop={false}
        style={styles.lottie}
        resizeMode="cover"
      />
    </>
  );
}
