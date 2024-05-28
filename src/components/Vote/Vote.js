import { useState, useEffect } from "react";
import CandidatesData from "../candidates/Candidatesdata";
import './Vote.css'; // Import your CSS file

const Vote = ({ state }) => {
    const [issues, setIssues] = useState([]);
    const [selectedIssue, setSelectedIssue] = useState('');
    const [hasVoted, setHasVoted] = useState(false);

    const saveIssues = (arr) => {
        setIssues(arr);
    };

    useEffect(() => {
        const checkVoterStatus = async () => {
            const { contract, accounts } = state;
            if (!contract || !accounts) {
                return;
            }

            try {
                const currentAccount = accounts[0];
                const hasVotedStatus = await contract.methods.hasVoted(currentAccount).call();
                setHasVoted(hasVotedStatus);
                if (hasVotedStatus) {
                    updatePopup("Sorry!", "You have already voted!", "img-popup-cross");
                }
            } catch (error) {
                console.error("Error checking voter status:", error);
            }
        };

        checkVoterStatus();
    }, [state]);

    const updatePopup = (header, message, imgClass) => {
        const popupH2 = document.querySelector('.popup-h2');
        const popupP = document.querySelector('.popup-p');
        const popupImg = document.querySelector('.img-popup');
        if (popupH2) popupH2.innerHTML = header;
        if (popupP) popupP.innerHTML = message;
        if (popupImg) {
            popupImg.classList.remove('img-popup-cross', 'img-popup-tick');
            popupImg.classList.add(imgClass);
        }
    };

    const openPopup = () => {
        const popup = document.querySelector('.popup');
        if (popup) {
            popup.classList.add('open-popup');
        }
        if (selectedIssue) {
            if (hasVoted) {
                console.log("You have already voted!");
            } else {
                handleVote();
            }
        } else {
            closePopup();
            console.log("No issue selected! Caller: openPopupFunc");
            alert("No Issue Selected!");
        }
    };

    const closePopup = () => {
        const popup = document.querySelector('.popup');
        if (popup) {
            popup.classList.remove('open-popup');
        }
    };

    const handleSelectChange = (event) => {
        setSelectedIssue(event.target.value);
    };

    const handleVote = async () => {
        const { contract, accounts } = state;
        if (!contract || !accounts) {
            return;
        }

        try {
            const currentAccount = accounts[0];
            if (selectedIssue) {
                const transaction = await contract.methods.vote(selectedIssue, true).send({ from: currentAccount });
                console.log('Transaction is done:', transaction);
                updatePopup("Congrats!", "Your vote is submitted on the blockchain!", "img-popup-tick");
            } else {
                console.log("No Issue Selected, Caller: handleVote");
            }
        } catch (error) {
            console.error("Error voting:", error);
            alert("An error occurred while submitting your vote.");
        }
    };

    return (
        <>
            <CandidatesData saveIssues={saveIssues} />
            <div className="body11">
                <select
                    id="issuesDropdown"
                    name="issuesDropdown"
                    value={selectedIssue}
                    onChange={handleSelectChange}
                >
                    <option value="" className="selected">Select an issue</option>
                    {issues.map((issue) => (
                        <option key={issue.id} value={issue.id}>
                            {issue.description}
                        </option>
                    ))}
                </select>
                <button className="VoteBtn" onClick={openPopup}>VOTE</button>
                <div className="container1">
                    <div className="popup">
                        <img className="img-popup" alt="popup" />
                        <h2 className="popup-h2">Please Wait!</h2>
                        <p className="popup-p">Your transaction is in progress!</p>
                        <button type="submit" className="btn" onClick={closePopup}>Close</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Vote;
