import React, { useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { connect } from 'react-redux';
import { setNutrientInfo, setMealInfo, showFoodModal } from '../store/actions/foodActions';
import { strings } from '../utils/localization';

const MealNutrient = props => {
  const { data } = props;

  const getNutrientImage = useCallback(() => {
    return props.data.imageUrl
      ? { uri: `${props.data.imageUrl}` }
      : require('../assets/img/food/nutrient.png');
  }, [])

  const getNutrientInfo = () => {
    const { data, date, disabled, meals, mealKey, nutrientKey } = props;
    const { setNutrientInfo, setMealInfo, showFoodModal } = props;
    const nutrientsCount = Object.values(meals[mealKey].nutrients).length;
    const nutrientInfo = {
      data: data,
      disabled: disabled,
      date: date,
      mealKey: mealKey,
      nutrientKey: nutrientKey,
      initialWeight: data.calculated.weight,
      initialHeatTreatment: data.calculated.heatTreatment
    }
    showFoodModal();
    setNutrientInfo(nutrientInfo);
    setMealInfo({ nutrientsCount })
  }

  return (
    <TouchableOpacity
      activeOpacity={0.5}
      style={[s.mainContainer, { ...props.style }]}
      onPress={getNutrientInfo}
    >
      <Image style={s.image} source={getNutrientImage()} />
      <View style={s.nutrientInfo}>
        <View style={s.rowContainer}>
          <Text
            ellipsizeMode="tail"
            numberOfLines={1}
            style={s.name}
          >
            {data.name}
          </Text>
          <Text style={s.weight}>
            {strings.formatString(strings.gramFs, data.calculated?.weight)}
          </Text>
          <Text style={s.greyColor}>
            {data.calculated?.heatTreatment && strings.treatmentMealNutr}
          </Text>
        </View>
        <View style={s.countContainer}>
          <View style={s.count}>
            <Text style={s.roundProteins}>{strings.proteinsAbbrev}</Text>
            <Text style={s.value}>{data.calculated?.proteins.toFixed(1)}</Text>
          </View>
          <View style={s.count}>
            <Text style={s.round}>{strings.fatsAbbrev}</Text>
            <Text style={s.value}>{data.calculated?.fats.toFixed(1)}</Text>
          </View>
          <View style={s.count}>
            <Text style={s.roundCarbs}>{strings.carbsAbbrev}</Text>
            <Text style={s.value}>{data.calculated?.carbs.toFixed(1)}</Text>
          </View>
          <View style={s.count}>
            <Text style={s.round}>{strings.caloriesAbbrev}</Text>
            <Text style={s.value}>{data.calculated?.calories}</Text>
          </View>
          <View style={s.count}>
            <Text style={s.round}>{strings.waterAbbrev}</Text>
            <Text style={s.value}>{data.calculated?.water || '-'}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default connect(
  state => ({
    date: state.main.shortDate,
    meals: state.firestore.data.meals
  }),
  {
    setNutrientInfo,
    setMealInfo,
    showFoodModal
  }
)(MealNutrient);

const s = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    paddingVertical: 7,
  },
  rowContainer: {
    flexDirection: 'row',
  },
  name: {
    maxWidth: '55%',
    color: '#4f6488',
  },
  weight: {
    marginLeft: 5,
    color: '#9da1a7',
  },
  greyColor: {
    color: '#9da1a7',
  },
  countContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 7,
    alignItems: 'center',
  },
  count: {
    flex: 1,
    flexDirection: 'row',
  },
  round: {
    textAlign: 'center',
    backgroundColor: '#f0f0f1',
    color: '#4f6488',
    width: 18,
    height: 18,
    marginRight: 4,
    borderRadius: 9,
    fontSize: 13,
    lineHeight: 16,
  },
  roundProteins: {
    textAlign: 'center',
    backgroundColor: '#f0f0f1',
    color: '#4f6488',
    width: 18,
    height: 18,
    marginRight: 4,
    borderRadius: 9,
    fontSize: 13,
    lineHeight: 17,
  },
  roundCarbs: {
    textAlign: 'center',
    backgroundColor: '#f0f0f1',
    color: '#4f6488',
    width: 18,
    height: 18,
    marginRight: 4,
    borderRadius: 9,
    fontSize: 13,
    lineHeight: 15,
  },
  value: {
    fontSize: 13,
  },
  image: {
    width: 45,
    height: 45,
    borderRadius: 23,
  },
  nutrientInfo: {
    flex: 1,
    paddingLeft: 10,
  },
})
