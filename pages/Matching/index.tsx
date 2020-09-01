import React, { useState, useEffect } from "react";
import { RouteComponentProps } from "react-router-native";
import {
  View,
  ViewStyle,
  StyleSheet,
  ImageBackground,
  Image,
  ImageStyle,
  TextStyle,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import { Dispatch } from "redux";
import { AppTheme, AppConstants } from "../../config/DefaultConfig";
import useConstants from "../../hooks/useConstants";
import useTheme from "../../hooks/useTheme";
import ThemedText from "../../components/UI/ThemedText";
import FooterNavigation from "../Footer/Index";
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";
import Swiper from "react-native-deck-swiper";
import database from "@react-native-firebase/database";
import auth from "@react-native-firebase/auth";

// @ts-ignore
const ImagePath = require("../../images/dual-tone.png");
const cross = require("../../images/cross.png");
const chat = require("../../images/chat.png");
const heart = require("../../images/heart.png");
const cardImage = require("../../images/new-card.jpg");
const girlImageUri =
  "https://i.picsum.photos/id/1027/200/300.jpg?hmac=WCxdERZ7sgk4jhwpfIZT0M48pctaaDcidOi3dKSHJYY";

interface Props extends RouteComponentProps {
  dispatch: Dispatch;
  history: any;
}

const Matching: React.FunctionComponent<Props> = ({ history }: Props) => {
  const [items, setItems] = useState([]);
  const [user, setUser] = useState({});
  const constants: AppConstants = useConstants();
  const theme: AppTheme = useTheme();

  const backButton = () => {
    history.push("/gender");
  };

  const goToMatched = () => {
    history.push("/matched");
  };

  useEffect(() => {
    database()
      .ref("/users")
      .once("value")
      .then((dataSnapshot) => {
        let newdata = dataSnapshot.val();
        if (dataSnapshot.val()) {
          let imagesArray = Object.values(newdata);
          // this.arrayholder = imagesArray;
          console.log("imagesRaay", imagesArray);
          setItems(imagesArray);
        }
      });

    database()
      .ref("user")
      .child(auth().currentUser.uid)
      .once("value")
      .then((dataSnapshot) => {
        console.log("snap", dataSnapshot.val().email);
        setUser(dataSnapshot.val());
      });
  }, []);

  const connect = (item) => {
    database()
      .ref("/requests")
      .push({
        senderId: user.id,
        receiverId: item.id,
        senderName: user.username,
        receiverName: item.username,
        senderImage: user.image,
        receiverImage: item.image,
        senderEmail: user.email,
        receiverEmail: item.email,
        isAccepted : 0
      });
  };
  // console.log("item", items);
  return (
    <View style={style.mainContainer}>
      <ScrollView>
        <ImageBackground source={ImagePath} style={style.imageStyle}>
          <TouchableOpacity style={style.backContainer} onPress={backButton}>
            <View style={style.leftContainer}>
              <MaterialIcon
                name="chevron-left-circle-outline"
                size={30}
                color={theme.highlightTextColor}
                style={style.backIcon}
              />
            </View>
            <View style={style.rightContainer}>
              <ThemedText styleKey="highlightTextColor" style={style.textStyle}>
                {constants.backText}
              </ThemedText>
            </View>
          </TouchableOpacity>
          <View style={[style.topContainer, style.titleContainer]}>
            <ThemedText
              styleKey="highlightTextColor"
              style={[style.textStyle, style.titleStyle]}
            >
              {constants.matching}
            </ThemedText>
          </View>
          <Swiper
            cards={items}
            renderCard={(card) => {
              // console.log("card", items);
              return (
                <View style={style.card}>
                  <Image
                    source={{ uri: card ? card.image : girlImageUri }}
                    style={style.imageCard}
                  />
                  <ThemedText styleKey="cardTextColor" style={style.text}>
                    {card ? card.username : null}
                  </ThemedText>
                  <View style={style.childContainer}>
                    <TouchableOpacity>
                      <View style={style.cardIcon}>
                        <MaterialIcon
                          name="gender-male"
                          size={15}
                          color={theme.highlightTextColor}
                          style={style.Icon}
                        />
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity>
                      <TouchableOpacity
                        style={style.cardContent}
                        onPress={() => connect(card)}
                      >
                        <ThemedText
                          styleKey="highlightTextColor"
                          style={{ fontWeight: "bold", textAlign: "center" }}
                        >
                          26
                        </ThemedText>
                      </TouchableOpacity>
                    </TouchableOpacity>
                  </View>
                  <ThemedText
                    styleKey="cardTextColor"
                    style={[style.text, style.textStyle]}
                  >
                    {card ? card.username : null}
                  </ThemedText>
                </View>
              );
            }}
            onSwiped={(cardIndex) => {
              // console.log(cardIndex);
            }}
            onSwipedAll={() => {
              console.log("onSwipedAll");
            }}
            cardIndex={0}
            useViewOverflow={Platform.OS === "ios"}
            backgroundColor={"transparent"}
            stackSize={4}
            // infinite
            cardStyle={{ paddingTop: 70 }}
          />
          <View style={style.bottomContainer}>
            <View style={style.bottomContent}>
              <View style={style.childContainer}>
                <View style={style.iconContainer}>
                  <TouchableOpacity>
                    <Image source={cross} style={style.logoImage} />
                  </TouchableOpacity>
                </View>
                <View style={style.iconContainer}>
                  <TouchableOpacity onPress={goToMatched}>
                    <Image source={chat} style={style.specialStyle} />
                  </TouchableOpacity>
                </View>
                <View style={style.iconContainer}>
                  <TouchableOpacity>
                    <Image source={heart} style={style.logoImage} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </ImageBackground>
      </ScrollView>
      <FooterNavigation history={history} />
    </View>
  );
};

export default Matching;

interface Style {
  mainContainer: ViewStyle;
  imageStyle: ImageStyle;
  topContainer: ViewStyle;
  leftContainer: ViewStyle;
  rightContainer: ViewStyle;
  backContainer: ViewStyle;
  titleContainer: ViewStyle;
  bottomContainer: ViewStyle;
  bottomContent: ViewStyle;
  childContainer: ViewStyle;
  iconContainer: ViewStyle;
  backIcon: ViewStyle;
  textStyle: TextStyle;
  titleStyle: TextStyle;
  logoImage: ImageStyle;
  specialStyle: ImageStyle;
  imageCard: ImageStyle;
  card: ViewStyle;
  text: ViewStyle;
  cardIcon: ViewStyle;
  cardContent: ViewStyle;
  Icon: TextStyle;
}

const style: Style = StyleSheet.create<Style>({
  mainContainer: {
    flex: 1,
    padding: 0,
    margin: 0,
    fontSize: 16,
    justifyContent: "center",
    flexDirection: "column",
  },
  imageStyle: {
    width: "100%",
    height: 830,
  },
  topContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 80,
    marginBottom: 20,
  },
  leftContainer: {
    flex: 0,
    justifyContent: "flex-start",
  },
  rightContainer: {
    flex: 3,
    justifyContent: "center",
    paddingTop: 17,
    paddingLeft: 5,
  },
  backIcon: {
    fontSize: 25,
    paddingTop: 20,
    paddingLeft: 25,
  },
  textStyle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  backContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 10,
    zIndex: 9999,
  },
  titleStyle: {
    fontSize: 32,
    textTransform: "capitalize",
  },
  titleContainer: {
    marginTop: 0,
    marginBottom: 30,
  },
  card: {
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#E8E8E8",
    justifyContent: "flex-start",
    backgroundColor: "white",
    width: "100%",
    height: 470,
  },
  text: {
    textAlign: "center",
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 20,
    backgroundColor: "transparent",
  },
  logoImage: {
    justifyContent: "center",
    width: 90,
    height: 90,
  },
  specialStyle: {
    width: 60,
    height: 60,
    marginTop: 20,
  },
  bottomContent: {
    flex: 1,
    justifyContent: "flex-end",
  },
  iconContainer: {
    margin: 12,
    minWidth: 50,
    height: 50,
    borderRadius: 50,
  },
  bottomContainer: {
    alignItems: "flex-end",
    flexDirection: "row",
    justifyContent: "flex-end",
    position: "absolute",
    bottom: 125,
  },
  childContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  imageCard: {
    width: "100%",
    height: 300,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  Icon: {
    justifyContent: "center",
  },
  cardIcon: {
    backgroundColor: "#fc5660",
    width: 37,
    height: 23,
    borderRadius: 20,
    marginTop: 5,
    paddingTop: 3,
    paddingLeft: 10,
  },
  cardContent: {
    backgroundColor: "#fc5660",
    width: 67,
    height: 23,
    borderRadius: 20,
    marginTop: 5,
    paddingTop: Platform.OS === "ios" ? 3 : 1,
    marginLeft: 10,
  },
});
