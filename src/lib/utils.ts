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

export const CATEGORY_LABELS: Record<string, string> = {
  arabe: "Árabe",
  disenador: "Diseñador",
  nicho: "Nicho",
  kit: "Kit",
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

export function formatUSD(amount: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
