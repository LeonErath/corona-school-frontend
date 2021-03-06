import React, { useState } from "react";
import {
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	Area,
	AreaChart,
} from "recharts";
import * as MomentLib from "moment";
import { Typography, Radio } from "antd";
import { extendMoment } from "moment-range";

import "./JobPerDay.less";
import { Statistic } from "../../api/useStatistics";

const moment = extendMoment(MomentLib);
const { Title } = Typography;

interface Props {
	statistics: Statistic[];
}

const JobPerDay = ({ statistics }: Props) => {
	const [period, setPeriod] = useState("a");

	const initializeCount = (
		startDate: MomentLib.Moment,
		stopDate: MomentLib.Moment
	) => {
		const range = moment.range(startDate, stopDate).snapTo("day");

		let counts: { [key: string]: number } = {};

		Array.from(range.by("days")).forEach((m) => {
			const key = m.format("YYYY-MM-DD");
			counts[key] = 0;
		});

		return counts;
	};

	const renderCompletedInDay = () => {
		const dates = statistics.map((s) => moment(s.createdAt));
		const stats = statistics.map((s) =>
			moment(s.createdAt).format("YYYY-MM-DD")
		);

		const minDate = moment.min(...dates);
		const maxDate = moment.max(...dates);

		const counts = initializeCount(minDate, maxDate);
		console.log(counts);

		for (const dateString of stats) {
			counts[dateString] = 1 + (counts[dateString] || 0);
		}

		const dateFormat = period === "a" ? "dddd" : "DD.MM dddd";
		let graphData: { day: string; count: number }[] = Object.keys(counts)
			.map((key) => ({
				label: moment(key).format(dateFormat),
				day: key,
				count: counts[key],
			}))
			.sort((a, b) => moment(a.day).unix() - moment(b.day).unix());

		let interval = 0;

		if (period === "a") {
			graphData = graphData.slice(Math.max(graphData.length - 7, 1));
		}

		if (period === "b") {
			graphData = graphData.slice(Math.max(graphData.length - 14, 1));
			interval = 1;
		}

		if (period === "c") {
			interval = Math.round(graphData.length / 7);
		}

		return (
			<AreaChart
				width={1000}
				height={400}
				data={graphData}
				margin={{
					top: 16,
					right: 16,
					left: 16,
					bottom: 16,
				}}>
				<defs>
					<linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
						<stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
						<stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
					</linearGradient>
				</defs>
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis dataKey="label" interval={interval} />
				<YAxis />
				<Tooltip />
				<Legend />
				<Area
					type="monotone"
					dataKey="count"
					stroke="#8884d8"
					fillOpacity={1}
					fill="url(#colorUv)"
					strokeWidth="1px"
					activeDot={{ r: 8 }}
				/>
			</AreaChart>
		);
	};
	return (
		<div className="job-per-day">
			<div className="dashboard-header-jobs">
				<Title level={4} style={{ color: "#6c757d", marginTop: 0 }}>
					Anzahl an Jobs
				</Title>
				<Radio.Group
					value={period}
					onChange={(change) => setPeriod(change.target.value)}>
					<Radio.Button value="a">1W</Radio.Button>
					<Radio.Button value="b">2W</Radio.Button>
					<Radio.Button value="c">Gesamt</Radio.Button>
				</Radio.Group>
			</div>
			<div>{renderCompletedInDay()}</div>
		</div>
	);
};

export default JobPerDay;
