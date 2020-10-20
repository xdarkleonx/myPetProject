import React from 'react';
import { View, Text, Image, StyleSheet, ImageBackground, ActivityIndicator, StatusBar } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { connect } from 'react-redux';
import { signOut } from '../store/actions/authActions';
import Icon from 'react-native-vector-icons/FontAwesome';
import { strings } from './localization';
import Login from '../screens/auth/Login';
import Register from '../screens/auth/Register';
import ResetPassword from '../screens/auth/ResetPassword';
import Food from '../screens/food/Food';
import Nutrients from '../screens/food/Nutrients';
import FoodDailyInfo from '../screens/food/FoodDailyInfo';
import NutrientsFilter from '../screens/food/NutrientsFilter';
import Product from '../screens/food/Product';
import Dish from '../screens/food/Dish';
import Train from '../screens/train/Train';
import Supply from '../screens/supply/Supply';
import Goal from '../screens/goal/Goal';
import Anthropometry from '../screens/anthropometry/Anthropometry';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const LoginStack = () => {
  return (
    <Stack.Navigator headerMode='none'>
      <Stack.Screen name='Login' component={Login} />
      <Stack.Screen name='Register' component={Register} />
      <Stack.Screen name='ResetPassword' component={ResetPassword} />
    </Stack.Navigator>
  )
}

const GoalStack = () => {
  return (
    <Stack.Navigator headerMode='none'>
      <Stack.Screen name='Goal' component={Goal} />
    </Stack.Navigator>
  );
}

const AnthropometryStack = () => {
  return (
    <Stack.Navigator headerMode='none'>
      <Stack.Screen name='Anthropometry' component={Anthropometry} />
    </Stack.Navigator>
  );
}

const FoodStack = () => {
  return (
    <Stack.Navigator headerMode='none'>
      <Stack.Screen name='Food' component={Food} />
      <Stack.Screen name='FoodDailyInfo' component={FoodDailyInfo} />
      <Stack.Screen name='Nutrients' component={Nutrients} />
      <Stack.Screen name='NutrientsFilter' component={NutrientsFilter} />
      <Stack.Screen name='Product' component={Product} />
      <Stack.Screen name='Dish' component={Dish} />
    </Stack.Navigator>
  );
}

const SupplyStack = () => {
  return (
    <Stack.Navigator headerMode='none'>
      <Stack.Screen name='Supply' component={Supply} />
    </Stack.Navigator>
  );
}

const TrainStack = () => {
  return (
    <Stack.Navigator headerMode='none'>
      <Stack.Screen name='Train' component={Train} />
    </Stack.Navigator>
  );
}

const CustomDrawerContent = (drawerProps, props) => (
  <DrawerContentScrollView {...drawerProps} >
    <ImageBackground
      style={s.drawerHead}
      source={require('../assets/img/common/drawer-photo.jpg')}
    >
      <View style={s.userBox}>
        <View style={s.avatarWrapper}>
          {props.avatar
            ? <Image source={{ uri: `${props.avatar}` }} resizeMode='cover' style={s.avatar} />
            : <Icon name='user-o' color='white' size={28} />
          }
        </View>
        <Text style={s.displayName}>{props.firstName} {props.lastName}</Text>
      </View>
    </ImageBackground>
    <DrawerItemList {...drawerProps} />
    {props.userId &&
      <DrawerItem
        label={strings.logout}
        style={s.exit}
        labelStyle={s.drawerItemLabel}
        inactiveTintColor='#131313'
        icon={({ color, focused }) =>
          <Icon name='sign-out' color={focused ? color : 'gray'} size={20} style={s.exitIcon} />
        }
        onPress={() => {
          props.signOut();
          drawerProps.navigation.closeDrawer();
        }}
      />
    }
  </DrawerContentScrollView>
)

