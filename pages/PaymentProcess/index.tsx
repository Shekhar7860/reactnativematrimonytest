import React, { useState } from "react";
import { RouteComponentProps } from "react-router-native";
import { Dispatch } from "redux";
import {
  View,
  ViewStyle,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  Image,
  ImageStyle,
  ImageBackground,
  ScrollView,
} from "react-native";
import { AppConstants, AppTheme } from "../../config/DefaultConfig";
import ThemedText from "../../components/UI/ThemedText";
import useConstants from "../../hooks/useConstants";
import RoundButton from "../../components/Base/RoundButton";
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";
import Icon from "react-native-vector-icons/FontAwesome";
import useTheme from "../../hooks/useTheme";
import AddSubscriptionView from "../../components/AddSubscriptionView";

// @ts-ignore
const ImagePath = require("../../images/profile.png");
const add = require("../../images/add-btn.png");
const card = require("../../images/card.png");
const pay = require("../../images/paytm.png");

interface Props extends RouteComponentProps {
  dispatch: Dispatch;
  history: any;
}

const PaymentProcess: React.FunctionComponent<Props> = ({
  dispatch,
  history,
}: Props) => {
  const constants: AppConstants = useConstants();
  const theme: AppTheme = useTheme();
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const STRIPE_ERROR = "Payment service error. Try again later.";
  const SERVER_ERROR = "Server error. Try again later.";
  const STRIPE_PUBLISHABLE_KEY = "pk_test_V6QVAPwpYaxrXhmh9y2l6qiX";

  const backButton = () => {
    history.push("/premium");
  };

  const goToNewCard = () => {
    history.push("/card");
  };

  const goToPayment = () => {
    history.push("/payment");
  };

  const getCreditCardToken = (creditCardData) => {
    const card = {
      "card[number]": creditCardData.values.number.replace(/ /g, ""),
      "card[exp_month]": creditCardData.values.expiry.split("/")[0],
      "card[exp_year]": creditCardData.values.expiry.split("/")[1],
      "card[cvc]": creditCardData.values.cvc,
    };

    return fetch("https://api.stripe.com/v1/tokens", {
      headers: {
        // Use the correct MIME type for your server
        Accept: "application/json",
        // Use the correct Content Type to send data in request body
        "Content-Type": "application/x-www-form-urlencoded",
        // Use the Stripe publishable key as Bearer
        Authorization: `Bearer ${STRIPE_PUBLISHABLE_KEY}`,
      },
      // Use a proper HTTP method
      method: "post",
      // Format the credit card data to a string of key-value pairs
      // divided by &
      body: Object.keys(card)
        .map((key) => key + "=" + card[key])
        .join("&"),
    }).then((response) => response.json());
  };

  const makePayment = async (token) => {
    console.group("token", token);
    fetch(
      "https://us-central1-hallowed-grin-213811.cloudfunctions.net/payWithStripe",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: 80,
          currency: "usd",
          token: token,
        }),
      }
    )
      .then((response) => response.json())
      .then((responseJson) => {
        console.group("resjjj", responseJson);
      })
      .catch((error) => {
        console.group("error", error);
      });
  };
  const subscribeUser = (creditCardToken) => {
    return new Promise((resolve) => {
      console.log("Credit card token\n", creditCardToken);
      setTimeout(() => {
        resolve({ status: true });
      }, 1000);
    });
  };
  const onSubmit = async (creditCardInput) => {
    console.log("working");

    // Disable the Submit button after the request is sent
    setSubmitted(true);
    let creditCardToken;

    try {
      // Create a credit card token
      creditCardToken = await getCreditCardToken(creditCardInput);
      console.log("token", creditCardToken);
      setToken(creditCardToken.id);
      makePayment(creditCardToken.id);
      if (creditCardToken.error) {
        // Reset the state if Stripe responds with an error
        // Set submitted to false to let the user subscribe again
        setSubmitted(false);
        setError(STRIPE_ERROR);
        return;
      }
    } catch (e) {
      // Reset the state if the request was sent with an error
      // Set submitted to false to let the user subscribe again
      this.setState({ submitted: false, error: STRIPE_ERROR });
      return;
    }

    // Send a request to your server with the received credit card token
    const { error } = await subscribeUser(creditCardToken);
    // Handle any errors from your server
    if (error) {
      setSubmitted(false);
      setError(SERVER_ERROR);
      //this.setState({ submitted: false, error: SERVER_ERROR });
    } else {
      setSubmitted(false);
      setError(null);
      // this.setState({ submitted: false, error: null });
      //  navigation.navigate('Home')
    }
  };

  return (
    <View style={style.mainContainer}>
      <AddSubscriptionView
        error={error}
        submitted={submitted}
        onSubmit={onSubmit}
      />
      {/* <ImageBackground source={ImagePath} style={style.imageStyle} >
        <View style={style.backContainer}>
          <TouchableOpacity onPress={backButton}>
            <View style={style.leftContainer}>
              <MaterialIcon name="chevron-left-circle-outline" size={30} color={theme.highlightTextColor} style={style.backIcon}/>
            </View>
          </TouchableOpacity>
          <View style={style.rightContainer}>
            <ThemedText styleKey="highlightTextColor" style={[style.textStyle, style.specialText]}>{constants.payment}</ThemedText>
          </View>
        </View>
        <View style={[style.backContainer, style.extraStyle]}>
          <ScrollView horizontal={true}>
            <TouchableOpacity style={style.leftContainer} onPress={goToNewCard}>
              <Image source={add} style={style.logoImage}/>
              <MaterialIcon name="plus" size={30} color={theme.cardTextColor} style={style.nexStyle}/>
            </TouchableOpacity>
            <View style={[style.rightContainer, style.extraContainer]}>
              <Image source={card} style={style.styleImage}/>
            </View>
            <View style={[style.rightContainer, style.extraContainer]}>
              <Image source={card} style={style.styleImage}/>
            </View>
          </ScrollView>
        </View>
      </ImageBackground>
      <ScrollView>
      <TouchableOpacity style={style.backContainer}>
        <View style={style.leftContainer}>
          <Icon name="credit-card-alt" size={30} color={theme.textColor} style={style.backIcon}/>
        </View>
        <View style={style.rightContainer}>
          <ThemedText styleKey="textColor" style={[style.textStyle, style.contentText]}>Credit/Debit Card</ThemedText>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={style.backContainer}>
        <View style={style.leftContainer}>
          <Icon name="google-wallet" size={30} color={theme.textColor} style={style.backIcon}/>
        </View>
        <View style={style.rightContainer}>
          <ThemedText styleKey="textColor" style={[style.textStyle, style.extraText]}>Google wallet</ThemedText>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={style.backContainer}>
        <View style={style.leftContainer}>
          <Icon name="amazon" size={30} color={theme.textColor} style={style.backIcon}/>
        </View>
        <View style={style.rightContainer}>
          <ThemedText styleKey="textColor" style={[style.textStyle, style.extraText]}>Amazon Pay</ThemedText>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={style.backContainer}>
        <View style={style.leftContainer}>
          <Image source={pay} style={style.newImage}/>
        </View>
        <View style={style.rightContainer}>
          <ThemedText styleKey="textColor" style={[style.textStyle, style.contentText]}>Paytm</ThemedText>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={style.backContainer}>
        <View style={style.leftContainer}>
          <Icon name="paypal" size={30} color={theme.textColor} style={[style.backIcon, {marginLeft: 5}]}/>
        </View>
        <View style={style.rightContainer}>
          <ThemedText styleKey="textColor" style={[style.textStyle, style.extraText]}>Pay Pal</ThemedText>
        </View>
      </TouchableOpacity>
      <RoundButton buttonStyle={style.inputLabel} label="Pay" buttonColor={theme.appColor} labelStyle={theme.highlightTextColor} onPress={goToPayment}/>
      </ScrollView> */}
    </View>
  );
};

