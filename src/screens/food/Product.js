import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import { Image, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import { Button } from '../../components/Button';
import { ButtonsGroup } from '../../components/ButtonsGroup';
import IconFA from 'react-native-vector-icons/FontAwesome';
import { Menu, MenuTrigger, MenuOptions, MenuOption } from 'react-native-popup-menu';
import { arrowDown, triggerText, menuTriggerStyles, menuOptionsStyles } from '../../styles/menu';
import { picker } from '../../styles/picker';
import RNPickerSelect from 'react-native-picker-select';
import { connect } from 'react-redux';
import { upperCaseFirst, getPhotoPath } from '../../utils/stringFormat';
import { selectPhoto } from '../../utils/selectPhoto';
import { uploadImage, deleteFile } from '../../utils/firebase';
import { productCategories } from '../../utils/constants';
import isEqual from 'lodash/isEqual';
import { calculateProteinsQuality, calculateFatsQuality } from '../../utils/nutrientActions';
import { calculateCarbsQuality, calculateMicroIndex } from '../../utils/nutrientActions';
import { createProduct, setEditInfo, updateProduct } from '../../store/actions/foodActions';
import { alert } from '../../utils/alertWrapper';
import { strings } from '../../utils/localization';

const Product = props => {
  const [disabled, setDisabled] = useState(false);
  const [buttonsGroupIndex, setButtonsGroupIndex] = useState(0);
  const [photo, setPhoto] = useState();
  const [mainInfo, setMainInfo] = useState();
  const [vitamins, setVitamins] = useState();
  const [minerals, setMinerals] = useState();
  const [aminoAcids, setAminoAcids] = useState();
  const [fattyAcids, setFattyAcids] = useState();
  const [saccharides, setSaccharides] = useState();
  const redStar = <Text style={s.red}> *</Text>;

  useEffect(() => {
    setDefaultValues();
    return () => props.setEditInfo(null);
  }, [])

  const onEndEditingValue = useCallback((event, name, precision, state, setState) => {
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
  }, [])

  const valueToString = useCallback((type, name) => {
    const value = type?.[name];
    if (value || value === 0)
      return String(value);
  }, [])

  const getType = useCallback(() => {
    const proteins = mainInfo?.proteins || 0;
    const fats = mainInfo?.fats || 0;
    const carbs = mainInfo?.carbs || 0;
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
  }, [mainInfo?.proteins, mainInfo?.fats, mainInfo?.carbs])

  const setDefaultValues = useCallback(() => {
    if (props.editInfo) {
      const { editInfo } = props;
      const { imageUrl, micronutrients, aminoacids, fattyacids, saccharides } = props.editInfo;

      imageUrl && setPhoto({
        photoSource: { uri: imageUrl },
      })

      setMainInfo({
        name: editInfo.name,
        category: editInfo.category,
        proteins: editInfo.proteins,
        fats: editInfo.fats,
        carbs: editInfo.carbs,
        calories: editInfo.calories,
        ...(editInfo.water) && { water: editInfo.water }
      })

      micronutrients && setVitamins({
        ...(micronutrients.vit_c) && { vit_c: micronutrients.vit_c },
        ...(micronutrients.vit_b1) && { vit_b1: micronutrients.vit_b1 },
        ...(micronutrients.vit_b2) && { vit_b2: micronutrients.vit_b2 },
        ...(micronutrients.vit_b4) && { vit_b4: micronutrients.vit_b4 },
        ...(micronutrients.vit_b5) && { vit_b5: micronutrients.vit_b5 },
        ...(micronutrients.vit_b6) && { vit_b6: micronutrients.vit_b6 },
        ...(micronutrients.vit_b9) && { vit_b9: micronutrients.vit_b9 },
        ...(micronutrients.vit_b12) && { vit_b12: micronutrients.vit_b12 },
        ...(micronutrients.vit_pp) && { vit_pp: micronutrients.vit_pp },
        ...(micronutrients.vit_h) && { vit_h: micronutrients.vit_h },
        ...(micronutrients.vit_a) && { vit_a: micronutrients.vit_a },
        ...(micronutrients.beta_carotene) && { beta_carotene: micronutrients.beta_carotene },
        ...(micronutrients.vit_e) && { vit_e: micronutrients.vit_e },
        ...(micronutrients.vit_d) && { vit_d: micronutrients.vit_d },
        ...(micronutrients.vit_k) && { vit_k: micronutrients.vit_k },
      });
      micronutrients && setMinerals({
        ...(micronutrients.min_ca) && { min_ca: micronutrients.min_ca },
        ...(micronutrients.min_p) && { min_p: micronutrients.min_p },
        ...(micronutrients.min_mg) && { min_mg: micronutrients.min_mg },
        ...(micronutrients.min_k) && { min_k: micronutrients.min_k },
        ...(micronutrients.min_na) && { min_na: micronutrients.min_na },
        ...(micronutrients.min_cl) && { min_cl: micronutrients.min_cl },
        ...(micronutrients.min_fe) && { min_fe: micronutrients.min_fe },
        ...(micronutrients.min_zn) && { min_zn: micronutrients.min_zn },
        ...(micronutrients.min_i) && { min_i: micronutrients.min_i },
        ...(micronutrients.min_cu) && { min_cu: micronutrients.min_cu },
        ...(micronutrients.min_mn) && { min_mn: micronutrients.min_mn },
        ...(micronutrients.min_se) && { min_se: micronutrients.min_se },
        ...(micronutrients.min_cr) && { min_cr: micronutrients.min_cr },
        ...(micronutrients.min_mo) && { min_mo: micronutrients.min_mo },
        ...(micronutrients.min_f) && { min_f: micronutrients.min_f },
      });
      aminoacids && setAminoAcids({
        ...(aminoacids.isoleucine) && { isoleucine: aminoacids.isoleucine },
        ...(aminoacids.leucine) && { leucine: aminoacids.leucine },
        ...(aminoacids.valine) && { valine: aminoacids.valine },
        ...(aminoacids.lysine) && { lysine: aminoacids.lysine },
        ...(aminoacids.methionine) && { methionine: aminoacids.methionine },
        ...(aminoacids.phenylalanine) && { phenylalanine: aminoacids.phenylalanine },
        ...(aminoacids.tryptophan) && { tryptophan: aminoacids.tryptophan },
        ...(aminoacids.threonine) && { threonine: aminoacids.threonine },
      });
      fattyacids && setFattyAcids({
        ...(fattyacids.saturated) && { saturated: fattyacids.saturated },
        ...(fattyacids.monounsaturated) && { monounsaturated: fattyacids.monounsaturated },
        ...(fattyacids.polyunsaturated) && { polyunsaturated: fattyacids.polyunsaturated },
        ...(fattyacids.omega3) && { omega3: fattyacids.omega3 },
        ...(fattyacids.omega6) && { omega6: fattyacids.omega6 },
        ...(fattyacids.transfats) && { transfats: fattyacids.transfats },
        ...(fattyacids.cholesterol) && { cholesterol: fattyacids.cholesterol },
      });
      saccharides && setSaccharides({
        ...(saccharides.monosaccharides) && { monosaccharides: saccharides.monosaccharides },
        ...(saccharides.polysaccharides) && { polysaccharides: saccharides.polysaccharides },
        ...(saccharides.fibers) && { fibers: saccharides.fibers },
      })
    }
  }, [])

  const isNoChanges = () => {
    const { editInfo } = props;

    const editInfoMainInfo = {
      name: editInfo?.name,
      category: editInfo?.category,
      proteins: editInfo?.proteins,
      fats: editInfo?.fats,
      carbs: editInfo?.carbs,
      calories: editInfo?.calories,
      water: editInfo?.water
    }

    const micronutrients = { ...vitamins, ...minerals };

    const values = [
      photo?.prevPhotoSource || photo?.photoData ? false : true,
      isEqual(editInfoMainInfo, mainInfo),
      editInfo?.micronutrients ? isEqual(editInfo?.micronutrients, micronutrients) : true,
      editInfo?.aminoacids ? isEqual(editInfo?.aminoacids, aminoAcids) : true,
      editInfo?.fattyacids ? isEqual(editInfo?.fattyacids, fattyAcids) : true,
      editInfo?.saccharides ? isEqual(editInfo?.saccharides, saccharides) : true
    ]

    return values.every(value => value === true);
  }

  const create = async () => {
    if (disabled) return;
    setDisabled(true);

    const name = mainInfo?.name?.trim().length || 0;
    const requiredFieldsCount = Object.keys(mainInfo || [])
      .filter(main => main !== 'water').length;

    if (isNoChanges()) {
      console.log('Dont save, there is no changes');
      props.navigation.navigate('Nutrients');
      return;
    }

    if (requiredFieldsCount < 6 || name < 2) {
      alert(strings.requiredProductFields, strings.requireFields);
      setDisabled(false);
      return;
    }

    const product = {
      type: getType(),
      ...mainInfo,
      ...(vitamins || minerals) && {
        micronutrients: {
          ...vitamins,
          ...minerals
        }
      },
      ...(aminoAcids || fattyAcids || saccharides || vitamins || minerals) && {
        quality: {
          ...(aminoAcids) && { proteins: calculateProteinsQuality(mainInfo.proteins, aminoAcids, mainInfo.category) },
          ...(fattyAcids) && { fats: calculateFatsQuality(mainInfo.fats, fattyAcids) },
          ...(saccharides) && { carbs: calculateCarbsQuality(mainInfo.carbs, saccharides) },
          ...(vitamins || minerals) && { microIndex: calculateMicroIndex({ ...vitamins, ...minerals }) }
        }
      },
      ...(aminoAcids) && {
        aminoacids: {
          ...(aminoAcids.isoleucine) && { isoleucine: aminoAcids.isoleucine },
          ...(aminoAcids.leucine) && { leucine: aminoAcids.leucine },
          ...(aminoAcids.valine) && { valine: aminoAcids.valine },
          ...(aminoAcids.lysine) && { lysine: aminoAcids.lysine },
          ...(aminoAcids.methionine) && { methionine: aminoAcids.methionine },
          ...(aminoAcids.phenylalanine) && { phenylalanine: aminoAcids.phenylalanine },
          ...(aminoAcids.tryptophan) && { tryptophan: aminoAcids.tryptophan },
          ...(aminoAcids.threonine) && { threonine: aminoAcids.threonine },
        }
      },
      ...(fattyAcids) && {
        fattyacids: {
          ...(fattyAcids.saturated) && { saturated: fattyAcids.saturated },
          ...(fattyAcids.monounsaturated) && { monounsaturated: fattyAcids.monounsaturated },
          ...(fattyAcids.polyunsaturated) && { polyunsaturated: fattyAcids.polyunsaturated },
          ...(fattyAcids.omega3) && { lysine: fattyAcids.omega3 },
          ...(fattyAcids.omega6) && { omega6: fattyAcids.omega6 },
          ...(fattyAcids.transfats) && { transfats: fattyAcids.transfats },
          ...(fattyAcids.cholesterol) && { cholesterol: fattyAcids.cholesterol },
        }
      },
      ...(saccharides) && {
        saccharides: {
          ...(saccharides.monosaccharides) && { monosaccharides: saccharides.monosaccharides },
          ...(saccharides.polysaccharides) && { polysaccharides: saccharides.polysaccharides },
          ...(saccharides.fibers) && { fibers: saccharides.fibers },
        }
      },
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
      const infoKey = props.editInfo?.infoKey;
      uploadImage('nutrients', photo.photoData,
        (imageUrl) => {
          product.imageUrl = imageUrl;
          props.editInfo
            ? props.updateProduct(infoKey, product)
            : props.createProduct(product)
        });
    }
    else {
      console.log('Stay photo same/empty');
      const infoKey = props.editInfo?.infoKey;
      const imageUrl = !photo?.photoSource
        ? null
        : props.editInfo?.imageUrl;

      imageUrl && (product.imageUrl = imageUrl);
      await props.editInfo
        ? props.updateProduct(infoKey, product)
        : props.createProduct(product)
    }

    props.navigation.navigate('Nutrients');
  }

  return (
    <>
      <ScrollView contentContainerStyle={s.main}>
        <StatusBar
          barStyle='dark-content'
          backgroundColor='white'
        />
        <View style={s.header}>
          <TouchableOpacity
            style={s.backButton}
            activeOpacity={0.5}
            onPress={() => props.navigation.goBack()}
          >
            <Image
              style={s.arrowIcon}
              resizeMode="contain"
              source={require('../../assets/img/common/left-arrow.png')}
            />
          </TouchableOpacity>
          {props.editInfo
            ? <Text style={s.sectionText}>{strings.editProduct}</Text>
            : <Menu>
              <MenuTrigger customStyles={menuTriggerStyles}>
                <Text style={triggerText}>{strings.createProduct}</Text>
                <IconFA style={arrowDown} name="angle-down" color="black" size={20} />
              </MenuTrigger>
              <MenuOptions customStyles={menuOptionsStyles}>
                <MenuOption
                  text={strings.createDish}
                  onSelect={() => props.navigation.replace('Dish')}
                />
              </MenuOptions>
            </Menu>
          }
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          style={s.imageButton}
          onPress={() => selectPhoto(strings.chooseProductPhoto, photo, setPhoto, props.editInfo?.imageUrl)}
        >
          {photo?.photoSource
            ? <Image style={s.image} resizeMode="cover" source={photo.photoSource} />
            : <>
              <IconFA name='camera' color='#c6cfdb' size={28} />
              <Text style={s.fotoText}>{strings.choosePhoto}</Text>
            </>
          }
        </TouchableOpacity>
        <ButtonsGroup
          style={s.buttonsGroup}
          buttonHeight={30}
          rows={2}
          selectedColor='#e6eaf0'
          selectedTextColor='#4f6488'
          selectedIndex={buttonsGroupIndex}
          buttons={[strings.mainTab, strings.vitamins, strings.minerals, strings.aminoShort, strings.fattyShort, strings.sacchShort]}
          onPress={(index) => setButtonsGroupIndex(index)}
        />
        {buttonsGroupIndex === 0 &&
          <View>
            <Text style={s.inputTitle}>{strings.productName}{redStar}</Text>
            <TextInput
              disableFullscreenUI
              style={s.textInput}
              placeholder={strings.enterName}
              maxLength={50}
              defaultValue={mainInfo?.name}
              onEndEditing={(event) => setMainInfo({ ...mainInfo, name: upperCaseFirst(event.nativeEvent.text) })}
            />
            <Text style={s.inputTitle}>{strings.category}{redStar}</Text>
            <RNPickerSelect
              style={picker}
              useNativeAndroidPickerStyle={false}
              Icon={() => <IconFA style={arrowDown} name="angle-down" color="#9da1a7" size={18} />}
              placeholder={{ label: strings.chooseCategoryPh, color: '#a9a9a9' }}
              items={productCategories}
              value={mainInfo?.category}
              onValueChange={(value) => setMainInfo({ ...mainInfo, category: value?.toLowerCase() })}
            />
            <Text style={s.inputTitle}>{strings.proteins}{redStar}</Text>
            <TextInput
              disableFullscreenUI
              style={s.textInput}
              placeholder={strings.proteinsIn100}
              keyboardType='number-pad'
              defaultValue={valueToString(mainInfo, 'proteins')}
              onEndEditing={(event) => onEndEditingValue(event, 'proteins', 1, mainInfo, setMainInfo)}
            />
            <Text style={s.inputTitle}>{strings.fats}{redStar}</Text>
            <TextInput
              disableFullscreenUI
              style={s.textInput}
              placeholder={strings.fatsIn100}
              keyboardType='number-pad'
              defaultValue={valueToString(mainInfo, 'fats')}
              onEndEditing={(event) => onEndEditingValue(event, 'fats', 1, mainInfo, setMainInfo)}
            />
            <Text style={s.inputTitle}>{strings.carbs}{redStar}</Text>
            <TextInput
              disableFullscreenUI
              style={s.textInput}
              placeholder={strings.carbsIn100}
              keyboardType='number-pad'
              defaultValue={valueToString(mainInfo, 'carbs')}
              onEndEditing={(event) => onEndEditingValue(event, 'carbs', 1, mainInfo, setMainInfo)}
            />
            <Text style={s.inputTitle}>{strings.calories}{redStar}</Text>
            <TextInput
              disableFullscreenUI
              style={s.textInput}
              placeholder={strings.caloriesIn100}
              keyboardType='number-pad'
              defaultValue={valueToString(mainInfo, 'calories')}
              onEndEditing={(event) => onEndEditingValue(event, 'calories', 0, mainInfo, setMainInfo)}
            />
            <Text style={s.inputTitle}>{strings.water}</Text>
            <TextInput
              disableFullscreenUI
              style={s.textInput}
              placeholder={strings.waterIn100}
              keyboardType='number-pad'
              defaultValue={valueToString(mainInfo, 'water')}
              onEndEditing={(event) => onEndEditingValue(event, 'water', 0, mainInfo, setMainInfo)}
            />
          </View>
        }
        {buttonsGroupIndex === 1 &&
          <View>
            <Text style={s.inputTitle}>{strings.formatString(strings.vitaminFs, 'C')}</Text>
            <TextInput
              style={s.textInput}
              disableFullscreenUI
              maxLength={6}
              placeholder={strings.formatString(strings.mgCommaFs, strings.vitC)}
              keyboardType='number-pad'
              defaultValue={valueToString(vitamins, 'vit_c')}
              onEndEditing={(event) => onEndEditingValue(event, 'vit_c', null, vitamins, setVitamins)}
            />
            <Text style={s.inputTitle}>{strings.formatString(strings.vitaminFs, 'B1')}</Text>
            <TextInput
              style={s.textInput}
              disableFullscreenUI
              maxLength={6}
              placeholder={strings.formatString(strings.mgCommaFs, strings.vitB1)}
              keyboardType='number-pad'
              defaultValue={valueToString(vitamins, 'vit_b1')}
              onEndEditing={(event) => onEndEditingValue(event, 'vit_b1', null, vitamins, setVitamins)}
            />
            <Text style={s.inputTitle}>{strings.formatString(strings.vitaminFs, 'B2')}</Text>
            <TextInput
              style={s.textInput}
              disableFullscreenUI
              maxLength={6}
              placeholder={strings.formatString(strings.mgCommaFs, strings.vitB2)}
              keyboardType='number-pad'
              defaultValue={valueToString(vitamins, 'vit_b2')}
              onEndEditing={(event) => onEndEditingValue(event, 'vit_b2', null, vitamins, setVitamins)}
            />
            <Text style={s.inputTitle}>{strings.formatString(strings.vitaminFs, 'B4')}</Text>
            <TextInput
              style={s.textInput}
              disableFullscreenUI
              maxLength={6}
              placeholder={strings.formatString(strings.mgCommaFs, strings.vitB4)}
              keyboardType='number-pad'
              defaultValue={valueToString(vitamins, 'vit_b4')}
              onEndEditing={(event) => onEndEditingValue(event, 'vit_b4', null, vitamins, setVitamins)}
            />
            <Text style={s.inputTitle}>{strings.formatString(strings.vitaminFs, 'B5')}</Text>
            <TextInput
              style={s.textInput}
              disableFullscreenUI
              maxLength={6}
              placeholder={strings.formatString(strings.mgCommaFs, strings.vitB5)}
              keyboardType='number-pad'
              defaultValue={valueToString(vitamins, 'vit_b5')}
              onEndEditing={(event) => onEndEditingValue(event, 'vit_b5', null, vitamins, setVitamins)}
            />
            <Text style={s.inputTitle}>{strings.formatString(strings.vitaminFs, 'B6')}</Text>
            <TextInput
              style={s.textInput}
              disableFullscreenUI
              maxLength={6}
              placeholder={strings.formatString(strings.mgCommaFs, strings.vitB6)}
              keyboardType='number-pad'
              defaultValue={valueToString(vitamins, 'vit_b6')}
              onEndEditing={(event) => onEndEditingValue(event, 'vit_b6', null, vitamins, setVitamins)}
            />
            <Text style={s.inputTitle}>{strings.formatString(strings.vitaminFs, 'B9')}</Text>
            <TextInput
              style={s.textInput}
              disableFullscreenUI
              maxLength={6}
              placeholder={strings.formatString(strings.mcgCommaFs, strings.vitB9)}
              keyboardType='number-pad'
              defaultValue={valueToString(vitamins, 'vit_b9')}
              onEndEditing={(event) => onEndEditingValue(event, 'vit_b9', null, vitamins, setVitamins)}
            />
            <Text style={s.inputTitle}>{strings.formatString(strings.vitaminFs, 'B12')}</Text>
            <TextInput
              style={s.textInput}
              disableFullscreenUI
              maxLength={6}
              placeholder={strings.formatString(strings.mcgCommaFs, strings.vitB12)}
              keyboardType='number-pad'
              defaultValue={valueToString(vitamins, 'vit_b12')}
              onEndEditing={(event) => onEndEditingValue(event, 'vit_b12', null, vitamins, setVitamins)}
            />
            <Text style={s.inputTitle}>{strings.formatString(strings.vitaminFs, 'PP')}</Text>
            <TextInput
              style={s.textInput}
              disableFullscreenUI
              maxLength={6}
              placeholder={strings.formatString(strings.mgCommaFs, strings.vitPP)}
              keyboardType='number-pad'
              defaultValue={valueToString(vitamins, 'vit_pp')}
              onEndEditing={(event) => onEndEditingValue(event, 'vit_pp', null, vitamins, setVitamins)}
            />
            <Text style={s.inputTitle}>{strings.formatString(strings.vitaminFs, 'H')}</Text>
            <TextInput
              style={s.textInput}
              disableFullscreenUI
              maxLength={6}
              placeholder={strings.formatString(strings.mcgCommaFs, strings.vitH)}
              keyboardType='number-pad'
              defaultValue={valueToString(vitamins, 'vit_h')}
              onEndEditing={(event) => onEndEditingValue(event, 'vit_h', null, vitamins, setVitamins)}
            />
            <Text style={s.inputTitle}>{strings.formatString(strings.vitaminFs, 'A')}</Text>
            <TextInput
              style={s.textInput}
              disableFullscreenUI
              maxLength={6}
              placeholder={strings.formatString(strings.mcgCommaFs, strings.vitA)}
              keyboardType='number-pad'
              defaultValue={valueToString(vitamins, 'vit_a')}
              onEndEditing={(event) => onEndEditingValue(event, 'vit_a', null, vitamins, setVitamins)}
            />
            <Text style={s.inputTitle}>{strings.betaCarotene}</Text>
            <TextInput
              style={s.textInput}
              disableFullscreenUI
              maxLength={6}
              placeholder={strings.formatString(strings.mgCommaFs, strings.betaCarotene)}
              keyboardType='number-pad'
              defaultValue={valueToString(vitamins, 'beta_carotene')}
              onEndEditing={(event) => onEndEditingValue(event, 'beta_carotene', null, vitamins, setVitamins)}
            />
            <Text style={s.inputTitle}>{strings.formatString(strings.vitaminFs, 'E')}</Text>
            <TextInput
              style={s.textInput}
              disableFullscreenUI
              maxLength={6}
              placeholder={strings.formatString(strings.mgCommaFs, strings.vitE)}
              keyboardType='number-pad'
              defaultValue={valueToString(vitamins, 'vit_e')}
              onEndEditing={(event) => onEndEditingValue(event, 'vit_e', null, vitamins, setVitamins)}
            />
            <Text style={s.inputTitle}>{strings.formatString(strings.vitaminFs, 'D')}</Text>
            <TextInput
              style={s.textInput}
              disableFullscreenUI
              maxLength={6}
              placeholder={strings.formatString(strings.mcgCommaFs, strings.vitD)}
              keyboardType='number-pad'
              defaultValue={valueToString(vitamins, 'vit_d')}
              onEndEditing={(event) => onEndEditingValue(event, 'vit_d', null, vitamins, setVitamins)}
            />
            <Text style={s.inputTitle}>{strings.formatString(strings.vitaminFs, 'K')}</Text>
            <TextInput
              style={s.textInput}
              disableFullscreenUI
              maxLength={6}
              placeholder={strings.formatString(strings.mcgCommaFs, strings.vitK)}
              keyboardType='number-pad'
              defaultValue={valueToString(vitamins, 'vit_k')}
              onEndEditing={(event) => onEndEditingValue(event, 'vit_k', null, vitamins, setVitamins)}
            />
          </View>
        }
        {buttonsGroupIndex === 2 &&
          <View>
            <Text style={s.inputTitle}>{strings.formatString(strings.mineralFs, 'Ca')}</Text>
            <TextInput
              style={s.textInput}
              disableFullscreenUI
              maxLength={6}
              placeholder={strings.formatString(strings.mgCommaFs, strings.minCa)}
              keyboardType='number-pad'
              defaultValue={valueToString(minerals, 'min_ca')}
              onEndEditing={(event) => onEndEditingValue(event, 'min_ca', null, minerals, setMinerals)}
            />
            <Text style={s.inputTitle}>{strings.formatString(strings.mineralFs, 'P')}</Text>
            <TextInput
              style={s.textInput}
              disableFullscreenUI
              maxLength={6}
              placeholder={strings.formatString(strings.mgCommaFs, strings.minP)}
              keyboardType='number-pad'
              defaultValue={valueToString(minerals, 'min_p')}
              onEndEditing={(event) => onEndEditingValue(event, 'min_p', null, minerals, setMinerals)}
            />
            <Text style={s.inputTitle}>{strings.formatString(strings.mineralFs, 'Mg')}</Text>
            <TextInput
              style={s.textInput}
              disableFullscreenUI
              maxLength={6}
              placeholder={strings.formatString(strings.mgCommaFs, strings.minMg)}
              keyboardType='number-pad'
              defaultValue={valueToString(minerals, 'min_mg')}
              onEndEditing={(event) => onEndEditingValue(event, 'min_mg', null, minerals, setMinerals)}
            />
            <Text style={s.inputTitle}>{strings.formatString(strings.mineralFs, 'K')}</Text>
            <TextInput
              style={s.textInput}
              disableFullscreenUI
              maxLength={6}
              placeholder={strings.formatString(strings.mgCommaFs, strings.minK)}
              keyboardType='number-pad'
              defaultValue={valueToString(minerals, 'min_k')}
              onEndEditing={(event) => onEndEditingValue(event, 'min_k', null, minerals, setMinerals)}
            />
            <Text style={s.inputTitle}>{strings.formatString(strings.mineralFs, 'Na')}</Text>
            <TextInput
              style={s.textInput}
              disableFullscreenUI
              maxLength={6}
              placeholder={strings.formatString(strings.mgCommaFs, strings.minNa)}
              keyboardType='number-pad'
              defaultValue={valueToString(minerals, 'min_na')}
              onEndEditing={(event) => onEndEditingValue(event, 'min_na', null, minerals, setMinerals)}
            />
            <Text style={s.inputTitle}>{strings.formatString(strings.mineralFs, 'Cl')}</Text>
            <TextInput
              style={s.textInput}
              disableFullscreenUI
              maxLength={6}
              placeholder={strings.formatString(strings.mgCommaFs, strings.minCl)}
              keyboardType='number-pad'
              defaultValue={valueToString(minerals, 'min_cl')}
              onEndEditing={(event) => onEndEditingValue(event, 'min_cl', null, minerals, setMinerals)}
            />
            <Text style={s.inputTitle}>{strings.formatString(strings.mineralFs, 'Fe')}</Text>
            <TextInput
              style={s.textInput}
              disableFullscreenUI
              maxLength={6}
              placeholder={strings.formatString(strings.mgCommaFs, strings.minFe)}
              keyboardType='number-pad'
              defaultValue={valueToString(minerals, 'min_fe')}
              onEndEditing={(event) => onEndEditingValue(event, 'min_fe', null, minerals, setMinerals)}
            />
            <Text style={s.inputTitle}>{strings.formatString(strings.mineralFs, 'Zn')}</Text>
            <TextInput
              style={s.textInput}
              disableFullscreenUI
              maxLength={6}
              placeholder={strings.formatString(strings.mgCommaFs, strings.minZn)}
              keyboardType='number-pad'
              defaultValue={valueToString(minerals, 'min_zn')}
              onEndEditing={(event) => onEndEditingValue(event, 'min_zn', null, minerals, setMinerals)}
            />
            <Text style={s.inputTitle}>{strings.formatString(strings.mineralFs, 'I')}</Text>
            <TextInput
              style={s.textInput}
              disableFullscreenUI
              maxLength={6}
              placeholder={strings.formatString(strings.mcgCommaFs, strings.minI)}
              keyboardType='number-pad'
              defaultValue={valueToString(minerals, 'min_i')}
              onEndEditing={(event) => onEndEditingValue(event, 'min_i', null, minerals, setMinerals)}
            />
            <Text style={s.inputTitle}>{strings.formatString(strings.mineralFs, 'Cu')}</Text>
            <TextInput
              style={s.textInput}
              disableFullscreenUI
              maxLength={6}
              placeholder={strings.formatString(strings.mgCommaFs, strings.minCu)}
              keyboardType='number-pad'
              defaultValue={valueToString(minerals, 'min_cu')}
              onEndEditing={(event) => onEndEditingValue(event, 'min_cu', null, minerals, setMinerals)}
            />
            <Text style={s.inputTitle}>{strings.formatString(strings.mineralFs, 'Mn')}</Text>
            <TextInput
              style={s.textInput}
              disableFullscreenUI
              maxLength={6}
              placeholder={strings.formatString(strings.mgCommaFs, strings.minMn)}
              keyboardType='number-pad'
              defaultValue={valueToString(minerals, 'min_mn')}
              onEndEditing={(event) => onEndEditingValue(event, 'min_mn', null, minerals, setMinerals)}
            />
            <Text style={s.inputTitle}>{strings.formatString(strings.mineralFs, 'Se')}</Text>
            <TextInput
              style={s.textInput}
              disableFullscreenUI
              maxLength={6}
              placeholder={strings.formatString(strings.mcgCommaFs, strings.minSe)}
              keyboardType='number-pad'
              defaultValue={valueToString(minerals, 'min_se')}
              onEndEditing={(event) => onEndEditingValue(event, 'min_se', null, minerals, setMinerals)}
            />
            <Text style={s.inputTitle}>{strings.formatString(strings.mineralFs, 'Cr')}</Text>
            <TextInput
              style={s.textInput}
              disableFullscreenUI
              maxLength={6}
              placeholder={strings.formatString(strings.mcgCommaFs, strings.minCr)}
              keyboardType='number-pad'
              defaultValue={valueToString(minerals, 'min_cr')}
              onEndEditing={(event) => onEndEditingValue(event, 'min_cr', null, minerals, setMinerals)}
            />
            <Text style={s.inputTitle}>{strings.formatString(strings.mineralFs, 'Mo')}</Text>
            <TextInput
              style={s.textInput}
              disableFullscreenUI
              maxLength={6}
              placeholder={strings.formatString(strings.mcgCommaFs, strings.minMo)}
              keyboardType='number-pad'
              defaultValue={valueToString(minerals, 'min_mo')}
              onEndEditing={(event) => onEndEditingValue(event, 'min_mo', null, minerals, setMinerals)}
            />
            <Text style={s.inputTitle}>{strings.formatString(strings.mineralFs, 'F')}</Text>
            <TextInput
              style={s.textInput}
              disableFullscreenUI
              maxLength={6}
              placeholder={strings.formatString(strings.mgCommaFs, strings.minF)}
              keyboardType='number-pad'
              defaultValue={valueToString(minerals, 'min_f')}
              onEndEditing={(event) => onEndEditingValue(event, 'min_f', null, minerals, setMinerals)}
            />
          </View>
        }
        {buttonsGroupIndex === 3 &&
          <View>
            <Text style={s.inputTitle}>{strings.isoleucine}</Text>
            <TextInput
              style={s.textInput}
              disableFullscreenUI
              maxLength={6}
              placeholder={strings.formatString(strings.gramCommaFs, strings.isoleucine)}
              keyboardType='number-pad'
              defaultValue={valueToString(aminoAcids, 'isoleucine')}
              onEndEditing={(event) => onEndEditingValue(event, 'isoleucine', null, aminoAcids, setAminoAcids)}
            />
            <Text style={s.inputTitle}>{strings.leucine}</Text>
            <TextInput
              style={s.textInput}
              disableFullscreenUI
              maxLength={6}
              placeholder={strings.formatString(strings.gramCommaFs, strings.leucine)}
              keyboardType='number-pad'
              defaultValue={valueToString(aminoAcids, 'leucine')}
              onEndEditing={(event) => onEndEditingValue(event, 'leucine', null, aminoAcids, setAminoAcids)}
            />
            <Text style={s.inputTitle}>{strings.valine}</Text>
            <TextInput
              style={s.textInput}
              disableFullscreenUI
              maxLength={6}
              placeholder={strings.formatString(strings.gramCommaFs, strings.valine)}
              keyboardType='number-pad'
              defaultValue={valueToString(aminoAcids, 'valine')}
              onEndEditing={(event) => onEndEditingValue(event, 'valine', null, aminoAcids, setAminoAcids)}
            />
            <Text style={s.inputTitle}>{strings.lysine}</Text>
            <TextInput
              style={s.textInput}
              disableFullscreenUI
              maxLength={6}
              placeholder={strings.formatString(strings.gramCommaFs, strings.lysine)}
              keyboardType='number-pad'
              defaultValue={valueToString(aminoAcids, 'lysine')}
              onEndEditing={(event) => onEndEditingValue(event, 'lysine', null, aminoAcids, setAminoAcids)}
            />
            <Text style={s.inputTitle}>{strings.methionine}</Text>
            <TextInput
              style={s.textInput}
              disableFullscreenUI
              maxLength={6}
              placeholder={strings.formatString(strings.gramCommaFs, strings.methionine)}
              keyboardType='number-pad'
              defaultValue={valueToString(aminoAcids, 'methionine')}
              onEndEditing={(event) => onEndEditingValue(event, 'methionine', null, aminoAcids, setAminoAcids)}
            />
            <Text style={s.inputTitle}>{strings.phenylalanine}</Text>
            <TextInput
              style={s.textInput}
              disableFullscreenUI
              maxLength={6}
              placeholder={strings.formatString(strings.gramCommaFs, strings.phenylalanine)}
              keyboardType='number-pad'
              defaultValue={valueToString(aminoAcids, 'phenylalanine')}
              onEndEditing={(event) => onEndEditingValue(event, 'phenylalanine', null, aminoAcids, setAminoAcids)}
            />
            <Text style={s.inputTitle}>{strings.tryptophan}</Text>
            <TextInput
              style={s.textInput}
              disableFullscreenUI
              maxLength={6}
              placeholder={strings.formatString(strings.gramCommaFs, strings.tryptophan)}
              keyboardType='number-pad'
              defaultValue={valueToString(aminoAcids, 'tryptophan')}
              onEndEditing={(event) => onEndEditingValue(event, 'tryptophan', null, aminoAcids, setAminoAcids)}
            />
            <Text style={s.inputTitle}>{strings.threonine}</Text>
            <TextInput
              style={s.textInput}
              disableFullscreenUI
              maxLength={6}
              placeholder={strings.formatString(strings.gramCommaFs, strings.threonine)}
              keyboardType='number-pad'
              defaultValue={valueToString(aminoAcids, 'threonine')}
              onEndEditing={(event) => onEndEditingValue(event, 'threonine', null, aminoAcids, setAminoAcids)}
            />
          </View>
        }
        {buttonsGroupIndex === 4 &&
          <View>
            <Text style={s.inputTitle}>{strings.saturated}</Text>
            <TextInput
              style={s.textInput}
              disableFullscreenUI
              maxLength={6}
              placeholder={strings.formatString(strings.gramCommaFs, strings.saturated)}
              keyboardType='number-pad'
              defaultValue={valueToString(fattyAcids, 'saturated')}
              onEndEditing={(event) => onEndEditingValue(event, 'saturated', null, fattyAcids, setFattyAcids)}
            />
            <Text style={s.inputTitle}>{strings.monounsaturated}</Text>
            <TextInput
              style={s.textInput}
              disableFullscreenUI
              maxLength={6}
              placeholder={strings.formatString(strings.gramCommaFs, strings.monounsaturated)}
              keyboardType='number-pad'
              defaultValue={valueToString(fattyAcids, 'monounsaturated')}
              onEndEditing={(event) => onEndEditingValue(event, 'monounsaturated', null, fattyAcids, setFattyAcids)}
            />
            <Text style={s.inputTitle}>{strings.polyunsaturated}</Text>
            <TextInput
              style={s.textInput}
              disableFullscreenUI
              maxLength={6}
              placeholder={strings.formatString(strings.gramCommaFs, strings.polyunsaturated)}
              keyboardType='number-pad'
              defaultValue={valueToString(fattyAcids, 'polyunsaturated')}
              onEndEditing={(event) => onEndEditingValue(event, 'polyunsaturated', null, fattyAcids, setFattyAcids)}
            />
            <Text style={s.inputTitle}>{strings.omega3}</Text>
            <TextInput
              style={s.textInput}
              disableFullscreenUI
              maxLength={6}
              placeholder={strings.formatString(strings.gramCommaFs, strings.omega3)}
              keyboardType='number-pad'
              defaultValue={valueToString(fattyAcids, 'omega3')}
              onEndEditing={(event) => onEndEditingValue(event, 'omega3', null, fattyAcids, setFattyAcids)}
            />
            <Text style={s.inputTitle}>{strings.omega6}</Text>
            <TextInput
              style={s.textInput}
              disableFullscreenUI
              maxLength={6}
              placeholder={strings.formatString(strings.gramCommaFs, strings.omega6)}
              keyboardType='number-pad'
              defaultValue={valueToString(fattyAcids, 'omega6')}
              onEndEditing={(event) => onEndEditingValue(event, 'omega6', null, fattyAcids, setFattyAcids)}
            />
            <Text style={s.inputTitle}>{strings.transfats}</Text>
            <TextInput
              style={s.textInput}
              disableFullscreenUI
              maxLength={6}
              placeholder={strings.formatString(strings.gramCommaFs, strings.transfats)}
              keyboardType='number-pad'
              defaultValue={valueToString(fattyAcids, 'transfats')}
              onEndEditing={(event) => onEndEditingValue(event, 'transfats', null, fattyAcids, setFattyAcids)}
            />
            <Text style={s.inputTitle}>{strings.cholesterol}</Text>
            <TextInput
              style={s.textInput}
              disableFullscreenUI
              maxLength={6}
              placeholder={strings.formatString(strings.mgCommaFs, strings.cholesterol)}
              keyboardType='number-pad'
              defaultValue={valueToString(fattyAcids, 'cholesterol')}
              onEndEditing={(event) => onEndEditingValue(event, 'cholesterol', 0, fattyAcids, setFattyAcids)}
            />
          </View>
        }
        {buttonsGroupIndex === 5 &&
          <View>
            <Text style={s.inputTitle}>{strings.monosaccharides}</Text>
            <TextInput
              style={s.textInput}
              disableFullscreenUI
              maxLength={6}
              placeholder={strings.formatString(strings.gramCommaFs, strings.monosaccharides)}
              keyboardType='number-pad'
              defaultValue={valueToString(saccharides, 'monosaccharides')}
              onEndEditing={(event) => onEndEditingValue(event, 'monosaccharides', null, saccharides, setSaccharides)}
            />
            <Text style={s.inputTitle}>{strings.polysaccharides}</Text>
            <TextInput
              style={s.textInput}
              disableFullscreenUI
              maxLength={6}
              placeholder={strings.formatString(strings.gramCommaFs, strings.polysaccharides)}
              keyboardType='number-pad'
              defaultValue={valueToString(saccharides, 'polysaccharides')}
              onEndEditing={(event) => onEndEditingValue(event, 'polysaccharides', null, saccharides, setSaccharides)}
            />
            <Text style={s.inputTitle}>{strings.fibers}</Text>
            <TextInput
              style={s.textInput}
              disableFullscreenUI
              maxLength={6}
              placeholder={strings.formatString(strings.gramCommaFs, strings.fibers)}
              keyboardType='number-pad'
              defaultValue={valueToString(saccharides, 'fibers')}
              onEndEditing={(event) => onEndEditingValue(event, 'fibers', null, saccharides, setSaccharides)}
            />
          </View>
        }
      </ScrollView>
      <Button
        disabled={disabled}
        style={s.save}
        title={strings.save}
        icon={disabled ? <ActivityIndicator color='white' /> : null}
        onPress={create}
      />
    </>
  )
}

export default connect(
  state => ({
    editInfo: state.food.editInfo,
  }),
  {
    createProduct,
    setEditInfo,
    updateProduct
  }
)(Product);

const s = StyleSheet.create({
  main: {
    // flexGrow: 1,
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
  sectionText: {
    fontSize: 22,
    fontWeight: 'bold',
    paddingVertical: 8
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
  save: {
    margin: 10,
    backgroundColor: '#2566d4',
    color: 'white'
  },
  red: {
    color: 'red',
  }
})