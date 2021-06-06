import React, { useState, useEffect, useRef, useLayoutEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { ScrollView, TextInput, StatusBar, ActivityIndicator } from 'react-native';
import { Button } from '../../components/Button';
import { ButtonsGroup } from '../../components/ButtonsGroup';
import IconFA from 'react-native-vector-icons/FontAwesome';
import { Menu, MenuTrigger, MenuOptions, MenuOption } from 'react-native-popup-menu';
import { arrowDown, triggerText, menuTriggerStyles, menuOptionsStyles } from '../../styles/menu';
import { picker } from '../../styles/picker';
import RNPickerSelect from 'react-native-picker-select';
import { EnergyValue } from '../../components/EnergyValue';
import MyModal from '../../components/MyModal';
import { upperCaseFirst, getPhotoPath } from '../../utils/stringFormat';
import { selectPhoto } from '../../utils/selectPhoto';
import isEqual from 'lodash/isEqual';
import { uploadImage, deleteFile } from '../../utils/firebase';
import Nutrient from '../../components/Nutrient';
import * as nutrientActions from '../../utils/nutrientActions';
import { dishCategories, heatTreatmentTypes, macroLoses } from '../../utils/constants';
import { aminoLoses, fattyLoses, saccharideLoses, microLoses } from '../../utils/constants';
import { connect } from 'react-redux';
import { setMealInfo, setDishIngredients, createDish } from '../../store/actions/foodActions';
import { updateDish, setEditInfo, clearIngredients } from '../../store/actions/foodActions';
import { alert } from '../../utils/alertWrapper';
import { strings } from '../../utils/localization';

const Dish = props => {
  const [disabled, setDisabled] = useState(false);
  const [buttonsGroupIndex, setButtonsGroupIndex] = useState(0);
  const [photo, setPhoto] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [mainInfo, setMainInfo] = useState();
  const [nutrientInfo, setNutrientInfo] = useState();
  const [nutritionValue, setNutritionValue] = useState();
  const [recepie, setRecepie] = useState([]);
  const lastStepRef = useRef();
  const redStar = <Text style={styles.red}> *</Text>;

  useEffect(() => {
    setDefaultValues();
    return () => {
      props.setEditInfo(null);
      props.setDishIngredients(null, true);
      props.setMealInfo({ button: 'addToMeal' });
    }
  }, [])

  useLayoutEffect(() => {
    calcNutritionValue();
  }, [props.dishIngredients, mainInfo?.heatTreatment, mainInfo?.totalWeight])

  const valueToString = (type, name) => {
    const value = type?.[name];

    if (value || value === 0) {
      return String(value)
    }
  }

  const onEndEditingValue = (event, name, precision, state, setState) => {
    let value = parseFloat(event.nativeEvent.text);

    if (precision === 0)
      value = Math.round(value);
    else if (precision > 0)
      value = parseFloat(parseFloat(value).toFixed(precision));

    if (typeof value !== String && !isNaN(value))
      setState({ ...state, [name]: value });
    else if (state) {
      const { [name]: removedKey, ...keys } = state;
      const keysInObject = Object.keys(keys).length;

      keysInObject >= 1 && isNaN(value)
        ? setState(keys)
        : setState(null);
    }
  }

  const goToNutrients = () => {
    props.clearIngredients();
    props.setMealInfo({ button: 'addToIngredients' });
    props.navigation.push('Nutrients');
  }

  const showIngredient = ingredient => {
    setNutrientInfo({ ...ingredient, updateIngredient: true });
    setModalVisible(true);
  }

  const showDishInfo = () => {
    const ingredients = props.dishIngredients?.map(i => ({
      name: i.name,
      calculated: {
        weight: i.calculated.weight,
        heatTreatment: i.calculated.heatTreatment,
      }
    }))
    setNutrientInfo({
      updateIngredient: false,
      ...mainInfo,
      ...nutritionValue,
      ...(ingredients?.length) && { ingredients },
      ...(recepie?.length) && { recepie }
    })
    setModalVisible(true);
  }

  const removeIngredient = infoKey => {
    const ingredients = props.dishIngredients.filter(i => i.infoKey !== infoKey);

    ingredients.length === 0
      ? props.setDishIngredients(null, true)
      : props.setDishIngredients(ingredients, true)
  }

  const addRecepieStep = event => {
    const text = event.nativeEvent.text.trim();
    if (text.length > 0) {
      setRecepie(recepie.concat({
        step: recepie?.length + 1 || 1,
        description: upperCaseFirst(text)
      }))
    }
    lastStepRef.current.setNativeProps({ text: '' });
  }

  const editRecepieStep = (event, stepNumber) => {
    const text = event.nativeEvent.text.trim();
    let steps;
    if (text.length > 0) {
      steps = recepie.filter(s => s.step !== stepNumber);
      steps.push({ step: stepNumber, description: text })
      steps.sort((a, b) => a.step - b.step);
    }
    else if (text.length === 0) {
      steps = recepie.filter(s => s.step !== stepNumber);
    }

    const numerated = steps.map((step, index) => ({ step: index + 1, description: step.description }))
    setRecepie(numerated)
  }

  const getType = nutritionValue => {
    const proteins = nutritionValue?.proteins || 0;
    const fats = nutritionValue?.fats || 0;
    const carbs = nutritionValue?.carbs || 0;
    const proteinsPercent = Math.round((proteins * 100) / (proteins + fats + carbs));
    const fatsPercent = Math.round((fats * 100) / (proteins + fats + carbs));
    const carbsPercent = Math.round((carbs * 100) / (proteins + fats + carbs));
    let type = {};

    if (proteinsPercent >= 20)
      type.protein = true;
    if (fatsPercent >= 25)
      type.fat = true;
    if (carbsPercent >= 30)
      type.carb = true;

    return type;
  }

  const calcIn100 = (object, totalWeight) => {
    if (!object) return;
    const newObject = {};

    Object.keys(object).forEach(key => {
      newObject[key] = parseFloat((object[key] * 100 / totalWeight).toFixed(3));
    })

    return newObject;
  }

  const calcWithTreatment = (object, loses) => {
    if (!object) return;

    const newObject = {};

    Object.keys(object).forEach(key => {
      newObject[key] = parseFloat((object[key] * (loses[key] || 1)).toFixed(3));
    })
    return newObject;
  }

  const calcNutritionValue = () => {
    if (!props.dishIngredients?.length) {
      setNutritionValue(null);
      return;
    }
    const heatTreatment = mainInfo?.heatTreatment || false;
    const ingredients = props.dishIngredients.map(i => ({
      category: i.category,
      species: i.species,
      ...i.calculated,
      ...(i.digestibleAminoacids) && {
        digestibleAminoacids: i.digestibleAminoacids
      }
    }))


    let macro = nutrientActions.calculateMacro(ingredients, true);
    let aminoAcids = nutrientActions.calculateAminoAcids(ingredients);
    let digestibleAminoAcids = nutrientActions.calculateAminoAcids(ingredients, true);
    let fattyAcids = nutrientActions.calculateFattyAcids(ingredients);
    let saccharides = nutrientActions.calculateSaccharides(ingredients);
    let micronutrients = nutrientActions.calculateMicronutrients(ingredients);

    if (heatTreatment) {
      macro = calcWithTreatment(macro, macroLoses);
      aminoAcids = calcWithTreatment(aminoAcids, aminoLoses);
      digestibleAminoAcids = calcWithTreatment(digestibleAminoAcids, aminoLoses);
      fattyAcids = calcWithTreatment(fattyAcids, fattyLoses);
      saccharides = calcWithTreatment(saccharides, saccharideLoses);
      micronutrients = calcWithTreatment(micronutrients, microLoses);
    }

    const totalWeight = mainInfo?.totalWeight || macro?.weight;

    const macroIn100 = calcIn100(macro, totalWeight);
    const aminoIn100 = calcIn100(aminoAcids, totalWeight);
    const digestibleAminoIn100 = calcIn100(digestibleAminoAcids, totalWeight);
    const fattyIn100 = calcIn100(fattyAcids, totalWeight);
    const saccharidesIn100 = calcIn100(saccharides, totalWeight);
    const micronutrientsIn100 = calcIn100(micronutrients, totalWeight);

    const proteinsQuality = nutrientActions.calculateProteinsQuality(macroIn100.proteins, digestibleAminoIn100);
    const fatsQuality = nutrientActions.calculateFatsQuality(macroIn100.fats, fattyIn100);
    const carbsQuality = nutrientActions.calculateCarbsQuality(macroIn100.carbs, saccharidesIn100);
    const microIndex = nutrientActions.calculateMicroIndex(micronutrientsIn100);

    setNutritionValue({
      proteins: parseFloat(macroIn100.proteins.toFixed(1)),
      fats: parseFloat(macroIn100.fats.toFixed(1)),
      carbs: parseFloat(macroIn100.carbs.toFixed(1)),
      calories: parseInt(macroIn100.calories),
      ...(macroIn100.water) && { water: macroIn100.water },
      ...(micronutrientsIn100) && { micronutrients: micronutrientsIn100 },
      ...(aminoIn100) && { aminoacids: aminoIn100 },
      ...(digestibleAminoIn100) && { digestibleAminoacids: digestibleAminoIn100 },
      ...(fattyIn100) && { fattyacids: fattyIn100 },
      ...(saccharidesIn100) && { saccharides: saccharidesIn100 },
      ...(proteinsQuality || fatsQuality || carbsQuality || microIndex) && {
        quality: {
          ...(proteinsQuality) && { proteins: proteinsQuality },
          ...(fatsQuality) && { fats: fatsQuality },
          ...(carbsQuality) && { carbs: carbsQuality },
          ...(microIndex) && { microIndex: microIndex },
        }
      },
    })
  }

  const setDefaultValues = () => {
    if (props.editInfo) {
      const { name, category, heatTreatment, totalWeight, prepareTime } = props.editInfo;
      const { imageUrl, recepie } = props.editInfo;

      imageUrl && setPhoto({
        photoSource: { uri: imageUrl },
      })
      setMainInfo({
        name,
        category,
        heatTreatment,
        totalWeight,
        prepareTime
      });
      setRecepie(recepie)
    }
  }

  const isNoChanges = () => {
    const { editInfo, dishIngredients } = props;

    const editMainInfo = {
      name: editInfo?.name,
      category: editInfo?.category,
      heatTreatment: editInfo?.heatTreatment,
      totalWeight: editInfo?.totalWeight,
      prepareTime: editInfo?.prepareTime,
    }
    const editIngredients = editInfo?.ingredients.map(i => {
      return {
        infoKey: i.infoKey,
        weight: i.calculated.weight,
        heatTreatment: i.calculated.heatTreatment,
      }
    })
    const currentIngredients = dishIngredients?.map(i => {
      return {
        infoKey: i.infoKey,
        weight: i.calculated.weight,
        heatTreatment: i.calculated.heatTreatment,
      }
    })

    const values = [
      photo?.prevPhotoSource || photo?.photoData ? false : true,
      isEqual(editMainInfo, mainInfo),
      isEqual(editIngredients, currentIngredients),
      isEqual(editInfo?.recepie, recepie),
    ]

    return values.every(value => value === true);
  }

  const create = async () => {
    if (disabled) return;
    setDisabled(true);

    const infoKey = props.editInfo?.infoKey;
    let alertText;

    if (isNoChanges()) {
      console.log('Dont save, there is no changes');
      props.navigation.navigate('Nutrients');
      return;
    }

    const name = mainInfo?.name?.trim().length || 0;
    const requiredFieldsCount = mainInfo && Object.keys(mainInfo).length;

    if (requiredFieldsCount < 5 || name < 2)
      alertText = strings.requiredDishFields;

    if (!props.dishIngredients?.length)
      alertText = alertText?.concat(`\n${strings.needAddIngredients}`) || strings.needAddIngredients;

    if (!recepie?.length)
      alertText = alertText?.concat(`\n${strings.describeRecepie}`) || strings.describeRecepie;

    if (alertText) {
      setDisabled(false);
      alert(alertText, strings.notAllDataFilled);
      return;
    }

    const ingredients = props.dishIngredients?.map(i => {
      return {
        species: i.species,
        category: i.category,
        infoKey: i.infoKey,
        name: i.name,
        proteins: i.proteins,
        fats: i.fats,
        carbs: i.carbs,
        calories: i.calories,
        ...(i.water) && { water: i.water },
        ...(i.micronutrients) && { micronutrients: i.micronutrients },
        ...(i.aminoacids) && { aminoacids: i.aminoacids },
        ...(i.fattyacids) && { fattyacids: i.fattyacids },
        ...(i.saccharides) && { saccharides: i.saccharides },
        ...(i.quality) && {
          quality: {
            ...(i.quality.proteins) && { proteins: i.quality.proteins },
            ...(i.quality.fats) && { fats: i.quality.fats },
            ...(i.quality.carbs) && { carbs: i.quality.carbs }
          }
        },
        calculated: {
          weight: i.calculated.weight,
          heatTreatment: i.calculated.heatTreatment,
        }
      }
    })

    const dish = {
      type: getType(nutritionValue),
      ...mainInfo,
      ...nutritionValue,
      ...(ingredients?.length) && { ingredients },
      ...(recepie?.length) && { recepie },
      ...(props.editInfo) && {
        created: props.editInfo.created
      }
    }

    if (photo?.prevPhotoSource) {
      console.log('Deleting photo');
      const imageUrl = props.editInfo?.imageUrl;
      const filePath = getPhotoPath(imageUrl, 'nutrients');
      deleteFile(filePath);
    }

    if (photo?.photoData) {
      console.log('Adding new photo');
      uploadImage('nutrients', photo.photoData,
        (imageUrl) => {
          dish.imageUrl = imageUrl;
          props.editInfo
            ? props.updateDish(infoKey, dish)
            : props.createDish(dish)
        });
    }
    else {
      console.log('Stay photo same/empty');
      const imageUrl = !photo?.photoSource
        ? null
        : props.editInfo?.imageUrl;

      imageUrl && (dish.imageUrl = imageUrl);
      await props.editInfo
        ? props.updateDish(infoKey, dish)
        : props.createDish(dish)
    }

    props.navigation.navigate('Nutrients');
  }

  return (
    <>
      <ScrollView contentContainerStyle={styles.main}>
        <StatusBar
          barStyle='dark-content'
          backgroundColor='white'
        />
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.5}
            onPress={() => props.navigation.goBack()}
          >
            <Image
              style={styles.arrowIcon}
              resizeMode='contain'
              source={require('../../assets/img/common/left-arrow.png')}
            />
          </TouchableOpacity>
          {props.editInfo
            ? <Text style={styles.sectionText}>{strings.editDish}</Text>
            : <Menu>
              <MenuTrigger customStyles={menuTriggerStyles}>
                <Text style={triggerText}>{strings.createDish}</Text>
                <IconFA style={arrowDown} name='angle-down' color='black' size={20} />
              </MenuTrigger>
              <MenuOptions customStyles={menuOptionsStyles}>
                <MenuOption
                  text={strings.createProduct}
                  onSelect={() => {
                    props.navigation.replace('Product');
                  }}
                />
              </MenuOptions>
            </Menu>
          }
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.imageButton}
          onPress={() => selectPhoto(strings.chooseDishPhoto, photo, setPhoto, props.editInfo?.imageUrl)}
        >
          {photo?.photoSource
            ? <Image style={styles.image} resizeMode='cover' source={photo.photoSource} />
            : <>
              <IconFA name='camera' color='#c6cfdb' size={28} />
              <Text style={styles.fotoText}>
                {strings.choosePhoto}
              </Text>
            </>
          }
        </TouchableOpacity>
        <EnergyValue
          bgColor='#e6eaf0'
          proteins={nutritionValue?.proteins}
          fats={nutritionValue?.fats}
          carbs={nutritionValue?.carbs}
          calories={nutritionValue?.calories}
          water={nutritionValue?.water}
          proteinsQuality={nutritionValue?.quality?.proteins}
          fatsQuality={nutritionValue?.quality?.fats}
          carbsQuality={nutritionValue?.quality?.carbs}
          micronutrientsQuality={nutritionValue?.quality?.microIndex}
          onPress={showDishInfo}
        />
        <ButtonsGroup
          style={styles.buttonsGroup}
          buttonHeight={30}
          selectedColor='#e6eaf0'
          selectedTextColor='#4f6488'
          selectedIndex={buttonsGroupIndex}
          buttons={[strings.description, strings.ingridients, strings.recepie]}
          onPress={(index) => setButtonsGroupIndex(index)}
        />
        {buttonsGroupIndex === 0 &&
          <View>
            <Text style={styles.inputTitle}>
              {strings.dishName}{redStar}
            </Text>
            <TextInput
              disableFullscreenUI
              style={styles.textInput}
              placeholder={strings.enterName}
              maxLength={50}
              defaultValue={mainInfo?.name}
              onEndEditing={event => setMainInfo({ ...mainInfo, name: upperCaseFirst(event.nativeEvent.text) })}
            />
            <Text style={styles.inputTitle}>
              {strings.category}{redStar}
            </Text>
            <RNPickerSelect
              style={picker}
              useNativeAndroidPickerStyle={false}
              Icon={() => <IconFA style={arrowDown} name='angle-down' color='#9da1a7' size={18} />}
              placeholder={{ label: strings.chooseCategoryPh, color: '#a9a9a9' }}
              items={dishCategories}
              value={mainInfo?.category}
              onValueChange={value => setMainInfo({ ...mainInfo, category: value?.toLowerCase() })}
            />
            <Text style={styles.inputTitle}>
              {strings.treatment}{redStar}
            </Text>
            <RNPickerSelect
              style={picker}
              useNativeAndroidPickerStyle={false}
              Icon={() => <IconFA style={arrowDown} name='angle-down' color='#9da1a7' size={18} />}
              placeholder={{ label: strings.notSelectedTreatment, color: '#a9a9a9' }}
              items={heatTreatmentTypes}
              value={mainInfo?.heatTreatment}
              onValueChange={value => setMainInfo({ ...mainInfo, heatTreatment: value })}
            />
            <Text style={styles.inputTitle}>
              {strings.totalWeight}{redStar}
            </Text>
            <TextInput
              disableFullscreenUI
              style={styles.textInput}
              placeholder={strings.totalWeightPh}
              keyboardType='number-pad'
              defaultValue={valueToString(mainInfo, 'totalWeight')}
              onEndEditing={event => onEndEditingValue(event, 'totalWeight', 0, mainInfo, setMainInfo)}
            />
            <Text style={styles.inputTitle}>
              {strings.prepareTime}{redStar}
            </Text>
            <TextInput
              disableFullscreenUI
              style={styles.textInput}
              placeholder={strings.prepareTimePh}
              keyboardType='number-pad'
              defaultValue={valueToString(mainInfo, 'prepareTime')}
              onEndEditing={event => onEndEditingValue(event, 'prepareTime', 0, mainInfo, setMainInfo)}
            />
          </View>
        }
        {buttonsGroupIndex === 1 &&
          <View>
            {props.dishIngredients?.map((ingredient, index) => {
              return (
                <View style={styles.ingredient} key={index}>
                  <TouchableOpacity
                    style={styles.ingredientTouchable}
                    onPress={() => showIngredient(ingredient)}
                  >
                    <Text style={styles.ingredientName}>{ingredient.name}
                      {ingredient.calculated.heatTreatment && strings.heatTreatment2}
                    </Text>
                    <Text style={styles.ingredientWeight}>
                      {strings.formatString(strings.gram, ingredient.calculated.weight)}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.remove}
                    onPress={() => removeIngredient(ingredient.infoKey)}
                  >
                    <IconFA name='remove' color='#c6cfdb' size={18} />
                  </TouchableOpacity>
                </View>
              )
            })}
            <TouchableOpacity
              style={styles.addIngredient}
              onPress={goToNutrients}
            >
              <IconFA name='plus' color='#4f6488' size={13} />
              <Text style={styles.addIngredientText}>{strings.addIngredient}</Text>
            </TouchableOpacity>
          </View>
        }
        {buttonsGroupIndex === 2 &&
          <View>
            {recepie?.map((rec, index) => {
              return (
                <View key={index}>
                  <Text style={styles.stepTitle}>
                    {strings.formatString(strings.stepFs, index + 1)}
                  </Text>
                  <TextInput
                    multiline
                    blurOnSubmit
                    disableFullscreenUI
                    style={styles.stepTextInput}
                    placeholder={strings.stepDescription}
                    maxLength={500}
                    defaultValue={rec.description}
                    onEndEditing={(event) => editRecepieStep(event, rec.step)}
                  />
                </View>
              )
            })}
            <View>
              <Text style={styles.stepTitle}>
                {strings.formatString(strings.stepFs, recepie?.length + 1 || 1)}
              </Text>
              <TextInput
                ref={lastStepRef}
                multiline
                blurOnSubmit
                disableFullscreenUI
                style={styles.stepTextInput}
                placeholder={strings.stepDescription}
                maxLength={500}
                defaultValue=''
                onEndEditing={event => addRecepieStep(event)}
              />
            </View>
          </View>
        }
      </ScrollView>
      <Button
        disabled={disabled}
        style={styles.save}
        title={strings.save}
        icon={disabled ? <ActivityIndicator color='white' /> : null}
        onPress={create}
      />
      <MyModal
        modalVisible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <StatusBar
          barStyle='light-content'
          backgroundColor='black'
        />
        <Nutrient
          showDetails
          updateIngredient={nutrientInfo?.updateIngredient}
          weight={nutrientInfo?.calculated?.weight || 100}
          heatTreatment={nutrientInfo?.calculated?.heatTreatment || false}
          data={nutrientInfo}
        />
      </MyModal>
    </>
  )
}

