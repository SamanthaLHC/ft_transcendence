import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useUser } from "../Context";

interface MatchData {
    id: number;
    login: string;
    name: string;
}

//FIXME : mauvais MAJ de userData ? --> probleme de Context
//FIXME : useEffect ? --> semble être appelé deux fois

const MatchHistory: React.FC = () => {

    const [cookies] = useCookies(['access_token']);
    const [matchData, setRankingData] = useState<MatchData[]>([]);
    const { userData } = useUser();
    console.log("in userDATA: ", userData);
    const idUser = userData.id;
    console.log("user id is: ", userData.id);

    useEffect(() => {

        const getMatch = async () => {

            console.log("idUser: ", idUser);
            console.log(`http://localhost:3000/users/gameHistorique/${idUser}`);
            try {
                const req = new Request(`http://localhost:3000/users/gameHistorique/${idUser}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${cookies.access_token}`,
                    },
                });

                const response = await fetch(req);
                if (response.ok) {
                    console.log(response);
                    const data = await response.json();
                } else {
                    console.log("BAD BAD");
                    // setAvatarUploadError("Avatar upload failed. Please try again.");
                }
            } catch (error) {
                console.error(error);
                // setAvatarUploadError("An error occurred while uploading your avatar.");
            }
        };
        getMatch();
    }, [cookies.access_token, idUser]);

    return (
        <React.Fragment>
            <h2 className="typo-friends yellow typo-pos">Match History </h2>
            <div>
                <table className="styled-table">
                    <thead>
                        <tr>
                            <th></th>
                            <th>your matchs</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="active-row">
                            <td>1</td>
                            <td></td>
                        </tr>
                        <tr className="active-row">
                            <td>2</td>
                            <td></td>

                        </tr>
                    </tbody>
                </table>
            </div>
        </React.Fragment>
    )
}

export default MatchHistory;