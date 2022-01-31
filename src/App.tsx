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

// States
export type ApiData = {
  title: string;
  cities: Cities;
}[];

type Cities = {
  title: string;
  forcast: Forcasts;
}[];

type Forcasts = {
  date: number;
  minTemp: number;
  maxTemp: number;
  weather: string;
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
const formatData = (data: Forcasts): FormattedData => {
  return data.map((day) => {
    return {
      date: numToDate(day.date),
      temp: {
        celcius: {
          low: day.minTemp,
          high: day.maxTemp,
        },
        farenheit: {
          low: cToF(day.minTemp),
          high: cToF(day.maxTemp),
        },
      },
      weather: day.weather,
    };
  });
};

const App = () => {
  const [forcastData, setForcastData] = useState<
    FormattedData | null | "LOADING"
  >("LOADING");
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [selectedCityIndex, setSelectedCityIndex] = useState<{
    stateIndex: number;
    cityIndex: number;
  }>({ stateIndex: 0, cityIndex: 0 });
  const [isNavClosed, setIsNavClosed] = useState(true);
  const [isCelciusSelected, setIsCelciusSelected] = useState(false);
  const [weatherData, setWeatherData] = useState<ApiData | null>(null);

  useEffect(() => {
    if (weatherData !== null) {
      const forcast =
        weatherData[selectedCityIndex.stateIndex].cities[
          selectedCityIndex.cityIndex
        ].forcast;
      const formattedData = formatData(forcast);
      setForcastData(formattedData);
    }
  }, [selectedCityIndex, weatherData]);

  /**
   * This effect fetches the data from the api and sets that data in the
   * forcastData state. If the api fails, weatherData state is set to null
   */
  useEffect(() => {
    if (forcastData === "LOADING") {
      try {
        axios
          .get("https://c96e-68-81-220-91.ngrok.io/states")
          .then((response) => {
            const data: ApiData = response.data;
            setWeatherData(data);
            const formattedData = formatData(data[0].cities[0].forcast);
            setForcastData(formattedData);
          });
      } catch {
        setForcastData(null);
      }
    }
  }, [forcastData]);

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

  if (forcastData === "LOADING") {
    return (
      <div className="w-screen h-screen pt-40 text-4xl text-center text-white bg-blue">
        Loading...
      </div>
    );
  }

  if (forcastData === null || weatherData === null) {
    return (
      <div className="w-screen h-screen pt-40 text-4xl text-center text-white bg-blue">
        The api is down, please try again later.
      </div>
    );
  }

  const selectedDay = forcastData[selectedDayIndex];

  const isToday = selectedDay.date.isToday();

  const { text, imgSrc } = formatWeatherString(selectedDay.weather);

  let city =
    weatherData[selectedCityIndex.stateIndex].cities[
      selectedCityIndex.cityIndex
    ];

  return (
    <div className="w-screen h-screen pt-20 overflow-hidden text-center text-white bg-blue">
      <h2 className="text-2xl">{`${
        isToday ? "Today, " : ""
      }${selectedDay.date.format("MMMM DD")}`}</h2>
      <h1 className="text-3xl font-bold">{`${city.title}, ${
        city.title === "New York" ? "NY" : "PA"
      }`}</h1>
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
        {forcastData.map((day, index) => {
          const { text, imgSrc } = formatWeatherString(day.weather);
          const isSelected = index === selectedDayIndex;
          return (
            <div
              onClick={() => setSelectedDayIndex(index)}
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
        data={weatherData}
        setSelectedCityIndex={setSelectedCityIndex}
      />
    </div>
  );
};

export default App;
