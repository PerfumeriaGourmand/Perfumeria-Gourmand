export const dynamic = "force-dynamic";
import ProductForm from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="font-display text-3xl text-cream mb-10">Nuevo producto</h1>
      <ProductForm />
    </div>
  );
}
