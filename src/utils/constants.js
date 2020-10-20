import { upperCaseFirst } from '../utils/stringFormat';
import { strings } from './localization';

export const aminoInGramm = {
  isoleucine: 0.04,
  leucine: 0.07,
  valine: 0.05,
  lysine: 0.055,
  methionine: 0.035,
  phenylalanine: 0.06,
  tryptophan: 0.01,
  threonine: 0.04
}

export const fattyAcidInGramm = {
  saturated: 0.25,
  monounsaturated: 0.25,
  polyunsaturated: 0.25,
  omega3: 0.05,
  omega6: 0.2,
  transfats: 0,
  cholesterol: 0
}

export const saccharidesInGramm = {
  monosaccharides: {
    current: 0.17,
    max: 10
  },
  polysaccharides: {
    current: 0.77,
    max: 70
  },
  fibers: {
    current: 0.06,
    max: 20
  },
}

export const microDailyNorm = {
  vit_c: 90,
  vit_b1: 1.5,
  vit_b2: 1.8,
  vit_b4: 500,
  vit_b5: 5,
  vit_b6: 2,
  vit_b9: 400,
  vit_b12: 3,
  vit_pp: 20,
  vit_h: 50,
  vit_a: 900,
  beta_carotene: 5,
  vit_e: 15,
  vit_d: 10,
  vit_k: 120,
  min_ca: 1000,
  min_p: 800,
  min_mg: 400,
  min_k: 2500,
  min_na: 1300,
  min_cl: 2300,
  min_fe: 10,
  min_zn: 12,
  min_i: 150,
  min_cu: 1,
  min_mn: 2,
  min_se: 70,
  min_cr: 50,
  min_mo: 70,
  min_f: 4,
}

export const macroLoses = {
  proteins: 0.94,
  fats: 0.88,
  carbs: 0.91,
  calories: 0.9,
  water: 0.8
}

export const microLoses = {
  vit_c: 0.4,
  vit_b1: 0.72,
  vit_b2: 0.8,
  vit_b4: 1,
  vit_b5: 0.7,
  vit_b6: 0.9,
  vit_b9: 0.3,
  vit_b12: 0.85,
  vit_pp: 0.8,
  vit_h: 1,
  vit_a: 0.6,
  beta_carotene: 0.8,
  vit_e: 0.95,
  vit_d: 0.95,
  vit_k: 0.95,
  min_ca: 0.88,
  min_p: 0.87,
  min_mg: 0.87,
  min_k: 0.84,
  min_na: 0.75,
  min_cl: 1,
  min_fe: 0.87,
  min_zn: 1,
  min_i: 1,
  min_cu: 1,
  min_mn: 1,
  min_se: 1,
  min_cr: 1,
  min_mo: 1,
  min_f: 1,
}

export const aminoLoses = {
  isoleucine: 0.94,
  leucine: 0.94,
  valine: 0.94,
  lysine: 0.94,
  methionine: 0.94,
  phenylalanine: 0.94,
  tryptophan: 0.94,
  threonine: 0.94,
}

export const fattyLoses = {
  saturated: 0.88,
  monounsaturated: 0.88,
  polyunsaturated: 0.88,
  omega3: 0.88,
  omega6: 0.88,
  transfats: 0.88,
  cholesterol: 0.88,
}

export const saccharideLoses = {
  monosaccharides: 0.91,
  polysaccharides: 0.91,
  fibers: 0.91,
}

