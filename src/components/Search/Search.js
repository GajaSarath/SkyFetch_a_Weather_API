import React, { useState } from 'react';
import { AsyncPaginate } from 'react-select-async-paginate';
import { fetchCities } from '../../api/OpenWeatherService';

const Search = ({ onSearchChange }) => {
  const [searchValue, setSearchValue] = useState(null);
  const [searchError, setSearchError] = useState(false);

  const loadOptions = async (inputValue) => {
    setSearchError(false);
    try {
      const citiesList = await fetchCities(inputValue);
      return {
        options: citiesList.data.map((city) => ({
          value: `${city.latitude} ${city.longitude}`,
          label: [city.name, city.admin1, city.countryCode].filter(Boolean).join(', '),
        })),
        hasMore: false,
      };
    } catch {
      setSearchError(true);
      throw new Error('City search is unavailable. Edit your search to try again.');
    }
  };

  const onChangeHandler = (enteredData) => {
    setSearchValue(enteredData);
    onSearchChange(enteredData);
  };

  return (
    <AsyncPaginate
      placeholder="🌎 Search for a city to get its weather..."
      debounceTimeout={600}
      aria-label="Search for a city"
      loadOptionsOnMenuOpen={false}
      loadingMessage={() => 'Searching cities...'}
      noOptionsMessage={({ inputValue }) =>
        searchError ? 'City search is unavailable. Edit your search to try again.' :
        inputValue.trim().length < 2 ? 'Type at least 2 characters to search.' :
        'No cities found. Try another city name.'
      }
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
        input: (provided) => ({ ...provided, color: 'white' }),
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
