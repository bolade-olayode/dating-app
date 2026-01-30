import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Animated, Easing, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = width / 3; // Exact 1/3rd of screen

interface Props {
  images: any[];
  direction?: 'up' | 'down';
  duration?: number;
}

const MarqueeColumn: React.FC<Props> = ({ 
  images, 
  direction = 'up', 
  duration = 30000 
}) => {
  const scrollAnim = useRef(new Animated.Value(0)).current;
  
  // Triple the images to create a seamless loop
  const allImages = [...images, ...images, ...images];
  const IMAGE_HEIGHT = 200; 
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
          <View key={index} style={styles.imageContainer}>
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
    height: 190, // Slightly shorter than calculation to create gap
    marginBottom: 10,
    marginHorizontal: 4,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default MarqueeColumn;