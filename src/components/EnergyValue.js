import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, } from 'react-native';
import { strings } from '../utils/localization';

export const EnergyValue = props => {
  const proteins = !isNaN(props.proteins) && props.proteins?.toFixed(1) || '-';
  const fats = props.fats?.toFixed(1) || '-';
  const carbs = props.carbs?.toFixed(1) || '-';
  const calories = Math.round(props.calories) || '-';
  const water = Math.round(props.water) || '-';
  const proteinsQuality = props.proteinsQuality?.toFixed(1) || '-';
  const fatsQuality = props.fatsQuality?.toFixed(1) || '-';
  const carbsQuality = props.carbsQuality?.toFixed(1) || '-';
  const micronutrientsQuality = props.micronutrientsQuality?.toFixed(1) || '-';

  return (
    <TouchableOpacity
      activeOpacity={0.5}
      style={[
        s.nutritionValueContainer,
        props.bgColor && { backgroundColor: props.bgColor }
      ]}
      onPress={() => props.onPress && props.onPress()}
    >
      <View style={s.energyValueContainer}>
        <View style={s.energyValueBox}>
          <Text style={s.roundProteins}>{strings.proteinsAbbrev}</Text>
          <Text style={s.value}>{proteins}</Text>
        </View>
        <View style={s.energyValueBox}>
          <Text style={s.round}>{strings.fatsAbbrev}</Text>
          <Text style={s.value}>{fats}</Text>
        </View>
        <View style={s.energyValueBox}>
          <Text style={s.roundCarbs}>{strings.carbsAbbrev}</Text>
          <Text style={s.value}>{carbs}</Text>
        </View>
        <View style={s.energyValueBox}>
          <Text style={s.round}>{strings.caloriesAbbrev}</Text>
          <Text style={s.value}>{calories}</Text>
        </View>
        <View style={[s.energyValueBox, { width: 40 }]}>
          <Text style={s.round}>{strings.waterAbbrev}</Text>
          <Text style={s.value}>{water}</Text>
        </View>
      </View>
      <View style={s.qualityContainer}>
        <View style={s.qualityBox}>
          <Image
            source={require('../assets/img/food/proteins-quality-icon2.png')}
            resizeMode="contain"
            style={s.proteinsQualityIcon}
          />
          <Text style={s.qualityText}>{proteinsQuality}</Text>
        </View>
        <View style={s.qualityBox}>
          <Image
            source={require('../assets/img/food/fats-quality-icon2.png')}
            resizeMode="contain"
            style={s.fatsQualityIcon}
          />
          <Text style={s.qualityText}>{fatsQuality}</Text>
        </View>
        <View style={s.qualityBox}>
          <Image
            source={require('../assets/img/food/carbs-quality-icon2.png')}
            resizeMode="contain"
            style={s.carbsQualityIcon}
          />
          <Text style={s.qualityText}>{carbsQuality}</Text>
        </View>
        <View style={s.qualityBox}>
          <Image
            source={require('../assets/img/food/vitamins-quality-icon2.png')}
            resizeMode="contain"
            style={s.vitaminsQualityIcon}
          />
          <Text style={s.qualityText}>{micronutrientsQuality}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const s = StyleSheet.create({
  nutritionValueContainer: {
    backgroundColor: '#f2f4f7',
    paddingVertical: 15,
    marginVertical: 10,
    borderRadius: 10
  },
  energyValueContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginHorizontal: 20,
  },
  energyValueBox: {
    flexDirection: 'row',
  },
  round: {
    textAlign: 'center',
    backgroundColor: 'white',
    color: '#4f6488',
    borderWidth: 0.5,
    borderColor: '#d0d5dd',
    width: 18,
    height: 18,
    marginRight: 4,
    borderRadius: 9,
    fontSize: 13,
    lineHeight: 16,
  },
  roundProteins: {
    textAlign: 'center',
    backgroundColor: 'white',
    color: '#4f6488',
    borderWidth: 0.5,
    borderColor: '#d0d5dd',
    width: 18,
    height: 18,
    marginRight: 4,
    borderRadius: 9,
    fontSize: 13,
    lineHeight: 17,
  },
  roundCarbs: {
    textAlign: 'center',
    backgroundColor: 'white',
    color: '#4f6488',
    borderWidth: 0.5,
    borderColor: '#d0d5dd',
    width: 18,
    height: 18,
    marginRight: 4,
    borderRadius: 9,
    fontSize: 13,
    lineHeight: 15,
  },
  value: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#4f6488'
  },
  qualityContainer: {
    marginTop: 10,
    flexDirection: 'row',
    marginHorizontal: 30,
    justifyContent: 'space-evenly',
  },
  qualityBox: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  proteinsQualityIcon: {
    width: 13,
    height: 16,
    marginTop: 1,
    marginRight: 3,
  },
  fatsQualityIcon: {
    width: 14,
    height: 15,
    marginTop: 1,
    marginRight: 3,
  },
  carbsQualityIcon: {
    width: 10,
    height: 17,
    marginTop: 1,
    marginRight: 3,
  },
  vitaminsQualityIcon: {
    width: 36,
    height: 16,
    marginTop: 1,
    marginRight: 3
  },
  qualityText: {
    fontSize: 12,
    color: '#4f6488',
  },
})