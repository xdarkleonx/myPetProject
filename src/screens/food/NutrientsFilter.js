import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button } from '../../components/Button';
import { ButtonsGroup } from '../../components/ButtonsGroup';
import { connect } from 'react-redux';
import { getNutrients, setNutrientsFilter, setIngredientsFilter } from '../../store/actions/foodActions';
import { strings } from '../../utils/localization';

const NutrientsFilter = props => {
  const navigation = useNavigation();
  const [filters, setFilters] = useState(
    props.mealInfo.button === 'addToMeal'
      ? props.nutrientsFilter
      : props.ingredientsFilter
  )

  const getSpeciesFilter = () => {
    switch (filters?.species) {
      case 'product':
        return 0;
      case 'dish':
        return 1;
    }
  }

  const setSpeciesFilter = index => {
    switch (index) {
      case 0:
        setFilters({ ...filters, species: 'product' });
        break;
      case 1:
        setFilters({ ...filters, species: 'dish' });
        break;
      default:
        setFilters({ ...filters, species: null });
        break;
    }
  }

  const getTypeFilter = () => {
    switch (filters?.type) {
      case 'protein':
        return 0;
      case 'fat':
        return 1;
      case 'carbs':
        return 2;
    }
  }

  const setTypeFilter = index => {
    switch (index) {
      case 0:
        setFilters({ ...filters, type: 'protein' });
        break;
      case 1:
        setFilters({ ...filters, type: 'fat' });
        break;
      case 2:
        setFilters({ ...filters, type: 'carb' });
        break;
      default:
        setFilters({ ...filters, type: null });
        break;
    }
  }

  const getMicroNutrientsFilter = (name, type) => {
    if (filters?.[type])
      return filters[type].includes(name);

    return null;
  }

  const setMicroNutrientsFilter = (name, type) => {
    if (filters?.[type]) {
      filters[type].includes(name)
        ? setFilters({ ...filters, [type]: filters[type].filter(item => item !== name) })
        : setFilters({ ...filters, [type]: [...filters[type], name] });
    } else {
      setFilters({ ...filters, [type]: [name] })
    }
  }

  const isFiltersEqual = (stateObj, storeObj) => {
    let isSpecialEqual = true;
    let isTypeEqual = true;
    let isVitaminsEqual = true;
    let isMineralsEqual = true;

    stateObj = {
      species: stateObj?.species || null,
      type: stateObj?.type || null,
      vitamins: stateObj?.vitamins || [],
      minerals: stateObj?.minerals || [],
    }

    storeObj = {
      species: storeObj?.species || null,
      type: storeObj?.type || null,
      vitamins: storeObj?.vitamins || [],
      minerals: storeObj?.minerals || [],
    }

    if (
      stateObj.vitamins.length !== storeObj.vitamins.length ||
      stateObj.minerals.length !== storeObj.minerals.length
    ) {
      return false;
    }

    isSpecialEqual = storeObj.species === stateObj.species;

    if (isSpecialEqual === false)
      return false;

    isTypeEqual = storeObj.type === stateObj.type;

    if (isTypeEqual === false)
      return false;

    if (storeObj.vitamins && stateObj.vitamins) {
      storeObj.vitamins.forEach(item => {
        if (!stateObj.vitamins.includes(item)) {
          isVitaminsEqual = false;
        }
      });
    }

    if (isVitaminsEqual === false)
      return false;

    if (storeObj.minerals && stateObj.minerals) {
      storeObj.minerals.forEach(item => {
        if (!stateObj.minerals.includes(item)) {
          isMineralsEqual = false;
        }
      });
    }
    if (isMineralsEqual === false)
      return false;

    return true;
  }

  const setSelectedFilters = () => {
    const initFilters = props.mealInfo.button === 'addToMeal'
      ? props.nutrientsFilter
      : props.ingredientsFilter;

    if (!isFiltersEqual(filters, initFilters)) {
      props.mealInfo.button === 'addToMeal'
        ? props.setNutrientsFilter(filters)
        : props.setIngredientsFilter(filters)
      props.getNutrients(filters, 'first');
    }
    navigation.navigate('Nutrients');
  }

  const resetFilters = () => {
    if (filters) {
      const newFilters = filters.name && { name: filters.name };

      props.mealInfo.button === 'addToMeal'
        ? props.setNutrientsFilter(newFilters, true)
        : props.setIngredientsFilter(newFilters, true)

      props.getNutrients(filters, 'first');
    }
    navigation.navigate('Nutrients');
  }

  return (
    <ScrollView contentContainerStyle={styles.main}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.5}
          onPress={navigation.goBack}
        >
          <Image
            style={styles.arrowIcon}
            resizeMode='contain'
            source={require('../../assets/img/common/left-arrow.png')}
          />
        </TouchableOpacity>
        <Text style={styles.title}>{strings.filterNutrients}</Text>
      </View>
      <Text style={styles.filterText2}>{strings.species}</Text>
      <ButtonsGroup
        toggle
        style={styles.buttonsGroup}
        buttonStyle='TouchableOpacity'
        buttons={[strings.products, strings.dishes]}
        selectedIndex={getSpeciesFilter}
        onPress={index => setSpeciesFilter(index)} />
      <Text style={styles.filterText}>{strings.nutrientType}</Text>
      <ButtonsGroup
        toggle
        style={styles.buttonsGroup}
        buttonStyle='TouchableOpacity'
        buttons={[strings.proteinType, strings.fatType, strings.carbType]}
        selectedIndex={getTypeFilter}
        onPress={index => setTypeFilter(index)} />
      <Text style={styles.filterText}>
        {strings.vitamins}
      </Text>
      <View style={styles.filterBox}>
        <Button
          toggle
          style={styles.filterButton}
          debounce={false}
          title='C'
          checked={() => getMicroNutrientsFilter('C', 'vitamins')}
          onPress={() => setMicroNutrientsFilter('C', 'vitamins')} />
        <Button
          toggle
          debounce={false}
          style={styles.filterButton}
          title='B1'
          checked={() => getMicroNutrientsFilter('B1', 'vitamins')}
          onPress={() => setMicroNutrientsFilter('B1', 'vitamins')} />
        <Button
          toggle
          debounce={false}
          style={styles.filterButton}
          title='B2'
          checked={() => getMicroNutrientsFilter('B2', 'vitamins')}
          onPress={() => setMicroNutrientsFilter('B2', 'vitamins')} />
        <Button
          toggle
          debounce={false}
          style={styles.filterButton}
          title='B4'
          checked={() => getMicroNutrientsFilter('B4', 'vitamins')}
          onPress={() => setMicroNutrientsFilter('B4', 'vitamins')} />
        <Button
          toggle
          debounce={false}
          style={styles.filterButton}
          title='B5'
          checked={() => getMicroNutrientsFilter('B5', 'vitamins')}
          onPress={() => setMicroNutrientsFilter('B5', 'vitamins')} />
        <Button
          toggle
          debounce={false}
          style={styles.filterButton}
          title='B6'
          checked={() => getMicroNutrientsFilter('B6', 'vitamins')}
          onPress={() => setMicroNutrientsFilter('B6', 'vitamins')} />
        <Button
          toggle
          debounce={false}
          style={styles.filterButton}
          title='B9'
          checked={() => getMicroNutrientsFilter('B9', 'vitamins')}
          onPress={() => setMicroNutrientsFilter('B9', 'vitamins')} />
        <Button
          toggle
          debounce={false}
          style={styles.filterButton}
          title='B12'
          checked={() => getMicroNutrientsFilter('B12', 'vitamins')}
          onPress={() => setMicroNutrientsFilter('B12', 'vitamins')} />
        <Button
          toggle
          debounce={false}
          style={styles.filterButton}
          title='PP'
          checked={() => getMicroNutrientsFilter('PP', 'vitamins')}
          onPress={() => setMicroNutrientsFilter('PP', 'vitamins')} />
        <Button
          toggle
          debounce={false}
          style={styles.filterButton}
          title='H'
          checked={() => getMicroNutrientsFilter('H', 'vitamins')}
          onPress={() => setMicroNutrientsFilter('H', 'vitamins')} />
        <Button
          toggle
          debounce={false}
          style={styles.filterLastButton}
          title='A'
          checked={() => getMicroNutrientsFilter('A', 'vitamins')}
          onPress={() => setMicroNutrientsFilter('A', 'vitamins')} />
        <Button
          toggle
          debounce={false}
          style={styles.filterLastButton}
          title='Кар.'
          checked={() => getMicroNutrientsFilter('Кар', 'vitamins')}
          onPress={() => setMicroNutrientsFilter('Кар', 'vitamins')} />
        <Button
          toggle
          debounce={false}
          style={styles.filterLastButton}
          title='E'
          checked={() => getMicroNutrientsFilter('E', 'vitamins')}
          onPress={() => setMicroNutrientsFilter('E', 'vitamins')} />
        <Button
          toggle
          debounce={false}
          style={styles.filterLastButton}
          title='D'
          checked={() => getMicroNutrientsFilter('D', 'vitamins')}
          onPress={() => setMicroNutrientsFilter('D', 'vitamins')} />
        <Button
          toggle
          debounce={false}
          style={styles.filterLastButton}
          title='K'
          checked={() => getMicroNutrientsFilter('K', 'vitamins')}
          onPress={() => setMicroNutrientsFilter('K', 'vitamins')} />
      </View>
      <Text style={styles.filterText}>{strings.minerals}</Text>
      <View style={styles.filterBox}>
        <Button
          toggle
          debounce={false}
          style={styles.filterButton}
          title='Ca'
          checked={() => getMicroNutrientsFilter('Ca', 'minerals')}
          onPress={() => setMicroNutrientsFilter('Ca', 'minerals')} />
        <Button
          toggle
          debounce={false}
          style={styles.filterButton}
          title='P'
          checked={() => getMicroNutrientsFilter('P', 'minerals')}
          onPress={() => setMicroNutrientsFilter('P', 'minerals')} />
        <Button
          toggle
          debounce={false}
          style={styles.filterButton}
          title='Mg'
          checked={() => getMicroNutrientsFilter('Mg', 'minerals')}
          onPress={() => setMicroNutrientsFilter('Mg', 'minerals')} />
        <Button
          toggle
          debounce={false}
          style={styles.filterButton}
          title='K'
          checked={() => getMicroNutrientsFilter('K', 'minerals')}
          onPress={() => setMicroNutrientsFilter('K', 'minerals')} />
        <Button
          toggle
          debounce={false}
          style={styles.filterButton}
          title='Na'
          checked={() => getMicroNutrientsFilter('Na', 'minerals')}
          onPress={() => setMicroNutrientsFilter('Na', 'minerals')} />
        <Button
          toggle
          debounce={false}
          style={styles.filterButton}
          title='Cl'
          checked={() => getMicroNutrientsFilter('Cl', 'minerals')}
          onPress={() => setMicroNutrientsFilter('Cl', 'minerals')} />
        <Button
          toggle
          debounce={false}
          style={styles.filterButton}
          title='Fe'
          checked={() => getMicroNutrientsFilter('Fe', 'minerals')}
          onPress={() => setMicroNutrientsFilter('Fe', 'minerals')} />
        <Button
          toggle
          debounce={false}
          style={styles.filterButton}
          title='Zn'
          checked={() => getMicroNutrientsFilter('Zn', 'minerals')}
          onPress={() => setMicroNutrientsFilter('Zn', 'minerals')} />
        <Button
          toggle
          debounce={false}
          style={styles.filterButton}
          title='I'
          checked={() => getMicroNutrientsFilter('I', 'minerals')}
          onPress={() => setMicroNutrientsFilter('I', 'minerals')} />
        <Button
          toggle
          debounce={false}
          style={styles.filterButton}
          title='Cu'
          checked={() => getMicroNutrientsFilter('Cu', 'minerals')}
          onPress={() => setMicroNutrientsFilter('Cu', 'minerals')} />
        <Button
          toggle
          debounce={false}
          style={styles.filterButton}
          title='Mn'
          checked={() => getMicroNutrientsFilter('Mn', 'minerals')}
          onPress={() => setMicroNutrientsFilter('Mn', 'minerals')} />
        <Button
          toggle
          debounce={false}
          style={styles.filterButton}
          title='Se'
          checked={() => getMicroNutrientsFilter('Se', 'minerals')}
          onPress={() => setMicroNutrientsFilter('Se', 'minerals')} />
        <Button
          toggle
          debounce={false}
          style={styles.filterButton}
          title='Cr'
          checked={() => getMicroNutrientsFilter('Cr', 'minerals')}
          onPress={() => setMicroNutrientsFilter('Cr', 'minerals')} />
        <Button
          toggle
          debounce={false}
          style={styles.filterButton}
          title='Mo'
          checked={() => getMicroNutrientsFilter('Mo', 'minerals')}
          onPress={() => setMicroNutrientsFilter('Mo', 'minerals')} />
        <Button
          toggle
          debounce={false}
          style={styles.filterButton}
          title='F'
          checked={() => getMicroNutrientsFilter('F', 'minerals')}
          onPress={() => setMicroNutrientsFilter('F', 'minerals')} />
      </View>
      <View style={styles.bottomBox}>
        <View style={styles.row}>
          <Button
            style={styles.bottomButton}
            title={strings.reset}
            onPress={resetFilters}
          />
          <Button
            style={styles.bottomButton}
            title={strings.accept}
            onPress={setSelectedFilters}
          />
        </View>
      </View>
    </ScrollView>
  )
}

export default connect(
  state => ({
    lastNutrient: state.food.lastNutrient,
    mealInfo: state.food.mealInfo,
    nutrientsFilter: state.food.nutrientsFilter,
    ingredientsFilter: state.food.ingredientsFilter,
  }),
  {
    getNutrients,
    setNutrientsFilter,
    setIngredientsFilter
  }
)(NutrientsFilter);

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
  filterText: {
    fontSize: 13,
    textAlign: 'center',
  },
  filterText2: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 10,
  },
  filterBox: {
    marginVertical: 8,
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    marginHorizontal: 5,
    backgroundColor: 'white',
    elevation: 3,
  },
  buttonsGroup: {
    marginVertical: 8,
    fontSize: 13,
    color: '#4f6488',
    elevation: 3,
  },
  filterButton: {
    width: 58,
    marginHorizontal: 5,
    marginBottom: 5,
    backgroundColor: 'white',
    elevation: 3,
  },
  filterLastButton: {
    width: 58,
    marginHorizontal: 5,
    backgroundColor: 'white',
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
  },
  bottomBox: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  bottomButton: {
    flex: 1,
    marginHorizontal: 5,
    marginBottom: 10,
    color: 'white',
    backgroundColor: '#2566d4',
  }
})