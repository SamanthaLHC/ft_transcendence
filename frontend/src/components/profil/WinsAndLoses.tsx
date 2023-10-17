import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";

// interface WinsAndLosesData {
//     // id: number;
//     // login: string;
//     // name: string;
// }

const WinsAndLoses: React.FC = () => {

    const [cookies] = useCookies(['access_token']);
    const [winsData, setWinsData] = useState();
    const [loseData, setLoseData] = useState();

    useEffect(() => {
        const getWinsAndLoses = async () => {
            const req: Request = new Request('http://localhost:3000/users/me', {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${cookies.access_token}`,
                },
            });

            const response = await fetch(req);
            const datas = await response.json();
            if (response.status === 200 || response.status === 304) {
                console.log(datas);
                setWinsData(datas.nbwin);
                setLoseData(datas.nbloose);
            }
            else {
            }
        };
        getWinsAndLoses();
    }, [cookies.access_token]);

    return (
        <React.Fragment>
            <div>
                <table className="styled-table">
                    <thead>
                        <tr>
                            <th>your wins</th>
                            <th>your loses</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="active-row">
                            <td>{winsData}</td>
                            <td>{loseData}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </React.Fragment>

    )
}

export default WinsAndLoses;