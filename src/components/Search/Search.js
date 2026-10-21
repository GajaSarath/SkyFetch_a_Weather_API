import React, { useState } from 'react';
import { AsyncPaginate } from 'react-select-async-paginate';
import { fetchCities } from '../../api/OpenWeatherService';

const Search = ({ onSearchChange }) => {
  const [searchValue, setSearchValue] = useState(null);

  const loadOptions = async (inputValue) => {
    const citiesList = await fetchCities(inputValue);

    return {
      options: citiesList.data.map((city) => {
        return {
          value: `${city.latitude} ${city.longitude}`,
          label: `${city.name}, ${city.countryCode}`,
        };
      }),
    };
  };

  const onChangeHandler = (enteredData) => {
    setSearchValue(enteredData);
    onSearchChange(enteredData);
  };

  return (
    <AsyncPaginate
      placeholder="🌎 Search for a city to get its weather..."
      debounceTimeout={600}
      value={searchValue}
      onChange={onChangeHandler}
      loadOptions={loadOptions}
      styles={{
        control: (provided) => ({
          ...provided,
          background: 'rgba(255,255,255,0.05)',
          border: '2px solid transparent',
          borderImage: 'linear-gradient(90deg, #2d95bd, #00c6ff) 1',
          borderRadius: '8px',
          backdropFilter: 'blur(10px)',
          color: 'white',
          padding: '2px 4px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }),
        placeholder: (provided) => ({
          ...provided,
          color: 'rgba(255,255,255,0.6)',
          fontFamily: 'Poppins, Roboto, sans-serif',
          fontSize: '14px',
        }),
        singleValue: (provided) => ({
          ...provided,
          color: 'white',
          fontFamily: 'Poppins, Roboto, sans-serif',
          fontSize: '14px',
        }),
        menu: (provided) => ({
          ...provided,
          background: 'rgba(0,0,0,0.8)',
          borderRadius: '8px',
          overflow: 'hidden',
        }),
        option: (provided, state) => ({
          ...provided,
          backgroundColor: state.isFocused ? 'rgba(45,149,189,0.5)' : 'transparent',
          color: 'white',
          cursor: 'pointer',
        }),
      }}
    />
  );
};

export default Search;
