import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useUser } from "../Context";

interface Game {
	gameId: number;
	gagnantId: number;
	perdantId: number;
	scoreGagnant: number;
	scorePerdant: number;
}

const MatchHistory: React.FC = () => {
	const [gameHistory, setGameHistory] = useState<Game[]>([]);
	const [playerNames, setPlayerNames] = useState<{ [key: number]: string }>({});
	const [cookies] = useCookies(['access_token']);

    function getId(): string | null {
		let url_str: string = window.location.search;
		let strToSearch: URLSearchParams = new URLSearchParams(url_str);
		let code_param: string | null = strToSearch.get("id");
        console.log(code_param)
		return code_param;
	}

	useEffect(() => {
		const getMatch = async () => {

			if (getId()) {

				try {
					const req = new Request(`http://localhost:3000/users/gameHistorique/${getId()}`, {
						method: "GET",
						headers: {
							Authorization: `Bearer ${cookies.access_token}`,
						},
					});

					const response = await fetch(req);

					if (response.ok) {
						const data = await response.json();
						setGameHistory(data);

					} else {
						console.log("gameHistory request failed");
					}
				} catch (error) {
					console.error("An error occurred while fetching match data:", error);
				}
			}
		};
		getMatch();
	}, []);

	// Function to get user name by ID
	const getUserNameById = async (idUser: number) => {
		try {
			const req = new Request(`http://localhost:3000/users/id/${idUser}`, {
				method: "GET",
				headers: {
					Authorization: `Bearer ${cookies.access_token}`,
				},
			});

			const response = await fetch(req);

			if (response.ok) {
				const user = await response.json();
				return user.name;
			} else {
				console.log("request get name by id failed");
				return "Unknown";
			}
		} catch (error) {
			console.error("An error occurred while fetching user name by id:", error);
			return "Unknown";
		}
	};

	useEffect(() => {
		const uniqueIds: Array<number> = gameHistory.reduce((ids: Array<number>, game) => {
			if (ids.indexOf(game.gagnantId) === -1) {
				ids.push(game.gagnantId);
			}
			if (ids.indexOf(game.perdantId) === -1) {
				ids.push(game.perdantId);
			}
			return ids;
		}, []);
		uniqueIds.forEach((playerId) => {
			getUserNameById(playerId)
				.then((name: string) => {
					setPlayerNames((prevNames) => ({
						...prevNames,
						[playerId]: name,
					}));
				})
				.catch((error) => {
					console.error('Error fetching winner name:', error);
				});
		});
	}, [gameHistory]);

	return (
		<React.Fragment>
			<h2 className="typo-friends yellow typo-pos">Match History</h2>
			<table className="styled-table">
				<thead>
					<tr>
						<th>Match </th>
						<th>Winner</th>
						<th>Loser</th>
						<th>Winner Score</th>
						<th>Loser Score</th>
					</tr>
				</thead>
				<tbody>
					{gameHistory.map((game, index) => (
						<tr className="active-row" key={index}>
							<td>{game.gameId}</td>
							<td>{playerNames[game.gagnantId]}</td>
							<td>{playerNames[game.perdantId]}</td>
							<td>{game.scoreGagnant}</td>
							<td>{game.scorePerdant}</td>
						</tr>
					))}
				</tbody>
			</table>
		</React.Fragment>
	);
}

export default MatchHistory;