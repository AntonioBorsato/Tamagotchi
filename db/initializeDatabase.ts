import { type SQLiteDatabase } from "expo-sqlite";

// Inicializa o banco de dados criando a tabela tamagochis, se ela não existir
export async function initializeDatabase(database: SQLiteDatabase) {
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
}
