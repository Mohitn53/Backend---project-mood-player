import { createContext,useContext } from "react";
import { useState } from "react";

export const MoodContext = createContext()


const MoodProvider = ({children}) => {
    const [mood, setmood] = useState(null)
  return (
    <MoodContext.Provider value={[mood, setmood]}>
        {children}
    </MoodContext.Provider>
  )
}

export default MoodProvider
export function useMood() {
  return useContext(MoodContext)
}