export default connect(
  state => ({
    editInfo: state.food.editInfo,
    dishIngredients: state.food.dishIngredients,
  }),
  {
    setMealInfo,
    setDishIngredients,
    createDish,
    updateDish,
    setEditInfo,
    clearIngredients
  }
)(Dish);

const styles = StyleSheet.create({
  main: {
    flexGrow: 1,
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingTop: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowIcon: {
    width: 11,
    height: 17,
  },
  backButton: {
    width: 40,
    position: 'absolute',
    left: 10,
    paddingRight: 10,
    paddingVertical: 10,
  },
  imageButton: {
    width: '100%',
    height: 100,
    borderRadius: 18,
    backgroundColor: '#e6eaf0',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 18,
  },
  fotoText: {
    color: '#acb5c0',
    fontSize: 13,
    marginTop: 10
  },
  buttonsGroup: {
    color: '#9da1a7',
    fontSize: 12,
    marginVertical: 10,
  },
  save: {
    margin: 10,
    backgroundColor: '#2566d4',
    color: 'white'
  },
  inputTitle: {
    marginTop: 5,
    marginLeft: 5,
  },
  textInput: {
    color: '#4f6488',
    borderColor: '#e1e3e6',
    borderBottomWidth: 1,
    height: 38,
    paddingVertical: 0,
  },
  stepTextInput: {
    color: '#4f6488',
    borderColor: '#e1e3e6',
    borderBottomWidth: 1,
    minHeight: 38,
    paddingTop: 0,
    marginBottom: 5,
  },
  red: {
    color: 'red',
  },
  sectionText: {
    fontSize: 22,
    fontWeight: 'bold',
    paddingVertical: 8
  },
  ingredientTouchable: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ingredient: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#e1e3e6',
    paddingLeft: 10,
  },
  ingredientName: {
    flex: 8,
    color: '#4f6488',
    paddingVertical: 5,
  },
  ingredientWeight: {
    flex: 2,
    color: '#4f6488',
    paddingVertical: 5,
    textAlign: 'right',
  },
  remove: {
    justifyContent: 'center',
    paddingLeft: 20,
    paddingRight: 10
  },
  addIngredient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5
  },
  addIngredientText: {
    color: '#4f6488',
    paddingVertical: 5,
    marginLeft: 5
  },
  stepTitle: {
    marginLeft: 5
  },
})