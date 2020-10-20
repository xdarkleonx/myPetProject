import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, StatusBar, FlatList, StyleSheet, Text, Image, ActivityIndicator } from 'react-native';
import { SearchHeader } from '../../components/SearchHeader';
import Nutrient from '../../components/Nutrient';
import { Button } from '../../components/Button';
import IconFA from 'react-native-vector-icons/FontAwesome';
import { upperCaseFirst } from '../../utils/stringFormat';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { getNutrients, clearNutrients, clearIngredients } from '../../store/actions/foodActions';
import { setNutrientsFilter, setIngredientsFilter, clearFilters } from '../../store/actions/foodActions';
import { strings } from '../../utils/localization';

const Nutrients = props => {
  const [searchText, setSearchText] = useState();
  const [sectionIndex, setSectionIndex] = useState(0);

  useEffect(() => {
    return () => {
      clearList();
      props.mealInfo.button === 'addToMeal'
        ? props.clearFilters('nutrients')
        : props.clearFilters('ingredients');
    }
  }, [])

  const clearList = useCallback(() => {
    props.mealInfo.button === 'addToMeal'
      ? props.clearNutrients()
      : props.clearIngredients()
  }, [props.mealInfo.button])

  const getFilters = useCallback(without => {
    const { mealInfo, nutrientsFilter, ingredientsFilter } = props;

    const filters = mealInfo.button === 'addToMeal'
      ? nutrientsFilter
      : ingredientsFilter;

    if (filters?.[without]) {
      let { [without]: removed, ...newFilters } = filters;
      return newFilters
    }

    return filters;
  }, [props?.nutrientsFilter, props?.ingredientsFilter])

  const setFilters = useCallback((filters, isOverwrite) => {
    const { mealInfo, setNutrientsFilter, setIngredientsFilter } = props;

    mealInfo.button === 'addToMeal'
      ? setNutrientsFilter(filters, isOverwrite)
      : setIngredientsFilter(filters, isOverwrite)
  }, [props.nutrientsFilter, props.ingredientsFilter])

  const setNameFilter = useCallback(text => {
    const { getNutrients } = props;

    if (!text) return;
    const currentText = upperCaseFirst(text);

    if (currentText.length > 0 && searchText !== currentText) {
      const filters = getFilters();
      setFilters({ ...filters, name: currentText });
      getNutrients({ ...filters, name: currentText }, 'first');
      setSearchText(currentText);
    }
    else if (currentText.length === 0 && searchText !== null) {
      const filters = getFilters('name');
      setFilters(filters, true);
      getNutrients(filters, 'first');
      setSearchText(null);
    }
  }, [props.nutrientsFilter, props.ingredientsFilter])

  const clearNameFilter = useCallback(() => {
    const filters = getFilters('name');
    setFilters(filters, true);
    setSearchText(null);

    if (sectionIndex === 0) {
      if (Object.keys(filters).length > 0)
        props.getNutrients(filters, 'first');
      else
        clearList();
    }
    else if (sectionIndex === 1) {
      props.getNutrients(filters, 'first');
    }
  }, [props.nutrientsFilter, props.ingredientsFilter])

  const clearOtherFilter = useCallback(() => {
    const { getNutrients } = props;
    const filters = getFilters();

    if (filters.name || filters.owner) {
      let { species, type, vitamins, minerals, ...newFilters } = filters;
      setFilters(newFilters, true);
      getNutrients(newFilters, 'first');
    }
    else {
      setFilters(null, true);
      clearList();
    }
  }, [props.nutrientsFilter, props.ingredientsFilter])

  const changeSectionFilter = useCallback(index => {
    const { getNutrients, clearNutrients, clearIngredients } = props;
    const { authId, nutrients, ingredients, mealInfo } = props;

    const isNeedChange = sectionIndex !== index;
    setSectionIndex(index);

    if (index === 0 && isNeedChange) {
      const filters = getFilters('owner');
      setFilters(filters, true);

      if (Object.keys(filters).length > 0) {
        getNutrients(filters, 'first')
      } else {
        mealInfo?.button === 'addToMeal'
          ? nutrients.length && clearNutrients()
          : ingredients.length && clearIngredients();
      }
    }
    else if (index === 1 && isNeedChange) {
      const filters = getFilters();
      setFilters({ ...filters, owner: authId });
      getNutrients({ ...filters, owner: authId }, 'first');
    }
  }, [props.nutrientsFilter, props.ingredientsFilter])

  const getItemLayout = useCallback((_, index) => {
    return ({
      length: 218.6666717529297,
      offset: 218.6666717529297 * index, index
    })
  }, [])

  const getMoreNutrients = useCallback(() => {
    const { lastNutrient, lastIngredient, mealInfo } = props;
    const filters = getFilters();
    const last = mealInfo.button === 'addToMeal'
      ? lastNutrient
      : lastIngredient;

    props.getNutrients(filters, last);
  }, [props.nutrients, props.mealInfo, props.lastNutrient, props.lastIngredient])

  const renderTags = useCallback(() => {
    let key = 0;
    let tags = [];
    const filters = getFilters();

    switch (filters?.species) {
      case 'product':
        tags.push(<Text key={key} style={s.tagText}>{strings.products}</Text>)
        break;
      case 'dish':
        tags.push(<Text key={key} style={s.tagText}>{strings.dishes}</Text>)
        break;
      default:
        break;
    }

    switch (filters?.type) {
      case 'protein':
        tags.push(<Text key={++key} style={s.tagText}>{strings.proteinType}</Text>)
        break;
      case 'fat':
        tags.push(<Text key={++key} style={s.tagText}>{strings.fatType}</Text>)
        break;
      case 'carb':
        tags.push(<Text key={++key} style={s.tagText}>{strings.carbType}</Text>)
        break;
      default:
        break;
    }

    filters?.vitamins?.map(vit => {
      tags.push(
        <Text key={++key} style={s.tagText}>
          {strings.formatString(strings.vitTagFs, vit)}
        </Text>
      )
    })

    filters?.minerals?.map(min => {
      tags.push(
        <Text key={++key} style={s.tagText}>
          {strings.formatString(strings.minTagFs, min)}
        </Text>
      )
    })

    if (tags.length) {
      tags.push(
        <Button
          key={++key}
          style={s.button}
          title={strings.resetLower}
          onPress={clearOtherFilter}
        />
      )
    }

    return tags;
  }, [props.nutrientsFilter, props.ingredientsFilter])

  const renderEmpty = useCallback(() => {
    const hasFilters = Object.keys(getFilters() ?? []).length > 0;
    if (props.loading) return null;

    return hasFilters
      ? <Text style={s.empty}>{strings.noQueryResults}</Text>
      : <Text style={s.tip}>
        {strings.enterNutrientName}
        {strings.useFilter}
        <IconFA name="filter" size={16} color='#a8b4c4' />.{'\n'}
        {strings.createNutrient}
        <Image style={s.addNutrientIcon} resizeMode="contain"
          source={require('../../assets/img/food/add-nutrient.png')} />.
        </Text>

  }, [props.loading, props?.nutrientsFilter, props?.ingredientsFilter])

  const renderFooter = useCallback(() => {
    return props.loading
      ? <ActivityIndicator size='large' />
      : null
  }, [props.loading])

  const renderHeader = useMemo(() => {
    const { button } = props.mealInfo;
    const { navigate } = props.navigation;

    const createIcon = <Image
      style={s.addIcon}
      resizeMode="contain"
      source={require('../../assets/img/food/add-nutrient.png')}
    />

    return (
      <View>
        <SearchHeader
          text={searchText}
          sections={[strings.nutrients, strings.myNutrients]}
          rightButtonIcon={button === 'addToMeal' && createIcon}
          onRightButtonPress={() => navigate('Product')}
          onChangeSection={sectionIndex => changeSectionFilter(sectionIndex)}
          onClearText={clearNameFilter}
          onSubmitEditing={setNameFilter}
          onOpenFilter={() => navigate('NutrientsFilter')}
        />
        <View style={s.tagBox}>
          {renderTags()}
        </View>
      </View>
    )
  }, [searchText, renderTags])

  const renderNutrients = useCallback(({ item }) => {
    const { mealInfo, nutrientsFilter } = props;
    const isShowMenu = mealInfo.button === 'addToMeal' && nutrientsFilter?.owner;
    return (
      <Nutrient
        showMenu={isShowMenu}
        addButton={mealInfo.button}
        style={s.nutrient}
        infoKey={item.infoKey}
        data={{ ...item }}
      />
    )
  }, [props.nutrients, props.ingredients])

  return (
    <View style={s.main}>
      <StatusBar
        barStyle='dark-content'
        backgroundColor='white'
      />
      <FlatList
        data={props.mealInfo.button === 'addToMeal'
          ? props.nutrients
          : props.ingredients
        }
        renderItem={renderNutrients}
        keyExtractor={(_, index) => index.toString()}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        getItemLayout={getItemLayout}
        onEndReachedThreshold={0.00001}
        onEndReached={getMoreNutrients}
      />
    </View>
  )
}