export default PaymentProcess;

interface Style {
  mainContainer: ViewStyle;
  childContainer: ViewStyle;
  leftContainer: ViewStyle;
  rightContainer: ViewStyle;
  backContainer: ViewStyle;
  inputLabel: ViewStyle;
  backIcon: ViewStyle;
  extraStyle: ViewStyle;
  extraContainer: ViewStyle;
  nexStyle: TextStyle;
  textStyle: TextStyle;
  specialText: TextStyle;
  contentText: TextStyle;
  extraText: TextStyle;
  imageStyle: ImageStyle;
  logoImage: ImageStyle;
  styleImage: ImageStyle;
  newImage: ImageStyle;
}

const style: Style = StyleSheet.create<Style>({
  mainContainer: {
    flex: 1,
    flexDirection: "column",
  },
  backContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  inputLabel: {
    minWidth: 150,
    paddingTop: 20,
    minHeight: 60,
    marginTop: 80,
    borderRadius: 50,
    marginBottom: 30,
  },
  childContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  leftContainer: {
    flex: 0,
    justifyContent: "flex-start",
  },
  rightContainer: {
    flex: 3,
    justifyContent: "center",
    paddingTop: 17,
    marginRight: 50,
  },
  backIcon: {
    fontSize: 25,
    paddingTop: 20,
    paddingLeft: 25,
  },
  extraStyle: {
    marginTop: 80,
    marginLeft: 25,
    marginRight: 25,
  },
  extraContainer: {
    paddingTop: 0,
    paddingLeft: 15,
    marginRight: 0,
  },
  nexStyle: {
    position: "absolute",
    left: 25,
    top: 80,
  },
  textStyle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  specialText: {
    fontSize: 24,
    textTransform: "capitalize",
    textAlign: "center",
  },
  contentText: {
    fontSize: 20,
    paddingLeft: 15,
  },
  extraText: {
    fontSize: 20,
    paddingLeft: 22,
  },
  imageStyle: {
    width: "100%",
    height: 250,
    marginBottom: 120,
  },
  logoImage: {
    justifyContent: "center",
    width: 80,
    height: 180,
  },
  styleImage: {
    justifyContent: "center",
    width: 280,
    height: 180,
  },
  newImage: {
    marginLeft: 25,
    marginTop: 20,
  },
});
