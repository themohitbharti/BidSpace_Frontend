import { Input } from "./index";
import { Button } from "./index";

export default function SearchBar() {
  return (
    <div className="flex flex-col gap-6">
      {/* Search */}
      <div className="flex w-full items-center overflow-hidden rounded-lg bg-gray-800">
        <Input
          placeholder="Search products"
          className="flex-grow border-none bg-transparent text-black focus:ring-0"
        />
        <Button className="rounded-none bg-blue-500 px-6 text-white">
          Find
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          className="border-gray-600 text-white transition-colors hover:border-blue-400 hover:bg-blue-500"
        >
          Live
        </Button>
        <Button
          variant="outline"
          className="border-gray-600 text-white transition-colors hover:border-blue-400 hover:bg-blue-500"
        >
          Sold
        </Button>
        <Button
          variant="outline"
          className="border-gray-600 text-white transition-colors hover:border-blue-400 hover:bg-blue-500"
        >
          Unsold
        </Button>
      </div>
    </div>
  );
}
