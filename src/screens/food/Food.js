import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, Image, ImageBackground } from 'react-native';
import { TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { mainLayout } from '../../styles/mainLayout';
import Icon from 'react-native-vector-icons/FontAwesome';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { ButtonsGroup } from '../../components/ButtonsGroup';
import FoodMeal from '../../components/FoodMeal';
import Water from '../../components/Water';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { Button } from '../../components/Button';
import DateTimePicker from '@react-native-community/datetimepicker';
import Nutrient from '../../components/Nutrient';
import EditWater from '../../components/EditWater';
import EditTime from '../../components/EditTime';
import MyModal from '../../components/MyModal';
import { FocusAwareStatusBar } from '../../components/FocusAwareStatusBar';
import { sortByTime } from '../../utils/sorting';
import * as nutrientActions from '../../utils/nutrientActions';
import { changeDate } from '../../store/actions/mainActions';
import { setMealInfo, addWater, hideFoodModal, setFoodDailyInfo } from '../../store/actions/foodActions';
import { Circle } from 'react-native-svg';
import { alert } from '../../utils/alertWrapper';
import { strings } from '../../utils/localization';

const Food = props => {
  const [tabIndex, setTabIndex] = useState(0);
  const [showActionButton, setShowActionButton] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const flatListOffset = useRef(0);

  useEffect(() => {
    setTotalForDay();
  }, [props.meals, props.waters])

  const updateIndex = useCallback(index => {
    if (tabIndex !== index)
      setLoading(true);

    requestAnimationFrame(() => {
      if (tabIndex !== index) {
        setTabIndex(index);
        setLoading(false);
      }
    })
  }, [tabIndex])

  const pickerChangeDate = useCallback((e, dateArg) => {
    setShowDatePicker(false);

    if (dateArg !== undefined) {
      const { timestamp, changeDate } = props;
      const currentDate = new Date(timestamp).setHours(0, 0, 0, 0);
      const changedDate = new Date(dateArg).setHours(0, 0, 0, 0);

      if (currentDate !== changedDate) {
        setLoading(true);
        changeDate(dateArg.getTime());
        requestAnimationFrame(() => setLoading(false));
      }
    }
  }, [props.timestamp])

  const arrowChangeDate = useCallback(timestamp => {
    setLoading(true);
    props.changeDate(timestamp);
    requestAnimationFrame(() => setLoading(false));
  }, [props.timestamp])

  const onScroll = useCallback(event => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    const direction = currentOffset > 0 && currentOffset > flatListOffset.current
      ? 'down'
      : 'up';
    const buttonVisible = direction === 'up';

    if (buttonVisible !== showActionButton)
      setShowActionButton(buttonVisible);

    flatListOffset.current = currentOffset;
  }, [flatListOffset.current])

  const createMealKey = useCallback(meals => {
    if (!meals)
      return 1;

    const mealKeys = Object.keys(meals || []);
    return mealKeys.length
      ? Math.max(...mealKeys) + 1
      : 1;
  }, [])

  const navigateToNutrients = useCallback(() => {
    const { meals, waters, navigation, setMealInfo, shortDate, addWater } = props;
    const mealNumber = meals ? Object.keys(meals).length + 1 : 1;
    const waterNumber = waters ? Object.keys(waters).length + 1 : 1;
    const mealKey = createMealKey(meals);
    const waterKey = createMealKey(waters);

    if (tabIndex === 0 && mealNumber > 10) {
      alert(strings.maxMeals);
    } else if (tabIndex === 1 && waterNumber > 10) {
      alert(strings.maxWater);
    } else if (tabIndex === 0) {
      setMealInfo({
        button: 'addToMeal',
        mealKey: mealKey,
        nutrientsCount: 0,
        existNutrients: []
      })
      navigation.navigate('Nutrients');
    } else {
      addWater(shortDate, waterKey);
    }

  }, [tabIndex, props.meals, props.waters])

  const setTotalForDay = useCallback(() => {
    const { meals, waters, setFoodDailyInfo } = props;
    const mealsArray = meals && Object.values(meals);
    const watersArray = waters && Object.values(waters);

    if (!mealsArray?.length && !watersArray?.length) {
      setFoodDailyInfo(null);
      return;
    }

    const maxValues = mealsArray?.reduce((total, meal) => {
      const nutrients = Object.values(meal.nutrients);
      const macro = nutrientActions.calculateMacro(nutrients);
      const macroKeys = macro && Object.keys(macro);

      macroKeys?.forEach(key => {
        total[key] = (total[key] || 0) + (macro[key] || 0);
      })
      return total;
    }, { proteins: 0, fats: 0, carbs: 0, calories: 0, water: 0 });

    const acceptedValues = mealsArray?.reduce((total, meal) => {
      if (meal.accepted) {
        const nutrients = Object.values(meal.nutrients);
        const macro = nutrientActions.calculateMacro(nutrients)
        const macroKeys = macro && Object.keys(macro);

        macroKeys?.forEach(key => {
          total[key] = (total[key] || 0) + (macro[key] || 0);
        })
      }
      return total;
    }, { proteins: 0, fats: 0, carbs: 0, calories: 0, water: 0 });

    const maxWater = watersArray?.reduce((total, water) => {
      return total + water.amount;
    }, 0);

    const acceptedWater = watersArray?.reduce((total, water) => {
      if (water.accepted) {
        return total = total + water.amount;
      }
      return total;
    }, 0);

    const waterInfo = {
      mealWater: parseInt(acceptedValues?.water || 0),
      cleanWater: parseInt(acceptedWater || 0)
    }

    const maxWaterValue = maxValues?.water + (maxWater || 0);
    const acceptedWaterValue = (acceptedValues?.water || 0) + (acceptedWater || 0);

    const dailyProgress = {
      proteins: (acceptedValues?.proteins * 100) / maxValues?.proteins,
      fats: (acceptedValues?.fats * 100) / maxValues?.fats,
      carbs: (acceptedValues?.carbs * 100) / maxValues?.carbs,
      calories: (acceptedValues?.calories * 100) / maxValues?.calories,
      water: (acceptedWaterValue * 100) / maxWaterValue,
    }

    const nutritionDetails = mealsArray?.reduce((total, meal) => {
      if (!meal.accepted) return total;
      const nutrients = Object.values(meal.nutrients);

      const aminoInMeal = nutrientActions.calculateAminoAcids(nutrients);
      const aminoKeys = aminoInMeal && Object.keys(aminoInMeal) || [];
      aminoKeys?.forEach(key => {
        total.aminoAcids[key] = parseFloat(((total.aminoAcids[key] || 0) + aminoInMeal[key])?.toFixed(3))
      });

      const digestibleAminoInMeal = nutrientActions.calculateAminoAcids(nutrients, true);
      const digestibleAminoKeys = digestibleAminoInMeal && Object.keys(digestibleAminoInMeal) || [];
      digestibleAminoKeys?.forEach(key => {
        total.digestibleAminoAcids[key] = parseFloat(((total.digestibleAminoAcids[key] || 0) + digestibleAminoInMeal[key])?.toFixed(3))
      });

      const fattyInMeal = nutrientActions.calculateFattyAcids(nutrients);
      const fattyKeys = fattyInMeal && Object.keys(fattyInMeal) || [];
      fattyKeys?.forEach(key => {
        total.fattyAcids[key] = parseFloat(((total.fattyAcids[key] || 0) + fattyInMeal[key])?.toFixed(3))
      });

      const saccharidesInMeal = nutrientActions.calculateSaccharides(nutrients);
      const saccharideKeys = saccharidesInMeal && Object.keys(saccharidesInMeal) || [];
      saccharideKeys?.forEach(key => {
        total.saccharides[key] = parseFloat(((total.saccharides[key] || 0) + saccharidesInMeal[key])?.toFixed(3))
      });

      const microInMeal = nutrientActions.calculateMicronutrients(nutrients);
      const microKeys = microInMeal && Object.keys(microInMeal) || [];
      microKeys?.forEach(key => {
        total.micronutrients[key] = parseFloat(((total.micronutrients[key] || 0) + microInMeal[key])?.toFixed(3))
      });

      return total;
    }, { aminoAcids: {}, digestibleAminoAcids: {}, fattyAcids: {}, saccharides: {}, micronutrients: {} });

    const mealWater = waterInfo.mealWater;
    const cleanWater = waterInfo.cleanWater;
    const waterIndex = (cleanWater * 100 / (cleanWater + mealWater)) || 0;

    const proteinsQuality = nutrientActions.calculateProteinsQuality(acceptedValues?.proteins, nutritionDetails?.digestibleAminoAcids);
    const fatsQuality = nutrientActions.calculateFatsQuality(acceptedValues?.fats, nutritionDetails?.fattyAcids);
    const carbsQuality = nutrientActions.calculateCarbsQuality(acceptedValues?.carbs, nutritionDetails?.saccharides);
    const microIndex = nutrientActions.calculateMicroIndex(nutritionDetails?.micronutrients);

    setFoodDailyInfo({
      values: {
        ...acceptedValues,
        water: acceptedWaterValue
      },
      progress: dailyProgress,
      proteinsQuality,
      fatsQuality,
      carbsQuality,
      microIndex,
      waterIndex,
      aminoAcids: nutritionDetails?.aminoAcids,
      fattyAcids: nutritionDetails?.fattyAcids,
      saccharides: nutritionDetails?.saccharides,
      micronutrients: nutritionDetails?.micronutrients,
      waterInfo: waterInfo
    });
  }, [props.meals, props.waters])

  const renderEmpty = useCallback(() => {
    return !loading
      ? <Text style={mainLayout.empty}>
        {tabIndex === 0 ? strings.noMeals : strings.noWater}
      </Text>
      : null;
  }, [loading])

  const renderFooter = useCallback(() => {
    return loading
      ? <ActivityIndicator size="large" style={mainLayout.loading} />
      : null;
  }, [loading])

  const renderHeader = useMemo(() => {
    const { timestamp, longDate, navigation, foodDailyInfo } = props;
    const defaultValue = (0).toFixed(1);
    const circle = <Circle cx={30} cy={30} r="22" fill="white" />;
    const tintColor = "#2566d4";
    const backgroundColor = "rgba(255, 255, 255, 0.5)";

    const notAcceptedFood = Object.values(props.meals ?? [])
      .filter(m => m.accepted).length === 0;
    const notAcceptedWater = Object.values(props.waters ?? [])
      .filter(w => w.accepted).length === 0;

    return (
      <View>
        <ImageBackground
          source={require('../../assets/img/food/food-head-image.jpg')}
          style={mainLayout.imageBackground}>
          <TouchableOpacity
            disabled={notAcceptedFood && notAcceptedWater}
            activeOpacity={0.9}
            style={mainLayout.headCenterContainer}
            onPress={() => navigation.navigate('FoodDailyInfo')}
          >
            <View>
              <Text style={mainLayout.progressTitle}>{strings.proteins}</Text>
              <AnimatedCircularProgress
                size={60}
                width={8}
                rotation={0}
                fill={foodDailyInfo?.progress?.proteins || 0}
                tintColor={tintColor}
                backgroundColor={backgroundColor}
                renderCap={() => circle}
              >
                {() => (
                  <>
                    <Text style={mainLayout.progressValue}>
                      {foodDailyInfo?.values?.proteins?.toFixed(1) || defaultValue}
                    </Text>
                    <Text style={mainLayout.progressMeasure}>{strings.gr}</Text>
                  </>
                )}
              </AnimatedCircularProgress>
              <View style={mainLayout.qualityContainer}>
                <Image
                  source={require('../../assets/img/food/proteins-quality-icon.png')}
                  resizeMode="contain"
                  style={s.proteinsQuality}
                />
                <Text style={mainLayout.qualityText}>
                  {foodDailyInfo?.proteinsQuality?.toFixed(1) || '-'}
                </Text>
              </View>
            </View>
            <View>
              <Text style={mainLayout.progressTitle}>{strings.fats}</Text>
              <AnimatedCircularProgress
                size={60}
                width={8}
                rotation={0}
                fill={foodDailyInfo?.progress?.fats || 0}
                tintColor={tintColor}
                backgroundColor={backgroundColor}
                renderCap={() => circle}
              >
                {() => (
                  <>
                    <Text style={mainLayout.progressValue}>
                      {foodDailyInfo?.values?.fats?.toFixed(1) || defaultValue}
                    </Text>
                    <Text style={mainLayout.progressMeasure}>{strings.gr}</Text>
                  </>
                )}
              </AnimatedCircularProgress>
              <View style={mainLayout.qualityContainer}>
                <Image
                  source={require('../../assets/img/food/fats-quality-icon.png')}
                  resizeMode="contain"
                  style={s.fatsQuality}
                />
                <Text style={mainLayout.qualityText}>
                  {foodDailyInfo?.fatsQuality?.toFixed(1) || '-'}
                </Text>
              </View>
            </View>
            <View>
              <Text style={mainLayout.progressTitle}>{strings.carbs}</Text>
              <AnimatedCircularProgress
                size={60}
                width={8}
                rotation={0}
                fill={foodDailyInfo?.progress?.carbs || 0}
                tintColor={tintColor}
                backgroundColor={backgroundColor}
                renderCap={() => circle}
              >
                {() => (
                  <>
                    <Text style={mainLayout.progressValue}>
                      {foodDailyInfo?.values?.carbs?.toFixed(1) || defaultValue}
                    </Text>
                    <Text style={mainLayout.progressMeasure}>{strings.gr}</Text>
                  </>
                )}
              </AnimatedCircularProgress>
              <View style={mainLayout.qualityContainer}>
                <Image
                  source={require('../../assets/img/food/carbs-quality-icon.png')}
                  resizeMode="contain"
                  style={s.carbsQuality}
                />
                <Text style={mainLayout.qualityText}>
                  {foodDailyInfo?.carbsQuality?.toFixed(1) || '-'}
                </Text>
              </View>
            </View>
            <View>
              <Text style={mainLayout.progressTitle}>{strings.calories}</Text>
              <AnimatedCircularProgress
                size={60}
                width={8}
                rotation={0}
                fill={foodDailyInfo?.progress?.calories || 0}
                tintColor={tintColor}
                backgroundColor={backgroundColor}
                renderCap={() => circle}
              >
                {() => (
                  <>
                    <Text style={mainLayout.progressValue}>
                      {foodDailyInfo?.values?.calories?.toFixed(0) || 0}
                    </Text>
                    <Text style={mainLayout.progressMeasure}>{strings.kcal}</Text>
                  </>
                )}
              </AnimatedCircularProgress>
              <View style={mainLayout.qualityContainer}>
                <Image
                  source={require('../../assets/img/food/vitamins-quality-icon.png')}
                  resizeMode="contain"
                  style={s.vitaminsQuality}
                />
                <Text style={mainLayout.qualityText}>
                  {foodDailyInfo?.microIndex?.toFixed(1) || '-'}
                </Text>
              </View>
            </View>
            <View>
              <Text style={mainLayout.progressTitle}>{strings.water}</Text>
              <AnimatedCircularProgress
                size={60}
                width={8}
                rotation={0}
                fill={foodDailyInfo?.progress?.water || 0}
                tintColor={tintColor}
                backgroundColor={backgroundColor}
                renderCap={() => circle}
              >
                {() => (
                  <>
                    <Text style={mainLayout.progressValue}>
                      {foodDailyInfo?.values?.water?.toFixed(0) || 0}
                    </Text>
                    <Text style={mainLayout.progressMeasure}>{strings.ml}</Text>
                  </>
                )}
              </AnimatedCircularProgress>
              <View style={mainLayout.qualityContainer}>
                <Image
                  source={require('../../assets/img/food/water-quality-icon.png')}
                  resizeMode="contain"
                  style={s.waterQuality}
                />
                <Text style={mainLayout.qualityText}>
                  {foodDailyInfo?.waterIndex?.toFixed(0) || '-'}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          <View style={mainLayout.headBottomContainer}>
            <TouchableOpacity style={mainLayout.arrow}
              onPress={() => arrowChangeDate(timestamp - 86400000)}
            >
              <Icon name="chevron-left" color="#9a8e81" size={20} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <Text style={mainLayout.dateFont}>{longDate}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={mainLayout.arrow}
              onPress={() => arrowChangeDate(timestamp + 86400000)}
            >
              <Icon name="chevron-right" color="#9a8e81" size={20} />
            </TouchableOpacity>
          </View>
        </ImageBackground>

        <ButtonsGroup
          disabled={loading}
          onPress={updateIndex}
          buttons={[strings.food, strings.water]}
          selectedIndex={tabIndex}
          style={s.buttonsGroup}
        />
      </View>
    );
  }, [loading, props.foodDailyInfo])

  const renderMeals = useCallback(({ item, index }) => {
    if (loading) return;
    const mealNumber = index + 1;

    if (tabIndex == 0) {
      return (
        <FoodMeal
          mealName={strings.formatString(strings.mealFs, mealNumber)}
          time={item.time}
          nutrients={item.nutrients}
          accepted={item.accepted}
          mealKey={item.key}
          alarmId={item.alarmId}
        />
      )
    } else {
      return (
        <Water
          mealName={strings.formatString(strings.waterFs, mealNumber)}
          time={item.time}
          amount={item.amount}
          accepted={item.accepted}
          mealKey={item.key}
          alarmId={item.alarmId}
        />
      )
    }
  }, [loading])

  return (
    <View style={mainLayout.main}>
      <FocusAwareStatusBar
        backgroundColor="black"
        barStyle="light-content" />
      <FlatList
        data={tabIndex === 0
          ? sortByTime(props.meals)
          : sortByTime(props.waters)
        }
        overScrollMode="never"
        ListEmptyComponent={renderEmpty}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        renderItem={renderMeals}
        keyExtractor={(_, index) => index.toString()}
        onScroll={onScroll}
      />
      {showActionButton && !props.modalVisible &&
        <Button
          disabled={loading}
          style={mainLayout.addButton}
          activeOpacity={0.9}
          icon={<Icon name="plus" color="white" size={16} />}
          onPress={navigateToNutrients}
        />
      }
      {showDatePicker &&
        <DateTimePicker
          value={props.timestamp}
          mode='date'
          display="spinner"
          onChange={pickerChangeDate}
        />
      }
      <MyModal
        modalVisible={props.modalVisible}
        onRequestClose={props.hideFoodModal}
      >
        {props.nutrientInfo &&
          <Nutrient
            showDetails
            editButtons={['updateMealNutrient', 'deleteMealNutrient']}
            disabled={props.nutrientInfo.disabled}
            weight={props.nutrientInfo.data.weight}
            heatTreatment={props.nutrientInfo.data.heatTreatment}
            data={props.nutrientInfo.data}
          />
        }
        {props.waterInfo && <EditWater />}
        {props.timeInfo && <EditTime />}
      </MyModal>
    </View>
  )
}

