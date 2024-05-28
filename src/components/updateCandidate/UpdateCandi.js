import { useState } from "react";
import "./UpdateCandi.css";

const UpdateCandi = ({ state }) => {
    const [input, setInput] = useState('');
    const [candidates, setCandidates] = useState([]);

    const saveCandidates = (arr) => {
        setCandidates(arr);
    };

    const { contract, accounts } = state;

    if (!contract) {
        return <div>Loading...</div>;
    }

    const handleInputChange = (event) => {
        setInput(event.target.value);
    };

    const AddCandi = async () => {
        if (!input) {
            alert("Please enter an issue description.");
            return;
        }

        const currentAcc = accounts[0];
        const admin = "0x6F37A129C3fa9a244177F970427b4Ef4a767252c"; // Replace with your actual admin address

        if (currentAcc !== admin) {
            alert("Only Admin Can Add Issues!");
            return;
        }

        try {
            alert("Great, Press Ok To continue!");

            const transaction = await contract.methods.openIssue(input).send({ from: currentAcc });
            console.log('Transaction is done:', transaction);
            alert("The Issue Is Added!");

            // Fetch updated issues data after adding a new issue
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
            saveCandidates(issues);
        } catch (error) {
            console.error('Error adding issue:', error);
            alert('An error occurred while adding the issue. Check console for details.');
        }
    };

    return (
        <div className="input-button-container">
            <div className="text_btn">
                <h3 className="h3">Add an Issue!</h3>
                <input
                    type="text"
                    id="textInput"
                    className="custom-input"
                    value={input}
                    onChange={handleInputChange}
                />
                <button onClick={AddCandi} className="custom-button">
                    Click to Open Issue for Voting
                </button>
            </div>
        </div>
    );
};

export default UpdateCandi;
