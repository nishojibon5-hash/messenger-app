import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, Text, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import io from 'socket.io-client';

const socket = io("http://192.168.0.100:3000"); // আপনার ফোনের IP এখানে দিন

export default function App() {
  const [message, setMessage] = useState('');
  const [chatList, setChatList] = useState([]);

  useEffect(() => {
    socket.on('receive_message', (data) => {
      setChatList((prev) => [...prev, data]);
    });
  }, []);

  const handleSend = () => {
    if (message.trim()) {
      socket.emit('send_message', { text: message, id: Date.now().toString() });
      setMessage('');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}><Text style={styles.headerText}>Messenger App</Text></View>
      <FlatList 
        data={chatList}
        renderItem={({item}) => (
          <View style={styles.bubble}><Text>{item.text}</Text></View>
        )}
      />
      <View style={styles.inputArea}>
        <TextInput style={styles.input} value={message} onChangeText={setMessage} placeholder="Type a message..." />
        <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
          <Text style={{color: '#fff'}}>Send</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 15, backgroundColor: '#0084ff', alignItems: 'center' },
  headerText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  bubble: { backgroundColor: '#e4e6eb', padding: 10, margin: 5, borderRadius: 15, alignSelf: 'flex-start' },
  inputArea: { flexDirection: 'row', padding: 10, borderTopWidth: 1, borderColor: '#eee' },
  input: { flex: 1, backgroundColor: '#f0f2f5', borderRadius: 20, paddingHorizontal: 15, height: 40 },
  sendBtn: { marginLeft: 10, backgroundColor: '#0084ff', padding: 10, borderRadius: 20 }
});
