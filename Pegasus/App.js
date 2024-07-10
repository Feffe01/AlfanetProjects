import React, { useState } from 'react';
import { StyleSheet, Text, Linking, TouchableOpacity, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';
import TimbratureButton from './TimbratureButton';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import axios from 'axios';

function App() {
  const [showButton, setShowButton] = useState(false);
  const [token, setToken] = useState()
  const [authToken, setAuthToken] = useState("")
  const [beaconAddress, setBeaconAddress] = useState([]);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const privacyUrl = 'http://gsl.alfanet.it/privacy.htm';
  const loginUrl = 'http://gsl.alfanet.it:3000/login';
  const timbratureUrl = 'http://gsl.alfanet.it:3000/timbrature';
  const profileUrl = 'http://gsl.alfanet.it:3000/profile';
  const beaconEndpoint = 'http://193.109.112.182/ibeacon';

  const getBeaconAddress = () => {
      console.log("getting beacon with token: ", token, "and authToken: ", authToken);
      axios.get(beaconEndpoint, {
          headers: { Authorization: authToken}
      }).then( res => {
          setBeaconAddress(res.data.beacons);
          console.log("GET - Endpoint: ", beaconEndpoint, " - response: ", res.data)
      })
  }

  const gotoPrivacy = () => {
    Linking.openURL(privacyUrl).catch((err) => console.error("Couldn't load privacy page", err));
  }

  const handleNavigationStateChange = (navState) => {
    console.log("Current URL:", navState.url);

    if(navState.url === profileUrl || navState.url === loginUrl)
      setShowPrivacy(true);
    else
      setShowPrivacy(false);

    if(navState.url === timbratureUrl) {
      setShowButton(true);
      getBeaconAddress();
    }
    else if (showButton === true)
      setShowButton(false);
  };

  return (
			<SafeAreaView style={styles.container}>
				{showPrivacy && (
					<TouchableOpacity onPress={gotoPrivacy}>
						<Text>Visualizza le informazioni sulla Privacy</Text>
					</TouchableOpacity>
				)}
				<WebView
					source={{ uri: 'http://gsl.alfanet.it:3000' }}
					javaScriptEnabled={true}
					onNavigationStateChange={handleNavigationStateChange}
					onMessage={(event) => {
							console.log("Message arrived with token: ", event.nativeEvent.data);
							setToken(event.nativeEvent.data);
							setAuthToken("bearer " + event.nativeEvent.data);
						}}
				/>
				{showButton && (
					<TimbratureButton style={styles.overlayButton} title="Premi per timbrare" token={token} beaconAddress={beaconAddress}/>
				)}
			</SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  overlayButton: {
    position: 'absolute',
    bottom: responsiveHeight(3),
    right: responsiveWidth(25),
    width: responsiveWidth(50),
    height: responsiveHeight(6),
    borderRadius: responsiveWidth(2),
  },
});

export default App;