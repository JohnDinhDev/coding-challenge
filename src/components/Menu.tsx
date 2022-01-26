import { useRef } from "react";
import useClickOutside from "hooks/ClickOutside";
interface Props {
  isOpen: boolean;
  setIsClosed: Function;
  isCelciusSelected: boolean;
  setIsCelciusSelected: React.Dispatch<React.SetStateAction<boolean>>;
}
const Menu = (props: Props) => {
  const { isOpen, isCelciusSelected, setIsCelciusSelected, setIsClosed } =
    props;
  const menuRef = useRef<HTMLDivElement>(null);
  useClickOutside(menuRef, () => setIsClosed());
  return (
    <div
      ref={menuRef}
      className={`${
        isOpen ? "right-0" : "-right-full"
      } transition-all duration-500 fixed w-screen lg:w-1/4 top-0 h-screen bg-midnight`}
    >
      <div className="absolute flex justify-between inline px-12 py-6 text-white rounded -12 w-96 bg-black/50 left-1/2 top-1/2 -translate-x-1/2">
        <button
          onClick={() => setIsCelciusSelected(true)}
          className="font-bold"
        >
          Celcius
        </button>
        <button
          onClick={() => setIsCelciusSelected(false)}
          className="font-bold"
        >
          Fahrenheit
        </button>
        <div
          className={`${
            isCelciusSelected ? "left-0" : "left-40"
          } absolute top-0 px-4 py-3 transition-all`}
        >
          <button className="px-12 py-3 font-bold rounded bg-blue">
            {isCelciusSelected ? "Celcius" : "Fahrenheit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Menu;
