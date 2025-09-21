import { fetchRandomCocktail, fetchCocktailByName } from "./api/cocktailApi.js";
function displayCocktail(cocktail) {
    console.log(`\n🍸 ${cocktail.strDrink}`);
    console.log(`Category: ${cocktail.strCategory}`);
    console.log(`Type: ${cocktail.strAlcoholic}`);
    console.log(`Glass: ${cocktail.strGlass}`);
    console.log("\nIngredients:");
    cocktail.ingredients.forEach(ingredient => {
        if (ingredient.measure) {
            console.log(`  - ${ingredient.measure} ${ingredient.name}`);
        }
        else {
            console.log(`  - ${ingredient.name}`);
        }
    });
    console.log("\nInstructions:");
    console.log(cocktail.strInstructions);
}
export async function runCocktailDemo() {
    console.log("🍹 Simple Cocktail API Demo");
    try {
        // Fetch a random cocktail
        console.log("\n📝 Fetching a random cocktail...");
        const randomCocktail = await fetchRandomCocktail();
        if (randomCocktail) {
            displayCocktail(randomCocktail);
        }
        // Search for a specific cocktail
        console.log("\n\n📝 Searching for 'Mojito'...");
        const mojitos = await fetchCocktailByName('Mojito');
        if (mojitos.length > 0) {
            displayCocktail(mojitos[0]); // Show first result
        }
        else {
            console.log("❌ No Mojito found");
        }
    }
    catch (error) {
        console.error("Error:", error);
    }
}
