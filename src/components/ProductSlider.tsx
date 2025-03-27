"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Modal from "react-modal";

interface ProductSliderProps {
  images: string[];
}

const ProductSlider: React.FC<ProductSliderProps> = ({ images }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [zoomPosition, setZoomPosition] = useState<{ x: number; y: number } | null>(null);
  const imageContainerRef = useRef<HTMLDivElement | null>(null);

  if (!images || images.length === 0) {
    return <p className="text-center text-gray-500">No images available</p>;
  }

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  
  const nextImage = () => setSelectedIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isModalOpen) {
        if (event.key === "ArrowRight") nextImage();
        else if (event.key === "ArrowLeft") prevImage();
        else if (event.key === "Escape") closeModal();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen]);

  // ✅ Handle zoom effect on mouse movement
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;

    const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect();
    let x = ((e.clientX - left) / width) * 100;
    let y = ((e.clientY - top) / height) * 100;

    // ✅ Ensure zoom lens stays within bounds
    x = Math.min(100, Math.max(0, x));
    y = Math.min(100, Math.max(0, y));

    setZoomPosition({ x, y });
  };

  const handleMouseLeave = () => setZoomPosition(null);

  return (
    <div className="text-center">
      {/* ✅ Main Image with Zoom Effect on Hover */}
      <div 
        ref={imageContainerRef}
        className="relative border rounded-md p-2 bg-black cursor-zoom-in flex justify-center items-center mx-auto overflow-hidden"
        style={{
          maxWidth: "588px",
          maxHeight: "588px",
          position: "relative",
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={openModal}
      >
        <Image
          className="rounded-md object-contain w-full h-full"
          src={images[selectedIndex]}
          alt={`Product Image ${selectedIndex + 1}`}
          width={588}
          height={588}
          priority
        />

{zoomPosition && (
  <div
    className="absolute pointer-events-none border-2 border-white rounded-full"
    style={{
      width: "120px", // ✅ Lens size
      height: "120px",
      left: `calc(${zoomPosition.x}% - 60px)`,
      top: `calc(${zoomPosition.y}% - 60px)`,
      backgroundImage: `url(${images[selectedIndex]})`,
      backgroundSize: "900% 900%", // ✅ Increased zoom scale
      backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
      backgroundRepeat: "no-repeat",
      boxShadow: "0px 0px 10px rgba(255, 255, 255, 0.5)",
      transform: "scale(1.1)",
      transition: "transform 0.1s ease-out",
    }}
  />
)}
      </div>

      {/* ✅ Thumbnail Images (Clicking changes main image, NOT opening modal) */}
      <div className="flex mt-2 justify-center space-x-2">
        {images.map((img, index) => (
          img ? (
            <Image
              key={index}
              src={img}
              alt={`Thumbnail ${index + 1}`}
              width={60}
              height={60}
              className={`cursor-pointer rounded-md ${
                selectedIndex === index ? "border-2 border-green-500" : ""
              }`}
              onClick={() => setSelectedIndex(index)}
            />
          ) : null
        ))}
      </div>

      {/* ✅ Lightbox Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Product Image Lightbox"
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 z-50"
        ariaHideApp={false}
      >
        <div className="relative flex w-full h-full">
          {/* Sidebar Thumbnails (Inside Lightbox) */}
          <div className="hidden md:flex flex-col items-center space-y-2 p-4">
            {images.map((img, index) => (
              <Image
                key={index}
                src={img}
                alt={`Thumbnail ${index + 1}`}
                width={60}
                height={60}
                className={`cursor-pointer rounded-md ${
                  selectedIndex === index ? "border-2 border-orange-500" : "opacity-60"
                }`}
                onClick={() => setSelectedIndex(index)}
              />
            ))}
          </div>

          {/* Lightbox Image Viewer */}
          <div className="flex-grow flex items-center justify-center relative">
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-white text-3xl bg-black bg-opacity-50 p-2 rounded-full"
              onClick={closeModal}
            >
              ✖
            </button>

            {/* Left Arrow */}
            <button
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-3xl bg-black bg-opacity-50 p-3 rounded-full"
              onClick={prevImage}
            >
              ◀
            </button>

            {/* ✅ Enlarged Lightbox Image */}
            <div className="flex justify-center items-center w-full h-full">
              <Image
                className="rounded-md object-contain"
                src={images[selectedIndex]}
                alt={`Product Image ${selectedIndex + 1}`}
                width={1200} 
                height={900} 
                style={{ maxWidth: "90vw", maxHeight: "90vh" }}
                priority
              />
            </div>

            {/* Right Arrow */}
            <button
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-3xl bg-black bg-opacity-50 p-3 rounded-full"
              onClick={nextImage}
            >
              ▶
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProductSlider;