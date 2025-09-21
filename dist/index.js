import { serve } from "@hono/node-server";
import { Hono } from "hono";
import dotenv from "dotenv";
import { runCocktailDemo } from "./cocktail-project/demo.js";
import { fetchRandomCocktail, fetchCocktailByName } from "./cocktail-project/api/cocktailApi.js";
dotenv.config();
const app = new Hono();
app.get("/", (c) => {
    return c.text("Hello! Visit /cocktail endpoints to see the cocktail API in action.");
});
// Simple cocktail endpoints
app.get("/cocktail/random", async (c) => {
    try {
        const cocktail = await fetchRandomCocktail();
        if (!cocktail) {
            return c.json({ error: "No cocktail found" }, 404);
        }
        return c.json(cocktail);
    }
    catch (error) {
        return c.json({ error: "Failed to fetch cocktail" }, 500);
    }
});
app.get("/cocktail/search/:name", async (c) => {
    try {
        const name = c.req.param("name");
        const cocktails = await fetchCocktailByName(name);
        return c.json({ cocktails, count: cocktails.length });
    }
    catch (error) {
        return c.json({ error: "Failed to search cocktails" }, 500);
    }
});
app.get("/cocktail/demo", async (c) => {
    try {
        console.log("Running simple cocktail demo...");
        await runCocktailDemo();
        return c.json({ message: "Demo completed! Check the server console for output." });
    }
    catch (error) {
        return c.json({ error: "Demo failed" }, 500);
    }
});
serve({
    fetch: app.fetch,
    port: Number(process.env.HONO_PORT) || 3000,
}, (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
    console.log("\nAvailable endpoints:");
    console.log("  GET / - Welcome message");
    console.log("  GET /cocktail/random - Get a random cocktail");
    console.log("  GET /cocktail/search/{name} - Search cocktails by name");
    console.log("  GET /cocktail/demo - Run the simple demo");
});
