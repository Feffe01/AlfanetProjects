import React, { useEffect } from 'react'
import { GET } from '../constants/httpRequests';
import { timbratureEndpoint } from '../constants/endpoints';
import dayjs from 'dayjs';

export default function PaySlipsPage() {

	useEffect(() => {
		GET(timbratureEndpoint, {dataInizio: dayjs().toISOString()});
	}, []);

	return (
		<p>PaySlipsPage</p>
	)
}
