const initState = {
  loading: false,
  modalVisible: false,
  itemsPerPage: 10,
  nutrients: [],
  ingredients: [],
};

const foodReducer = (state = initState, action) => {
  switch (action.type) {
    case 'SHOW_FOOD_MODAL':
      console.log(action);
      return {
        ...state,
        modalVisible: true
      }

    case 'HIDE_FOOD_MODAL':
      console.log(action);
      return {
        ...state,
        modalVisible: false,
        nutrientInfo: null,
        waterInfo: null,
        timeInfo: null
      }

    case 'SET_FOOD_LOADING':
      console.log(action);
      return {
        ...state,
        loading: action.loading
      }

    case 'SET_FOOD_MEAL_INFO':
      console.log(action);
      return {
        ...state,
        mealInfo: action.data
      }

    case 'SET_NUTRIENT_INFO':
      console.log(action);
      return {
        ...state,
        nutrientInfo: {
          ...state.nutrientInfo,
          ...action.data
        }
      }

    case 'SET_FOOD_DAILY_INFO':
      console.log(action);
      return {
        ...state,
        foodDailyInfo: { ...action.data }
      }

    case 'SET_WATER_INFO':
      console.log(action);
      return {
        ...state,
        waterInfo: action.waterInfo
      }

    case 'SET_MEAL_TIME_INFO':
      console.log(action);
      return {
        ...state,
        timeInfo: action.timeInfo
      }

    case 'SET_NUTRIENTS_FILTER':
      console.log(action);
      return {
        ...state,
        nutrientsFilter: action.isOverwrite
          ? action.filters
          : { ...state.filters, ...action.filters }
      }

    case 'SET_INGREDIENTS_FILTER':
      console.log(action);
      return {
        ...state,
        ingredientsFilter: action.isOverwrite
          ? action.filters
          : { ...state.filters, ...action.filters }
      }

    case 'CLEAR_FILTERS':
      console.log(action);
      return {
        ...state,
        ...(action.filterType === 'nutrients') && { nutrientsFilter: null },
        ...(action.filterType === 'ingredients') && { ingredientsFilter: null },
      }

    case 'CLEAR_NUTRIENTS':
      console.log(action);
      return {
        ...state,
        nutrients: [],
      }

    case 'CLEAR_INGREDIENTS':
      console.log(action);
      return {
        ...state,
        ingredients: [],
      }

    case 'EDIT_INFO':
      console.log(action);
      return {
        ...state,
        editInfo: action.data
      }

    case 'SET_DISH_INGREDIENTS':
      console.log(action);
      return {
        ...state,
        dishIngredients: action.isOverwrite
          ? action.data
          : state.dishIngredients?.concat(action.data) || [action.data]
      }

    case 'ADD_MEAL':
      console.log(action);
      return {
        ...state,
        mealInfo: {
          ...state.mealInfo,
          mealKey: action.mealKey,
          nutrientNumber: 2,
          nutrientsCount: 1,
          existNutrients: state.mealInfo.existNutrients.concat(action.nutrient.infoKey)
        }
      }
    case 'ADD_MEAL_ERROR':
      console.log(action);

    case 'REMOVE_MEAL':
      console.log(action);
      return {
        ...state
      }
    case 'REMOVE_MEAL_ERROR':
      console.log(action);

    case 'ADD_MEAL_NUTRIENT':
      console.log(action);
      return {
        ...state,
        mealInfo: {
          ...state.mealInfo,
          nutrientNumber: action.number + 1,
          nutrientsCount: state.mealInfo.nutrientsCount + 1,
          existNutrients: state.mealInfo.existNutrients.concat(action.nutrient.infoKey)
        }
      };
    case 'ADD_MEAL_NUTRIENT_ERROR':
      console.log(action);

    case 'UPDATE_MEAL_NUTRIENT':
      console.log(action);
      return {
        ...state,
        modalVisible: false,
        nutrientInfo: null
      };
    case 'UPDATE_MEAL_NUTRIENT_ERROR':
      console.log(action);

    case 'REMOVE_MEAL_NUTRIENT':
      console.log(action);
      return {
        ...state,
        modalVisible: false,
        nutrientInfo: null
      };
    case 'REMOVE_MEAL_NUTRIENT_ERROR':
      console.log(action);

    case 'ADD_WATER':
      console.log(action);
      return {
        ...state,
      };
    case 'ADD_WATER_ERROR':
      console.log(action);

    case 'UPDATE_WATER':
      console.log(action);
      return {
        ...state,
        modalVisible: false,
        waterInfo: null
      };
    case 'UPDATE_WATER_ERROR':
      console.log(action);

    case 'REMOVE_WATER':
      console.log(action);
      return {
        ...state
      }
    case 'REMOVE_WATER_ERROR':
      console.log(action);

    case 'UPDATE_MEAL_TIME':
      console.log(action);
      return {
        ...state,
        modalVisible: false,
        timeInfo: null
      };
    case 'UPDATE_MEAL_TIME_ERROR':
      console.log(action);

    case 'ACCEPT_MEAL':
      console.log(action);
      return {
        ...state
      };
    case 'ACCEPT_MEAL_ERROR':
      console.log(action);

    case 'GET_NUTRIENTS':
      const type = state.mealInfo.button === 'addToMeal' ? 'nutrients' : 'ingredients'
      const list = action.owerwrite ? action.nutrients : [...state[type], ...action.nutrients];
      console.log(`Got ${type}:`, list)
      return {
        ...state,
        [type]: list,
        lastNutrient: action.lastNutrient || null,
        lastIngredient: action.lastNutrient || null,
        loading: false
      }

    case 'CREATE_PRODUCT':
      console.log(action);
      return {
        ...state,
        nutrients: [...state.nutrients, action.product] 
      };
    case 'CREATE_PRODUCT_ERROR':
      console.log(action);

    case 'UPDATE_PRODUCT':
      console.log(action);
      return {
        ...state,
        nutrients: [
          action.product,
          ...state.nutrients.filter(n => {
            return n.infoKey !== action.product.infoKey
          })]
      };
    case 'UPDATE_PRODUCT_ERROR':
      console.log(action);

    case 'CREATE_DISH':
      console.log(action);
      return {
        ...state,
        nutrients: [...state.nutrients, action.data] 
      };
    case 'CREATE_DISH_ERROR':
      console.log(action);

    case 'UPDATE_DISH':
      console.log(action);
      return {
        ...state,
        nutrients: [
          action.dish,
          ...state.nutrients.filter(n => {
            return n.infoKey !== action.dish.infoKey
          })]
      };
    case 'UPDATE_DISH_ERROR':
      console.log(action);

    case 'REMOVE_NUTRIENT':
      console.log(action);
      const nutrients = [
        ...state.nutrients.filter(n => n.infoKey !== action.docId)
      ]
      return {
        ...state,
        nutrients,
      }
    case 'REMOVE_NUTRIENT_ERROR':
      console.log(action);

    default:
      return state;
  }
};

export default foodReducer;
