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
    function getId(): string | null {
		let url_str: string = window.location.search;
		let strToSearch: URLSearchParams = new URLSearchParams(url_str);
		let code_param: string | null = strToSearch.get("id");
		return code_param;
	}
    useEffect(() => {
        const getWinsAndLoses = async (id:string) => {
            const req: Request = new Request('http://' + process.env.REACT_APP_HOSTNAME + ':3000/users/id/' + id, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${cookies.access_token}`,
                },
            });

            const response = await fetch(req);
            const datas = await response.json();
            if (response.status === 200 || response.status === 304) {
                setWinsData(datas.nbwin);
                setLoseData(datas.nbloose);
            }
            else {
            }
        };
        let id = getId()
        if (id)
            getWinsAndLoses(id);
    }, [cookies.access_token, window.location.search]);

    return (
        <React.Fragment>
            <div>
                <table className="styled-table">
                    <thead>
                        <tr>
                            <th>wins</th>
                            <th>loses</th>
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