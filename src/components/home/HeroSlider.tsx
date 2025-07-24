import { motion } from "framer-motion";
import { Button } from "../index";
import { useEffect, useState } from "react";
import { FaUserTie, FaGavel, FaCoins } from "react-icons/fa";
import banner1 from "../../assets/banner1.jpg";
import banner2 from "../../assets/banner2.jpg";
import BidCoin from "../../assets/BidCoin.webp";
import { useNavigate } from "react-router-dom";

const slides = [
  {
    title: "Explore, bid, and trade exclusive space-themed NFTs",
    subtitle:
      "Galactic marketplace with 10,000+ unique NFTs from 1,200 artists",
    background: banner1,
    type: "nft",
  },
  {
    title: "Own rare cosmic art that's truly yours",
    subtitle: "Discover creators from across the galaxy",
    background: banner2,
    type: "art",
  },
  {
    title: "Power Up Your Bidding Journey",
    subtitle:
      "Get BidCoins to participate in exclusive cosmic auctions and unlock premium features",
    background: BidCoin,
    type: "coins",
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

  const handleBuyCoins = () => {
    navigate("/profile?buyCoins=true");
  };

  return (
    <div className="relative h-[50vh] w-full overflow-hidden">
      {slides.map((slide, index) => (
        <motion.div
          key={index}
          className={`absolute top-0 left-0 h-full w-full bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
          style={{
            backgroundImage: `url(${slide.background})`,
          }}
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
            <motion.p
              className="mt-3 text-base md:text-lg"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              {slide.subtitle}
            </motion.p>

            <motion.div
              className="mt-6 flex gap-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              {slide.type === "coins" ? (
                <>
                  <Button
                    className="flex items-center rounded-lg bg-blue-500 px-5 py-2 text-white hover:bg-blue-600"
                    onClick={handleBuyCoins}
                  >
                    <FaCoins className="mr-2" />
                    Buy BidCoins
                  </Button>
                  <Button
                    className="flex items-center rounded-lg bg-blue-500 px-5 py-2 text-white hover:bg-blue-600"
                    onClick={() => navigate("/discover")}
                  >
                    <FaGavel className="mr-2" />
                    View Auctions
                  </Button>
                </>
              ) : (
                <>
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
                </>
              )}
            </motion.div>
          </div>
        </motion.div>
      ))}

      {/* Slide indicators */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-3 w-3 rounded-full transition-all duration-300 ${
              index === current
                ? "scale-125 bg-white"
                : "bg-white/50 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
