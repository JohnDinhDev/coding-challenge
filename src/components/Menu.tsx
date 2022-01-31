import { useEffect, useRef, useState } from "react";
import useClickOutside from "hooks/ClickOutside";
import { ApiData } from "App";
interface Props {
  isOpen: boolean;
  setIsClosed: Function;
  isCelciusSelected: boolean;
  setIsCelciusSelected: React.Dispatch<React.SetStateAction<boolean>>;
  data: ApiData | null;
  setSelectedCityIndex: Function;
}
const Menu = (props: Props) => {
  const {
    data,
    setSelectedCityIndex,
    isOpen,
    isCelciusSelected,
    setIsCelciusSelected,
    setIsClosed,
  } = props;
  const menuRef = useRef<HTMLDivElement>(null);
  useClickOutside(menuRef, () => setIsClosed());

  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (data !== null) {
      const arr: any = [];
      data.forEach((state, stateIndex) => {
        state.cities.forEach((city, cityIndex) => {
          arr.push({ stateIndex, cityIndex });
        });
      });

      setOptions(arr);
    }
  }, [data]);

  return (
    <div
      ref={menuRef}
      className={`${
        isOpen ? "right-0" : "-right-full"
      } transition-all duration-500 fixed w-screen lg:w-1/4 top-0 h-screen bg-midnight`}
    >
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2">
        <div className="flex justify-between inline px-12 py-6 text-white rounded w-96 bg-black/50">
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

      <select
        onChange={(e) => {
          const valueArr = e.target.value.split("");
          setSelectedCityIndex({
            stateIndex: parseInt(valueArr[0]),
            cityIndex: parseInt(valueArr[2]),
          });
        }}
        className="text-black"
      >
        {data !== null && options.length > 0
          ? options.map((option, index) => {
              // @ts-ignore
              const city = data[option.stateIndex].cities[option.cityIndex];
              return (
                <option
                  //@ts-ignore
                  value={`${option.stateIndex} ${option.cityIndex}`}
                  key={index}
                >
                  {city.title}
                </option>
              );
            })
          : null}
      </select>
    </div>
  );
};

export default Menu;
