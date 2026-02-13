import { useCallback, useEffect, useState } from "react";
import { API } from "../contexts/API";
import { getErrorResponse } from "../contexts/CallBacks";
import type { CityProps, CountryProps, StateProps } from "../types/Types";

export default function useGetLocations({
  selectedCountry,
  selectedState,
}: {
  selectedCountry: string;
  selectedState: string;
}) {
  const [state, setState] = useState<StateProps[]>([]);
  const [city, setCity] = useState<CityProps[]>([]);
  const [country, setCountry] = useState<CountryProps[]>([]);

  const getCountries = useCallback(async () => {
    try {
      const countryRes = await API.get("/countries");
      setCountry(countryRes.data || []);
    } catch (error) {
      getErrorResponse(error, true);
    }
  }, []);

  const getStates = useCallback(async () => {
    if (!selectedCountry) {
      setState([]);
      setCity([]);
      return;
    }
    try {
      const stateRes = await API.get(`/states/country/${selectedCountry}`);
      setState(stateRes.data || []);
      setCity([]);
    } catch (error) {
      getErrorResponse(error, true);
    }
  }, [selectedCountry]);

  const getCities = useCallback(async () => {
    if (!selectedState) {
      setCity([]);
      return;
    }
    try {
      const cityRes = await API.get(`/cities/state/${selectedState}`);
      setCity(cityRes.data || []);
    } catch (error) {
      getErrorResponse(error, true);
    }
  }, [selectedState]);

  useEffect(() => {
    getCountries();
  }, [getCountries]);

  useEffect(() => {
    getStates();
  }, [getStates]);

  useEffect(() => {
    getCities();
  }, [getCities]);

  return { city, state, country };
}
