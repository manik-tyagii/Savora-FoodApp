import { useState } from "react";
import Body from "./Body";
import Section1 from "./Section1";
import Sidebar from "./Sidebar";

function Home() {
  const [isTopRated, setIsTopRated] = useState(false);
  const [sortOrder, setSortOrder] = useState(null);

  const toggleSort = () =>
    setSortOrder((previous) =>
      previous === null ? "desc" : previous === "desc" ? "asc" : null,
    );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero / Section1 */}
      <Section1 />

      {/* Divider */}
      <div className="px-4 sm:px-6 lg:px-8">
        <hr className="border-t border-gray-300 mt-6" />
      </div>

      {/* Main Content */}
      <div className="home-content flex-1">
        <div className="mx-auto flex max-w-7xl items-start gap-2 px-2 sm:gap-5 sm:px-4 lg:px-6">
          <Sidebar
            isTopRated={isTopRated}
            setIsTopRated={setIsTopRated}
            sortOrder={sortOrder}
            toggleSort={toggleSort}
            onRefresh={() => window.location.reload()}
          />
          <div className="min-w-0 flex-1">
            <Body
              isTopRated={isTopRated}
              setIsTopRated={setIsTopRated}
              sortOrder={sortOrder}
              toggleSort={toggleSort}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