export const productCategories = [
  { label: upperCaseFirst(strings.eggs), value: strings.eggs, digestibility: 1 },
  { label: upperCaseFirst(strings.milkProducts), value: strings.milkProducts, digestibility: 1 },
  { label: upperCaseFirst(strings.meat), value: strings.meat, digestibility: 1 },
  { label: upperCaseFirst(strings.seafood), value: strings.seafood, digestibility: 0.95 },
  { label: upperCaseFirst(strings.sausages), value: strings.sausages, digestibility: 0.8 },
  { label: upperCaseFirst(strings.mushrooms), value: strings.mushrooms, digestibility: 0.4 },
  { label: upperCaseFirst(strings.nuts), value: strings.nuts, digestibility: 0.8 },
  { label: upperCaseFirst(strings.fruits), value: strings.fruits, digestibility: 0.8 },
  { label: upperCaseFirst(strings.vegetables), value: strings.vegetables, digestibility: 0.8 },
  { label: upperCaseFirst(strings.cereals), value: strings.cereals, digestibility: 0.8 },
  { label: upperCaseFirst(strings.pasta), value: strings.pasta, digestibility: 0.85 },
  { label: upperCaseFirst(strings.legumes), value: strings.legumes, digestibility: 0.7 },
  { label: upperCaseFirst(strings.spice), value: strings.spice, digestibility: 0.7 },
  { label: upperCaseFirst(strings.breadBakery), value: strings.breadBakery, digestibility: 0.85 },
  { label: upperCaseFirst(strings.confectionery), value: strings.confectionery, digestibility: 0.75 },
  { label: upperCaseFirst(strings.fastfood), value: strings.fastfood, digestibility: 0.8 },
  { label: upperCaseFirst(strings.restaurantFood), value: strings.restaurantFood, digestibility: 0.9 },
  { label: upperCaseFirst(strings.juices), value: strings.juices, digestibility: 0.8 },
  { label: upperCaseFirst(strings.сarbonatedDrinks), value: strings.сarbonatedDrinks, digestibility: 0.7 },
  { label: upperCaseFirst(strings.other), value: strings.other, digestibility: 0.8 }
];

export const dishCategories = [
  { label: upperCaseFirst(strings.first), value: strings.first },
  { label: upperCaseFirst(strings.second), value: strings.second },
  { label: upperCaseFirst(strings.snacks), value: strings.snacks },
  { label: upperCaseFirst(strings.garnishes), value: strings.garnishes },
  { label: upperCaseFirst(strings.porridges), value: strings.porridges },
  { label: upperCaseFirst(strings.salads), value: strings.salads },
  { label: upperCaseFirst(strings.sauces), value: strings.sauces },
  { label: upperCaseFirst(strings.bakery), value: strings.bakery },
  { label: upperCaseFirst(strings.desserts), value: strings.desserts },
  { label: upperCaseFirst(strings.cannedFood), value: strings.cannedFood },
  { label: upperCaseFirst(strings.rolledIntoJar), value: strings.rolledIntoJar },
  { label: upperCaseFirst(strings.jam), value: strings.jam },
  { label: upperCaseFirst(strings.beverages), value: strings.beverages },
  { label: upperCaseFirst(strings.cocktails), value: strings.cocktails },
  { label: upperCaseFirst(strings.semiProducts), value: strings.semiProducts },
  { label: upperCaseFirst(strings.other), value: strings.other }
];

export const heatTreatmentTypes = [
  { label: strings.noHeatTreatment, value: false },
  { label: strings.heatTreatment, value: true },
];


export const days = Array.from(Array(31), (_, m) => (
  { label: `${m + 1}`, value: m + 1 })
);

export const months = [
  { label: strings.janMonth, value: 0 },
  { label: strings.febMonth, value: 1 },
  { label: strings.marMonth, value: 2 },
  { label: strings.aprMonth, value: 3 },
  { label: strings.mayMonth, value: 4 },
  { label: strings.juneMonth, value: 5 },
  { label: strings.julyMonth, value: 6 },
  { label: strings.augMonth, value: 7 },
  { label: strings.septMonth, value: 8 },
  { label: strings.octMonth, value: 9 },
  { label: strings.novMonth, value: 10 },
  { label: strings.decMonth, value: 11 },
];

export const years = Array.from(Array(100), (_, m) => (
  { label: `${new Date().getFullYear() - m - 10}`, value: new Date().getFullYear() - m - 10 })
);

export const sex = [
  { label: strings.male, value: 'male' },
  { label: strings.female, value: 'female' },
];