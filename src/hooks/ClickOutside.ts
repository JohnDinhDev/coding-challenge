import { useEffect } from "react";
const useClickOutside = (ref: any, callback: Function) => {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */

    function handleClickOutside(event: any) {
      console.log(event.target.nodeName);
      if (
        ref.current &&
        !ref.current.contains(event.target) &&
        event.target.nodeName !== "BUTTON"
      ) {
        callback();
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);
};

export default useClickOutside;
