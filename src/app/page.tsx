import ProductSlider from "@/components/ProductSlider";

const productMedia = [
  { type: "video", src: "/videos/product.mp4" },
  { type: "image", src: "/images/product1.webp" },
  { type: "image", src: "/images/product2.webp" },
  { type: "image", src: "/images/product3.webp" },
  { type: "image", src: "/images/product4.webp" },
  { type: "image", src: "/images/product5.webp" }

];

export default function Home() {
  return (
    <div className="p-2">
      <h1 className="text-2xl font-bold text-center mb-6">Product Slider</h1>
      <ProductSlider images={productMedia} />
    </div>
  );
}