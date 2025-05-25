import React, { useRef, useState } from "react";
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from "lucide-react";

interface SliderSectionProps<T> {
  title: string;
  items: T[];
  renderCard: (item: T, idx: number) => React.ReactNode;
}

export default function SliderSection<T>({
  title,
  items,
  renderCard,
}: SliderSectionProps<T>) {
  const [isOpen, setIsOpen] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollBy = (distance: number) => {
    containerRef.current?.scrollBy({ left: distance, behavior: "smooth" });
  };

  return (
    <div className="my-8">
      {/* Header */}
      <div
        className="flex cursor-pointer items-center justify-between border-t border-gray-600 pt-4"
        onClick={() => setIsOpen((o) => !o)}
      >
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </div>

      {isOpen && (
        <div className="relative mt-4">
          {/* Left Arrow */}
          <button
            onClick={() => scrollBy(-containerRef.current!.clientWidth)}
            className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-1 text-white hover:bg-black"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Cards Container */}
          <div
            ref={containerRef}
            className="no-scrollbar flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4"
          >
            {items.map((item, idx) => (
              <div key={idx} className="snap-start">
                {renderCard(item, idx)}
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => scrollBy(containerRef.current!.clientWidth)}
            className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-1 text-white hover:bg-black"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
