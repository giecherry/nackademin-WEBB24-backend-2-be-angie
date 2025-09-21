export type Cocktail = {
    idDrink: string;
    strDrink: string;
    strCategory: string;
    strAlcoholic: string;
    strGlass: string;
    strInstructions: string;
    strDrinkThumb: string;
    ingredients: Ingredient[];
    tags?: string[];
    dateModified?: string;
};

export type Ingredient = {
    name: string;
    measure?: string;
};

export type CocktailApiDrink = {
    idDrink: string;
    strDrink: string;
    strDrinkAlternate?: string;
    strTags?: string;
    strVideo?: string;
    strCategory: string;
    strIBA?: string;
    strAlcoholic: string;
    strGlass: string;
    strInstructions: string;
    strInstructionsES?: string;
    strInstructionsDE?: string;
    strInstructionsFR?: string;
    strInstructionsIT?: string;
    strDrinkThumb: string;
    strIngredient1?: string;
    strIngredient2?: string;
    strIngredient3?: string;
    strIngredient4?: string;
    strIngredient5?: string;
    strIngredient6?: string;
    strIngredient7?: string;
    strIngredient8?: string;
    strIngredient9?: string;
    strIngredient10?: string;
    strIngredient11?: string;
    strIngredient12?: string;
    strIngredient13?: string;
    strIngredient14?: string;
    strIngredient15?: string;
    strMeasure1?: string;
    strMeasure2?: string;
    strMeasure3?: string;
    strMeasure4?: string;
    strMeasure5?: string;
    strMeasure6?: string;
    strMeasure7?: string;
    strMeasure8?: string;
    strMeasure9?: string;
    strMeasure10?: string;
    strMeasure11?: string;
    strMeasure12?: string;
    strMeasure13?: string;
    strMeasure14?: string;
    strMeasure15?: string;
    strImageSource?: string;
    strImageAttribution?: string;
    strCreativeCommonsConfirmed?: string;
    dateModified?: string;
};

export type CocktailApiResponse = {
    drinks: CocktailApiDrink[] | null;
};

export type CocktailCategory = 'Ordinary Drink' | 'Cocktail' | 'Milk / Float / Shake' | 'Other/Unknown' | 'Cocoa' | 'Shot' | 'Coffee / Tea' | 'Homemade Liqueur' | 'Punch / Party Drink' | 'Beer' | 'Soft Drink / Soda';

export type AlcoholicType = 'Alcoholic' | 'Non alcoholic' | 'Optional alcohol';

export type CocktailStats = {
    totalCocktails: number;
    alcoholicCocktails: number;
    nonAlcoholicCocktails: number;
    categoryCounts: Record<string, number>;
    averageIngredientCount: number;
    mostCommonIngredients: Array<{ ingredient: string; count: number }>;
};
