import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { ProgressBar } from '../components/ProgressBar';
import { ButtonsGroup } from '../components/ButtonsGroup';
import * as constants from '../utils/constants';
import { strings } from '../utils/localization';

export const NutritionDetails = props => {
  const [aminoProgress, setAminoProgress] = useState();
  const [fattyProgress, setFattyProgress] = useState();
  const [saccharidesProgress, setSaccharidesProgress] = useState();
  const [waterInfoProgress, setWaterInfoProgress] = useState();

  const { index, buttonsHeight, buttons, microPercent } = props;
  const { proteins, fats, carbs, aminoacids, fattyacids, saccharides, waterInfo } = props;

  useEffect(() => {
    getAminoAcidsProgress(proteins, aminoacids, setAminoProgress);
    getFattyAcidsProgress(fats, fattyacids, setFattyProgress);
    getSaccharidesProgress(carbs, saccharides, setSaccharidesProgress);
    getWaterInfoProgress(waterInfo, setWaterInfoProgress);
  }, [proteins, fats, carbs, waterInfo])

  const getAminoAcidsProgress = () => {
    if (!aminoacids)
      return 0;

    const aminoProgress = {}
    const aminoKeys = Object.keys(aminoacids);

    aminoKeys?.forEach(key => {
      aminoProgress[key] = (aminoacids[key] * 100) / (proteins * constants.aminoInGramm[key]);
    })
    setAminoProgress(aminoProgress);
  }

  const getFattyAcidsProgress = () => {
    const { transfats, cholesterol, saturated, monounsaturated, polyunsaturated, omega3, omega6 } = fattyacids || {};
    const fattyInGramm = constants.fattyAcidInGramm;

    if (!fattyacids)
      return 0;

    const fattyProgress = {
      ...(transfats) && { transfats: (transfats * 100) / 3 },
      ...(cholesterol) && { cholesterol: (cholesterol * 100) / 300 },
      ...(saturated) && { saturated: (saturated * 100) / (fats * fattyInGramm.saturated) },
      ...(monounsaturated) && { monounsaturated: (monounsaturated * 100) / (fats * fattyInGramm.monounsaturated) },
      ...(polyunsaturated) && { polyunsaturated: (polyunsaturated * 100) / (fats * fattyInGramm.polyunsaturated) },
      ...(omega3) && { omega3: (omega3 * 100) / (fats * fattyInGramm.omega3) },
      ...(omega6) && { omega6: (omega6 * 100) / (fats * fattyInGramm.omega6) },
    }
    setFattyProgress(fattyProgress);
  }

  const getSaccharidesProgress = () => {
    const { monosaccharides, polysaccharides, fibers } = saccharides || {};
    const saccharidesInGramm = constants.saccharidesInGramm;

    if (!saccharides) return 0;

    const saccharidesProgress = {
      ...(monosaccharides) && { monosaccharides: (monosaccharides * 100) / (carbs * saccharidesInGramm.monosaccharides.current) },
      ...(polysaccharides) && { polysaccharides: (polysaccharides * 100) / (carbs * saccharidesInGramm.polysaccharides.current) },
      ...(fibers) && { fibers: (fibers * 100) / (carbs * saccharidesInGramm.fibers.current) },
    }
    setSaccharidesProgress(saccharidesProgress);
  }

  const getWaterInfoProgress = () => {
    if (!waterInfo)
      return 0;

    const waterProgress = {
      mealWater: (waterInfo.mealWater * 100 / (waterInfo.cleanWater + waterInfo.mealWater)) * 100 / 20,
      cleanWater: (waterInfo.cleanWater * 100 / (waterInfo.cleanWater + waterInfo.mealWater)) * 100 / 80
    }
    // console.log('waterProgress', waterProgress)
    setWaterInfoProgress(waterProgress);
  }

  return (
    !Object.values(microPercent ?? []).length > 0 &&
      !Object.values(aminoacids ?? []).length > 0 &&
      !Object.values(fattyacids ?? []).length > 0 &&
      !Object.values(saccharides ?? []).length > 0 &&
      !Object.values(waterInfo ?? []).length > 0
      ? <Text style={s.noInfo2}>{strings.noAdditionInfo}</Text>
      : <>
        <ButtonsGroup
          buttonHeight={buttonsHeight ? buttonsHeight : 30}
          buttons={buttons || [strings.microShort, strings.aminoShort, strings.fattyShort, strings.sacchShort]}
          selectedIndex={index}
          selectedColor='#f2f4f7'
          selectedTextColor='#4f6488'
          style={s.nutritionValue}
          onPress={(index) => props.onPress(index)}
        />
        <View style={s.box}>
          {index === 0
            ? microPercent
              ? <View style={s.micronutrientsBox}>
                <View style={s.column}>
                  <View style={s.progressBarBox}>
                    <Text style={s.progressName}>C</Text>
                    <ProgressBar
                      maxColor='darkorange'
                      style={s.progressBar}
                      progress={microPercent.vit_c}
                    />
                    <Text style={s.progressValue}>{microPercent.vit_c ? `${microPercent.vit_c}%` : '-'}</Text>
                  </View>
                  <View style={s.progressBarBox}>
                    <Text style={s.progressName}>B1</Text>
                    <ProgressBar
                      maxColor='darkorange'
                      style={s.progressBar}
                      progress={microPercent.vit_b1}
                    />
                    <Text style={s.progressValue}>{microPercent.vit_b1 ? `${microPercent.vit_b1}%` : '-'}</Text>
                  </View>
                  <View style={s.progressBarBox}>
                    <Text style={s.progressName}>B2</Text>
                    <ProgressBar
                      maxColor='darkorange'
                      style={s.progressBar}
                      progress={microPercent.vit_b2}
                    />
                    <Text style={s.progressValue}>{microPercent.vit_b2 ? `${microPercent.vit_b2}%` : '-'}</Text>
                  </View>
                  <View style={s.progressBarBox}>
                    <Text style={s.progressName}>B4</Text>
                    <ProgressBar
                      maxColor='darkorange'
                      style={s.progressBar}
                      progress={microPercent.vit_b4}
                    />
                    <Text style={s.progressValue}>{microPercent.vit_b4 ? `${microPercent.vit_b4}%` : '-'}</Text>
                  </View>
                  <View style={s.progressBarBox}>
                    <Text style={s.progressName}>B5</Text>
                    <ProgressBar
                      maxColor='darkorange'
                      style={s.progressBar}
                      progress={microPercent.vit_b5}
                    />
                    <Text style={s.progressValue}>{microPercent.vit_b5 ? `${microPercent.vit_b5}%` : '-'}</Text>
                  </View>
                  <View style={s.progressBarBox}>
                    <Text style={s.progressName}>B6</Text>
                    <ProgressBar
                      maxColor='darkorange'
                      style={s.progressBar}
                      progress={microPercent.vit_b6}
                    />
                    <Text style={s.progressValue}>{microPercent.vit_b6 ? `${microPercent.vit_b6}%` : '-'}</Text>
                  </View>
                  <View style={s.progressBarBox}>
                    <Text style={s.progressName}>B9</Text>
                    <ProgressBar
                      maxColor='darkorange'
                      style={s.progressBar}
                      progress={microPercent.vit_b9}
                    />
                    <Text style={s.progressValue}>{microPercent.vit_b9 ? `${microPercent.vit_b9}%` : '-'}</Text>
                  </View>
                  <View style={s.progressBarBox}>
                    <Text style={s.progressName}>B12</Text>
                    <ProgressBar
                      maxColor='darkorange'
                      style={s.progressBar}
                      progress={microPercent.vit_b12}
                    />
                    <Text style={s.progressValue}>{microPercent.vit_b12 ? `${microPercent.vit_b12}%` : '-'}</Text>
                  </View>
                  <View style={s.progressBarBox}>
                    <Text style={s.progressName}>PP</Text>
                    <ProgressBar
                      maxColor='darkorange'
                      style={s.progressBar}
                      progress={microPercent.vit_pp}
                    />
                    <Text style={s.progressValue}>{microPercent.vit_pp ? `${microPercent.vit_pp}%` : '-'}</Text>
                  </View>
                  <View style={s.progressBarBox}>
                    <Text style={s.progressName}>H</Text>
                    <ProgressBar
                      maxColor='darkorange'
                      style={s.progressBar}
                      progress={microPercent.vit_h}
                    />
                    <Text style={s.progressValue}>{microPercent.vit_h ? `${microPercent.vit_h}%` : '-'}</Text>
                  </View>
                  <View style={s.progressBarBox}>
                    <Text style={s.progressName}>A</Text>
                    <ProgressBar
                      maxColor='darkorange'
                      style={s.progressBar}
                      progress={microPercent.vit_a}
                    />
                    <Text style={s.progressValue}>{microPercent.vit_a ? `${microPercent.vit_a}%` : '-'}</Text>
                  </View>
                  <View style={s.progressBarBox}>
                    <Text style={s.progressName}>Кар.</Text>
                    <ProgressBar
                      maxColor='darkorange'
                      style={s.progressBar}
                      progress={microPercent.beta_carotene}
                    />
                    <Text style={s.progressValue}>{microPercent.beta_carotene ? `${microPercent.beta_carotene}%` : '-'}</Text>
                  </View>
                  <View style={s.progressBarBox}>
                    <Text style={s.progressName}>E</Text>
                    <ProgressBar
                      maxColor='darkorange'
                      style={s.progressBar}
                      progress={microPercent.vit_e}
                    />
                    <Text style={s.progressValue}>{microPercent.vit_e ? `${microPercent.vit_e}%` : '-'}</Text>
                  </View>
                  <View style={s.progressBarBox}>
                    <Text style={s.progressName}>D</Text>
                    <ProgressBar
                      maxColor='darkorange'
                      style={s.progressBar}
                      progress={microPercent.vit_d}
                    />
                    <Text style={s.progressValue}>{microPercent.vit_d ? `${microPercent.vit_d}%` : '-'}</Text>
                  </View>
                  <View style={s.progressBarBox}>
                    <Text style={s.progressName}>K</Text>
                    <ProgressBar
                      maxColor='darkorange'
                      style={s.progressBar}
                      progress={microPercent.vit_k}
                    />
                    <Text style={s.progressValue}>{microPercent.vit_k ? `${microPercent.vit_k}%` : '-'}</Text>
                  </View>
                </View>
                <View style={s.column}>
                  <View style={s.progressBarBox}>
                    <Text style={s.progressName}>Ca</Text>
                    <ProgressBar
                      maxColor='darkorange'
                      style={s.progressBar}
                      progress={microPercent.min_ca}
                    />
                    <Text style={s.progressValue}>{microPercent.min_ca ? `${microPercent.min_ca}%` : '-'}</Text>
                  </View>
                  <View style={s.progressBarBox}>
                    <Text style={s.progressName}>P</Text>
                    <ProgressBar
                      maxColor='darkorange'
                      style={s.progressBar}
                      progress={microPercent.min_p}
                    />
                    <Text style={s.progressValue}>{microPercent.min_p ? `${microPercent.min_p}%` : '-'}</Text>
                  </View>
                  <View style={s.progressBarBox}>
                    <Text style={s.progressName}>Mg</Text>
                    <ProgressBar
                      maxColor='darkorange'
                      style={s.progressBar}
                      progress={microPercent.min_mg}
                    />
                    <Text style={s.progressValue}>{microPercent.min_mg ? `${microPercent.min_mg}%` : '-'}</Text>
                  </View>
                  <View style={s.progressBarBox}>
                    <Text style={s.progressName}>K</Text>
                    <ProgressBar
                      maxColor='darkorange'
                      style={s.progressBar}
                      progress={microPercent.min_k}
                    />
                    <Text style={s.progressValue}>{microPercent.min_k ? `${microPercent.min_k}%` : '-'}</Text>
                  </View>
                  <View style={s.progressBarBox}>
                    <Text style={s.progressName}>Na</Text>
                    <ProgressBar
                      maxColor='darkorange'
                      style={s.progressBar}
                      progress={microPercent.min_na}
                    />
                    <Text style={s.progressValue}>{microPercent.min_na ? `${microPercent.min_na}%` : '-'}</Text>
                  </View>
                  <View style={s.progressBarBox}>
                    <Text style={s.progressName}>Cl</Text>
                    <ProgressBar
                      maxColor='darkorange'
                      style={s.progressBar}
                      progress={microPercent.min_cl}
                    />
                    <Text style={s.progressValue}>{microPercent.min_cl ? `${microPercent.min_cl}%` : '-'}</Text>
                  </View>
                  <View style={s.progressBarBox}>
                    <Text style={s.progressName}>Fe</Text>
                    <ProgressBar
                      maxColor='darkorange'
                      style={s.progressBar}
                      progress={microPercent.min_fe}
                    />
                    <Text style={s.progressValue}>{microPercent.min_fe ? `${microPercent.min_fe}%` : '-'}</Text>
                  </View>
                  <View style={s.progressBarBox}>
                    <Text style={s.progressName}>Zn</Text>
                    <ProgressBar
                      maxColor='darkorange'
                      style={s.progressBar}
                      progress={microPercent.min_zn}
                    />
                    <Text style={s.progressValue}>{microPercent.min_zn ? `${microPercent.min_zn}%` : '-'}</Text>
                  </View>
                  <View style={s.progressBarBox}>
                    <Text style={s.progressName}>I</Text>
                    <ProgressBar
                      maxColor='darkorange'
                      style={s.progressBar}
                      progress={microPercent.min_i}
                    />
                    <Text style={s.progressValue}>{microPercent.min_i ? `${microPercent.min_i}%` : '-'}</Text>
                  </View>
                  <View style={s.progressBarBox}>
                    <Text style={s.progressName}>Cu</Text>
                    <ProgressBar
                      maxColor='darkorange'
                      style={s.progressBar}
                      progress={microPercent.min_cu}
                    />
                    <Text style={s.progressValue}>{microPercent.min_cu ? `${microPercent.min_cu}%` : '-'}</Text>
                  </View>
                  <View style={s.progressBarBox}>
                    <Text style={s.progressName}>Mn</Text>
                    <ProgressBar
                      maxColor='darkorange'
                      style={s.progressBar}
                      progress={microPercent.min_mn}
                    />
                    <Text style={s.progressValue}>{microPercent.min_mn ? `${microPercent.min_mn}%` : '-'}</Text>
                  </View>
                  <View style={s.progressBarBox}>
                    <Text style={s.progressName}>Se</Text>
                    <ProgressBar
                      maxColor='darkorange'
                      style={s.progressBar}
                      progress={microPercent.min_se}
                    />
                    <Text style={s.progressValue}>{microPercent.min_se ? `${microPercent.min_se}%` : '-'}</Text>
                  </View>
                  <View style={s.progressBarBox}>
                    <Text style={s.progressName}>Cr</Text>
                    <ProgressBar
                      maxColor='darkorange'
                      style={s.progressBar}
                      progress={microPercent.min_cr}
                    />
                    <Text style={s.progressValue}>{microPercent.min_cr ? `${microPercent.min_cr}%` : '-'}</Text>
                  </View>
                  <View style={s.progressBarBox}>
                    <Text style={s.progressName}>Mo</Text>
                    <ProgressBar
                      maxColor='darkorange'
                      style={s.progressBar}
                      progress={microPercent.min_mo}
                    />
                    <Text style={s.progressValue}>{microPercent.min_mo ? `${microPercent.min_mo}%` : '-'}</Text>
                  </View>
                  <View style={s.progressBarBox}>
                    <Text style={s.progressName}>F</Text>
                    <ProgressBar
                      maxColor='darkorange'
                      style={s.progressBar}
                      progress={microPercent.min_f}
                    />
                    <Text style={s.progressValue}>{microPercent.min_f ? `${microPercent.min_f}%` : '-'}</Text>
                  </View>
                </View>
              </View>
              : <Text style={s.noInfo}>{strings.noMicroData}</Text>
            : null
          }
          {index === 1
            ? aminoacids
              ? <View>
                <View style={s.progressBarBox}>
                  <Text style={s.leftText}>Изолейцин</Text>
                  <ProgressBar
                    style={s.progressBar}
                    progress={aminoProgress?.isoleucine}
                  />
                  <Text style={s.rightText}>{aminoacids?.isoleucine ? `${aminoacids.isoleucine.toFixed(2)} гр` : '-'}</Text>
                </View>
                <View style={s.progressBarBox}>
                  <Text style={s.leftText}>Лейцин</Text>
                  <ProgressBar
                    style={s.progressBar}
                    progress={aminoProgress?.leucine}
                  />
                  <Text style={s.rightText}>{aminoacids.leucine ? `${aminoacids.leucine.toFixed(2)} гр` : '-'}</Text>
                </View>
                <View style={s.progressBarBox}>
                  <Text style={s.leftText}>Валин</Text>
                  <ProgressBar
                    style={s.progressBar}
                    progress={aminoProgress?.valine}
                  />
                  <Text style={s.rightText}>{aminoacids.valine ? `${aminoacids.valine.toFixed(2)} гр` : '-'}</Text>
                </View>
                <View style={s.progressBarBox}>
                  <Text style={s.leftText}>Лизин</Text>
                  <ProgressBar
                    style={s.progressBar}
                    progress={aminoProgress?.lysine}
                  />
                  <Text style={s.rightText}>{aminoacids.lysine ? `${aminoacids.lysine.toFixed(2)} гр` : '-'}</Text>
                </View>
                <View style={s.progressBarBox}>
                  <Text style={s.leftText}>Метионин</Text>
                  <ProgressBar
                    style={s.progressBar}
                    progress={aminoProgress?.methionine}
                  />
                  <Text style={s.rightText}>{aminoacids.methionine ? `${aminoacids.methionine.toFixed(2)} гр` : '-'}</Text>
                </View>
                <View style={s.progressBarBox}>
                  <Text style={s.leftText}>Фенилаланин</Text>
                  <ProgressBar
                    style={s.progressBar}
                    progress={aminoProgress?.phenylalanine}
                  />
                  <Text style={s.rightText}>{aminoacids.phenylalanine ? `${aminoacids.phenylalanine.toFixed(2)} гр` : '-'}</Text>
                </View>
                <View style={s.progressBarBox}>
                  <Text style={s.leftText}>Триптофан</Text>
                  <ProgressBar
                    style={s.progressBar}
                    progress={aminoProgress?.tryptophan}
                  />
                  <Text style={s.rightText}>{aminoacids.tryptophan ? `${aminoacids.tryptophan.toFixed(2)} гр` : '-'}</Text>
                </View>
                <View style={s.progressBarBox}>
                  <Text style={s.leftText}>Треонин</Text>
                  <ProgressBar
                    style={s.progressBar}
                    progress={aminoProgress?.threonine}
                  />
                  <Text style={s.rightText}>{aminoacids.threonine ? `${aminoacids.threonine.toFixed(2)} гр` : '-'}</Text>
                </View>
              </View>
              : <Text style={s.noInfo}>{strings.noAminoData}</Text>
            : null
          }
          {index === 2
            ? fattyacids
              ? <View>
                <View style={s.progressBarBox}>
                  <Text style={s.leftText}>Насыщенные</Text>
                  <ProgressBar
                    style={s.progressBar}
                    progress={fattyProgress?.saturated}
                  />
                  <Text style={s.rightText}>{fattyacids.saturated ? `${fattyacids.saturated.toFixed(2)} гр` : '-'}</Text>
                </View>
                <View style={s.progressBarBox}>
                  <Text style={s.leftText}>Мононенасыщ.</Text>
                  <ProgressBar
                    style={s.progressBar}
                    progress={fattyProgress?.monounsaturated}
                  />
                  <Text style={s.rightText}>{fattyacids.monounsaturated ? `${fattyacids.monounsaturated.toFixed(2)} гр` : '-'}</Text>
                </View>
                <View style={s.progressBarBox}>
                  <Text style={s.leftText}>Полиненасыщ.</Text>
                  <ProgressBar
                    style={s.progressBar}
                    progress={fattyProgress?.polyunsaturated}
                  />
                  <Text style={s.rightText}>{fattyacids.polyunsaturated ? `${fattyacids.polyunsaturated.toFixed(2)} гр` : '-'}</Text>
                </View>
                <View style={s.progressBarBox}>
                  <Text style={s.leftText}>Омега-3</Text>
                  <ProgressBar
                    style={s.progressBar}
                    progress={fattyProgress?.omega3}
                  />
                  <Text style={s.rightText}>{fattyacids.omega3 ? `${fattyacids.omega3.toFixed(2)} гр` : '-'}</Text>
                </View>
                <View style={s.progressBarBox}>
                  <Text style={s.leftText}>Омега-6</Text>
                  <ProgressBar
                    style={s.progressBar}
                    progress={fattyProgress?.omega6}
                  />
                  <Text style={s.rightText}>{fattyacids.omega6 ? `${fattyacids.omega6.toFixed(2)} гр` : '-'}</Text>
                </View>
                <View style={s.progressBarBox}>
                  <Text style={s.leftText}>Трансжиры</Text>
                  <ProgressBar
                    maxColor
                    style={s.progressBar}
                    progress={fattyProgress?.transfats}
                  />
                  <Text style={s.rightText}>{fattyacids.transfats ? `${fattyacids.transfats.toFixed(2)} гр` : '-'}</Text>
                </View>
                <View style={s.progressBarBox}>
                  <Text style={s.leftText}>Холестерин</Text>
                  <ProgressBar
                    style={s.progressBar}
                    progress={fattyProgress?.cholesterol}
                  />
                  <Text style={s.rightText}>{fattyacids.cholesterol ? `${Math.round(fattyacids.cholesterol)} мг` : '-'}</Text>
                </View>
              </View>
              : <Text style={s.noInfo}>{strings.noFattyData}</Text>
            : null
          }
          {index === 3
            ? saccharides
              ? <View>
                <View style={s.progressBarBox}>
                  <Text style={s.leftText}>Простые сахара</Text>
                  <ProgressBar
                    style={s.progressBar}
                    progress={saccharidesProgress?.monosaccharides}
                  />
                  <Text style={s.rightText}>{saccharides.monosaccharides ? `${saccharides.monosaccharides.toFixed(1)} гр` : '-'}</Text>
                </View>
                <View style={s.progressBarBox}>
                  <Text style={s.leftText}>Полисахариды</Text>
                  <ProgressBar
                    style={s.progressBar}
                    progress={saccharidesProgress?.polysaccharides}
                  />
                  <Text style={s.rightText}>{saccharides.polysaccharides ? `${saccharides.polysaccharides.toFixed(1)} гр` : '-'}</Text>
                </View>
                <View style={s.progressBarBox}>
                  <Text style={s.leftText}>Клетчатка</Text>
                  <ProgressBar
                    style={s.progressBar}
                    progress={saccharidesProgress?.fibers}
                  />
                  <Text style={s.rightText}>{saccharides.fibers ? `${saccharides.fibers.toFixed(1)} гр` : '-'}</Text>
                </View>
              </View>
              : <Text style={s.noInfo}>{strings.noSacchData}</Text>
            : null
          }
          {index === 4
            ? waterInfo
              ? <View>
                <View style={s.progressBarBox}>
                  <Text style={s.leftText}>Из нутриентов</Text>
                  <ProgressBar
                    style={s.progressBar}
                    progress={waterInfoProgress?.mealWater}
                  />
                  <Text style={s.rightText}>{waterInfo.mealWater ? `${waterInfo.mealWater.toFixed(0)} мл` : '-'}</Text>
                </View>
                <View style={s.progressBarBox}>
                  <Text style={s.leftText}>Чистая</Text>
                  <ProgressBar
                    style={s.progressBar}
                    progress={waterInfoProgress?.cleanWater}
                  />
                  <Text style={s.rightText}>{waterInfo.cleanWater ? `${waterInfo.cleanWater.toFixed(0)} мл` : '-'}</Text>
                </View>
              </View>
              : <Text style={s.noInfo}>{strings.noWaterData}</Text>
            : null
          }
        </View>
      </>
  )
}

const s = StyleSheet.create({
  nutritionValue: {
    color: '#9da1a7',
    fontSize: 12,
  },
  micronutrientsBox: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  noInfo: {
    fontSize: 13,
    color: '#9da1a7',
    textAlign: 'center',
    padding: 5,
  },
  noInfo2: {
    fontSize: 13,
    color: '#9da1a7',
    textAlign: 'center',
    padding: 5,
    marginBottom: 10
  },
  column: {
    width: '48%'
  },
  progressBarBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressName: {
    flex: 2,
    fontSize: 13,
  },
  progressBar: {
    flex: 6,
  },
  progressValue: {
    flex: 3,
    textAlign: 'center',
    fontSize: 13,
  },
  leftText: {
    width: 130,
    fontSize: 13,
  },
  rightText: {
    width: 80,
    textAlign: 'right',
    fontSize: 13,
  },
  box: {
    marginVertical: 10
  }
});