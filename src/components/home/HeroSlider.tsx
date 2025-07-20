import { motion } from "framer-motion";
import { Button } from "../index";
import { useEffect, useState } from "react";
import { FaUserTie, FaGavel } from "react-icons/fa"; // Add these imports
import banner1 from "../../assets/banner1.jpg";
import banner2 from "../../assets/banner2.jpg";
import { useNavigate } from "react-router-dom";

const slides = [
  {
    title: "Explore, bid, and trade exclusive space-themed NFTs",
    subtitle:
      "Galactic marketplace with 10,000+ unique NFTs from 1,200 artists",
    background: banner1,
  },
  {
    title: "Own rare cosmic art that's truly yours",
    subtitle: "Discover creators from across the galaxy",
    background: banner2,
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-[50vh] w-full overflow-hidden">
      {slides.map((slide, index) => (
        <motion.div
          key={index}
          className={`absolute top-0 left-0 h-full w-full bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
          style={{ backgroundImage: `url(${slide.background})` }}
        >
          <div className="flex h-full w-full flex-col items-center justify-center bg-black/60 px-4 text-center text-white">
            <motion.h1
              className="text-3xl font-bold md:text-5xl"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1 }}
            >
              {slide.title}
            </motion.h1>
            <p className="mt-3 text-base md:text-lg">{slide.subtitle}</p>
            <div className="mt-6 flex gap-4">
              <Button
                className="flex items-center rounded-lg bg-blue-500 px-5 py-2 text-white hover:bg-blue-600"
                onClick={() => navigate("/upload-item")}
              >
                <FaUserTie className="mr-2" />
                Be a Seller
              </Button>
              <Button
                className="flex items-center rounded-lg bg-blue-500 px-5 py-2 text-white hover:bg-blue-600"
                onClick={() => navigate("/discover")}
              >
                <FaGavel className="mr-2" />
                Discover Bids
              </Button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
