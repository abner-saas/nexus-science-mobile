import { expoClient, type ExpoClientStorage } from "@better-auth/expo/client";
import { createAuthClient } from "better-auth/react";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3333";

/**
 * O plugin exige getItem/setItem síncronos e assíncronos. No iOS/Android isso
 * continua sendo o SecureStore. Na web o módulo nativo é vazio e a sessão do
 * better-auth segue no cookie do browser (o plugin não grava storage quando
 * Platform.OS === "web"). localStorage só satisfaz a interface.
 */
const webStorage: ExpoClientStorage = {
  getItem(key) {
    if (typeof localStorage === "undefined") return null;
    return localStorage.getItem(key);
  },
  setItem(key, value) {
    localStorage.setItem(key, value);
  },
  async getItemAsync(key) {
    return webStorage.getItem(key);
  },
  async setItemAsync(key, value) {
    webStorage.setItem(key, value);
  },
};

export const authClient = createAuthClient({
  baseURL: API_URL,
  plugins: [
    expoClient({
      scheme: "nexusscience",
      storagePrefix: "nexusscience",
      storage: Platform.OS === "web" ? webStorage : SecureStore,
    }),
  ],
});
