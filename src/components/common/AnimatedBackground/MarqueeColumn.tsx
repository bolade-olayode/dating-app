import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Animated, Easing, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = width / 3; // Exact 1/3rd of screen

interface Props {
  images: any[];
  direction?: 'up' | 'down';
  duration?: number;
  borderRadius?: number;
  marginHorizontal?: number;
  marginBottom?: number;
  imageHeight?: number;
}

const MarqueeColumn: React.FC<Props> = ({
  images,
  direction = 'up',
  duration = 30000,
  borderRadius = 8,
  marginHorizontal = 4,
  marginBottom = 10,
  imageHeight = 190,
}) => {
  const scrollAnim = useRef(new Animated.Value(0)).current;

  // Triple the images to create a seamless loop
  const allImages = [...images, ...images, ...images];
  const IMAGE_HEIGHT = imageHeight;
  const contentHeight = images.length * IMAGE_HEIGHT; 

  useEffect(() => {
    const startValue = direction === 'up' ? 0 : -contentHeight;
    const endValue = direction === 'up' ? -contentHeight : 0;

    scrollAnim.setValue(startValue);

    Animated.loop(
      Animated.timing(scrollAnim, {
        toValue: endValue,
        duration: duration,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [direction, contentHeight, duration]);

  return (
    <View style={[styles.columnContainer, { width: COLUMN_WIDTH }]}>
      <Animated.View style={{ transform: [{ translateY: scrollAnim }] }}>
        {allImages.map((img, index) => (
          <View
            key={index}
            style={[
              styles.imageContainer,
              {
                height: imageHeight,
                marginBottom: marginBottom,
                marginHorizontal: marginHorizontal,
                borderRadius: borderRadius,
              }
            ]}
          >
            <Image
              source={img}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
        ))}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  columnContainer: {
    overflow: 'hidden',
    height: '100%',
    // paddingHorizontal: 4, // Optional: minimal gap
  },
  imageContainer: {
    // Dynamic styles passed via props
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default MarqueeColumn;