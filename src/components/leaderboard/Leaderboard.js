import './Leaderboard.css'; 

const Leaderboard = ({ state, issues }) => {
    return (
        <>
            <div className="body">
                <div className="table">
                    <div className="table-header">
                        <h1>Leaderboard</h1>
                    </div>
                    <div className="table-body">
                        {issues.length > 0 ? (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Id</th>
                                        <th>Issue</th>
                                        <th>Yes Votes</th>
                                        <th>No Votes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {issues.map((issue) => (
                                        <tr key={issue.id}>
                                            <td>{issue.id}</td>
                                            <td>{issue.description}</td>
                                            <td><strong>{issue.yesCount}</strong></td>
                                            <td><strong>{issue.noCount}</strong></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>There are no issues opened.</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Leaderboard;
