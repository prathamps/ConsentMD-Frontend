import axios from "axios"
import Cookies from "js-cookie"

const api = axios.create({
	baseURL: "http://40.114.45.2:3000/v1", // This should be in an env file
	headers: {
		"Content-Type": "application/json",
	},
})

api.interceptors.request.use(
	(config) => {
		const token = Cookies.get("accessToken")
		if (token) {
			config.headers["Authorization"] = `Bearer ${token}`
		}
		return config
	},
	(error) => {
		return Promise.reject(error)
	}
)

export default api
