import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";

interface WinsAndLosesData {
    // id: number;
    // login: string;
    // name: string;
}

const WinsAndLoses: React.FC = () => {

    const [cookies] = useCookies(['access_token']);
    const [WinsAndLosesData, setWinsAndLosesData] = useState<WinsAndLosesData[]>([]);

    useEffect(() => {
        const getWinsAndLoses = async () => {

            try {
                const req = new Request("http://localhost:3000/users/get_class", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${cookies.access_token}`,
                    },
                });

                const response = await fetch(req);
                if (response.ok) {
                    const data = await response.json();
                    setWinsAndLosesData(data);
                } else {
                    // setAvatarUploadError("Avatar upload failed. Please try again.");
                }
            } catch (error) {
                console.error(error);
                // setAvatarUploadError("An error occurred while uploading your avatar.");
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
                            <th>Wins</th>
                            <th>Loses</th>
                        </tr>
                    </thead>
                    <tbody>
                        {WinsAndLosesData.map((item, index) => (
                            <tr className="active-row" key={index}>
                                <td></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </React.Fragment>

    )
}

export default WinsAndLoses;