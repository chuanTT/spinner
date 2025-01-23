import { guaranteedNumberDB, usedNumberDB } from "./db";

export const objAction = {
  add_guaranteed: async (number?: number) => {
    if (!number) return;
    await guaranteedNumberDB.add(number);
  },
  delete_guaranteed: async (number?: number) => {
    if (!number) return;
    await guaranteedNumberDB.delete(number);
  },

  add_used: async (number?: number) => {
    if (!number) return;
    await usedNumberDB.add(number);
  },

  delete_used: async (number?: number) => {
    if (!number) return;
    await usedNumberDB.delete(number);
  },

  delete_all_used: async() => {
    await usedNumberDB.clearAll();
  }
};