export default compose(
  connect(
    state => ({
      userId: state.firebase.auth.uid,
      timestamp: state.main.timestamp,
      shortDate: state.main.shortDate,
      longDate: state.main.longDate,
      meals: state.firestore.data.meals,
      waters: state.firestore.data.waters,
      nutrientInfo: state.food.nutrientInfo,
      modalVisible: state.food.modalVisible,
      waterInfo: state.food.waterInfo,
      timeInfo: state.food.timeInfo,
      foodDailyInfo: state.food.foodDailyInfo,
    }),
    {
      changeDate,
      setMealInfo,
      addWater,
      hideFoodModal,
      setFoodDailyInfo
    },
  ),
  firestoreConnect(props => [
    {
      collection: `meals/${props.userId}/food`,
      doc: `${props.shortDate}`,
      storeAs: 'meals'
    },
    {
      collection: `meals/${props.userId}/water`,
      doc: `${props.shortDate}`,
      storeAs: 'waters'
    },
  ]),
)(Food);

const s = StyleSheet.create({
  buttonsGroup: {
    margin: 10
  },
  proteinsQuality: {
    width: 13,
    height: 16,
    marginTop: 1,
    marginRight: 3
  },
  fatsQuality: {
    width: 13,
    height: 14,
    marginTop: 1,
    marginRight: 3
  },
  carbsQuality: {
    width: 9,
    height: 15,
    marginTop: 1,
    marginRight: 3
  },
  vitaminsQuality: {
    width: 30,
    height: 14,
    marginTop: 1,
    marginRight: 3
  },
  waterQuality: {
    width: 18,
    height: 14,
    marginTop: 1,
    marginRight: 3
  },
})