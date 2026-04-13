import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const CATEGORY_LABELS: Record<string, string> = {
  arabe: "Árabe",
  disenador: "Diseñador",
  nicho: "Nicho",
};

export const GENDER_LABELS: Record<string, string> = {
  hombre: "Hombre",
  mujer: "Mujer",
  unisex: "Unisex",
};

export const SEASON_LABELS: Record<string, string> = {
  verano: "Verano",
  invierno: "Invierno",
  primavera: "Primavera",
  otono: "Otoño",
  todo_clima: "Todo clima",
};

export const CONCENTRATION_LABELS: Record<string, string> = {
  parfum: "Parfum",
  edp: "EDP",
  edt: "EDT",
  edc: "EDC",
  oil: "Aceite",
  otro: "Otro",
};
