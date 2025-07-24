import React, { useState } from "react";
import { FaTimes, FaCoins, FaRocket, FaStar, FaGem } from "react-icons/fa";
import { toast } from "react-toastify";

interface CoinPack {
  id: string;
  coins: number;
  price: number;
  bonus: number;
  popular?: boolean;
  bestValue?: boolean;
  icon: React.ReactNode;
  gradient: string;
  glow: string;
}

interface BuyCoinsPackProps {
  isOpen: boolean;
  onClose: () => void;
  userCoins: number;
}

const COIN_PACKS: CoinPack[] = [
  {
    id: "starter",
    coins: 100,
    price: 100,
    bonus: 0,
    icon: <FaCoins className="text-2xl" />,
    gradient: "from-blue-400 to-cyan-400",
    glow: "shadow-[0_0_20px_rgba(59,130,246,0.3)]",
  },
  {
    id: "popular",
    coins: 500,
    price: 475,
    bonus: 50,
    popular: true,
    icon: <FaStar className="text-2xl" />,
    gradient: "from-purple-400 to-pink-400",
    glow: "shadow-[0_0_25px_rgba(168,85,247,0.4)]",
  },
  {
    id: "best",
    coins: 1000,
    price: 900,
    bonus: 150,
    bestValue: true,
    icon: <FaGem className="text-2xl" />,
    gradient: "from-emerald-400 to-teal-400",
    glow: "shadow-[0_0_30px_rgba(16,185,129,0.4)]",
  },
  {
    id: "premium",
    coins: 2500,
    price: 2200,
    bonus: 500,
    icon: <FaRocket className="text-2xl" />,
    gradient: "from-yellow-400 to-orange-400",
    glow: "shadow-[0_0_35px_rgba(251,191,36,0.4)]",
  },
];

