import {async} from 'regenerator-runtime';
import { API_URL,RES_PER_PAGE } from './config';
import { getJSON } from './helpers';

export const state ={
    recipe:{},
    search:{
        query:'',
        results:[],
        page:1,
        resultPerPage:RES_PER_PAGE,
    },
    bookmarks:[],
};
// console.log(state);
export const loadRecipe = async function(id){
    try{
       const data = await getJSON(`${API_URL}${id}`); // Ndryshimi i rrugës së kërkesës nga `${API_URL}/:${id}` në `${API_URL}/${id}`
        let { recipe } = data.data
        state.recipe = {
          id: recipe.id,
          title: recipe.title,
          publisher: recipe.publisher,
          sourceUrl: recipe.source_url,
          image: recipe.image_url,
          servings: recipe.servings,
          cookingTime: recipe.cooking_time,
          ingredients: recipe.ingredients,
        }

        if(state.bookmarks.some(bookmark=>bookmark.id === id))
            state.recipe.bookmarked =true;
        else
        state.recipe.bookmarked =false; 
        console.log(state.recipe); // Fshirja e kësaj linje për të parandaluar thirrjen e pavendosur të loadRecipe(id)
    } catch(err) {
        throw err;
    }


}

export const loadSearchResults = async function(query){

    try{
        state.search.query = query;
        const data = await getJSON(`${API_URL}?search=${query}`)
        console.log(data);

    state.search.results =  data.data.recipes.map(rec =>{
            return{
                id: rec.id,
                title: rec.title,
                publisher: rec.publisher,
                image: rec.image_url,

            }
        });
        state.search.page = 1;
    }catch(err){
        console.log(`${err}`)
        throw err;
        
    }
}
// export const getSearchResultPage = function(page = state.search.page){
//     state.search.page = page
//     const start = (page -1) * state.search.resultPerPage;
//     const end = page * state.search.resultPerPage;
//     return state.search.results.slice(start,end);
// }


export const getSearchResultsPage = function (page = state.search.page) {
    state.search.page = page;
  
    const start = (page - 1) * state.search.resultsPerPage; // 0
    const end = page * state.search.resultsPerPage; // 9
  
    return state.search.results.slice(start, end);
  };

export const updateServings = function(newServings){
    state.recipe.ingredients.forEach(ing => {
        ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
        
    });
    state.recipe.servings = newServings;
}

export const addBookmark = function(recipe){

    state.bookmarks.push(recipe);

    if(recipe.id === state.recipe.id) state.recipe.bookmarked = true;

}
export const deleteBookmark = function(id){

    const index = state.bookmarks.findIndex(el => el.id === id)
    state.bookmarks.splice(index,1);

    if(id === state.recipe.id) state.recipe.bookmarked = false;



}
