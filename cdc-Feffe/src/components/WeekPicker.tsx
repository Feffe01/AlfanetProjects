import React, { useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';

dayjs.extend(isoWeek);

interface WeekPickerProps {
  onWeekChange: (startOfWeek: Dayjs) => void;
}

const WeekPicker: React.FC<WeekPickerProps> = ({ onWeekChange }) => {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs().startOf('isoWeek'));

  const handleWeekChange = (date: Dayjs | null) => {
    if (date) {
      const startOfWeek = date.startOf('isoWeek');
			if (!startOfWeek.isSame(selectedDate, 'day'))
			{
      	setSelectedDate(startOfWeek);
      	onWeekChange(startOfWeek);
			}
    }
  };

  return (
		<DatePicker
			label="Settimana selezionata"
			value={selectedDate}
			onChange={handleWeekChange}
			format="DD MMMM YYYY"
		/>
  );
};

export default WeekPicker;
