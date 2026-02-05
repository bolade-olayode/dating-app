import React, { useEffect, useRef, forwardRef } from "react";
import { View, Animated, Dimensions, ScrollView } from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import { LinearGradient } from "expo-linear-gradient";

export interface SheetProps {
  children?: any;
  sheetHeight?: any;
  refRBSheet?: React.RefObject<any>;
}

const BottomSheet = forwardRef<any, SheetProps>(
  ({ children, sheetHeight, refRBSheet }, ref) => {
    const slideInAnimation = useRef(
      new Animated.Value(Dimensions.get("window").height)
    ).current;

    useEffect(() => {
      Animated.timing(slideInAnimation, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, []);

    return (
      <View style={{ paddingHorizontal: 16 }}>
        <Animated.View
          style={{ transform: [{ translateY: slideInAnimation }] }}
        >
          <RBSheet
            customModalProps={{
              animationType: "slide",
            }}
            ref={ref || refRBSheet}
            draggable={false}
            closeOnPressMask={false}
            customStyles={{
              wrapper: {
                backgroundColor: "rgba(0, 0, 0, 0.16)",
              },
              draggableIcon: {
                backgroundColor: "transparent",
              },
              container: {
                height: sheetHeight,
                borderTopRightRadius: 12,
                borderTopLeftRadius: 12,
                backgroundColor: "#141414",
              },
            }}
          >
            <LinearGradient
              colors={["#090A0F", "#090A0F"]}
              start={{ x: 1, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={{ width: "100%", height: "100%" }}
            >
              <ScrollView showsVerticalScrollIndicator={false}>
                <View>{children}</View>
              </ScrollView>
            </LinearGradient>
          </RBSheet>
        </Animated.View>
      </View>
    );
  }
);

export default BottomSheet;
