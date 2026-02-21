import Body from "./Body";
import Section1 from "./Section1";

function Home() {
  return (
    <div className="min-h-screen flex flex-col">

      {/* Hero / Section1 */}
      <Section1 />

      {/* Divider */}
      <div className="px-4 sm:px-6 lg:px-8">
        <hr className="border-t border-gray-300 mt-6" />
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <Body />
      </div>

    </div>
  );
}

export default Home;
