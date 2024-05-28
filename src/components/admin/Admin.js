import React, { useState } from 'react';
import Header from '../header/Header';
import Leaderboard from '../leaderboard/Leaderboard';
import Wallet from '../Wallet/Wallet';
import UpdateCandi from '../updateCandidate/UpdateCandi';
import "./Admin.css";

const Admin = () => {
    const [state, setState] = useState({
        web: null,
        contract: null,
        accounts: null
    });

    const [issues, setIssues] = useState([]);

    const saveState = (newState) => {
        setState(newState);
    };

    const saveIssues = (newIssues) => {
        setIssues(newIssues);
    };

    return (
        <>
            <Wallet saveState={saveState} saveIssues={saveIssues} />
            <Header />
            <UpdateCandi state={state} />
            <Leaderboard issues={issues} />
        </>
    );
};

export default Admin;
