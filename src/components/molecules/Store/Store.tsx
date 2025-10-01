import React, { memo } from "react";
import { Store as StoreProperties } from "@/hooks/domain/stores/schema.ts";
import {
  Image,
  Linking,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { styles } from "./styles";
import { useTheme } from "@/theme";
import MaterialIcons from "@react-native-vector-icons/material-design-icons";
import { useNavigation } from "@react-navigation/native";
import { Paths } from "@/navigation/paths.ts";

function Store(props: StoreProperties) {
  const { colors, fonts } = useTheme();
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={[styles.storeContainer, { backgroundColor: colors.purple100 }]}
      onPress={() =>
        navigation.navigate(Paths.Store, {
          storeId: props.id,
          store: { ...props },
        })
      }
    >
      <View style={styles.logoContainer}>
        <Image
          source={{ uri: props.logoUrl }}
          style={styles.logoImage}
          width={60}
          height={60}
        />
        <Text style={[fonts.size_24, { color: "#FFFFFF" }]}>
          {props.businessName}
        </Text>
      </View>

      <View style={styles.infoList}>
        {props.businessEmail && (
          <TouchableWithoutFeedback
            onPress={() => Linking.openURL(`mailto:${props.businessEmail}`)}
          >
            <View style={styles.infoItem}>
              <MaterialIcons
                name="card-account-mail"
                size={26}
                color="#3c83f6"
              />

              <Text style={[styles.itemLabel, fonts.size_16]} numberOfLines={1}>
                {props.businessEmail}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        )}

        {props.businessPhoneNumber && (
          <TouchableWithoutFeedback
            onPress={() => Linking.openURL(`tel:${props.businessPhoneNumber}`)}
          >
            <View style={styles.infoItem}>
              <MaterialIcons name="phone" size={26} color="#40ba5c" />

              <Text style={[styles.itemLabel, fonts.size_16]} numberOfLines={1}>
                {props.businessPhoneNumber}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        )}

        {props.businessAddress && (
          <TouchableWithoutFeedback
            onPress={() =>
              Linking.openURL(
                "https://www.google.com/maps/search/?api=1&query=" +
                  encodeURIComponent(props.businessAddress),
              )
            }
          >
            <View style={styles.infoItem}>
              <MaterialIcons
                name="map-marker"
                size={26}
                color={colors.red500}
              />

              <Text style={[styles.itemLabel, fonts.size_16]} numberOfLines={1}>
                {props.businessAddress} ffs fsff afsaaf faf af a
              </Text>
            </View>
          </TouchableWithoutFeedback>
        )}

        {props.whatsppUsername && (
          <TouchableWithoutFeedback
            onPress={() =>
              Linking.openURL("https://wa.me/" + props.whatsppUsername)
            }
          >
            <View style={styles.infoItem}>
              <MaterialIcons name="whatsapp" size={26} color="#075E54" />

              <Text style={[styles.itemLabel, fonts.size_16]} numberOfLines={1}>
                {props.whatsppUsername}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        )}

        {props.tgUsername && (
          <TouchableWithoutFeedback
            onPress={() => Linking.openURL("https://t.me/" + props.tgUsername)}
          >
            <View style={styles.infoItem}>
              <MaterialIcons name="send-outline" size={26} color="#33abe0" />

              <Text style={[styles.itemLabel, fonts.size_16]} numberOfLines={1}>
                {props.tgUsername}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        )}
      </View>
    </TouchableOpacity>
  );
}

export default memo(Store);
