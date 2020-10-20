import firebaseApp from '@react-native-firebase/app';

export const showFoodModal = () => ({
  type: 'SHOW_FOOD_MODAL'
})

export const hideFoodModal = () => ({
  type: 'HIDE_FOOD_MODAL'
})

export const setLoading = loading => ({
  type: 'SET_FOOD_LOADING',
  loading: loading
})

export const setMealInfo = data => ({
  type: 'SET_FOOD_MEAL_INFO',
  data: data
})

export const setNutrientInfo = data => ({
  type: 'SET_NUTRIENT_INFO',
  data: data
})

export const setFoodDailyInfo = data => ({
  type: 'SET_FOOD_DAILY_INFO',
  data: data
})

export const setWaterInfo = data => ({
  type: 'SET_WATER_INFO',
  waterInfo: {
    mealKey: data.mealKey,
    prevAmount: data.amount,
    date: data.date
  }
})

export const setMealTimeInfo = timeInfo => ({
  type: 'SET_MEAL_TIME_INFO',
  timeInfo: timeInfo
})

export const setNutrientsFilter = (filters, isOverwrite) => ({
  type: 'SET_NUTRIENTS_FILTER',
  filters,
  isOverwrite
})

export const setIngredientsFilter = (filters, isOverwrite) => ({
  type: 'SET_INGREDIENTS_FILTER',
  filters,
  isOverwrite
})

export const clearFilters = filterType => ({
  type: 'CLEAR_FILTERS',
  filterType
})

export const clearNutrients = () => ({
  type: 'CLEAR_NUTRIENTS'
})

export const clearIngredients = () => ({
  type: 'CLEAR_INGREDIENTS'
})

export const setEditInfo = data => ({
  type: 'EDIT_INFO',
  data: data
})

export const setDishIngredients = (data, isOverwrite) => {
  return (dispatch, getState) => {
    dispatch({
      type: 'SET_DISH_INGREDIENTS',
      data: data,
      isOverwrite: isOverwrite
    });
  }
}

export const addMeal = (date, mealKey, nutrient) => {
  return (dispatch, getState, getFirebase) => {
    const userId = getState().firebase.auth.uid;
    const firestore = getFirebase().firestore();

    firestore
      .collection(`meals/${userId}/food`)
      .doc(date)
      .set({
        [mealKey]: {
          accepted: false,
          nutrients: {
            '1': {
              ...nutrient,
            }
          }
        }
      }, { merge: true })
      .then(() => {
        dispatch({ type: 'ADD_MEAL', mealKey, date, nutrient });
      })
      .catch((error) => {
        dispatch({ type: 'ADD_MEAL_ERROR', error });
      })
  }
}

export const removeMeal = (date, mealKey, mealCount) => {
  return (dispatch, getState, getFirebase) => {
    const userId = getState().firebase.auth.uid;
    let query = getFirebase().firestore()
      .collection(`meals/${userId}/food`)
      .doc(date);

    mealCount === 1
      ? query = query.delete()
      : query = query.set({
        [mealKey]: firebaseApp.firestore.FieldValue.delete()
      }, { merge: true })

    query = query
      .then(() => {
        dispatch({ type: 'REMOVE_MEAL', mealKey });
      })
      .catch((error) => {
        dispatch({ type: 'REMOVE_MEAL_ERROR', error });
      })
  }
}

export const addMealNutrient = (date, mealKey, nutrient, number) => {
  return (dispatch, getState, getFirebase) => {
    const userId = getState().firebase.auth.uid;

    getFirebase().firestore()
      .collection(`meals/${userId}/food`)
      .doc(date)
      .set({
        [mealKey]: {
          nutrients: {
            [number]: {
              ...nutrient,
            }
          }
        }
      }, { merge: true })
      .then(() => {
        dispatch({ type: 'ADD_MEAL_NUTRIENT', date, mealKey, nutrient, number });
      })
      .catch((error) => {
        dispatch({ type: 'ADD_MEAL_NUTRIENT_ERROR', error });
      })
  }
}

export const updateMealNutrient = nutrientInfo => {
  return (dispatch, getState, getFirebase) => {
    const userId = getState().firebase.auth.uid;
    getFirebase().firestore()
      .collection(`meals/${userId}/food`)
      .doc(nutrientInfo.date)
      .set({
        [nutrientInfo.mealKey]: {
          nutrients: {
            [nutrientInfo.nutrientKey]: {
              calculated: nutrientInfo.data.calculated
            }
          }
        }
      }, { merge: true })
      .then(() => {
        dispatch({ type: 'UPDATE_MEAL_NUTRIENT', data: nutrientInfo });
      })
      .catch((error) => {
        dispatch({ type: 'UPDATE_MEAL_NUTRIENT_ERROR', error });
      })
  }
}

export const removeMealNutrient = data => {
  return (dispatch, getState, getFirebase) => {
    const userId = getState().firebase.auth.uid;
    getFirebase().firestore()
      .collection(`meals/${userId}/food`)
      .doc(data.date)
      .set({
        [data.mealKey]: {
          nutrients: {
            [data.nutrientKey]: firebaseApp.firestore.FieldValue.delete()
          }
        }
      }, { merge: true })
      .then(() => {
        dispatch({ type: 'REMOVE_MEAL_NUTRIENT', ...data });
      })
      .catch((error) => {
        dispatch({ type: 'REMOVE_MEAL_NUTRIENT_ERROR', error });
      })
  }
}

