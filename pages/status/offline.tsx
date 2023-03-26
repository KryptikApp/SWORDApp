import type { NextPage } from "next";

const Offline: NextPage = () => {
  return (
    <div>
      <div className="h-[10rem]">
        {/* padding div for space between top and main elements */}
      </div>

      <div className="text-center max-w-2xl mx-auto content-center">
        <h1 className="text-5xl font-bold sans dark:text-white">
          SWORD example Requires An Internet Connection!
        </h1>
      </div>
      <div className="h-[10rem]">
        {/* padding div for space between top and main elements */}
      </div>
    </div>
  );
};

export default Offline;
