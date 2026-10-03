import dotenv from "dotenv";

dotenv.config();

function requireEnv(name:string, fallback?:string){
    const value = process.env[name] ?? fallback;
    if(value === undefined){
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
}

export const env = {
    port: parseInt(requireEnv("PORT", "4000"), 10),
    // node: requireEnv("NODE_ENV", "development"),
    databseUrl: requireEnv("DATABASE_URL"),
    geminiApiKey: requireEnv("GEMINI_API_KEY"),
    embeddingModel: requireEnv("EMBEDDING_MODEL", "gemini-embedding-001"),
    chatModel:requireEnv("CHAT_MODEL", "gemini-3.5-flash-lite"),
    // maxUploadSizeMb: parseInt(requireEnv("MAX_UPLOADSIZE_MB", "15"), 10)
}