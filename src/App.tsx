import axios from "axios";
import Menu from "components/Menu";
import NavButton from "components/NavButton";
import dayjs, { Dayjs } from "dayjs";
import isToday from "dayjs/plugin/isToday";
import clearSvg from "assets/icons/clear.svg";
import pCloudySvg from "assets/icons/pCloudy.svg";
import mCloudySvg from "assets/icons/mCloudy.svg";
import cloudySvg from "assets/icons/cloudy.svg";
import rainSvg from "assets/icons/rain.svg";
import snowSvg from "assets/icons/snow.svg";
import tsSvg from "assets/icons/ts.svg";
import { useEffect, useState } from "react";
dayjs.extend(isToday);

type ApiData = {
  date: number;
  temp2m: {
    max: number;
    min: number;
  };
  weather: string;
  wind10m_max: number;
}[];

export type FormattedData = {
  date: Dayjs;
  temp: {
    celcius: {
      low: number;
      high: number;
    };
    farenheit: {
      low: number;
      high: number;
    };
  };
  weather: string;
}[];

/**
 * Converts celcius to farenheit
 */
const cToF = (celcius: number) => {
  return Math.round(celcius * 1.8 + 32);
};

/**
 * Coverts the number from api to a Dayjs object
 *
 * @example
 * const num = 20220126
 *
 * const dateObj = numToDate(num)
 *
 * dateObj.format("MM DD YYYY") // "01 26 2022"
 */
const numToDate = (num: number): Dayjs => {
  const str = num.toString();
  const year = str.slice(0, 4);
  const month = str.slice(4, 6);
  const day = str.slice(6);
  const strDate = `${year}-${month}-${day} 00:00`;
  return dayjs(strDate);
};

/**
 * Converts { ApiData } to { FormattedData }
 */
const formatData = (data: ApiData): FormattedData => {
  return data.map((day) => {
    return {
      date: numToDate(day.date),
      temp: {
        celcius: {
          low: day.temp2m.min,
          high: day.temp2m.max,
        },
        farenheit: {
          low: cToF(day.temp2m.min),
          high: cToF(day.temp2m.max),
        },
      },
      weather: day.weather,
    };
  });
};

const App = () => {
  const [weatherData, setWeatherData] = useState<
    FormattedData | null | "LOADING"
  >("LOADING");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isNavClosed, setIsNavClosed] = useState(true);
  const [isCelciusSelected, setIsCelciusSelected] = useState(false);

  /**
   * This effect fetches the data from the api and sets that data in the
   * weatherData state. If the api fails, weatherData state is set to null
   */
  useEffect(() => {
    if (weatherData === "LOADING") {
      try {
        axios
          .get(
            "https://www.7timer.info/bin/api.pl?lon=-76.887&lat=40.273&product=civillight&unit=british&output=json"
          )
          .then((response) => {
            const data: ApiData = response.data.dataseries;
            const formattedData = formatData(data);
            setWeatherData(formattedData);
          });
      } catch {
        setWeatherData(null);
      }
    }
  }, [weatherData]);

  /**
   * Takes in the 'weather' string from api and returns the formatted text
   * and image src for the graphic
   */
  const formatWeatherString = (str: string) => {
    console.log(str);
    switch (str) {
      case "clear":
        return { text: "Clear", imgSrc: clearSvg };
      case "pcloudy":
        return { text: "Partly Cloudy", imgSrc: pCloudySvg };
      case "mcloudy":
        return { text: "Cloudy", imgSrc: mCloudySvg };
      case "cloudy":
        return { text: "Cloudy", imgSrc: cloudySvg };
      case "rain":
        return { text: "Rain", imgSrc: rainSvg };
      case "lightrain":
        return { text: "Light Rain", imgSrc: rainSvg };
      case "snow":
        return { text: "Snow", imgSrc: snowSvg };
      case "ts":
        return { text: "Thunderstorm", imgSrc: tsSvg };
      case "tsrain":
        return { text: "Thunderstorm with Rain", imgSrc: tsSvg };
      case "lightsnow":
        return { text: "Light Snow", imgSrc: snowSvg };
      default:
        return { text: "Unkown", imgSrc: clearSvg };
    }
  };

  if (weatherData === "LOADING") {
    return (
      <div className="w-screen h-screen pt-40 text-4xl text-center text-white bg-blue">
        Loading...
      </div>
    );
  }

  if (weatherData === null) {
    return (
      <div className="w-screen h-screen pt-40 text-4xl text-center text-white bg-blue">
        The api is down, please try again later.
      </div>
    );
  }

  const selectedDay = weatherData[selectedIndex];

  const isToday = selectedDay.date.isToday();

  const { text, imgSrc } = formatWeatherString(selectedDay.weather);

  return (
    <div className="w-screen h-screen pt-20 overflow-hidden text-center text-white bg-blue">
      <h2 className="text-2xl">{`${
        isToday ? "Today, " : ""
      }${selectedDay.date.format("MMMM DD")}`}</h2>
      <h1 className="text-3xl font-bold">Harisburg, PA</h1>
      <img
        className="w-40 mx-auto mt-12 mb-6"
        src={imgSrc}
        alt="Clear Weather"
      />
      <h3 className="mr-16 font-bold text-8xl">
        <span className="text-2xl font-normal align-middle">(high)</span>
        {isCelciusSelected
          ? selectedDay.temp.celcius.high
          : selectedDay.temp.farenheit.high}
        <span className="absolute text-2xl">
          °{isCelciusSelected ? "C" : "F"}
        </span>
      </h3>
      <h4 className="text-xl">{text}</h4>
      <h4 className="mr-6 text-xl">
        (low){" "}
        {isCelciusSelected
          ? selectedDay.temp.celcius.low
          : selectedDay.temp.farenheit.low}
        <span className="absolute text-xl">°F</span>
      </h4>

      <section className="mt-12 grid-cols-7 grid">
        {weatherData.map((day, index) => {
          const { text, imgSrc } = formatWeatherString(day.weather);
          const isSelected = index === selectedIndex;
          return (
            <div
              onClick={() => setSelectedIndex(index)}
              key={index}
              className={`py-3 rounded ${
                isSelected ? "bg-black/60" : "hover:bg-black/50"
              } ease-in transition`}
            >
              <h5 className="text-lg uppercase">{day.date.format("ddd")}</h5>
              <img className="mx-auto my-4" src={imgSrc} alt="Clear Weather" />
              <h1 className="hidden md:block">{text}</h1>
              <h5 className="pr-6 text-lg">
                {isCelciusSelected
                  ? day.temp.celcius.high
                  : day.temp.farenheit.high}
                <span className="absolute text-lg">
                  °{isCelciusSelected ? "C" : "F"}
                </span>
              </h5>
            </div>
          );
        })}
      </section>
      <NavButton
        isNavClosed={isNavClosed}
        onClick={() => setIsNavClosed(!isNavClosed)}
      />
      <Menu
        isOpen={!isNavClosed}
        setIsClosed={() => setIsNavClosed(true)}
        isCelciusSelected={isCelciusSelected}
        setIsCelciusSelected={setIsCelciusSelected}
      />
    </div>
  );
};

export default App;
