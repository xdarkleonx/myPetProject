import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, TextInput, Image, Switch, ScrollView } from 'react-native';
import { Button } from './Button';
import IconFA from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import { ButtonsGroup } from '../components/ButtonsGroup';
import { useNavigation } from '@react-navigation/native';
import { Menu, MenuTrigger, MenuOptions, MenuOption } from 'react-native-popup-menu';
import { menu, menuIcon, menuTriggerStyles, menuOptionsStyles } from '../styles/menu';
import { deleteFile } from '../utils/firebase';
import { calculateMicroIndex } from '../utils/nutrientActions';
import * as constants from '../utils/constants';
import { getPhotoPath } from '../utils/stringFormat';
import { EnergyValue } from './EnergyValue';
import { NutritionDetails } from './NutritionDetails';
import { setNutrientInfo, updateMealNutrient, removeMealNutrient, addMealNutrient } from '../store/actions/foodActions';
import { addMeal, setEditInfo, removeNutrient, setDishIngredients } from '../store/actions/foodActions';
import { strings } from '../utils/localization';
import { alert } from '../utils/alertWrapper';

const Nutrient = props => {
  const [disabled, setDisabled] = useState();
  const [showDetails, setShowDetails] = useState();
  const [detailsIndex, setDetailsIndex] = useState(0);
  const [nutritionValueIndex, setNutritionValueIndex] = useState(0);
  const [calculated, setCalculated] = useState();
  const navigation = useNavigation();

  useEffect(() => {
    const calculated = calculateNutrients(
      props.data,
      props.data.calculated?.weight,
      props.data.calculated?.heatTreatment
    )
 
    setDisabled(props.disabled || false);
    setShowDetails(props.showDetails);
    setCalculated(calculated);
  }, [props.data.infoKey])

  const getImage = useCallback(imageUrl => {
    return imageUrl
      ? { uri: `${imageUrl}` }
      : require('../assets/img/food/nutrient.png');
  }, [])

  const calculateMacro = useCallback((value, weight, treatment, lossRate, decimal) => {
    if (value === undefined)
      return;

    lossRate = treatment ? lossRate : 1;
    const result = value * weight / 100 * lossRate;

    return decimal
      ? parseFloat(result.toFixed(decimal))
      : Math.round(result);
  }, [])

  const calculateMicro = useCallback((value, weight, treatment, dailyNorm, lossRate) => {
    if (value === undefined)
      return;

    lossRate = treatment ? lossRate : 1;

    if (dailyNorm) {
      const percentResult = 100 * value / dailyNorm * weight / 100 * lossRate;
      return percentResult < 1
        ? parseFloat(percentResult.toFixed(1))
        : Math.round(percentResult);
    }
    else {
      const result = value * weight / 100 * lossRate;
      return parseFloat(result.toFixed(3));
    }
  }, [])

  const calculateNutrients = useCallback((data, weight, treatment) => {
    const { proteins, fats, carbs, calories, water, micronutrients } = data;
    const { aminoacids, digestibleAminoacids, fattyacids, saccharides } = data;
    const { microDailyNorm, macroLoses, microLoses, aminoLoses, fattyLoses, saccharideLoses } = constants;

    weight = parseInt(weight) || 100;
    treatment = treatment || false;

    let calculated = {
      weight: weight,
      heatTreatment: treatment,
      proteins: calculateMacro(proteins, weight, treatment, macroLoses.proteins, 2),
      fats: calculateMacro(fats, weight, treatment, macroLoses.fats, 2),
      carbs: calculateMacro(carbs, weight, treatment, macroLoses.carbs, 2),
      calories: calculateMacro(calories, weight, treatment, macroLoses.calories),
    }

    if (water)
      calculated.water = calculateMacro(water, weight, treatment, macroLoses.water);

    if (micronutrients) {
      microDailyNorm.min_fe = props.user?.gender == 'female' ? 18 : 10;
      microDailyNorm.min_se = props.user?.gender == 'female' ? 55 : 70;
      Object.keys(micronutrients).forEach(key => {
        calculated.micronutrients = {
          ...calculated.micronutrients,
          [key]: calculateMicro(micronutrients[key], weight, treatment, null, microLoses[key])
        }
        calculated.microPercent = {
          ...calculated.microPercent,
          [key]: calculateMicro(micronutrients[key], weight, treatment, microDailyNorm[key], microLoses[key])
        }
      })
      calculated.microIndex = calculateMicroIndex(calculated.micronutrients);
    }
    if (digestibleAminoacids) {
      Object.keys(digestibleAminoacids).forEach(key => {
        calculated.digestibleAminoacids = {
          ...calculated.digestibleAminoacids,
          [key]: calculateMacro(digestibleAminoacids[key], weight, treatment, aminoLoses[key], 3)
        }
      })
    }
    if (aminoacids) {
      Object.keys(aminoacids).forEach(key => {
        calculated.aminoacids = {
          ...calculated.aminoacids,
          [key]: calculateMacro(aminoacids[key], weight, treatment, aminoLoses[key], 3)
        }
      })
    }
    if (fattyacids) {
      Object.keys(fattyacids).forEach(key => {
        calculated.fattyacids = {
          ...calculated.fattyacids,
          [key]: calculateMacro(fattyacids[key], weight, treatment, fattyLoses[key], 3)
        }
      })
    }
    if (saccharides) {
      Object.keys(saccharides).forEach(key => {
        calculated.saccharides = {
          ...calculated.saccharides,
          [key]: calculateMacro(saccharides[key], weight, treatment, saccharideLoses[key], 3)
        }
      })
    }

    return calculated;
  }, [])

  const addToMeal = () => {
    const { data, date, mealInfo } = props;
    const { heatTreatment, weight, proteins, fats, carbs, calories, water } = calculated;
    const { mealKey, nutrientNumber, nutrientsCount, existNutrients } = mealInfo;
    const { isShow, type, filter, owner, updated, created, ...nutrient } = data;
    const isExists = existNutrients.some(n => n === nutrient.infoKey);

    if (nutrientsCount >= 10) {
      alert(strings.maxNutrientsInMeal);
      return;
    }
    else if (isExists) {
      alert(strings.nutrientExist);
      return;
    }

    nutrient.calculated = {
      weight: weight,
      heatTreatment: heatTreatment,
      proteins: proteins,
      fats: fats,
      carbs: carbs,
      calories: calories,
      ...(water) && { water },
    }

    nutrientsCount === 0
      ? props.addMeal(date, mealKey, nutrient)
      : props.addMealNutrient(date, mealKey, nutrient, nutrientNumber);
  }

  const addToIngredients = () => {
    const { dishIngredients, infoKey, editInfo } = props;
    const { weight, heatTreatment, proteins, fats, carbs, calories } = calculated;
    const { water, micronutrients, aminoacids, fattyacids, saccharides } = calculated;

    const isExists = dishIngredients?.some(i => i.infoKey === infoKey);
    const editedDish = editInfo?.infoKey === infoKey;

    if (dishIngredients?.length >= 20) {
      alert(strings.maxIngredients);
      return;
    }
    else if (isExists) {
      alert(strings.nutrientExist);
      return;
    }
    else if (editedDish) {
      alert(strings.cantAddEditableDish);
      return;
    }

    const nutrient = {
      ...props.data,
      calculated: {
        weight,
        heatTreatment,
        proteins,
        fats,
        carbs,
        calories,
        water,
        micronutrients,
        aminoacids,
        fattyacids,
        saccharides
      }
    }
    props.setDishIngredients(nutrient);
  }

  const editIngredient = useCallback(calculated => {
    const { data, updateIngredient, dishIngredients } = props;

    if (updateIngredient) {
      const ingredients = dishIngredients.map(ingredient => {
        if (ingredient.infoKey === data.infoKey)
          return { ...ingredient, calculated }
        return ingredient;
      })
      props.setDishIngredients(ingredients, true)
    }
  }, [props.dishIngredients])

  const changeNutrientInfo = calculated => {
    if (!props.editButtons)
      return;

    props.setNutrientInfo({
      ...props.nutrientInfo,
      data: {
        ...props.nutrientInfo.data,
        calculated: {
          weight: calculated.weight,
          heatTreatment: calculated.heatTreatment,
          proteins: calculated.proteins,
          fats: calculated.fats,
          carbs: calculated.carbs,
          calories: calculated.calories,
          ...(calculated.water) &&
          { water: calculated.water }
        }
      }
    })
  }

  const onWeightChange = useCallback(weight => {
    const heatTreatment = calculated?.heatTreatment || false;
    const calculatedData = calculateNutrients(props.data, weight, heatTreatment);

    changeNutrientInfo(calculatedData);
    editIngredient(calculatedData);
    setCalculated(calculatedData);
  }, [calculated?.heatTreatment])

  const onHeatTreatmentChange = useCallback(heatTreatment => {
    const weight = calculated?.weight || 100;
    const calculatedData = calculateNutrients(props.data, weight, heatTreatment);

    changeNutrientInfo(calculatedData);
    editIngredient(calculatedData);
    setCalculated(calculatedData);
  }, [calculated?.weight])

  const editNutrient = useCallback(data => {
    const { infoKey } = props;
    props.setEditInfo({ ...data, infoKey });

    if (data.species === 'product')
      navigation.navigate('Product');
    else {
      const ingredients = data.ingredients.map(ingredient => {
        const weight = ingredient.calculated.weight;
        const heatTreatment = ingredient.calculated.heatTreatment;
        const calculated = calculateNutrients(ingredient, weight, heatTreatment);
        return {
          ...ingredient,
          calculated: {
            weight: calculated.weight,
            heatTreatment: calculated.heatTreatment,
            proteins: calculated.proteins,
            fats: calculated.fats,
            carbs: calculated.carbs,
            calories: calculated.calories,
            water: calculated.water,
            micronutrients: calculated.micronutrients,
            aminoacids: calculated.aminoacids,
            fattyacids: calculated.fattyacids,
            saccharides: calculated.saccharides
          }
        }
      })
      props.setDishIngredients(ingredients, true);
      navigation.navigate('Dish');
    }
  }, [props.infoKey])

  const removeNutrient = useCallback(docId => {
    const { imageUrl } = props.data;
    if (imageUrl) {
      const filePath = getPhotoPath(imageUrl, 'nutrients');
      deleteFile(filePath);
    }

    props.removeNutrient(docId);
  }, [props.data.imageUrl])

  const renderNutritionDetails = () => {
    const { data } = props;

    if (!showDetails)
      return;

    if (data.species === 'product') {
      return (
        <NutritionDetails
          index={nutritionValueIndex}
          proteins={data.proteins}
          fats={data.fats}
          carbs={data.carbs}
          microPercent={calculated?.microPercent}
          aminoacids={calculated?.aminoacids}
          fattyacids={calculated?.fattyacids}
          saccharides={calculated?.saccharides}
          onPress={index => setNutritionValueIndex(index)}
        />
      )
    } else {
      return (
        <View>
          <ButtonsGroup
            buttonHeight={30}
            buttons={[strings.nutritionValue, strings.ingridients, strings.recepie]}
            selectedIndex={detailsIndex}
            selectedColor='#f2f4f7'
            selectedTextColor='#4f6488'
            style={s.dishDetails}
            onPress={index => setDetailsIndex(index)}
          />
          {detailsIndex === 0 && (
            <NutritionDetails
              buttonsHeight={25}
              index={nutritionValueIndex}
              proteins={data.proteins}
              fats={data.fats}
              carbs={data.carbs}
              microPercent={calculated?.microPercent}
              aminoacids={calculated?.aminoacids}
              fattyacids={calculated?.fattyacids}
              saccharides={calculated?.saccharides}
              onPress={index => setNutritionValueIndex(index)}
            />
          )
          }
          {detailsIndex === 1 &&
            <ScrollView nestedScrollEnabled style={s.dishDetailsBox}>
              {data.ingredients
                ? data.ingredients?.map((ingredient, index) => {
                  return (
                    <View key={index} style={s.ingredient}>
                      <Text>{ingredient.name}
                        {ingredient.calculated.heatTreatment && strings.treatmentIngred}
                      </Text>
                      <Text>{strings.formatString(strings.gramFs, ingredient.calculated.weight)}</Text>
                    </View>
                  )
                })
                : <Text style={s.noInfo}>{strings.emptyIngredients}</Text>
              }
            </ScrollView>
          }
          {detailsIndex === 2 &&
            <ScrollView nestedScrollEnabled style={s.dishDetailsBox}>
              {data.recepie && data.prepareTime &&
                <View style={s.prepareTimeBox}>
                  <IconFA name="clock-o" color="#9da1a7" size={18} style={{ marginRight: 5 }} />
                  <Text>{strings.formatString(strings.prepareTimeFs, data.prepareTime)}</Text>
                </View>
              }
              {data.recepie
                ? data.recepie?.map((recepieStep, index) => {
                  return (
                    <View key={index} style={s.recepieStep}>
                      <Text>
                        <Text style={s.bold}>
                          {strings.formatString(strings.stepDotFs, recepieStep.step)}
                        </Text>
                        {recepieStep.description}
                      </Text>
                    </View>
                  )
                })
                : <Text style={s.noInfo}>{strings.noRecepie}</Text>
              }
            </ScrollView>
          }
        </View>
      )
    }
  }

  const renderAddButton = () => {
    const { addButton, data, mealInfo, dishIngredients } = props;

    const exist = dishIngredients
      ? dishIngredients?.some(i => i.infoKey === data.infoKey)
      : mealInfo.existNutrients?.some(n => n === data.infoKey);

    const icon = exist
      ? <IconFA name="check" color="darkseagreen" size={13} />
      : <IconFA name="plus" color="#4f6488" size={13} />;

    if (addButton === 'addToMeal') {
      return (
        <Button
          title={exist ? strings.added : strings.addToMeal}
          style={s.addButton}
          icon={icon}
          onPress={addToMeal}
        />
      )
    } else if (addButton === 'addToIngredients') {
      return (
        <Button
          title={exist ? strings.added : strings.addToIngredients}
          style={s.addButton}
          icon={icon}
          onPress={addToIngredients}
        />
      )
    }
  }

  const renderEditButtons = () => {
    const { editButtons, mealInfo, nutrientInfo } = props;
    const { removeMealNutrient, updateMealNutrient } = props;
    const heatTreatment = calculated?.heatTreatment;
    const weight = calculated?.weight;
    let initialWeight, initialHeatTreatment;

    if (disabled === true)
      return;

    if (nutrientInfo) {
      initialWeight = nutrientInfo.initialWeight;
      initialHeatTreatment = nutrientInfo.initialHeatTreatment;
    }

    const hasButtons = editButtons?.some(button => {
      return button === 'updateMealNutrient' ||
        button === 'deleteMealNutrient';
    })

    if (hasButtons) {
      return (
        <View style={s.row}>
          {mealInfo.nutrientsCount > 1 &&
            <Button
              title={strings.delete}
              style={s.editButton}
              icon={<IconFA name="times" color="red" size={13} />}
              onPress={() => removeMealNutrient(nutrientInfo)}
            />
          }
          {initialWeight !== weight || initialHeatTreatment !== heatTreatment
            ? <Button
              title={strings.save}
              style={mealInfo.nutrientsCount > 1 ? s.editButton2 : s.editButton}
              icon={<IconFA name="check" color="darkseagreen" size={13} />}
              onPress={() => updateMealNutrient(nutrientInfo)}
            />
            : null
          }
        </View>
      )
    }
  }

  return (
    <View style={[s.main, { ...props.style }]}>
      <View style={s.row}>
        <Image style={s.imageStyle} source={getImage(props.data.imageUrl)} />
        <View style={s.nutrientInfo}>
          <Text style={s.name} ellipsizeMode="tail" numberOfLines={1}>
            {props.data.name || strings.nutrientNoName}
          </Text>
          <Text style={s.gray}>
            {strings.formatString(
              strings.categoryFs,
              props.data.species === 'product' ? strings.product : strings.dish,
              props.data.category || strings.noCategory
            )}
          </Text>
          <View style={s.row}>
            <Text style={s.gray}>{strings.weightGramm}</Text>
            <TextInput
              style={s.weightStyle}
              editable={disabled === false ? true : false}
              disableFullscreenUI
              keyboardType='number-pad'
              selectionColor='#a6c3fe'
              maxLength={4}
              defaultValue={(calculated?.weight || 100).toString()}
              onEndEditing={e => onWeightChange(e.nativeEvent.text)}
            />
            {props.data.species === 'product'
              ? <View style={s.heatTreatmentContainer}>
                <Text style={s.gray}>{strings.treatmentLower}</Text>
                <Switch
                  style={s.heat}
                  disabled={disabled}
                  value={calculated?.heatTreatment}
                  thumbColor={calculated?.heatTreatment ? '#2566d4' : 'white'}
                  onValueChange={treatment => onHeatTreatmentChange(treatment)}
                />
              </View>
              : <Text style={s.totalWeight}>{`(${props.data.totalWeight || '100'})`}</Text>
            }
          </View>
        </View>
        {props.showMenu &&
          <Menu style={menu}>
            <MenuTrigger customStyles={menuTriggerStyles}>
              <Image
                style={menuIcon}
                source={require('../assets/img/common/menu-horiz.png')}
              />
            </MenuTrigger>
            <MenuOptions customStyles={menuOptionsStyles}>
              <MenuOption
                text={strings.menuEdit}
                onSelect={() => editNutrient(props.data)}
              />
              <MenuOption
                text={strings.menuDeleteNutrient}
                onSelect={() => removeNutrient(props.data.infoKey)}
              />
            </MenuOptions>
          </Menu>
        }
      </View>
      <EnergyValue
        proteins={calculated?.proteins}
        fats={calculated?.fats}
        carbs={calculated?.carbs}
        calories={calculated?.calories}
        water={calculated?.water}
        proteinsQuality={props.data.quality?.proteins}
        fatsQuality={props.data.quality?.fats}
        carbsQuality={props.data.quality?.carbs}
        micronutrientsQuality={calculated?.microIndex}
        onPress={() => setShowDetails(!showDetails)}
      />
      {renderNutritionDetails()}
      {renderAddButton()}
      {renderEditButtons()}
    </View>
  )
}

