import React, { useState } from 'react';
import './votePage.css';

const VotePage = ({ contract, account }) => {
    const [voteCount, setVoteCount] = useState(0);

    const handleVote = async () => {
        try {
            await contract.methods.vote().send({ from: account });
            const count = await contract.methods.getVoteCount().call();
            setVoteCount(count);
        } catch (error) {
            console.error("Error while voting:", error);
        }
    };

    return (
        <div className="vote-page">
            <h1>Vote for Wage Increase</h1>
            <button onClick={handleVote}>Vote</button>
            <p>Current Votes: {voteCount}</p>
            {voteCount > 10 ? <p className="vote-status accepted">The proposal is accepted!</p> : <p className="vote-status">The proposal needs more votes.</p>}
        </div>
    );
};

export default VotePage;
