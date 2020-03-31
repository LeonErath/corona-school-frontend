import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import {
	baseUrl,
	getJobs,
	login,
	postChangeStatus,
	postVerifyStudent,
	getLoginStatus
} from "./urls.js";
import useInterval from "./interval";

const ApiContext = React.createContext();
axios.defaults.withCredentials = true;

const ApiContextComponent = ({ children, history }) => {
	const [userIsLoggedIn, setUserIsLoggedIn] = useState(false);
	const [studentData, setStudentData] = useState([]);

	useInterval(() => {
		if (userIsLoggedIn) {
			getJobsCall();
		}
	}, 1000);

	useEffect(() => {
		if (userIsLoggedIn) {
			getJobsCall();
		}
	}, []);

	const loginCall = data => {
		axios
			.post(baseUrl + login, data)
			.then(resp => {
				console.log(resp);

				setUserIsLoggedIn(true);
				history.push("/screening");
			})
			.catch(err => {
				console.log("login Failed", err);
			});
	};

	const getJobsCall = () => {
		axios
			.get(baseUrl + getJobs)
			.then(({ data }) => setStudentData(data))
			.catch(err => {
				console.log("Get Jobs failed.", err);
			});
	};

	const checkLoginStatus = () => {
		return axios.get(baseUrl + getLoginStatus);
	};

	const postChangeStatusCall = data => {
		axios
			.post(baseUrl + postChangeStatus, data)
			.then(resp => console.log(resp))
			.catch(err => console.error(err));
	};

	const postVerifyStudentCall = data => {
		axios
			.post(baseUrl + postVerifyStudent, data)
			.then(getJobsCall())
			.catch(err => console.error(err));
	};

	return (
		<ApiContext.Provider
			value={{
				getJobsCall,
				studentData,
				checkLoginStatus,
				postChangeStatusCall,
				postVerifyStudentCall,
				userIsLoggedIn,
				setUserIsLoggedIn,
				loginCall
			}}>
			{children}
		</ApiContext.Provider>
	);
};

export default withRouter(ApiContextComponent);
export { ApiContext };
