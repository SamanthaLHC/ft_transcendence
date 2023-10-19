import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useUser } from "../Context";

interface MatchData {
    gameId: number;
    gagnantId: number;
    perdantId: number;
    scoreGagnant: number;
    scorePerdant: number;
    at: string;
    winnerName: string;
    loserName: string;
}

const MatchHistory: React.FC = () => {
    const [cookies] = useCookies(['access_token']);
    const [matchData, setMatchData] = useState<MatchData[]>([]);
    const { userData } = useUser();
    const idUser = userData.id;

    useEffect(() => {
        const getMatch = async () => {
            try {
                const req = new Request(`http://localhost:3000/users/gameHistorique/${idUser}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${cookies.access_token}`,
                    },
                });

                const response = await fetch(req);

                if (response.ok) {
                    const data = await response.json();
                    setMatchData(data);
                } else {
                    console.log("API request failed");
                }
            } catch (error) {
                console.error("An error occurred while fetching match data:", error);
            }
        };
        getMatch();
    }, [cookies.access_token, idUser]);

    // Function to get user name by ID
    const getUserNameById = async (userId: number) => {
        try {
            const req = new Request(`http://localhost:3000/users/id/${userId}`, {
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
                console.log("request failed");
                return "Unknown";
            }
        } catch (error) {
            console.error("An error occurred while fetching user data:", error);
            return "Unknown";
        }
    };

    useEffect(() => {
        const fetchUserNames = async () => {
            const promises = matchData.map((item) => {
                return Promise.all([getUserNameById(item.gagnantId), getUserNameById(item.perdantId)]);
            });

            Promise.all(promises).then((userNames) => {
                const updatedMatchData = matchData.map((item, index) => ({
                    ...item,
                    winnerName: userNames[index][0],
                    loserName: userNames[index][1],
                }));
                setMatchData(updatedMatchData);
            });
        };

        if (matchData.length > 0) {
            fetchUserNames();
        }
    }, [setMatchData]);

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
                    {matchData.map((item, index) => (
                        <tr className="active-row" key={index}>
                            <td>{item.gameId}</td>
                            <td>{item.winnerName}</td>
                            <td>{item.loserName}</td>
                            <td>{item.scoreGagnant}</td>
                            <td>{item.scorePerdant}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </React.Fragment>
    );
}

export default MatchHistory;
