import { Box, Button, CircularProgress, Typography } from '@mui/material';
import { BarChart, BarSeriesType } from '@mui/x-charts';
import React, { useEffect, useState } from 'react';
import { GET } from '../constants/httpRequests';
import { productionGraphDataEndpoint } from '../constants/endpoints';
import dayjs, { Dayjs } from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers';

interface DataPoint {
  x: string;
  y: number;
  index: number;
}

interface ActivityData {
  activity: string;
  data: DataPoint[];
}

export default function GraphPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [dataset, setDataset] = useState<ActivityData[]>([]);
  const [date, setDate] = useState<Dayjs | null>(dayjs());
	const graphColors = ['#A8E6CE', '#DCEDC2', '#FFD3B5', '#FFAAA6', '#e2c1ff', '#ffc1c1',];

	//GETTING DATA FOR CHART
	const fetchData = async() => {
		try {
			// setIsLoading(true);
			await GET(productionGraphDataEndpoint, { dataInizio: date?.toISOString() }, setDataset);
		} catch {
			alert("Si è verificato un errore inaspettato con il server. Si prega di riprovare.");
		} finally {
			setIsLoading(false);
		}
	}

  useEffect(() => {
		fetchData();
  }, [date]);

  const transformDataForChart = (data: ActivityData[]) => {
    const xAxisLabels: Set<string> = new Set();
    const series: Record<string, number[]> = {};

    // Loop over each activity set
    data.forEach((activitySet) => {
      const activity = activitySet.activity;
      series[activity] = [];

			// Loop over each activity's data
      activitySet.data.forEach((entry) => {
        const date = entry.x;
        xAxisLabels.add(date);
        series[activity].push(entry.y);
      });
    });

    const xAxisData = Array.from(xAxisLabels);

    const alignedSeries: BarSeriesType[] = Object.keys(series).map((activity) => {
      const alignedData = xAxisData.map((date, index) => {
        return series[activity][index] !== undefined ? series[activity][index] : 0;
      });

      return { label: activity, data: alignedData, type: "bar" };
    });

    return { xAxisData, alignedSeries };
  };

  const { xAxisData, alignedSeries } = transformDataForChart(dataset);

	// PAGE
  return (
    <Box
      width={"100%"}
      height={"100%"}
      padding={"40px 5%"}
      display={"flex"}
      flexDirection={"column"}
      alignItems={"center"}
      gap={"20px"}
    >
      <Typography variant={"h2"} color={"primary"} fontWeight={800} textAlign={"center"} gutterBottom>
        GRAFICO PRODUZIONE
      </Typography>
			<Box display="flex" gap="20px" alignItems="center">
				<Typography>Giorno selezionato:</Typography>
				<DatePicker
					value={date}
					onChange={(date) => setDate(date)}
					format="DD MMMM YYYY"
					maxDate={dayjs()}
				/>
				<Button
					onClick={() => setDate(dayjs())}
					variant="outlined"
				>
					Oggi
				</Button>
			</Box>
      <Box flex={1} width={'100%'}>
				{isLoading ?
					<Box display="flex" justifyContent="center" alignItems="center" height={"100%"}>
						<CircularProgress />
					</Box>
				:
					<BarChart
						xAxis={[{ scaleType: 'band', data: xAxisData }]}
						series={alignedSeries}
						colors={graphColors}
						grid={{ horizontal: true }}
					/>
				}
      </Box>
    </Box>
  );
}