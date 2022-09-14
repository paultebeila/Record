import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function App() {

  const [recording, setRecording] = React.useState();
  const [recodings, setRecordings] = React.useState();
  const [message, setMessage] = React.useState("");

  async function startRecoeding(){
    try {
      const permision = await Audio.requestPermissionsAsync();

      if(permision.status === "granted"){
        await Audio.setAudioModeAsync({
          allowRecordingIOS: true,
          playInSilentModeIOS: true,
        });
        const { recording } = await Audio.Recording.createAsync(
          Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        );
        setRecording(recording);
      } else {
        setMessage("Please grant permission to the app to access microphone");
      }
    } catch(err) {
      console.error('Failed to start recording', err)
    }
  }
  async function stopRecording(){
    setRecording(undefined);
    await recording.stopAndUnloadAsync();

    let updateRecordings = [...recodings];
    const { sound, status } = await recording.createNewLoadedSoundAsync();
    updateRecordings.push({
      sound: sound,
      duration: getDurationFormatted(status.durationMillis),
      file: recording.getURI()
    })
    setRecordings(updateRecordings);
  }
  function getDurationFormatted(millis){
    const minutes = millis / 1000 / 60;
    const minutesDisplay = Math.floor(minutes);
    const seconds = Math.round((minutes - minutesDisplay) * 60);
    const secondsDisplay = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutesDisplay}:${secondsDisplay}`;
  }
  function getRecordingLines() {
    return recodings.map((recordingLine, index) => {
      return(
        <View key={index} style={styles.row}>
          <Text style={styles.fill}>Recording {index+1} - {recordingLine.duration}</Text>
          <Button style={styles.button} onPress={() => recordingLine.sound.replayAsync()} title="Play"/>
        </View>
      );
    })
  }
  return (
    <View style={styles.container}>
      <Text>{message}</Text>
      <Button 
        title={recording ? 'Stop Recording' : 'Start Recording'}
        onPress={recording ? stopRecording : startRecoeding}
       />
       {getRecordingLines()}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fill: {
    flex: 1,
    margin: 16,
  },  
  button: {
    margin: 16,
  },
});
