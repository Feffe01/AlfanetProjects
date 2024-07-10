import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, PermissionsAndroid, Platform } from 'react-native';
import { BleManager, ScanMode } from 'react-native-ble-plx';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import axios from 'axios';

async function requestPermissions() {
    if (Platform.OS === 'android') {
        try {
            const granted = await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
            ]);
            const allGranted = Object.values(granted).every(permission => permission === PermissionsAndroid.RESULTS.GRANTED);
            return allGranted;
        } catch (err) {
            console.warn(err);
            return false;
        }
    } else {
        return true;
    }
}

const manager = new BleManager();

function TimbratureButton({ style, title, token, beaconAddress }) {
    const [isScanning, setIsScanning] = useState(false);
		const [canStartScan, setCanStartScan] = useState(false);
    const [foundDevice, setFoundDevice] = useState(false);
    const [bluetoothState, setBluetoothState] = useState('Unknown');
    // const [debug, setDebug] = useState("std");

    useEffect(() => {
        const subscription = manager.onStateChange((state) => {
            setBluetoothState(state);
            if (state === 'PoweredOn' && !isScanning && canStartScan) {
                startScan();
                subscription.remove();
            }
        }, true);

        return () => {
            subscription.remove();
            if (isScanning) {
                manager.stopDeviceScan();
            }
        };
    }, [isScanning]);

    useEffect(() => {
        const checkPermissions = async () => {
            const hasPermissions = await requestPermissions();
            if (!hasPermissions) {
                console.error('Required permissions not granted.');
                // setDebug('Permissions not granted');
            }
        };
        checkPermissions();
    }, []);

    const sendToken = () => {
        console.log("Sending through axios.post: ", token);
        axios.post("http://193.109.112.182/timbrature", {
            valoriPost: [],
            token: token
        })
    };

    const startScan = () => {
        console.log('Starting scanning...');
        // setDebug("ScanStart");
				setIsScanning(true)
        manager.startDeviceScan(
					null,
					{
					allowDuplicates: true,
					scanMode: ScanMode.LowLatency,
					},
					(error, device) => {
            if (error) {
                console.error('Scan error: ', error.message);
                // setDebug(`ScanErr: ${error.message}, state: ${bluetoothState}`);
                setIsScanning(false);
                return;
            }
            console.log("Detected device:", device.id, device.name, device.rssi);
						// console.log(device);

            for (let i = 0; beaconAddress[i]; i++) {
                if (device.id === beaconAddress[i].MacAddress) {
                    console.log("Beacon found: ", device.id);
                    // setDebug("BeaconFound");
                    manager.stopDeviceScan();
                    setIsScanning(false);
                    setFoundDevice(true);
                    sendToken();
                    return;
                }
            }
        });

        setTimeout(() => {
            // setDebug("Timeout");
            manager.stopDeviceScan();
            setIsScanning(false);
            setFoundDevice(false);
        }, 10000);
    };

    const handleSearch = async () => {
        console.log("isScanning: ", isScanning);
        console.log("token: ", token);
        console.log("beaconAddress: ", beaconAddress);
        // setDebug("ScanInit");

        if (!isScanning && token && beaconAddress[0] && beaconAddress.length) {
            setCanStartScan(true);
            setFoundDevice(false);

            if (bluetoothState === 'PoweredOn') {
                startScan();
            } else {
                // setDebug("Waiting for Bluetooth to power on");
                console.log("Bluetooth is off");
            }
						setCanStartScan(false);
        } else {
            // setDebug("DataMissing - isScanning: " + isScanning + " token: " + token + "beaconAddress[0]: " + beaconAddress[0]);
            console.error("Device scan didn't start because some data is missing");
        }
    };

    return (
        <>
            {/* <Text>{debug}</Text>
            <Text>|</Text>
            <Text>|</Text>
            <Text>|</Text>
            <Text>|</Text>
            <Text>|</Text>
            <Text>|</Text>
            <Text>|</Text>
            <Text>|</Text>*/}

            <TouchableOpacity
                onPress={handleSearch}
                style={[
                    styles.button,
                    isScanning ? styles.scanningButton : foundDevice ? styles.foundButton : styles.normalButton,
                    style
                ]}
                disabled={isScanning}
            >
                {isScanning ? (
                    <ActivityIndicator size="small" color="#000000" />
                ) : foundDevice ? (
                    <Text style={styles.text}>Beacon trovato!</Text>
                ) : (
                    <Text style={styles.text}>{title}</Text>
                )}
            </TouchableOpacity>
        </>
    );
}

const styles = StyleSheet.create({
    button: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,  // Android shadow
        shadowOpacity: 0.2,  // iOS shadow
        shadowRadius: 4,
        shadowOffset: { height: 2, width: 0 },
        margin: 10,
    },
    scanningButton: {
        backgroundColor: '#FFFF00', // Yellow when scanning
    },
    foundButton: {
        backgroundColor: '#008000', // Green when a device is found
    },
    normalButton: {
        backgroundColor: '#007AFF', // Blue when normal
    },
    text: {
        color: '#FFFFFF',
        fontSize: responsiveFontSize(2),
        fontWeight: '600',
    },
});

export default TimbratureButton;
