import { createContext, useState, useEffect, useContext } from "react";
import { API_URL } from "../constant";
import PropTypes from "prop-types";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [places, setPlaces] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [flights, setFlights] = useState([]);

  useEffect(() => {
    const fetchData = async (endpoint, stateSetter) => {
      try {
        const response = await fetch(`${API_URL}/${endpoint}`);
        const result = await response.json();

        console.log(`Fetched ${endpoint}:`, result);

        if (result?.status === "success" && Array.isArray(result.data)) {
          stateSetter(result.data);
        } else {
          console.error(`Invalid data format for ${endpoint}`);
          stateSetter([]);
        }
      } catch (error) {
        console.error(`Failed to fetch ${endpoint}:`, error);
        stateSetter([]);
      }
    };

    fetchData("places", setPlaces);
    fetchData("hotels", setHotels);
    fetchData("flights", setFlights);
  }, []);

  const resetData = () => {
    setPlaces([]);
    setHotels([]);
    setFlights([]);
  };

  return (
    <DataContext.Provider value={{ places, hotels, flights, resetData }}>
      {children}
    </DataContext.Provider>
  );
};

DataProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useData = () => useContext(DataContext);