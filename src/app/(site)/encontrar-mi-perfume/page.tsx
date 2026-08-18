import type { Metadata } from "next";
import Quiz from "./Quiz";

export const metadata: Metadata = {
  title: "Encontrá tu perfume",
  description: "Respondé 5 preguntas y te recomendamos el perfume ideal para vos.",
  alternates: { canonical: "/encontrar-mi-perfume" },
};

export default function EncontrarMiPerfumePage() {
  return <Quiz />;
}
