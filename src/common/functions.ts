/* eslint-disable @typescript-eslint/no-explicit-any */
import { Socket } from "socket.io-client";
import { objAction } from "./action";
import { guaranteedNumberDB, usedNumberDB } from "./db";

export const parseArray = (arr: string) => {
  try {
    const arrValue = JSON.parse(arr);
    return Array.isArray(arrValue) ? arrValue : [];
  } catch {
    return [];
  }
};

export const convertArrayNumber = (arrNumber: any[]): number[] => {
  return arrNumber && Array.isArray(arrNumber) ? (arrNumber as number[]) : [];
};

export const getDataUsedNumbers = async () => {
  const arrNumber = await usedNumberDB.findAll();
  return convertArrayNumber(arrNumber);
};

export const getDataGuaranteedNumbers = async () => {
  const arrNumberGuaranteed = await guaranteedNumberDB.findAll();
  return convertArrayNumber(arrNumberGuaranteed);
};

export const getDataDB = async () => {
  const usedNumbers = await getDataUsedNumbers();
  const guaranteedNumbers = await getDataGuaranteedNumbers();
  return {
    guaranteedNumbers,
    usedNumbers,
  };
};

export const emitData = (
  socket: Socket<any, any>,
  type: keyof typeof objAction,
  data: any
) => {
  return socket.emit("sync_data", { type, data });
};
