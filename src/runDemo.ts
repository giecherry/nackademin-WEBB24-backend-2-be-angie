import { runCocktailDemo } from "./cocktail-project/demo.js";

runCocktailDemo().catch(error => {
    console.error("Demo failed:", error);
    process.exit(1);
});
