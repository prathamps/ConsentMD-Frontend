exports.handler = async (event, context) => {
	const { httpMethod, path, body, headers } = event

	// Remove /api from the path since Netlify functions add it
	const apiPath = path.replace("/.netlify/functions/api-proxy", "")

	const apiUrl = `http://40.114.45.2:3000/v1${apiPath}`

	try {
		const response = await fetch(apiUrl, {
			method: httpMethod,
			headers: {
				"Content-Type": "application/json",
				...(headers.authorization && { Authorization: headers.authorization }),
			},
			...(body && { body }),
		})

		const data = await response.text()

		return {
			statusCode: response.status,
			headers: {
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Headers": "Content-Type, Authorization",
				"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
			},
			body: data,
		}
	} catch (error) {
		return {
			statusCode: 500,
			body: JSON.stringify({ error: "Proxy error" }),
		}
	}
}
