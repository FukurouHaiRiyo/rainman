import React from 'react';

interface SearcTextInputProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

const SearchTextInput: React.FC<SearcTextInputProps> = ({ searchTerm, setSearchTerm }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event?.target.value);
  }

  return (
    <input 
      type='text'
      id='search-input'
      className='bg-white border rounded px-2 py-1 ml-2'
      placeholder='Enter search term'
      onChange={handleChange}
      value={searchTerm}
    />
  )
}

export default SearchTextInput;