const Main = props => (
  <Drawer.Navigator
    backBehavior='none'
    initialRouteName='SupplyStack'
    drawerContentOptions={{
      activeTintColor: '#346bc7',
      activeBackgroundColor: '#dedede',
      inactiveTintColor: '#131313',
      contentContainerStyle: { flexGrow: 1, paddingTop: 0 },
      labelStyle: s.drawerItemLabel,
      itemStyle: s.drawerItem,
    }}
    drawerContent={drawerProps => CustomDrawerContent(drawerProps, props)}
  >
    <Drawer.Screen
      name='GoalStack'
      component={GoalStack}
      options={{
        drawerLabel: strings.goal,
        drawerIcon: ({ color, focused }) => (
          <Image
            source={require('../assets/img/common/goal-icon.png')}
            resizeMode={'center'}
            style={[s.icon, { tintColor: focused ? color : 'gray' }]}
          />
        )
      }}
    />
    <Drawer.Screen
      name='AnthropometryStack'
      component={AnthropometryStack}
      options={{
        drawerLabel: strings.anthropometry,
        drawerIcon: ({ color, focused }) => (
          <Image
            source={require('../assets/img/common/anthropometry-icon.png')}
            resizeMode={'center'}
            style={[s.icon, { tintColor: focused ? color : 'gray' }]}
          />
        )
      }}
    />
    <Drawer.Screen
      name='FoodStack'
      component={FoodStack}
      options={{
        //unmountOnBlur: true,
        drawerLabel: strings.foodDiary,
        drawerIcon: ({ color, focused }) => (
          <Image
            source={require('../assets/img/common/food-icon.png')}
            resizeMode={'center'}
            style={[s.icon, { tintColor: focused ? color : 'gray' }]}
          />
        )
      }}
    />
    <Drawer.Screen
      name='SupplyStack'
      component={SupplyStack}
      options={{
        drawerLabel: strings.supplementsDiary,
        drawerIcon: ({ color, focused }) => (
          <Image
            source={require('../assets/img/common/supply-icon.png')}
            resizeMode={'center'}
            style={[s.icon, { tintColor: focused ? color : 'gray' }]}
          />
        )
      }}
    />
    <Drawer.Screen
      name='TrainStack'
      component={TrainStack}
      options={{
        drawerLabel: strings.trainDiary,
        drawerIcon: ({ color, focused }) => (
          <Image
            source={require('../assets/img/common/train-icon.png')}
            resizeMode={'center'}
            style={[s.icon, { tintColor: focused ? color : 'gray' }]}
          />
        )
      }}
    />
  </Drawer.Navigator>
)

const SplashScreen = () => (
  <ImageBackground
    style={s.splashScreen}
    source={require('../assets/img/common/splash-screen.jpg')}
  >
    <StatusBar translucent backgroundColor='transparent' />
    <ActivityIndicator size='large' color='white' style={s.activityIndicator} />
  </ImageBackground>
)

const AppRoot = (props) => {
  return (
    <NavigationContainer>
      {!props.isLoaded
        ? SplashScreen()
        : props.userId
          ? Main(props)
          : LoginStack()
      }
    </NavigationContainer>
  )
}

export default connect(
  (state) => ({
    userId: state.firebase.auth.uid,
    isLoaded: state.firebase.auth.isLoaded,
    avatar: state.firebase.profile.avatar,
    firstName: state.firebase.profile.firstName,
    lastName: state.firebase.profile.lastName,
  }),
  { signOut }
)(AppRoot);

const s = StyleSheet.create({
  splashScreen: {
    flex: 1,
    justifyContent: 'center'
  },
  icon: {
    width: 25,
    height: 25,
    marginLeft: 10,
  },
  drawerHead: {
    width: '100%',
    height: 154,
  },
  drawerItem: {
    borderRadius: 0,
    marginHorizontal: 0,
    paddingHorizontal: 0,
    marginVertical: 0,
    marginTop: 5
  },
  exit: {
    flex: 1,
    marginHorizontal: 0,
    borderRadius: 0,
    paddingHorizontal: 0,
    justifyContent: 'flex-end',
  },
  drawerItemLabel: {
    fontWeight: 'bold',
    marginLeft: -20,
  },
  exitIcon: {
    marginLeft: 10
  },
  avatarWrapper: {
    width: 70,
    height: 70,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: 'white',
    overflow: 'hidden',
    backgroundColor: '#bbcff1',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 70,
    height: 70,
  },
  userBox: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  displayName: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
    marginTop: 7,
    textAlign: 'center'
  },
  activityIndicator: {
    marginTop: 80
  }
})
