import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Image, TouchableOpacity } from 'react-native';
import IconFA from 'react-native-vector-icons/FontAwesome';
import { Menu, MenuTrigger, MenuOptions, MenuOption } from 'react-native-popup-menu';
import { arrowDown, triggerText, menuTriggerStyles, menuHeadOptionsStyles } from '../styles/menu';
import { useNavigation } from '@react-navigation/native';
import { strings } from '../utils/localization';

export const SearchHeader = props => {
   const [section, setSection] = useState(props.sections[0]);
   const [searchText, setSearchText] = useState('');
   const [showClearButton, setShowClearButton] = useState(false);
   const navigation = useNavigation();

   return (
      <View style={s.main}>
         <View style={s.header}>
            <TouchableOpacity style={s.back}
               activeOpacity={0.5}
               onPress={() => navigation.goBack()}
            >
               <Image
                  style={s.arrowLeft}
                  resizeMode="contain"
                  source={require('../assets/img/common/left-arrow.png')}
               />
            </TouchableOpacity>
            <Menu>
               <MenuTrigger customStyles={menuTriggerStyles}>
                  <Text style={triggerText}>{section}</Text>
                  <IconFA style={arrowDown} name="angle-down" color="black" size={20} />
               </MenuTrigger>
               <MenuOptions customStyles={menuHeadOptionsStyles}>
                  <MenuOption
                     text={props.sections[0]}
                     onSelect={() => {
                        setSection(props.sections[0]);
                        props.onChangeSection(0)
                     }}
                  />
                  <MenuOption
                     text={props.sections[1]}
                     onSelect={() => {
                        setSection(props.sections[1]);
                        props.onChangeSection(1)
                     }}
                  />
               </MenuOptions>
            </Menu>
            {props.rightButtonIcon && props.onRightButtonPress &&
               <TouchableOpacity style={s.addButton}
                  activeOpacity={0.5}
                  onPress={() => props.onRightButtonPress()}
               >
                  {props.rightButtonIcon}
               </TouchableOpacity>
            }
         </View>
         <View style={s.searchSection}>
            {showClearButton === true
               ? <TouchableOpacity
                  activeOpacity={0.5}
                  style={s.clearButton}
                  onPress={() => {
                     setSearchText('');
                     setShowClearButton(false);
                     props.onClearText();
                  }}
               >
                  <IconFA name="close" size={16} color='#a8b4c4' />
               </TouchableOpacity>
               : <IconFA style={s.leftIcon} name="search" size={16} color='#a8b4c4' />
            }
            <TextInput
               autoFocus
               disableFullscreenUI
               style={s.searchInput}
               selectionColor='#a6c3fe'
               returnKeyType='search'
               placeholder={strings.search}
               value={searchText}
               onChangeText={(text) => setSearchText(text)}
               onSubmitEditing={event => {
                  const text = event.nativeEvent.text.trim();
                  text.length > 0
                     ? setShowClearButton(true)
                     : !showClearButton && setShowClearButton(false);

                  props.onSubmitEditing(text);
               }}
               onBlur={() => setSearchText(props.text)}
            />
            <TouchableOpacity
               style={s.filterButton}
               activeOpacity={0.5}
               onPress={() => props.onOpenFilter()}
            >
               <IconFA
                  name="filter"
                  size={16}
                  color='#a8b4c4' />
            </TouchableOpacity>
         </View>
      </View>
   )
}

const s = StyleSheet.create({
   main: {
      elevation: 3,
      backgroundColor: 'white',
      paddingHorizontal: 10,
      paddingVertical: 15,
      marginBottom: 10,
   },
   header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
   },
   back: {
      width: 40,
      position: 'absolute',
      left: 10,
      paddingRight: 10,
      paddingVertical: 10,
   },
   addButton: {
      position: 'absolute',
      right: 0,
      top: 5,
      paddingHorizontal: 13,
      paddingVertical: 10,
   },
   arrowLeft: {
      width: 11,
      height: 17,
   },
   headerText: {
      fontSize: 22,
      fontWeight: 'bold',
      alignSelf: 'center',
      marginTop: -33,
   },
   searchSection: {
      height: 40,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#efeff0',
      borderRadius: 18,
      marginTop: 15,
   },
   leftIcon: {
      position: 'absolute',
      left: 15,
   },
   clearButton: {
      zIndex: 20,
      position: 'absolute',
      left: 0,
      paddingHorizontal: 14,
      paddingVertical: 12,
   },
   searchInput: {
      flex: 1,
      paddingLeft: 40,
      paddingRight: 15,
   },
   filterButton: {
      position: 'absolute',
      right: 0,
      paddingHorizontal: 15,
      paddingVertical: 12,
   }
});