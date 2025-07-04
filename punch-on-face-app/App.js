import React, { useState, useRef } from 'react';
import { View, Button, Image, StyleSheet, Animated } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FaceDetector from 'expo-face-detector';

export default function App() {
  const [image, setImage] = useState(null);
  const [faces, setFaces] = useState([]);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const translateXAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(0)).current;

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access gallery is required!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImage(uri);
      detectFaces(uri);
    }
  };

  const detectFaces = async (uri) => {
    const options = {
      mode: FaceDetector.FaceDetectorMode.fast,
      detectLandmarks: FaceDetector.FaceDetectorLandmarks.all,
      runClassifications: FaceDetector.FaceDetectorClassifications.none,
    };
    const detection = await FaceDetector.detectFacesAsync(uri, options);
    setFaces(detection.faces);
    console.log("Faces detected:", detection.faces);
  };

  const punchFace = () => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 80,
          useNativeDriver: true,
        }),
        Animated.timing(translateXAnim, {
          toValue: -10,
          duration: 80,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 5,
          duration: 80,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 80,
          useNativeDriver: true,
        }),
        Animated.timing(translateXAnim, {
          toValue: 10,
          duration: 80,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: -5,
          duration: 80,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 80,
          useNativeDriver: true,
        }),
        Animated.timing(translateXAnim, {
          toValue: 0,
          duration: 80,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 0,
          duration: 80,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };

  return (
    <View style={styles.container}>
      <Button title="Pick a Photo" onPress={pickImage} />
      {image && (
        <>
          <Animated.View
            style={{
              transform: [
                { scale: scaleAnim },
                { translateX: translateXAnim },
                { translateY: translateYAnim }
              ]
            }}
          >
            <Image source={{ uri: image }} style={styles.image} />
          </Animated.View>
          <Button title="Punch!" onPress={punchFace} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 300,
    height: 300,
    marginTop: 20,
    borderRadius: 10,
  },
});
