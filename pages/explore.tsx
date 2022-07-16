import type { NextPage } from 'next'
import { Toaster } from 'react-hot-toast';

import SearchNetwork from '../components/search/searchNetwork';


const Explore: NextPage = () => {

  return (
    <div>
        <Toaster/>
        <div className="h-[10rem]">
          {/* padding div for space between top and main elements */}
        </div>
        
        <div className="text-center max-w-2xl mx-auto content-center">
          <SearchNetwork/>
        </div>

        <div className="h-[10rem]">
          {/* padding div for space between top and main elements */}
        </div>
    </div>
 
  )
}

export default Explore