export default connect(
  state => ({
    mealInfo: state.food.mealInfo,
    nutrientInfo: state.food.nutrientInfo,
    editInfo: state.food.editInfo,
    date: state.main.shortDate,
    dishIngredients: state.food.dishIngredients,
    user: state.firebase.profile
  }),
  {
    setNutrientInfo,
    updateMealNutrient,
    removeMealNutrient,
    addMeal,
    addMealNutrient,
    setEditInfo,
    removeNutrient,
    setDishIngredients
  }
)(Nutrient);

const s = StyleSheet.create({
  main: {
    backgroundColor: 'white',
    elevation: 3,
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  row: {
    flexDirection: 'row',
  },
  name: {
    width: '90%',
  },
  gray: {
    color: '#9da1a7',
    marginTop: 3,
    fontSize: 13
  },
  totalWeight: {
    color: '#9da1a7',
    marginTop: 1,
    marginLeft: 5,
    fontSize: 13,
  },
  weightStyle: {
    width: 60,
    height: 22,
    textAlign: 'center',
    borderColor: '#ebebeb',
    borderRadius: 3,
    borderBottomWidth: 1,
    paddingTop: 0,
    paddingBottom: 3,
    marginTop: 0,
    marginLeft: 5,
    alignSelf: 'flex-end'
  },
  heatTreatmentContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  heat: {
    height: 20,
    marginTop: 5
  },
  imageStyle: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  nutrientInfo: {
    flex: 1,
    paddingLeft: 10,
  },
  addButton: {
    backgroundColor: '#f2f4f7',
    marginBottom: 10
  },
  dishDetails: {
    color: '#9da1a7',
    fontSize: 13,
    marginBottom: 10,
  },
  prepareTimeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#ebebeb',
    paddingHorizontal: 10,
    paddingVertical: 5,
    paddingBottom: 10
  },
  dishDetailsBox: {
    maxHeight: 270.6866,
    marginBottom: 10
  },
  ingredient: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: '#ebebeb',
    borderBottomWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  recepieStep: {
    borderColor: '#ebebeb',
    borderBottomWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  editButton: {
    flex: 1,
    marginBottom: 10
  },
  editButton2: {
    flex: 1,
    marginBottom: 10,
    marginLeft: 10
  },
  noInfo: {
    fontSize: 13,
    color: '#9da1a7',
    textAlign: 'center',
    padding: 5,
  },
  bold: {
    fontWeight: 'bold'
  }
})