export default function BuyCoinsPack({
  isOpen,
  onClose,
  userCoins,
}: BuyCoinsPackProps) {
  const [selectedPack, setSelectedPack] = useState<string | null>(null);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handlePackSelect = (packId: string) => {
    setSelectedPack(packId);
    setIsCustomMode(false);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      setCustomAmount(value);
      setSelectedPack(null);
      setIsCustomMode(true);
    }
  };

  const getCustomPrice = (coins: number) => {
    return coins.toFixed(0); // 1 coin = 1 rupee
  };

  const handlePurchase = async () => {
    setIsProcessing(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      let purchaseDetails;
      if (isCustomMode && customAmount) {
        purchaseDetails = {
          coins: parseInt(customAmount),
          price: parseFloat(getCustomPrice(parseInt(customAmount))),
          bonus: 0,
        };
      } else if (selectedPack) {
        const pack = COIN_PACKS.find((p) => p.id === selectedPack);
        if (pack) {
          purchaseDetails = {
            coins: pack.coins,
            price: pack.price,
            bonus: pack.bonus,
          };
        }
      }

      if (purchaseDetails) {
        toast.success(
          `Successfully purchased ${purchaseDetails.coins + purchaseDetails.bonus} coins!`,
        );
        onClose();
      }
    } catch {
      toast.error("Purchase failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const canPurchase =
    selectedPack ||
    (isCustomMode && customAmount && parseInt(customAmount) > 0);

  return (
    <>
      {/* Backdrop with animated stars */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-[1px]"
        onClick={onClose}
      >
        {/* Animated star field */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            >
              <div className="h-1 w-1 rounded-full bg-blue-400"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal with proper scrolling */}
      <div className="fixed inset-4 z-50 flex items-center justify-center overflow-hidden">
        <div className="max-h-full w-full max-w-4xl overflow-hidden rounded-2xl border border-blue-500/30 bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20 shadow-2xl backdrop-blur-xl">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-10 -right-10 h-40 w-40 animate-pulse rounded-full bg-blue-500/10 blur-3xl"></div>
            <div className="absolute -bottom-10 -left-10 h-40 w-40 animate-pulse rounded-full bg-purple-500/10 blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 h-60 w-60 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-cyan-500/5 blur-3xl"></div>
          </div>

          {/* Header - Fixed */}
          <div className="relative flex-shrink-0 border-b border-blue-500/20 bg-gradient-to-r from-blue-900/30 to-purple-900/30 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg">
                  <FaCoins className="text-lg text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Cosmic Coin Store
                  </h2>
                  <p className="text-sm text-blue-300">
                    Power up your bidding adventures
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-full bg-gray-800/50 p-2 text-gray-400 transition-all hover:scale-110 hover:bg-gray-700 hover:text-white"
              >
                <FaTimes className="text-lg" />
              </button>
            </div>

            {/* Current balance */}
            <div className="mt-3 rounded-lg bg-black/30 p-3 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Current Balance:</span>
                <div className="flex items-center gap-2">
                  <FaCoins className="text-yellow-400" />
                  <span className="text-xl font-bold text-white">
                    {userCoins.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-400">coins</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content - Scrollable */}
          <div
            className="relative flex-1 overflow-y-auto p-4"
            style={{ maxHeight: "calc(100vh - 200px)" }}
          >
            {/* Coin Packs Grid */}
            <div className="mb-6">
              <h3 className="mb-4 text-lg font-semibold text-white">
                Choose Your Pack
              </h3>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
                {COIN_PACKS.map((pack) => (
                  <div
                    key={pack.id}
                    onClick={() => handlePackSelect(pack.id)}
                    className={`group relative cursor-pointer overflow-hidden rounded-lg border-2 p-4 transition-all duration-300 hover:scale-105 ${
                      selectedPack === pack.id
                        ? `border-blue-400 ${pack.glow} bg-gradient-to-br from-gray-800/90 to-gray-900/90`
                        : "border-gray-600/50 bg-gradient-to-br from-gray-800/50 to-gray-900/50 hover:border-gray-500"
                    }`}
                  >
                    {/* Popular/Best Value Badge */}
                    {pack.popular && (
                      <div className="absolute -top-1 -right-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-2 py-1 text-xs font-bold text-white shadow-lg">
                        POPULAR
                      </div>
                    )}
                    {pack.bestValue && (
                      <div className="absolute -top-1 -right-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-2 py-1 text-xs font-bold text-white shadow-lg">
                        BEST VALUE
                      </div>
                    )}

                    {/* Pack Icon */}
                    <div
                      className={`mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r ${pack.gradient} shadow-lg`}
                    >
                      <div className="text-lg">{pack.icon}</div>
                    </div>

                    {/* Pack Details */}
                    <div className="space-y-1">
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-bold text-white">
                          {pack.coins.toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-400">coins</span>
                      </div>

                      {pack.bonus > 0 && (
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-green-400">
                            +{pack.bonus} bonus
                          </span>
                          <FaStar className="text-xs text-green-400" />
                        </div>
                      )}

                      <div className="text-xl font-bold text-green-400">
                        ₹{pack.price}
                      </div>

                      <div className="text-xs text-gray-400">
                        ₹{(pack.price / (pack.coins + pack.bonus)).toFixed(2)}{" "}
                        per coin
                      </div>
                    </div>

                    {/* Selection indicator */}
                    {selectedPack === pack.id && (
                      <div className="absolute inset-0 rounded-lg bg-blue-500/10 ring-2 ring-blue-400 ring-inset"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Amount Section */}
            <div className="mb-6 rounded-lg border border-cyan-500/30 bg-gradient-to-r from-cyan-900/20 to-blue-900/20 p-4 backdrop-blur-sm">
              <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-white">
                <FaRocket className="text-cyan-400" />
                Custom Amount
              </h3>
              <div className="flex flex-col gap-3 md:flex-row md:items-end">
                <div className="flex-1">
                  <label className="mb-2 block text-sm text-gray-300">
                    Enter exact amount of coins you need
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={customAmount}
                      onChange={handleCustomAmountChange}
                      placeholder="e.g., 750"
                      className="w-full rounded-lg border border-gray-600 bg-gray-800/50 px-4 py-2.5 pr-12 text-white placeholder-gray-400 backdrop-blur-sm focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 focus:outline-none"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <FaCoins className="text-yellow-400" />
                    </div>
                  </div>
                </div>
                {customAmount && parseInt(customAmount) > 0 && (
                  <div className="rounded-lg bg-black/30 p-3 backdrop-blur-sm">
                    <div className="text-xs text-gray-400">Total Price:</div>
                    <div className="text-lg font-bold text-green-400">
                      ₹{getCustomPrice(parseInt(customAmount))}
                    </div>
                    <div className="text-xs text-gray-500">₹1.00 per coin</div>
                  </div>
                )}
              </div>
            </div>

            {/* Purchase Button */}
            <div className="mb-4 flex justify-center">
              <button
                onClick={handlePurchase}
                disabled={!canPurchase || isProcessing}
                className="group relative overflow-hidden rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 px-8 py-3 font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-blue-500 hover:to-cyan-500 hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] disabled:from-gray-600 disabled:to-gray-700 disabled:opacity-50 disabled:hover:scale-100"
              >
                {/* Button background animation */}
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 transition-transform duration-1000 group-hover:translate-x-full"></div>

                <div className="relative flex items-center gap-2">
                  {isProcessing ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <FaRocket className="text-lg" />
                      {selectedPack
                        ? (() => {
                            const pack = COIN_PACKS.find(
                              (p) => p.id === selectedPack,
                            );
                            return pack
                              ? `Buy ${(pack.coins + pack.bonus).toLocaleString()} Coins - ₹${pack.price}`
                              : "Buy Coins";
                          })()
                        : isCustomMode && customAmount
                          ? `Buy ${parseInt(customAmount).toLocaleString()} Coins - ₹${getCustomPrice(parseInt(customAmount))}`
                          : "Select a pack or enter custom amount"}
                    </>
                  )}
                </div>
              </button>
            </div>

            {/* Security Notice */}
            <div className="rounded-lg border border-blue-500/30 bg-blue-900/20 p-3 text-center">
              <p className="text-xs text-blue-300">
                🔒 Secure payment powered by cosmic encryption technology
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
