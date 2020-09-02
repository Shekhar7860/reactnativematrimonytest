import React, { useState, useCallback, useEffect } from 'react'
import { useLocation } from "react-router-dom";
import { GiftedChat } from 'react-native-gifted-chat';
import auth from "@react-native-firebase/auth";
import database from "@react-native-firebase/database";

export default function Chat() {
    const girlImageUri =
  "https://i.picsum.photos/id/1027/200/300.jpg?hmac=WCxdERZ7sgk4jhwpfIZT0M48pctaaDcidOi3dKSHJYY";
  const [messages, setMessages] = useState([]);
  const location = useLocation();
  const [receiverId, setReceiverId] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [receiverImage, setReceiverImage] = useState("");
  const [image, setImage] = useState(girlImageUri);
  const [name, setName] = useState("");
  

  useEffect(() => {
    //  console.log('currentUser', auth().currentUser._user)
    console.log('data', location.state.detail);
    if (auth().currentUser !== null) {
        console.log(
          "logged In User" +
            JSON.stringify(auth().currentUser.providerData[0].email)
        );
        database()
          .ref("user")
          .child(auth().currentUser.uid)
          .once("value")
          .then((dataSnapshot) => {
            console.log("snap", dataSnapshot.val().email);
            setImage(dataSnapshot.val().image);
            setName(dataSnapshot.val().username);
          });
      }

    setMessages([
      {
        _id: 1,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
    ])
    console.log('receievrid', location.state.detail.key.receiverId, auth().currentUser.uid)
    if(location.state.detail.key.receiverId !== auth().currentUser.uid){
        setReceiverId(location.state.detail.key.receiverId)
        setReceiverName(location.state.detail.key.receiverName)
        setReceiverImage(location.state.detail.key.receiverImage)
    }
    else {
        setReceiverId(location.state.detail.key.senderId)
        setReceiverName(location.state.detail.key.senderName)
        setReceiverImage(location.state.detail.key.senderImage)   
    }

    database()
    .ref("/messages").child(chatID(auth().currentUser.uid, receiverId))
      .once("value")
      .then((dataSnapshot) => {
        console.log("this is message", dataSnapshot.val());
       
      });
   
  }, [])

  const chatID = (senderId, receiverId) => {
    const chatterID = senderId;
    const chateeID = receiverId;
    const chatIDpre = [];
    chatIDpre.push(chatterID);
    chatIDpre.push(chateeID);
    chatIDpre.sort();
    return chatIDpre.join('_');
  };


  const onSend = useCallback((messages = []) => {
    database()
    .ref("/messages").child(chatID(auth().currentUser.uid, receiverId))
    .push({
      senderId: auth().currentUser.uid,
      receiverId : receiverId,
      senderName: name,
      receiverName:  receiverName,
      message : messages[0].text,
      receiverImage : receiverImage,
      senderImage : image,
    });
    console.log('ajjaj', receiverId)
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
   
  }, [])

  return (
    <GiftedChat
      messages={messages}
      onSend={messages => onSend(messages)}
      user={{
        _id: 1,
      }}
    />
  )
}