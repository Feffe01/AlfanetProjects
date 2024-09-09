import React, { useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { Box, Button, Typography } from '@mui/material';

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
		<Box display="flex" gap="20px" alignItems="center">
			<Typography>Settimana selezionata:</Typography>
			<DatePicker
				value={selectedDate}
				onChange={handleWeekChange}
				format="DD MMMM YYYY"
			/>
			<Button
				onClick={() => handleWeekChange(dayjs())}
				variant="outlined"
			>
				Attuale
			</Button>
		</Box>
  );
};

export default WeekPicker;
