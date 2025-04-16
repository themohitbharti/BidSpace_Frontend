import {
  HeroSlider,
  SearchBar,
  Container,
  HomeStats,
  CardsByCategory,
} from "../components/index";

export default function Home() {
  return (
    <div>
      <HeroSlider />

      <div className="py-12">
        <Container>
          <div className="grid grid-cols-1 gap-8 md:gap-12 lg:grid-cols-3">
            {/* Search Section - Takes up 2/3 of the space */}
            <div className="space-y-6 lg:col-span-2">
              <h2 className="mb-6 text-3xl font-bold text-white">
                Find Your Favourite Bids
              </h2>
              <div className="max-w-2xl">
                <SearchBar />
              </div>
            </div>

            {/* Stats Section - Takes up 1/3 of the space */}
            <div className="flex items-center lg:col-span-1">
              <HomeStats />
            </div>
          </div>
        </Container>
      </div>

      <div>
        <CardsByCategory />
      </div>
    </div>
  );
}
