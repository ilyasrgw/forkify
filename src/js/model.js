import { async } from 'regenerator-runtime';
import {
  API_URL,
  RES_PER_PAGE,
  KEY,
  SPOONACULAR_KEY,
  SPOONACULAR_ENDPOINT,
} from './config';
import { AJAX } from './helpers';

export const state = {
  theme: 'light',
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
  ingredientList: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

const getTotalNutrientAmount = function (ingredientsArr, nutrient) {
  return ingredientsArr
    .map(
      ing =>
        ing.nutrition?.nutrients.find(
          nutr => nutr.name === nutrient[0].toUpperCase() + nutrient.slice(1)
        )?.amount ?? 0
    )
    .reduce((acc, ingNutr) => acc + ingNutr, 0);
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}`);
    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;

    const ingredientList = state.recipe.ingredients
      .map(ing => `${ing.quantity ?? ''} ${ing.unit ?? ''} ${ing.description} `)
      .join('\n');

    if (!ingredientList) {
      throw new Error('ingredientList is empty or not formatted correctly');
    }

    // const ingredientData = await AJAX(
    //   `${SPOONACULAR_ENDPOINT}?apiKey=${SPOONACULAR_KEY}`,
    //   {
    //     ingredientList: ingredientList,
    //     servings: state.recipe.servings,
    //     includeNutrition: true,
    //   },
    //   'application/x-www-form-urlencoded'
    // );

    // console.log(ingredientData);

    const mockIngredientsData = [
      {
        nutrition: {
          nutrients: [
            { name: 'Calories', amount: 150 },
            { name: 'Carbohydrates', amount: 20 },
            { name: 'Protein', amount: 5 },
            { name: 'Fat', amount: 7 },
          ],
        },
      },
      {
        nutrition: {
          nutrients: [
            { name: 'Calories', amount: 100 },
            { name: 'Carbohydrates', amount: 15 },
            { name: 'Protein', amount: 3 },
            { name: 'Fat', amount: 5 },
          ],
        },
      },
      // add more ingredients if needed
    ];

    const calories = getTotalNutrientAmount(mockIngredientsData, 'calories');
    const carbs = getTotalNutrientAmount(mockIngredientsData, 'carbohydrates');
    const proteins = getTotalNutrientAmount(mockIngredientsData, 'protein');
    const fats = getTotalNutrientAmount(mockIngredientsData, 'fat');
    state.recipe.calories = Math.floor(calories / state.recipe.servings);
    state.recipe.carbs = Math.floor(carbs / state.recipe.servings);
    state.recipe.proteins = Math.floor(proteins / state.recipe.servings);
    state.recipe.fats = Math.floor(fats / state.recipe.servings);
    console.log(state.recipe);
  } catch (err) {
    if (err.message.includes('402')) {
      console.error(
        'Payment required: You may need a paid plan or API upgrade.'
      );
    } else {
      console.error('An error occurred:', err.message);
    }
    throw err; // Rethrow error for further handling if needed
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;

    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);

    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    state.search.page = 1;
  } catch (err) {
    console.error(`${err} 🔥🔥🔥🔥`);
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    // newQt = oldQt * newServings / oldServings
  });
  state.recipe.servings = newServings;
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  // Add bookmark
  state.bookmarks.push(recipe);

  // Mark current recipe as bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  persistBookmarks();
};

export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  persistBookmarks();
};

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
// clearBookmarks();

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());
        // const ingArr = ing[1].replaceAll(' ', '').split(',');
        if (ingArr.length !== 3)
          throw new Error('Wrong format! Please use the correct format.');
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: newRecipe.cookingTime,
      servings: newRecipe.servings,
      ingredients,
    };

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);

    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
const persistTheme = function () {
  localStorage.setItem('theme', JSON.stringify(state.theme));
};
export const changeTheme = function (theme) {
  state.theme = theme;
  persistTheme();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
  const themeStorage = localStorage.getItem('theme');
  if (themeStorage) state.theme = JSON.parse(themeStorage);
};
init();