export default compose(
  connect(
    state => ({
      authId: state.firebase.auth.uid,
      nutrients: state.food.nutrients,
      ingredients: state.food.ingredients,
      lastNutrient: state.food.lastNutrient,
      lastIngredient: state.food.lastIngredient,
      loading: state.food.loading,
      nutrientsFilter: state.food.nutrientsFilter,
      ingredientsFilter: state.food.ingredientsFilter,
      mealInfo: state.food.mealInfo,
    }),
    {
      getNutrients,
      clearNutrients,
      clearIngredients,
      setNutrientsFilter,
      setIngredientsFilter,
      clearFilters
    }
  ),
)(Nutrients);

const s = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#f7f7f7'
  },
  nutrient: {
    marginBottom: 10,
  },
  tagBox: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    marginBottom: 5,
  },
  tagText: {
    borderRadius: 18,
    paddingHorizontal: 7,
    paddingVertical: 4,
    elevation: 3,
    fontSize: 13,
    color: '#4f6488',
    backgroundColor: '#e6eaf0',
    marginLeft: 10,
    marginBottom: 5,
  },
  button: {
    height: 25.7,
    elevation: 3,
    marginLeft: 10,
    marginBottom: 5,
    paddingHorizontal: 5
  },
  addButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2566d4',
    elevation: 2,
  },
  darkFill: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    width: '100%',
    padding: 20,
    paddingVertical: 20,
    backgroundColor: 'white',
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonsBox: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  addIcon: {
    width: 20,
    height: 20,
    tintColor: '#2566d4'
  },
  empty: {
    color: '#9da1a7',
    textAlign: 'center',
    marginTop: 10,
  },
  tip: {
    color: '#9da1a7',
    textAlign: 'center',
    margin: 20,
    lineHeight: 25,
  },
  loading: {
    marginTop: 20
  },
  addNutrientIcon: {
    width: 16,
    height: 16
  },
})