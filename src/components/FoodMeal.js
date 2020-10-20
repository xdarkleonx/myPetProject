import React, { useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import IconM from 'react-native-vector-icons/MaterialIcons';
import IconFA from 'react-native-vector-icons/FontAwesome';
import { Button } from './Button';
import MealNutrient from './MealNutrient';
import { Menu, MenuTrigger, MenuOptions, MenuOption } from 'react-native-popup-menu';
import { menu, menuIcon, menuTriggerStyles, menuOptionsStyles } from '../styles/menu';
import { connect } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { removeMeal, setMealInfo, setMealTimeInfo, showFoodModal, acceptMeal } from '../store/actions/foodActions';
import { debounce } from 'lodash';
import { alert } from '../utils/alertWrapper';
import { strings } from '../utils/localization';

const FoodMeal = props => {
  const navigation = useNavigation();
  const { nutrients, accepted } = props;
  const time = time ? time : '--:--';

  const calculateTotal = useCallback((nutrients, nutrientName) => {
    if (!nutrients)
      return 0;

    return Object.values(nutrients)
      .reduce((sum, record) => {
        return record[nutrientName] !== undefined
          ? sum + record[nutrientName]
          : sum;
      }, 0);
  }, [])

  const openTimeModal = () => {
    props.showFoodModal();
    props.setMealTimeInfo({
      type: 'food',
      prevTime: props.time,
      mealKey: props.mealKey,
      date: props.date,
      alarmId: props.alarmId
    })
  }

  const navigateToNutrients = () => {
    const { setMealInfo, mealKey, nutrients } = props;
    const nutrientNumber = Math.max(...Object.keys(nutrients)) + 1;
    const nutrientsCount = Object.keys(nutrients).length;
    const existNutrients = Object.values(nutrients)
      .map(nutrient => { return nutrient.infoKey });

    if (nutrientsCount >= 10) {
      alert(strings.maxNutrientsInMeal);
    } else {
      setMealInfo({
        button: 'addToMeal',
        mealKey,
        nutrientNumber,
        nutrientsCount,
        existNutrients
      })
      navigation.navigate('Nutrients');
    }
  }

  const setAccept = isAccepted => {
    const { acceptMeal, date, mealKey } = props;
    acceptMeal({
      type: 'food',
      accepted: isAccepted,
      date,
      mealKey
    });
  }

  const removeMeal = () => {
    const { removeMeal, mealKey, date, meals } = props;
    const mealCount = Object.keys(meals).length;
    removeMeal(date, mealKey, mealCount);
  }

  const renderNutrients = useCallback(nutrients => {
    return nutrients && Object.keys(nutrients)
      .map((nutrientKey, index) => {
        return (
          <MealNutrient
            key={index}
            mealKey={props.mealKey}
            nutrientKey={nutrientKey}
            disabled={props.accepted}
            data={{ ...nutrients[nutrientKey] }}
          />
        )
      })
  }, [])

  return (
    <View style={s.mainContainer}>
      <View style={s.rowContainer}>
        <Text style={s.mealTitle}>{props.mealName}</Text>
        <TouchableOpacity
          style={s.rowContainer}
          disabled={accepted}
          onPress={openTimeModal}
        >
          <IconM name="access-time" color="#96a1ba" size={20} />
          <Text style={s.timeText}>{time}</Text>
        </TouchableOpacity>
        <Menu style={menu}>
          <MenuTrigger customStyles={menuTriggerStyles}>
            <Image
              style={menuIcon}
              source={require('../assets/img/common/menu-horiz.png')}
            />
          </MenuTrigger>
          <MenuOptions customStyles={menuOptionsStyles}>
            {accepted &&
              <MenuOption
                text={strings.menuDeclineMeal}
                onSelect={debounce(() => setAccept(false), 300)}
              />
            }
            <MenuOption
              text={strings.menuDeleteMeal}
              onSelect={debounce(removeMeal, 300)}
            />
          </MenuOptions>
        </Menu>
      </View>
      {renderNutrients(nutrients)}
      <View style={s.totalContainer}>
        <Text style={s.totalText}>{strings.total}</Text>
        <View style={s.energyValueBox}>
          <Text style={s.total}>
            {calculateTotal(nutrients, 'proteins').toFixed(1)}
          </Text>
          <Text style={s.total}>
            {calculateTotal(nutrients, 'fats').toFixed(1)}
          </Text>
          <Text style={s.total}>
            {calculateTotal(nutrients, 'carbs').toFixed(1)}
          </Text>
          <Text style={s.total}>
            {calculateTotal(nutrients, 'calories')}
          </Text>
          <Text style={s.total}>
            {calculateTotal(nutrients, 'water')}
          </Text>
        </View>
      </View>
      {!accepted && (
        <View style={s.buttonsContainer}>
          <Button
            title={strings.productDish}
            style={s.addButton}
            icon={<IconFA name="plus" color="#4f6488" size={13} />}
            onPress={navigateToNutrients}
          />
          <Button
            title={strings.accept}
            style={s.acceptButton}
            icon={<IconFA name="check" color="darkseagreen" size={13} />}
            onPress={() => setAccept(true)}
          />
        </View>
      )}
    </View>
  )
}

export default connect(
  state => ({
    date: state.main.shortDate,
    meals: state.firestore.data.meals,
  }),
  {
    removeMeal,
    setMealInfo,
    showFoodModal,
    setMealTimeInfo,
    acceptMeal
  }
)(FoodMeal);

const s = StyleSheet.create({
  mainContainer: {
    width: '100%',
    backgroundColor: 'white',
    elevation: 3,
    padding: 10,
    marginBottom: 10,
  },
  rowContainer: {
    flexDirection: 'row',
  },
  energyValueBox: {
    flexDirection: 'row',
    flex: 1,
    marginLeft: 10
  },
  totalContainer: {
    flexDirection: 'row',
    marginTop: 7,
  },
  total: {
    flex: 1,
    marginLeft: 24,
    fontWeight: 'bold',
    fontSize: 13,
  },
  buttonsContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  addButton: {
    flex: 1,
    marginRight: 10,
  },
  acceptButton: {
    flex: 1,
  },
  mealTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginRight: 5,
  },
  timeText: {
    color: '#9da1a7',
    paddingLeft: 3,
  },
  totalText: {
    fontSize: 13,
    fontWeight: 'bold',
    marginLeft: 5,
  }
})