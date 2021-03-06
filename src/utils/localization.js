import LocalizedStrings from 'react-native-localization';

export const strings = new LocalizedStrings({
  ru: {
    //constants.js
    eggs: 'яйца',
    milkProducts: 'молочная продукция',
    meat: 'мясо',
    seafood: 'рыба, морепродукты',
    sausages: 'колбасные изделия',
    mushrooms: 'грибы',
    nuts: 'орехи, семена',
    fruits: 'фрукты, ягоды',
    vegetables: 'овощи',
    cereals: 'крупы',
    pasta: 'макаронные изделия',
    legumes: 'бобовые',
    spice: 'специи',
    breadBakery: 'хлебобулочные изделия',
    confectionery: 'кондитерские изделия',
    fastfood: 'фастфуд',
    restaurantFood: 'ресторанная еда',
    juices: 'соки',
    сarbonatedDrinks: 'газированные напитки',
    other: 'другое',
    first: 'Первые',
    second: 'Вторые',
    snacks: 'Закуски',
    garnishes: 'Гарниры',
    porridges: 'Каши',
    salads: 'Салаты',
    sauces: 'Соусы',
    bakery: 'выпечка',
    desserts: 'десерты',
    cannedFood: 'консервы',
    rolledIntoJar: 'закрутки',
    jam: 'варенье',
    beverages: 'напитки',
    cocktails: 'коктейли',
    semiProducts: 'полуфабрикаты',
    noHeatTreatment: 'Без обработки',
    heatTreatment: 'Тепловая обработка',
    janMonth: 'Январь',
    febMonth: 'Февраль',
    marMonth: 'Март',
    aprMonth: 'Апрель',
    mayMonth: 'Май',
    juneMonth: 'Июнь',
    julyMonth: 'Июль',
    augMonth: 'Август',
    septMonth: 'Сентябрь',
    octMonth: 'Октябрь',
    novMonth: 'Ноябрь',
    decMonth: 'Декабрь',
    male: 'Мужчина',
    female: 'Женщина',
    // dateTimeFormat.js
    sun: 'Вс',
    mon: 'Пн',
    tue: 'Вт',
    wed: 'Ср',
    thu: 'Чт',
    fri: 'Пт',
    sat: 'Сб',
    jan: 'Января',
    feb: 'Февраля',
    mar: 'Марта',
    apr: 'Апреля',
    may: 'Мая',
    june: 'Июня',
    july: 'Июля',
    aug: 'Августа',
    sept: 'Сентября',
    oct: 'Октября',
    nov: 'Ноября',
    dec: 'Декабря',
    //selectPhoto.js
    deleteCurrentPhoto: 'Удалить текущее фото',
    //alerts
    maxIngredients: 'Максимально допустимое количество ингредиентов: 20',
    nutrientExist: 'Данный нутриент уже добавлен',
    cantAddEditableDish: 'Нельзя добавить редактируемое блюдо',
    maxNutrientsInMeal: 'Нельзя добавить больше 10 нутриентов в прием пищи',
    needAddSets: 'Чтобы применить тренировку необходимо добавить подходы всем упражнениям.',
    requireFields: 'Заполните обязательные поля',
    requireFieldsHasRedStar: 'Обязателные поля отмечены красной звездочкой.',
    notAllDataFilled: 'Не все данные заполненны',
    describeRecepie: 'Опишите рецепт в двух словах.',
    needAddIngredients: 'Добавьте ингридиенты.',
    requiredDishFields: 'Убедитесь что вы заполнили:\n- Название (>2 символов).\n- Категория.\n- Обработка.\n- Масса готового блюда (гр).\n- Время приготовления (мин).\n',
    maxMeals: 'Максимальное количество приемов пищи в день: 10',
    maxWater: 'Максимальное количество приемов воды в день: 10',
    requiredProductFields: 'Основное:\n- Название (>2 символов)\n- Категория\n- Белки\n- Жиры\n- Углеводы\n- Калорийность',
    //navigation.js
    goal: 'Цель',
    anthropometry: 'Антропоментрия',
    foodDiary: 'Дневник питания',
    supplementsDiary: 'Дневник добавок',
    trainDiary: 'Дневник тренировок',
    logout: 'Выход',
    //Cardio.js
    slowPace: 'легкий темп',
    avgPace: 'средний темп',
    highPace: 'высокий темп',
    cardio: 'Кардио',
    menuDeclineWorkout: 'Отклонить тренировку',
    menuDeleteWorkout: 'Удалить тренировку',
    cardioFs: '{0} мин, {1}, {2} уд/мин',
    setDurAndPace: 'укажите длительность и темп',
    accept: 'Принять',
    //EditTime.js
    changeMealTime: 'Изменить время приема',
    changeWorkoutTime: 'Изменить время тренировки',
    mealTime: 'Время приема пищи',
    mealTimeText: 'Давай друг, иди кушай, набирайся сил.',
    waterTime: 'Время приема воды',
    waterTimeText: 'Освежись, выпей води.',
    workoutTime: 'Время тренировки',
    workoutTimeText: 'Иди на тренировку и выложись на полную',
    cardioTime: 'Время кардио',
    cardioTimeText: 'Кардио ждет тебя друг мой',
    settedTimeFs: 'установлено {0}',
    notSettedTime: 'не установлено',
    deleteTime: 'Удалить время',
    changeFs: 'Изменить {0}',
    //EditWater.js
    changeWaterAmount: 'Изменить количество воды',
    settedWaterFs: 'Установлено {0} мл',
    changeAmountFs: 'Изменить {0} мл',
    //Meal.js
    menuDeclineMeal: 'Отклонить прием',
    menuDeleteMeal: 'Удалить прием',
    total: 'Итого',
    productDish: 'Продукт/Блюдо',
    //MealNutrient.js
    treatmentMealNutr: ', обработка',
    proteinsAbbrev: 'б',
    fatsAbbrev: 'ж',
    carbsAbbrev: 'у',
    caloriesAbbrev: 'к',
    waterAbbrev: 'в',
    //Nutrient.js
    nutritionValue: 'Пищ. ценность',
    ingridients: 'Ингредиенты',
    recepie: 'Рецепт',
    treatmentIngred: ' (обработка)',
    treatmentLower: 'обработка',
    gramFs: '{0} гр',
    emptyIngredients: 'Список ингредиентов пуст',
    prepareTimeFs: 'Время приготовления: {0} мин',
    stepDotFs: 'Шаг {0}. ',
    noRecepie: 'Рецепт еще не создан',
    addToMeal: 'Добавить в прием',
    added: 'Добавлено',
    addToIngredients: 'Добавить в ингредиенты',
    delete: 'Удалить',
    save: 'Сохранить',
    nutrientNoName: 'Нутриент без имени',
    product: 'Продукт',
    dish: 'Блюдо',
    noCategory: 'без категории',
    categoryFs: '{0}, {1}',
    weightGramm: 'Вес, гр',
    menuEdit: 'Редактировать',
    menuDeleteNutrient: 'Удалить нутриент',
    //NutritionDetails.js
    noAdditionInfo: 'Нет дополнительной информации',
    microShort: 'Микронутр.',
    aminoShort: 'Аминокисл.',
    fattyShort: 'Жир. кисл.',
    sacchShort: 'Сахариды',
    noMicroData: 'Нет данных по микронутриентам',
    noAminoData: 'Нет данных по аминокислотам',
    noFattyData: 'Нет данных по жирным кислотам',
    noSacchData: 'Нет данных по сахаридам',
    noWaterData: 'Нет данных по воде',
    //SearchHeader.js
    search: 'Поиск',
    //Water.js
    water: 'Вода',
    amountFs: '{0} мл',
    //Login.js
    welcome: 'Добро пожаловать',
    tagline: 'Достигайте цели вместе с нами!',
    email: 'Адрес электронной почты',
    password: 'Пароль',
    enter: 'Войти',
    forgot: 'Забыли пароль?',
    fbLogin: 'войти через Facebook',
    noAccount: 'У Вас нет аккаунта?',
    register: 'Зарегистрируйтесь',
    //Register.js
    fastRegister: 'Быстрая регистрация',
    firstName: 'Имя',
    firstNamePh: 'Введите свое имя',
    lastName: 'Фамилия',
    lastNamePh: 'Введите свою фамилию',
    email: 'Электронная почта',
    emailPh: 'Укажите адрес эл. почты',
    password: 'Пароль',
    passwordPh: 'Придумайте пароль (не менее 6 символов)',
    phoneTitle: 'Телефон',
    phonePh: 'Укажите номер телефона (+380..)',
    birthday: 'Дата рождения',
    gender: 'Пол',
    genderPh: 'Укажите пол',
    day: 'День',
    month: 'Месяц',
    year: 'Год',
    registerAndEnter: 'Зарегистрироваться и войти',
    //ResetPassword.js
    recoverPassword: 'Востановление пароля',
    registerEmailPh: 'Адрес эл. почты указанная при регистрации',
    needCheckMail: 'Для дальнейшего шага необходимо будет проверть почту.',
    sendInstructions: 'Отправить инструкции на почту',
    //DailyFoodInfo.js
    totalForDay: 'Итоги за день',
    proteins: 'Белки',
    fats: 'Жиры',
    carbsShort: 'Углев.',
    calories: 'Калории',
    kcalFs: '{0} ккал',
    microInfo: 'Микро.',
    aminoInfo: 'Амино.',
    fattyInfo: 'Жирн. к.',
    sacchInfo: 'Сахар.',
    //Dish.js
    editDish: 'Редактировать блюдо',
    createDish: 'Создать блюдо',
    createProduct: 'Создать продукт',
    chooseDishPhoto: 'Выбрать фото блюда',
    choosePhoto: 'Выбрать фото',
    description: 'Описание',
    dishName: 'Название блюда',
    enterName: 'Введите название',
    category: 'Категория',
    chooseCategoryPh: 'Выберите категорию',
    treatment: 'Обработка',
    notSelectedTreatment: 'Без обработки/тепловая обработка',
    totalWeight: 'Масса готового блюда',
    totalWeightPh: 'Введите массу готового блюда, гр',
    prepareTime: 'Время приготовления',
    prepareTimePh: 'Введите время приготовления, мин',
    addIngredient: 'Добавить ингредиент',
    stepFs: 'Шаг {0}',
    stepDescription: 'Описание шага',
    //FilterNutrients.js
    filterNutrients: 'Фильтр нутриентов',
    species: 'Вид',
    products: 'продукты',
    dishes: 'блюда',
    nutrientType: 'Тип нутриента',
    vitamins: 'Витамины',
    minerals: 'Минералы',
    reset: 'Сбросить',
    proteinType: 'белковые',
    fatType: 'жирные',
    carbType: 'углеводные',
    //Food.js
    noMeals: 'Нет добавленых приемов пищи.',
    noWater: 'Нет добавленых приемов воды.',
    gr: 'гр',
    ml: 'мл',
    kcal: 'ккал',
    carbs: 'Углеводы',
    food: 'Еда',
    mealFs: 'Прием пищи {0}',
    waterFs: 'Прием воды {0}',
    //Nutrients.js
    vitTagFs: 'вит {0}',
    minTagFs: 'мин {0}',
    resetLower: 'сбросить',
    nutrients: 'Нутриенты',
    myNutrients: 'Мои нутриенты',
    noQueryResults: 'По данному запросу ничего не найдено',
    enterNutrientName: 'Введите в строке поиска название нутриента.\n',
    useFilter: 'Или воспользуйтесь фильтром поиска ',
    createNutrient: 'Если нет нужного нутриента, создайте его ',
    //Product.js
    editProduct: 'Редактировать продукт',
    chooseProductPhoto: 'Выбрать фото продукта',
    mainTab: 'Основное',
    productName: 'Название продукта',
    proteinsIn100: 'Белки в 100 гр',
    fatsIn100: 'Жиры в 100 гр',
    carbsIn100: 'Углеводы в 100 гр',
    caloriesIn100: 'Калорийность в 100 гр',
    waterIn100: 'Вода в 100 гр',
    vitaminFs: 'Витамин {0}',
    mineralFs: 'Минерал {0}',
    betaCarotene: 'Бета каротин',
    vitC: 'Аскробиновая кислота',
    vitB1: 'Тиамин',
    vitB2: 'Рыбофлавин',
    vitB4: 'Холин',
    vitB5: 'Пантотеновая кислота',
    vitB6: 'Пиридоксин',
    vitB9: 'Фолацин',
    vitB12: 'Кобаламин',
    vitPP: 'Ниацин',
    vitH: 'Биотин',
    vitA: 'Ретиноловый эквивалент',
    betaCarotene: 'Провитамин А',
    vitE: 'Токоферол',
    vitD: 'Кальциферол',
    vitK: 'Филлохинон',
    minCa: 'Кальций',
    minP: 'Фосфор',
    minMg: 'Магний',
    minK: 'Калий',
    minNa: 'Натрий',
    minCl: 'Хлор',
    minFe: 'Железо',
    minZn: 'Цинк',
    minI: 'Йод',
    minCu: 'Медь',
    minMn: 'Марганец',
    minSe: 'Селен',
    minCr: 'Хром',
    minMo: 'Молибден',
    minF: 'Фтор',
    isoleucine: 'Изолейцин',
    leucine: 'Лейцин',
    valine: 'Валин',
    lysine: 'Лизин',
    methionine: 'Метионин',
    phenylalanine: 'Фенилаланин',
    tryptophan: 'Триптофан',
    threonine: 'Треонин',
    gramCommaFs: '{0}, гр',
    mgCommaFs: '{0}, мг',
    mcgCommaFs: '{0}, мкг',
    saturated: 'Насыщенные',
    monounsaturated: 'Мононенасыщенные',
    polyunsaturated: 'Полиненасыщенные',
    omega3: 'Омега-3',
    omega6: 'Омега-6',
    transfats: 'Трансжиры',
    cholesterol: 'Холестерин',
    monosaccharides: 'Простые сахара',
    polysaccharides: 'Полисахариды',
    fibers: 'Клетчатка',
  },
  en: {
    //navigation.js
    goal: 'Goal',
    anthropometry: 'Anthropometry',
    foodDiary: 'Food diary',
    supplementsDiary: 'Supplements diary',
    trainDiary: 'Train diary',
    logout: 'Logout',
  }
});