import { useSQLiteContext } from "expo-sqlite";

export type TamagochiDatabase = {
  id: number;
  name: string;
  hunger: number;
  sleep: number;
  fun: number;
  image: string;
};

export function useTamagochiDatabase() {
  const database = useSQLiteContext();

  // Função para buscar IDs disponíveis para reutilização
  async function getAvailableIds(): Promise<number[]> {
    try {
      const query = `
        SELECT id + 1 AS next_id FROM tamagochis t
        WHERE NOT EXISTS (SELECT 1 FROM tamagochis WHERE id = t.id + 1)
        AND t.id < (SELECT MAX(id) FROM tamagochis)
      `;
      const response = await database.getAllAsync<{ next_id: number }>(query);
      return response.map((row) => row.next_id);
    } catch (error) {
      throw error;
    }
  }

  // Função modificada para criar um Tamagochi sem ID
  async function create(data: Omit<TamagochiDatabase, "id">) {
    const statement = await database.prepareAsync(`
      INSERT INTO tamagochis (name, hunger, sleep, fun, image) VALUES (?, ?, ?, ?, ?)
    `);

    try {
      const result = await statement.executeAsync([
        data.name,
        data.hunger,
        data.sleep,
        data.fun,
        data.image, // Ensure this is a key, not a URI
      ]);

      return { insertedRowId: result.lastInsertRowId };
    } catch (error) {
      throw error;
    } finally {
      await statement.finalizeAsync();
    }
  }

  async function searchByName(name: string) {
    try {
      const query = "SELECT * FROM tamagochis WHERE name LIKE ?";
      const response = await database.getAllAsync<TamagochiDatabase>(
        query,
        `%${name}%`
      );

      return response;
    } catch (error) {
      throw error;
    }
  }

  async function update(data: TamagochiDatabase) {
    const statement = await database.prepareAsync(`
      UPDATE tamagochis SET name = ?, hunger = ?, sleep = ?, fun = ?, image = ? WHERE id = ?
    `);

    try {
      await statement.executeAsync([
        data.name,
        data.hunger,
        data.sleep,
        data.fun,
        data.image,
        data.id,
      ]);
    } catch (error) {
      throw error;
    } finally {
      await statement.finalizeAsync();
    }
  }

  async function remove(id: number) {
    try {
      await database.execAsync(`DELETE FROM tamagochis WHERE id = ${id}`);
    } catch (error) {
      throw error;
    }
  }

  async function show(id: number) {
    try {
      const query = "SELECT * FROM tamagochis WHERE id = ?";
      const response = await database.getFirstAsync<TamagochiDatabase>(query, [
        id,
      ]);

      return response;
    } catch (error) {
      throw error;
    }
  }

  async function updateAttributesPeriodically() {
    try {
      const query = "SELECT id, hunger, sleep, fun FROM tamagochis";
      const tamagochisToUpdate = await database.getAllAsync<TamagochiDatabase>(
        query
      );

      for (const tamagochi of tamagochisToUpdate) {
        const updatedHunger = Math.max(0, tamagochi.hunger - 1);
        const updatedSleep = Math.max(0, tamagochi.sleep - 1);
        const updatedFun = Math.max(0, tamagochi.fun - 1);

        // Atualiza o Tamagochi
        await update({
          id: tamagochi.id,
          name: tamagochi.name,
          hunger: updatedHunger,
          sleep: updatedSleep,
          fun: updatedFun,
          image: tamagochi.image,
        });
      }
    } catch (error) {
      throw error;
    }
  }

  return {
    create,
    searchByName,
    update,
    remove,
    show,
    updateAttributesPeriodically,
    getAvailableIds,
  };
}