export const addWater = (date, mealKey) => {
  return (dispatch, getState, getFirebase) => {
    const userId = getState().firebase.auth.uid;
    getFirebase().firestore()
      .collection(`meals/${userId}/water`)
      .doc(date)
      .set({
        [mealKey]: {
          accepted: false,
          amount: 200
        }
      }, { merge: true })
      .then(() => {
        dispatch({ type: 'ADD_WATER', date });
      })
      .catch((error) => {
        dispatch({ type: 'ADD_WATER_ERROR', error });
      })
  }
}

export const updateWater = data => {
  return (dispatch, getState, getFirebase) => {
    const userId = getState().firebase.auth.uid;
    getFirebase().firestore()
      .collection(`meals/${userId}/water`)
      .doc(data.date)
      .set({
        [data.mealKey]: {
          amount: data.amount
        }
      }, { merge: true })
      .then(() => {
        dispatch({ type: 'UPDATE_WATER', ...data });
      })
      .catch((error) => {
        dispatch({ type: 'UPDATE_WATER_ERROR', error });
      })
  }
}

export const removeWater = (date, mealKey, waterCount) => {
  return (dispatch, getState, getFirebase) => {
    const userId = getState().firebase.auth.uid;
    let query = getFirebase().firestore()
      .collection(`meals/${userId}/water`)
      .doc(date);

    waterCount === 1
      ? query = query.delete()
      : query = query.set({
        [mealKey]: firebaseApp.firestore.FieldValue.delete()
      }, { merge: true })

    query = query
      .then(() => {
        dispatch({ type: 'REMOVE_WATER', mealKey });
      })
      .catch((error) => {
        dispatch({ type: 'REMOVE_WATER_ERROR', error });
      })
  }
}

export const updateMealTime = data => {
  return (dispatch, getState, getFirebase) => {
    const userId = getState().firebase.auth.uid;
    const timeValue = data.time
      ? data.time
      : firebaseApp.firestore.FieldValue.delete();

    const alarmIdValue = data.time
      ? data.alarmId
      : firebaseApp.firestore.FieldValue.delete()

    getFirebase().firestore()
      .collection(`meals/${userId}/${data.type}`)
      .doc(data.date)
      .set({
        [data.mealKey]: {
          time: timeValue,
          alarmId: alarmIdValue
        }
      }, { merge: true })
      .then(() => {
        dispatch({ type: 'UPDATE_MEAL_TIME', data });
      })
      .catch((error) => {
        dispatch({ type: 'UPDATE_MEAL_TIME_ERROR', error });
      })
  }
}

export const acceptMeal = data => {
  return (dispatch, getState, getFirebase) => {
    const userId = getState().firebase.auth.uid;
    getFirebase().firestore()
      .collection(`meals/${userId}/${data.type}`)
      .doc(data.date)
      .set({
        [data.mealKey]: {
          accepted: data.accepted
        }
      }, { merge: true })
      .then(() => {
        dispatch({ type: 'ACCEPT_MEAL', accepted: data.accepted });
      })
      .catch((error) => {
        dispatch({ type: 'ACCEPT_MEAL_ERROR', error });
      })
  }
}

export const getNutrients = (filters, startAfter) => {
  return (dispatch, getState, getFirebase) => {
    let query = getFirebase().firestore().collection('nutrients');
    const owerwrite = startAfter === 'first' ? true : false;
    const itemsPerPage = getState().food.itemsPerPage;

    if (getState().food.loading) return;

    if (startAfter) {
      dispatch({ type: 'SET_FOOD_LOADING', loading: true });
    } else {
      console.log('End of list');
      dispatch({ type: 'SET_FOOD_LOADING', loading: false });
      return;
    }

    startAfter !== 'first' && (
      query = query.startAfter(startAfter)
    )

    filters?.owner
      ? query = query.where('owner', '==', filters.owner)
      : query = query.where('isShow', '==', true)

    if (filters?.name) {
      query = query
        .where('name', '>=', filters.name)
        .where('name', '<=', `${filters.name}\u{f8ff}`)
        .orderBy('name', 'desc');

      query
        .limit(itemsPerPage)
        .get()
        .then(docSnapshots => {
          let nutrients = docSnapshots.docs.map(doc => ({ infoKey: doc.id, ...doc.data() }))
          if (!nutrients.length)
            dispatch({ type: 'GET_NUTRIENTS', nutrients, owerwrite });

          filters?.species && (
            nutrients = nutrients.filter(nutrient => {
              return filters.species === nutrient.species
            }))
          filters?.type && (
            nutrients = nutrients.filter(nutrient => {
              return nutrient.type[filters.type] === true
            }))
          filters?.vitamins && (
            nutrients = nutrients.filter(nutrient => {
              return Object.values(filters.vitamins).every(vit => {
                return nutrient.filter[`vit_${vit.toLowerCase()}`];
              })
            }))
          filters?.minerals && (
            nutrients = nutrients.filter(nutrient => {
              return Object.values(filters.minerals).every(min => {
                return nutrient.filter[`min_${min.toLowerCase()}`];
              })
            }))

          dispatch({ type: 'GET_NUTRIENTS', nutrients, owerwrite });
        })
        .catch(function (error) {
          dispatch({ type: 'GET_NUTRIENTS_ERROR', error });
        });
      return;
    }

    filters?.species && (
      query = query.where('species', '==', filters.species)
    )
    filters?.type && (
      query = query.where(`type.${filters.type}`, '==', true)
    )
    filters?.vitamins?.map(vit => {
      query = query.where(`filter.vit_${vit.toLowerCase()}`, '==', true)
    })
    filters?.minerals?.map(min => {
      query = query.where(`filter.min_${min.toLowerCase()}`, '==', true);
    })

    query
      .limit(itemsPerPage)
      .get()
      .then(docSnapshots => {
        const lastNutrient = docSnapshots.docs[docSnapshots.docs.length - 1];
        const nutrients = docSnapshots.docs.map(doc => ({ infoKey: doc.id, ...doc.data() }))
        dispatch({ type: 'GET_NUTRIENTS', nutrients, lastNutrient, owerwrite });
      })
      .catch(function (error) {
        dispatch({ type: 'GET_NUTRIENTS_ERROR', error });
      });
  }
}

