import * as model from './model';
import recipeView from './views/recipeView.js';
import 'core-js/stable';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarkView from './views/bookmarkView.js';
import { Fraction } from 'fractional';
import 'regenerator-runtime/runtime';
const recipeContainer = document.querySelector('.recipe');

    // if(module.hot){
    //     module.hot.accept();
    // }

    const controlRecipes = async function () {
        try {
          const id = window.location.hash.slice(1);
      
          if (!id) return;
          recipeView.renderSpinner();
      
          // 0) Update results view to mark selected search result
          resultsView.update(model.getSearchResultsPage());
      
          // 1) Updating bookmarks view
          bookmarkView.update(model.state.bookmarks);
      
          // 2) Loading recipe
          await model.loadRecipe(id);
      
          // 3) Rendering recipe
          recipeView.render(model.state.recipe);
        } catch (err) {
          recipeView.renderError();
          console.error(err);
        }
      };
const  controlSearchResults  = async function(){
    try{
        resultsView.renderSpinner();
        const query = searchView.getQuery();
        if(!query) return;
        await model.loadSearchResults(query);
        // resultsView.render(model.state.search.results);
        resultsView.render(model.getSearchResultsPage(4));

        paginationView.render(model.state.search);
    }catch(err){
        console.log(err) 
    }
}
const controlPagination = function(goToPage){
     resultsView.render(model.getSearchResultsPage(goToPage));
     paginationView.render(model.state.search);
}
const controlServings = function(newServings ){
    model.updateServings(newServings);

    recipeView.render(model.state.recipe);
    // recipeView.update(model.state.recipe);

}
const controlBookmark = function(){
  if(!model.state.recipe.bookmarked ) 
     model.addBookmark(model.state.recipe)
  else
  if(model.state.recipe.bookmarked )  
    model.deleteBookmark(model.state.recipe.id)
    recipeView.update(model.state.recipe);

    bookmarkView.render(model.state.bookmarks);
}
const init = function(){
    recipeView.addHandlerRender(controlRecipes);
    recipeView.addHandlerUpdateServings(controlServings)
    recipeView.addHandlerAddBookmark(controlBookmark);

    searchView.addHandlerSearch(controlSearchResults);
    paginationView.addHandlerClick(controlPagination);
    
}
init();
