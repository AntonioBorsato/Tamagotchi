import { type SQLiteDatabase } from "expo-sqlite";

// Função para inicializar o banco de dados
export async function initializeDatabase(database: SQLiteDatabase) {
  if (!database) {
    console.error("Banco de dados não está inicializado.");
    return;
  }

  try {
    console.log("Inicializando o banco de dados...");

    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS tamagochis (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        hunger INTEGER NOT NULL DEFAULT 100, 
        sleep INTEGER NOT NULL DEFAULT 100,   
        fun INTEGER NOT NULL DEFAULT 100,     
        image TEXT NOT NULL DEFAULT 'default_image_uri'
      );
    `);

    console.log("Tabela criada ou já existe.");
  } catch (error) {
    console.error("Erro ao criar a tabela:", error);
  }
}