export const createProduct = data => {
  return (dispatch, getState, getFirebase) => {
    const userId = getState().firebase.auth.uid;
    const filter = Object.keys(data.micronutrients || [])
      ?.reduce((total, name) => total = { ...total, [name]: true }, {});

    getFirebase().firestore()
      .collection('nutrients')
      .add({
        ...data,
        species: 'product',
        owner: userId,
        isShow: false,
        created: firebaseApp.firestore.FieldValue.serverTimestamp(),
        ...(data.micronutrients) && { filter }
      })
      .then((doc) => {
        dispatch({
          type: 'CREATE_PRODUCT',
          product: { species: 'product', infoKey: doc.id, ...data }
        });
      })
      .catch((error) => {
        dispatch({ type: 'CREATE_PRODUCT_ERROR', error });
      })
  }
}

export const updateProduct = (docId, data) => {
  return (dispatch, getState, getFirebase) => {
    const userId = getState().firebase.auth.uid;
    const filter = Object.keys(data.micronutrients || [])
      ?.reduce((total, name) => total = { ...total, [name]: true }, {});

    const product = {
      ...data,
      species: 'product',
      owner: userId,
      isShow: false,
      updated: firebaseApp.firestore.FieldValue.serverTimestamp(),
      ...(data.micronutrients) && { filter }
    }
    getFirebase().firestore()
      .collection('nutrients')
      .doc(docId)
      .set(product)
      .then(() => {
        dispatch({ type: 'UPDATE_PRODUCT', product: { infoKey: docId, ...product } });
      })
      .catch((error) => {
        dispatch({ type: 'UPDATE_PRODUCT_ERROR', error });
      })
  }
}

export const createDish = data => {
  return (dispatch, getState, getFirebase) => {
    const userId = getState().firebase.auth.uid;
    const filter = Object.keys(data.micronutrients || [])
      ?.reduce((total, name) => total = { ...total, [name]: true }, {});

    getFirebase().firestore()
      .collection('nutrients')
      .add({
        ...data,
        species: 'dish',
        owner: userId,
        isShow: false,
        created: firebaseApp.firestore.FieldValue.serverTimestamp(),
        ...(data.micronutrients) && { filter }
      })
      .then((doc) => {
        dispatch({ type: 'CREATE_DISH', data: { infoKey: doc.id, ...data } });
      })
      .catch((error) => {
        dispatch({ type: 'CREATE_DISH_ERROR', error });
      })
  }
}

export const updateDish = (docId, data) => {
  return (dispatch, getState, getFirebase) => {
    const userId = getState().firebase.auth.uid;
    const filter = Object.keys(data.micronutrients || [])
      ?.reduce((total, name) => total = { ...total, [name]: true }, {});

    const dish = {
      ...data,
      species: 'dish',
      owner: userId,
      isShow: false,
      updated: firebaseApp.firestore.FieldValue.serverTimestamp(),
      ...(data.micronutrients) && { filter }
    }
    getFirebase().firestore()
      .collection('nutrients')
      .doc(docId)
      .set(dish)
      .then(() => {
        dispatch({ type: 'UPDATE_DISH', dish: { infoKey: docId, ...dish } });
      })
      .catch((error) => {
        dispatch({ type: 'UPDATE_DISH_ERROR', error });
      })
  }
}

export const removeNutrient = docId => {
  return (dispatch, getState, getFirebase) => {
    getFirebase().firestore()
      .collection('nutrients')
      .doc(docId)
      .delete()
      .then(() => {
        dispatch({ type: 'REMOVE_NUTRIENT', docId });
      })
      .catch((error) => {
        dispatch({ type: 'REMOVE_NUTRIENT_ERROR', error });
      })
  }
}