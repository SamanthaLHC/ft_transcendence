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
	const [winnerNames, setWinnerNames] = useState<{ [key: number]: string }>({});
	const [loserNames, setLoserNames] = useState<{ [key: number]: string }>({});
	const [cookies] = useCookies(['access_token']);
	const { userData } = useUser();

	useEffect(() => {
		const getMatch = async () => {

			if (userData.id) {

				try {
					const req = new Request(`http://localhost:3000/users/gameHistorique/${userData.id}`, {
						method: "GET",
						headers: {
							Authorization: `Bearer ${cookies.access_token}`,
						},
					});

					const response = await fetch(req);

					if (response.ok) {
						const data = await response.json();
						console.log(data);
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
	}, [cookies.access_token, userData]);

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
		gameHistory.forEach((game, index) => {
			// Fetch winner and loser names asynchronously
			getUserNameById(game.gagnantId)
				.then((winnerName) => {
					setWinnerNames((prevWinnerNames) => ({
						...prevWinnerNames,
						[game.gagnantId]: winnerName,
					}));
				})
				.catch((error) => {
					console.error('Error fetching winner name:', error);
				});

			getUserNameById(game.perdantId)
				.then((loserName) => {
					setLoserNames((prevLoserNames) => ({
						...prevLoserNames,
						[game.perdantId]: loserName,
					}));
				})
				.catch((error) => {
					console.error('Error fetching loser name:', error);
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
							<td>{winnerNames[game.gagnantId]}</td>
							<td>{loserNames[game.perdantId]}</td>
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
