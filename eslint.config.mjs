import coreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

export default [
  { ignores: [".next/**", "node_modules/**"] },
  ...coreWebVitals,
  ...nextTypescript,
  {
    rules: {
      // Nueva en eslint-plugin-react-hooks v7 (Next 16). Marca como error el
      // patron "isMounted" (useEffect(() => setMounted(true), [])) que este
      // proyecto usa para evitar mismatches de hidratacion SSR/cliente — un
      // patron seguro y muy comun en Next.js, no un bug. Bajado a warning
      // para que siga siendo visible sin bloquear el CI.
      "react-hooks/set-state-in-effect": "warn",
    },
  },
];
