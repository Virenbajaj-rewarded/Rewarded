import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Typography } from '@/components';
import { EProgramStatusDisplayNames } from '@/enums';

type CustomTabBarProps = {
  activeTab: EProgramStatusDisplayNames;
  onTabChange: (tab: EProgramStatusDisplayNames) => void;
};

export function CustomTabBar({ activeTab, onTabChange }: CustomTabBarProps) {
  const tabs = [
    EProgramStatusDisplayNames.ACTIVE,
    EProgramStatusDisplayNames.DRAFT,
    EProgramStatusDisplayNames.STOPPED,
  ];

  return (
    <View style={styles.container}>
      {tabs.map(tab => (
        <TouchableOpacity
          key={tab}
          style={styles.tab}
          onPress={() => onTabChange(tab)}
          activeOpacity={0.7}
        >
          <Typography
            fontVariant="medium"
            fontSize={14}
            color={activeTab === tab ? '#3c83f6' : '#FFFFFF'}
          >
            {tab}
          </Typography>
          {activeTab === tab && <View style={styles.indicator} />}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#000000',
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
    paddingHorizontal: 16,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    position: 'relative',
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#3c83f6',
  },
});
