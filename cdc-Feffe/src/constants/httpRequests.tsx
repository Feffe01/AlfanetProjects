import axios from "axios";
import { mainHost } from "./endpoints";

export const GET =	async( endpoint: string, params?: object | null, setData?: (value: any) => void) =>
{
	console.log("GET", mainHost + endpoint, params);

	const token = localStorage.getItem('token');
    if (!token) {
        console.error("No token found");
        return;
    }

	try {
			const response = await axios.get(mainHost + endpoint, {
					headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${token}`,
					},
					params: params || undefined
			});
			console.log("GET response: ", response);
			if (setData) {
					setData(response.data);
			}
			return response.data;
	} catch (error) {
			console.error(error);
			throw error;
	}
}

export const POST =	async( endpoint: string, data: object) =>
{
	console.log("POST", mainHost + endpoint, data);

	const token = localStorage.getItem('token');
    if (!token) {
        console.error("No token found");
        return;
    }

	try {
		const response = await axios.post(mainHost + endpoint, data,
			{
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`,
				},
			}
		)
		console.log("POST response: ", response);
		return response.data;
	} catch (error) {
		console.error(error);
		throw error;
	}
}

export const PUT = async( endpoint: string, data: object) =>
	{
		console.log("PUT", mainHost + endpoint, data);
	
		const token = localStorage.getItem('token');
    if (!token) {
        console.error("No token found");
        return;
    }

		try {
			const response = await axios.put(mainHost + endpoint, data,
				{
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${token}`,
					},
				}
			)
			console.log("PUT response: ", response);
			return response.data;
		} catch (error) {
			console.error(error);
			throw error;
		}
	}

export const PATCH = async( endpoint: string, data: object) =>
{
	console.log("PATCH", mainHost + endpoint, data);

	const token = localStorage.getItem('token');
    if (!token) {
        console.error("No token found");
        return;
    }

	try {
		const response = await axios.patch(mainHost + endpoint, data,
			{
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`,
				},
			}
		)
		console.log("PATCH response: ", response);
		return response.data;
	} catch (error) {
		console.error(error);
		throw error;
	}
}
