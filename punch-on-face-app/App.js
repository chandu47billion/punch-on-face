import React, { useState } from 'react';
import { View, Button, Image, StyleSheet, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FaceDetector from 'expo-face-detector';

export default function App() {
  const [image, setImage] = useState(null);
  const [faces, setFaces] = useState([]);

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

  return (
    <View style={styles.container}>
      <Button title="Pick a Photo" onPress={pickImage} />
      {image && (
        <>
          <Image source={{ uri: image }} style={styles.image} />
          <View style={styles.overlay}>
            {faces.map((face, index) => (
              <View
                key={index}
                style={{
                  position: 'absolute',
                  left: face.bounds.origin.x,
                  top: face.bounds.origin.y,
                  width: face.bounds.size.width,
                  height: face.bounds.size.height,
                  borderWidth: 2,
                  borderColor: 'red'
                }}
              />
            ))}
          </View>
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
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
