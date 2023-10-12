import React from "react";

const MatchHistory: React.FC = () => {

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