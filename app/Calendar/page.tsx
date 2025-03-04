'use client'

import React, { useState } from 'react';
import { Calendar } from 'react-calendar';
import "react-calendar/dist/Calendar.css";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const CalendarBox = () => {
  const [value, onChange] = useState<Value>(new Date());

  return (
    <div className='w-full max-w-full rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card'>
      <Calendar 
        onChange={onChange} value={value}
      />
    </div>
  )
}

export default CalendarBox;