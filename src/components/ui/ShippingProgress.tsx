import { Check } from "lucide-react";
import type { FulfillmentStatus } from "@/types";

const STEPS = [
  { key: "paid", label: "Pagado" },
  { key: "processing", label: "Preparando" },
  { key: "shipped", label: "Enviado" },
  { key: "delivered", label: "Entregado" },
];

function currentStepIndex(fulfillmentStatus: FulfillmentStatus | null): number {
  if (fulfillmentStatus === "delivered") return 3;
  if (fulfillmentStatus === "shipped") return 2;
  return 1; // pago aprobado, todavia sin despachar
}

// Solo tiene sentido para pedidos con el pago aprobado — el resto de los
// estados (pendiente, rechazado, cancelado, reembolsado) ya se ven con el
// badge de STATUS_LABELS en la card del pedido.
export default function ShippingProgress({
  fulfillmentStatus,
}: {
  fulfillmentStatus: FulfillmentStatus | null;
}) {
  const activeIndex = currentStepIndex(fulfillmentStatus);

  return (
    <div className="flex items-center">
      {STEPS.map((step, i) => {
        const done = i <= activeIndex;
        const isLast = i === STEPS.length - 1;
        return (
          <div key={step.key} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center border transition-colors ${
                  done
                    ? "bg-gold border-gold text-white"
                    : "bg-white border-border-light text-transparent"
                }`}
              >
                {done && <Check size={11} strokeWidth={3} />}
              </div>
              <span
                className={`font-sans text-[10px] whitespace-nowrap ${
                  done ? "text-text-dark font-medium" : "text-text-light"
                }`}
              >
                {step.label}
              </span>
            </div>
            {!isLast && (
              <div
                className={`h-px flex-1 mx-1.5 -mt-4 transition-colors ${
                  i < activeIndex ? "bg-gold" : "bg-border-light"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
