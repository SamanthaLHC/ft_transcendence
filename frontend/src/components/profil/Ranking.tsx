import React from "react";

const Ranking: React.FC = () => {

    return (
        <React.Fragment>

            <h2 className="typo-friends yellow typo-pos"> Ranking </h2>
            <div>
                <table className="styled-table">
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="active-row">
                            <td>1</td>
                            <td>Carsu</td>
                        </tr>
                        <tr className="active-row">
                            <td>2</td>
                            <td>wamu</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </React.Fragment>

    )
}

export default Ranking;