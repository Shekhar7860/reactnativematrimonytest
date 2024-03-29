import React, { useEffect, useState} from 'react';
import { ViewStyle, StyleSheet } from 'react-native';
import { NativeRouter, Route, Switch } from "react-router-native";
import { connect } from "react-redux";
import BackHandlerHOC from '../components/HOC/BackHandlerHOC';
import BaseHome from '../pages/BaseHome';
import { ApplicationConfig } from '../config/DefaultConfig';
import ConfigContext from '../config/AppConfigProvider';
import ThemedView from '../components/UI/ThemedView';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import ForgetPassword from '../pages/ForgetPassword';
import Gender from '../pages/Gender';
import Matching from '../pages/Matching';
import Matched from '../pages/Matched';
import Searching from '../pages/Searching';
import Nearby from '../pages/Nearby';
import Profile from '../pages/Profile';
import EditProfile from '../pages/EditProfile';
import Calling from '../pages/Calling';
import VideoCall from '../pages/VideoCall';
import Premium from '../pages/Premium';
import Message from '../pages/Message';
import PaymentProcess from '../pages/PaymentProcess';
import NewCard from '../pages/NewCard';
import Payment from '../pages/Payment';
import Chat from '../pages/Chat';
import AsyncStorage from '@react-native-community/async-storage'

interface Props {
  configReducer: ApplicationConfig
}


const Router: React.FunctionComponent<Props> = ({
  configReducer
}: Props) => {

  const [user, setUser] = useState("")

  useEffect(() => {
    readData()
  }, [])
  
  const readData = async () => {
    try {
      const userData = await AsyncStorage.getItem('user')
      if (userData !== null) {
        var data = JSON.parse(userData);
        console.log('data is', data)
        setUser(data)
      }
    } catch (e) {
     console.log('Failed to fetch the data from storage')
    }
  }
  return (
    <ConfigContext.Provider value={configReducer}>
      <ThemedView style={style.container}>
        <NativeRouter>
          <BackHandlerHOC>
            <Switch>
              <Route exact path="/" component={user ? Profile : BaseHome} />
              <Route exact path="/login/" component={Login} />
              <Route exact path="/signup/" component={Signup} />
              <Route exact path="/forget/" component={ForgetPassword} />
              <Route exact path="/gender/" component={Gender} />
              <Route exact path="/matching/" component={Matching} />
              <Route exact path="/matched/" component={Matched} />
              <Route exact path="/searching/" component={Searching} />
              <Route exact path="/nearby/" component={Nearby} />
              <Route exact path="/profile/" component={Profile} />
              <Route exact path="/edit/" component={EditProfile} />
              <Route exact path="/calling/" component={Calling} />
              <Route exact path="/video/" component={VideoCall} />
              <Route exact path="/premium/" component={Premium} />
              <Route exact path="/message/" component={Message} />
              <Route exact path="/process/" component={PaymentProcess} />
              <Route exact path="/card/" component={NewCard} />
              <Route exact path="/payment/" component={Payment} />
              <Route exact path="/chat/" component={Chat} />
            </Switch>
          </BackHandlerHOC>
        </NativeRouter>
      </ThemedView>
    </ConfigContext.Provider>
  )
}

export default connect(({ configReducer }) => ({ configReducer }))(Router);

interface Style {
  container: ViewStyle
}

const style: Style = StyleSheet.create<Style>({
  container: {
      flex: 1
  }
})

