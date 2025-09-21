export const transformApiDrinkToCocktail = (apiDrink) => {
    const ingredients = [];
    for (let i = 1; i <= 15; i++) {
        const ingredientKey = `strIngredient${i}`;
        const measureKey = `strMeasure${i}`;
        const ingredientName = apiDrink[ingredientKey];
        const measure = apiDrink[measureKey];
        if (ingredientName && ingredientName.trim()) {
            ingredients.push({
                name: ingredientName.trim(),
                measure: measure && measure.trim() ? measure.trim() : undefined
            });
        }
    }
    return {
        idDrink: apiDrink.idDrink,
        strDrink: apiDrink.strDrink,
        strCategory: apiDrink.strCategory,
        strAlcoholic: apiDrink.strAlcoholic,
        strGlass: apiDrink.strGlass,
        strInstructions: apiDrink.strInstructions,
        strDrinkThumb: apiDrink.strDrinkThumb,
        ingredients,
        tags: apiDrink.strTags ? apiDrink.strTags.split(',').map(tag => tag.trim()) : undefined,
        dateModified: apiDrink.dateModified
    };
};
//Fetches a random cocktail from the API
export const fetchRandomCocktail = async () => {
    const url = 'https://www.thecocktaildb.com/api/json/v1/1/random.php';
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.status}`);
        }
        const data = await response.json();
        if (!data.drinks || data.drinks.length === 0) {
            return null;
        }
        return transformApiDrinkToCocktail(data.drinks[0]);
    }
    catch (error) {
        console.error('Error fetching random cocktail:', error);
        throw error;
    }
};
//Fetches cocktails by name with type transformation
export const fetchCocktailByName = async (name) => {
    const url = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${encodeURIComponent(name)}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.status}`);
        }
        const data = await response.json();
        if (!data.drinks) {
            return [];
        }
        return data.drinks.map(transformApiDrinkToCocktail);
    }
    catch (error) {
        console.error('Error fetching cocktail by name:', error);
        throw error;
    }
};
