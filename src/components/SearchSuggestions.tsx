// components/SearchSuggestions.tsx


interface Props {
  items: string[];
  onSelect: (item: string) => void;
}

export default function SearchSuggestions({ items, onSelect }: Props) {
  return (
    <ul className="absolute top-full left-0 mt-1 w-full bg-white text-black rounded-lg shadow-lg overflow-hidden z-10">
      {items.map((item, i) => (
        <li
          key={i}
          onMouseDown={() => onSelect(item)}
          className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}
