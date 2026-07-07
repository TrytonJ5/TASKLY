import dotenv from "dotenv";
dotenv.config();

// 1. Import the specific function using curly braces
import { criarApp } from "./app.js";

const PORT: number = Number(process.env.PORT) || 3000; // Added a fallback just in case

// 2. Initialize the app by calling the function
const app = criarApp();

// 3. Now you can listen!
app.listen(PORT, () => console.log(`Taskly rodando com sucesso na porta ${PORT}!`));