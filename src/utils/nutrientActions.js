import { productCategories, aminoInGramm, fattyAcidInGramm, saccharidesInGramm } from './constants';

export const calculateMacro = nutrients => {
  if (!nutrients?.length) {
    return;
  }

  return nutrients.reduce((total, nutrient) => {
    const { weight, proteins, fats, carbs, calories, water = 0 } = nutrient;

    return {
      weight: (total.weight || 0) + weight,
      proteins: (total.proteins || 0) + proteins,
      fats: (total.fats || 0) + fats,
      carbs: (total.carbs || 0) + carbs,
      calories: (total.calories || 0) + calories,
      ...(water !== null) && { water: (total.water || 0) + (water || 0) },
    };
  }, {})
}

export const calculateAminoAcids = (nutrients, onlyDigestible) => {
  if (!nutrients || nutrients?.every(n => !n.aminoacids)) {
    return;
  }

  const result = nutrients?.reduce((total, nutrient) => {
    const digestibility = (onlyDigestible && nutrient.species === 'product')
      ? productCategories.find(category => category.value === nutrient.category)?.digestibility
      : 1;

    let aminoacids;
    if (onlyDigestible) {
      aminoacids = nutrient.species === 'product'
        ? nutrient.aminoacids
        : nutrient.digestibleAminoacids;
    }
    else {
      aminoacids = nutrient.aminoacids;
    }
    const aminoKeys = Object.keys(aminoacids ?? []);

    aminoKeys?.forEach(key => {
      total[key] = (total[key] || 0) + (parseFloat((aminoacids[key] * digestibility)?.toFixed(3)) || 0);
    })

    return total;
  }, {});

  return Object.keys(result).length && result;
}

export const calculateFattyAcids = nutrients => {
  if (!nutrients || nutrients?.every(n => !n.fattyacids))
    return;

  const result = nutrients?.reduce((total, nutrient) => {
    const fattyacids = nutrient.fattyacids;
    const fattyKeys = fattyacids && Object.keys(fattyacids);

    fattyKeys?.forEach(key => {
      total[key] = (total[key] || 0) + (parseFloat((fattyacids[key])?.toFixed(3)) || 0);
    })
    return total;
  }, {});

  return Object.keys(result).length && result;
}

export const calculateSaccharides = nutrients => {
  if (!nutrients || nutrients?.every(n => !n.saccharides))
    return;

  const result = nutrients?.reduce((total, nutrient) => {
    const saccharides = nutrient.saccharides;
    const saccharideKeys = saccharides && Object.keys(saccharides);

    saccharideKeys?.forEach(key => {
      total[key] = (total[key] || 0) + (parseFloat((saccharides[key])?.toFixed(3)) || 0);
    })
    return total;
  }, {});

  return Object.keys(result).length && result;
}

export const calculateMicronutrients = nutrients => {
  if (!nutrients || nutrients?.every(n => !n.micronutrients))
    return;

  const result = nutrients?.reduce((total, nutrient) => {
    const micro = nutrient.micronutrients;
    const microKeys = micro && Object.keys(micro);

    microKeys?.forEach(key => {
      total[key] = (total[key] || 0) + (parseFloat(micro[key]?.toFixed(3)) || 0);
    })

    return total;
  }, {});

  return Object.keys(result).length && result;
}

export const calculateProteinsQuality = (proteins, aminoAcids, category) => {
  if (!aminoAcids)
    return;

  const digestibility = category
    ? productCategories.find(cat => cat.value === category)?.digestibility
    : 1;

  let proteinQuality = Object.keys(aminoAcids).reduce((total, key) => {
    const currentValue = aminoAcids[key] * digestibility;
    const currentMaxValue = proteins * aminoInGramm[key];
    const quality = currentValue * 12.5 / currentMaxValue || 0;
    return total + Math.min(quality, 12.5);
  }, 0)

  return parseFloat(proteinQuality.toFixed(3));
};

export const calculateFatsQuality = (fats, fattyAcids) => {
  if (!fattyAcids)
    return;

  let fatQuality = Object.keys(fattyAcids).reduce((total, key) => {
    const currentValue = fattyAcids[key];
    const currentMaxValue = fats * fattyAcidInGramm[key];
    const max = fattyAcidInGramm[key] * 100;
    const quality = currentValue * max / currentMaxValue || 0;
    return total + Math.min(quality, max);
  }, 0)

  fattyAcids.transfats
    ? fatQuality = fatQuality * (1 - (fattyAcids.transfats / 100))
    : fatQuality;

  return parseFloat(fatQuality.toFixed(3));
}

export const calculateCarbsQuality = (carbs, saccharides) => {
  if (!saccharides)
    return;

  let carbQuality = Object.keys(saccharides).reduce((total, key) => {
    const currentValue = saccharides[key];
    const currentMaxValue = carbs * saccharidesInGramm[key].current;
    const max = saccharidesInGramm[key].max;
    const quality = currentValue * max / currentMaxValue || 0;
    return total + Math.min(quality, max);
  }, 0)

  return parseFloat(carbQuality.toFixed(3));
}

export const calculateMicroIndex = micronutrients => {
  if (!micronutrients) return;

  const microTotal = Object.values(micronutrients)
    .reduce((total, value) => {
      return total + value;
    }, 0);

  const microIndex = microTotal * 100 / 10817.3;
  return parseFloat(microIndex.toFixed(3));
}