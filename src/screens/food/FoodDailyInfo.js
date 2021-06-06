import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, Image, StatusBar } from 'react-native';
import { ProgressBar } from '../../components/ProgressBar';
import { NutritionDetails } from '../../components/NutritionDetails';
import { microDailyNorm } from '../../utils/constants'
import { connect } from 'react-redux';
import { strings } from '../../utils/localization';

const FoodDailyInfo = props => {
  const [index, setIndex] = useState(0);
  const [microPercent, setMicroPercent] = useState();

  useEffect(() => {
    setMicroPercent(calculateMicroPercent());
  }, [props.foodDailyInfo.micronutrients])

  const calculateMicroPercent = () => {
    const micronutrients = props.foodDailyInfo.micronutrients;
    const microPercents = {};

    if (!micronutrients)
      return;

    Object.keys(micronutrients).forEach(key => {
      const value = micronutrients[key] * 100 / microDailyNorm[key];
      microPercents[key] = value < 1
        ? parseFloat(value.toFixed(1))
        : Math.round(value);
    })

    return microPercents;
  }

  return (
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
        <Text style={styles.title}>{strings.totalForDay}</Text>
      </View>
      <View style={styles.energyValueContainer}>
        <View style={styles.energyValueBox}>
          <Text style={styles.energyValueTitle}>
            {strings.proteins}
          </Text>
          <Text style={styles.energyValue}>
            {strings.formatString(strings.gramFs, props.foodDailyInfo.values?.proteins.toFixed(1) || 0)}
          </Text>
          <ProgressBar
            style={styles.progress}
            progress={props.foodDailyInfo.progress?.proteins}
          />
          <View style={styles.qualityBox}>
            <Image
              source={require('../../assets/img/food/proteins-quality-icon.png')}
              resizeMode='contain'
              style={styles.proteinsQualityIcon}
            />
            <Text style={styles.qualityText}>
              {props.foodDailyInfo?.proteinsQuality?.toFixed(1) || '-'}
            </Text>
          </View>
        </View>
        <View style={styles.energyValueBox}>
          <Text style={styles.energyValueTitle}>
            {strings.fats}
          </Text>
          <Text style={styles.energyValue}>
            {strings.formatString(strings.gramFs, props.foodDailyInfo.values?.fats.toFixed(1) || 0)}
          </Text>
          <ProgressBar
            style={styles.progress}
            progress={props.foodDailyInfo.progress?.fats}
          />
          <View style={styles.qualityBox}>
            <Image
              source={require('../../assets/img/food/fats-quality-icon.png')}
              resizeMode='contain'
              style={styles.fatsQualityIcon}
            />
            <Text style={styles.qualityText}>
              {props.foodDailyInfo?.fatsQuality?.toFixed(1) || '-'}
            </Text>
          </View>
        </View>
        <View style={styles.energyValueBox}>
          <Text style={styles.energyValueTitle}>
            {strings.carbsShort}
          </Text>
          <Text style={styles.energyValue}>
            {strings.formatString(strings.gramFs, props.foodDailyInfo.values?.carbs?.toFixed(1) || 0)}
          </Text>
          <ProgressBar
            style={styles.progress}
            progress={props.foodDailyInfo.progress?.carbs}
          />
          <View style={styles.qualityBox}>
            <Image
              source={require('../../assets/img/food/carbs-quality-icon.png')}
              resizeMode='contain'
              style={styles.carbsQualityIcon}
            />
            <Text style={styles.qualityText}>
              {props.foodDailyInfo?.carbsQuality?.toFixed(1) || '-'}
            </Text>
          </View>
        </View>
        <View style={styles.energyValueBox2}>
          <Text style={styles.energyValueTitle}>
            {strings.calories}
          </Text>
          <Text style={styles.energyValue}>
            {strings.formatString(strings.kcalFs, props.foodDailyInfo.values?.calories?.toFixed(0) || 0)}
          </Text>
          <ProgressBar
            style={styles.progress}
            progress={props.foodDailyInfo.progress?.calories}
          />
          <View style={styles.qualityBox}>
            <Image
              source={require('../../assets/img/food/vitamins-quality-icon.png')}
              resizeMode='contain'
              style={styles.vitaminsQualityIcon}
            />
            <Text style={styles.qualityText}>
              {props.foodDailyInfo?.microIndex?.toFixed(0) || '-'}
            </Text>
          </View>
        </View>
        <View style={styles.energyValueBox}>
          <Text style={styles.energyValueTitle}>
            {strings.water}
          </Text>
          <Text style={styles.energyValue}>
            {strings.formatString(strings.amountFs, props.foodDailyInfo.values?.water?.toFixed(0) || 0)}
          </Text>
          <ProgressBar
            style={styles.progress}
            progress={props.foodDailyInfo.progress?.water}
          />
          <View style={styles.qualityBox}>
            <Image
              source={require('../../assets/img/food/water-quality-icon2.png')}
              resizeMode='contain'
              style={styles.waterQualityIcon}
            />
            <Text style={styles.qualityText}>
              {props.foodDailyInfo?.waterIndex?.toFixed(0) || '-'}
            </Text>
          </View>
        </View>
      </View>
      <NutritionDetails
        index={index}
        buttons={[
          strings.microInfo,
          strings.aminoInfo,
          strings.fattyInfo,
          strings.sacchInfo,
          strings.water
        ]}
        proteins={props.foodDailyInfo.values?.proteins}
        fats={props.foodDailyInfo.values?.fats}
        carbs={props.foodDailyInfo.values?.carbs}
        microPercent={microPercent || {}}
        aminoacids={props.foodDailyInfo?.aminoAcids || {}}
        fattyacids={props.foodDailyInfo?.fattyAcids || {}}
        saccharides={props.foodDailyInfo?.saccharides || {}}
        waterInfo={props.foodDailyInfo?.waterInfo || {}}
        onPress={(index) => setIndex(index)}
      />
    </ScrollView>
  )
}

export default connect(
  (state) => ({
    foodDailyInfo: state.food.foodDailyInfo,
  })
)(FoodDailyInfo);

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
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  image: {
    width: 320,
    height: 105,
    margin: 5,
    alignSelf: 'center',
  },
  energyValueContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    marginBottom: 20,
  },
  energyValueBox: {
    flex: 1,
    padding: 2,
    marginHorizontal: '0.8%'
  },
  energyValueBox2: {
    flex: 1.3,
    padding: 2,
    marginHorizontal: '0.8%'
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
    width: 11,
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
  waterQualityIcon: {
    width: 13,
    height: 18,
    marginRight: 3
  },
  energyValueTitle: {
    fontWeight: 'bold',
    textAlign: 'center'
  },
  energyValue: {
    textAlign: 'center',
    fontSize: 12,
  },
  progress: {
    marginVertical: 5
  },
  qualityText: {
    fontSize: 12,
  },
})