import React, { useState, useEffect } from 'react';
import { Alert, SafeAreaView, AsyncStorage, ScrollView, Image, StyleSheet } from 'react-native';
import socketio from 'socket.io-client';

import logo from '../assets/logo.png';

import SpotList from '../components/SpotList'

export default function List() {
    const [techs, setTechs] = useState([]);

    useEffect(() => {
        AsyncStorage.getItem('user').then(user_id =>{
            const socket = socketio('http://192.168.1.11:3333', {
                query: {user_id}
            })

            socket.on('booking_response', booking => {
                Alert.alert(`klsalkdkljsda`);
            })
        })
    }, [])

    useEffect(() => {
        AsyncStorage.getItem('techs').then(storagedTechs => {
            const techsArray = storagedTechs.split(',').map(tech => tech.trim());

            setTechs(techsArray);
        })
    }, []);

    return (
        <ScrollView>
            <SafeAreaView>
                <Image style={styles.logo} source={logo} />
                {techs.map(tech => <SpotList key={tech} tech={tech} />)}
            </SafeAreaView>
        </ScrollView>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    logo: {
        height: 32,
        resizeMode: 'contain',
        alignSelf: 'center',
        marginTop: 28
    }
})