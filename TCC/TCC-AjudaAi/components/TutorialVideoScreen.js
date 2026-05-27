import React, { useContext, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';

import { GlobalContext } from './GlobalContext';

// video file lives in the project's top-level `assets` folder
const videoSource = require("../assets/AjudAI-Tutorial.mp4")

const TutorialVideoScreen = ({ videoUri, onSkip, navigation }) => {
  const {updtTutorialFeito} = useContext(GlobalContext);

  const player = useVideoPlayer(videoSource, (player) => {
    player.loop= true;
    player.volume= 0;
    player.staysActiveInBackground= false;
    player.play()
  })

  // cleanup: pause/unload the player when the screen unmounts
  useEffect(() => {
    return () => {
      try {
        // stop or pause playback and unload resources if available
        if (player) {
          if (typeof player.pause === 'function') player.pause();
          if (typeof player.stop === 'function') player.stop();
          if (typeof player.unload === 'function') player.unload();
          if (typeof player.unloadAsync === 'function') player.unloadAsync();
        }
      } catch (e) {
        // ignore cleanup errors
        // console.log('player cleanup error', e);
      }
    };
  }, [player]);

  return (
    <View style={styles.container}>
      <VideoView 
        player={player}
        style={styles.video}
        allowsFullscreen={false}
      />
      <TouchableOpacity 
        style={styles.skipButton} 
        onPress={async () => {
          try {
            if (player) {
              if (typeof player.pause === 'function') player.pause();
              if (typeof player.stop === 'function') player.stop();
              if (typeof player.unload === 'function') player.unload();
              if (typeof player.unloadAsync === 'function') player.unloadAsync();
            }
          } catch (e) {}
          await updtTutorialFeito(true)
          navigation.replace("Drawer");
        }}
        activeOpacity={0.8}
      >
        <Text style={styles.skipText}>Ir para o App</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  video: {
    flex: 1,
  },
  skipButton: {
    position: 'absolute',
    right: 16,
    top: 32,
    backgroundColor: "#0088ffff",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  skipText: {
    color: 'white',
    fontSize: 16,
  },
});

export default TutorialVideoScreen;