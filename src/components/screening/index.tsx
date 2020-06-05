import React, { useContext, useState, useEffect } from "react";
import Jitsi from "react-jitsi";
import { useParams, withRouter, RouteComponentProps } from "react-router-dom";
import classes from "./index.module.less";
import { ApiContext, IJobInfo } from "../../api/ApiContext";
import JobScreeningEdit from "../userList/JobScreeningEdit";
import { message } from "antd";

interface MatchParams {
	room: string | undefined;
	email: string | undefined;
}

const Screening = (props: RouteComponentProps) => {
	const params = useParams<MatchParams>();
	const context = useContext(ApiContext);
	const [selectedJob, setSelectedJob] = useState<IJobInfo | null>(null);

	useEffect(() => {
		if (!params.email) {
			return;
		}

		const job = context?.studentData.find((s) => s.data.email === params.email);
		console.log(job, params.email, context?.studentData);

		if (job) {
			setSelectedJob(job);
		}
	}, [params.email, context?.studentData]);

	if (!params.room || !params.email || !selectedJob) {
		return <div>Error</div>;
	}

	const completeJob = (job: IJobInfo, decision: boolean) => {
		context
			?.postChangeStatusCall(job.data, decision ? "SET_DONE" : "SET_REJECTED")
			.then(() => {
				message.success("Änderungen wurden erfolgreich gespeichert.");
				props.history.push("/screening");
			})
			.catch(() =>
				message.error("Änderungen konnten nicht gespeichert werden")
			);
	};

	if (context === null) {
		return <div>Error</div>;
	}

	return (
		<div className={classes.container}>
			<Jitsi
				containerStyle={{ width: "100%", height: "100%" }}
				roomName={params.room}
				onAPILoad={(JitsiMeetAPI) => {
					console.log("Good Morning everyone!", JitsiMeetAPI);
				}}
			/>
			<div className={classes.editContainer}>
				<JobScreeningEdit
					showButtons
					completeJob={completeJob}
					removeJob={(email: string) => {
						context.handleRemoveJob(email);
						props.history.push("/screening");
					}}
					selectedJob={selectedJob}
					setSelectedJob={(job: IJobInfo) => setSelectedJob(job)}
				/>
			</div>
		</div>
	);
};

export default withRouter(Screening);