import { useEffect } from 'react'
import { GET } from '../constants/httpRequests';
import { timeoffsEndpoint } from '../constants/endpoints';
import dayjs from 'dayjs';

export default function PaySlipsPage() {

	useEffect(() => {
		GET(timeoffsEndpoint, {dataInizio: dayjs("11/07/2024").toISOString()});
	}, []);

	return (
		<p>PaySlipsPage</p>
	)
}
