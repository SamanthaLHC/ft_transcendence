import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";

interface RankingData {
	id: number;
	login: string;
	name: string;
	nbwin: number
}

const Ranking: React.FC = () => {

	const [cookies] = useCookies(['access_token']);
	const [rankingData, setRankingData] = useState<RankingData[]>([]);

	useEffect(() => {
		const getRanking = async () => {
			try {
				const req = new Request("http://" + process.env.REACT_APP_HOSTNAME + ":3000/users/get_class", {
					method: "GET",
					headers: {
						Authorization: `Bearer ${cookies.access_token}`,
					},
				});

				const response = await fetch(req);
				if (response.ok) {
					const data = await response.json();
					setRankingData(data);
				}
			} catch (error) {
				console.error(error);
			}
		};
		getRanking();
	}, [cookies.access_token]);

	return (
		<React.Fragment>

			<h2 className="typo-friends yellow typo-pos"> Ranking </h2>
			<div>
				<table className="styled-table">
					<thead>
						<tr>
							<th>Rank</th>
							<th>Name</th>
							<th>Wins</th>
						</tr>
					</thead>
					<tbody>
						{rankingData.map((item, index) => (
							<tr className="active-row" key={index}>
								<td>{index + 1}</td>
								<td>{item.name}</td>
								<td>{item.nbwin}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</React.Fragment>

	)
}

export default Ranking;