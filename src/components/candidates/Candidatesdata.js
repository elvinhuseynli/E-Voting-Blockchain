import { useState, useEffect } from "react";
import Wallet from "../Wallet/Wallet";

const CandidatesData = ({ saveIssues }) => {
    const [state, setState] = useState({
        web: null,
        contract: null,
        accounts: null
    });

    const saveState = (newState) => {
        setState(newState);
    };

    useEffect(() => {
        const fetchData = async () => {
            const { contract } = state;
            if (!contract) {
                return;
            }
            try {
                const issueCount = await contract.methods.issueCount().call();
                const issues = [];
                for (let i = 1; i <= issueCount; i++) {
                    const issue = await contract.methods.issues(i).call();
                    issues.push({
                        id: i,
                        description: issue.description,
                        yesCount: issue.yesCount,
                        noCount: issue.noCount,
                        isOpen: issue.isOpen
                    });
                }
                saveIssues(issues);
            } catch (error) {
                console.error("Error fetching issues data:", error);
            }
        };

        fetchData();
    }, [state.contract]);

    return (
        <Wallet saveState={saveState} />
    );
};

export default CandidatesData;
