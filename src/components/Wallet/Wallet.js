import Web3 from "web3";
import { useEffect, useState } from "react";
import ContractJSON from "./Contract.json";

const Wallet = ({ saveState, saveIssues }) => {
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const connectWallet = async () => {
            try {
                const { ethereum } = window;

                if (!ethereum) {
                    console.error("MetaMask is not installed");
                    alert("Please install MetaMask to interact with this application!");
                    return;
                }

                if (!isConnected) {
                    console.log("MetaMask is available");

                    ethereum.on("chainChanged", () => {
                        window.location.reload();
                    });

                    ethereum.on("accountsChanged", () => {
                        window.location.reload();
                    });

                    const web3 = new Web3(ethereum);

                    console.log("Requesting MetaMask accounts");
                    await ethereum.request({ method: 'eth_requestAccounts' });

                    const accounts = await web3.eth.getAccounts();
                    console.log("Connected accounts:", accounts);

                    if (accounts.length === 0) {
                        console.error("No accounts found. Ensure MetaMask is connected.");
                        alert("No accounts found. Ensure MetaMask is connected.");
                        return;
                    }

                    const contract = new web3.eth.Contract(
                        ContractJSON.abi,
                        "0x0b1c7c7aa43679367298e06254c9948bef91a73c"
                    );

                    console.log("Contract instance created:", contract);

                    saveState({ web3, contract, accounts });
                    setIsConnected(true);

                    // Fetch issues data
                    const issueCount = await contract.methods.issueCount().call();
                    console.log("Total issues:", issueCount);

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
                    console.log("Fetched issues:", issues);
                    saveIssues(issues);
                }
            } catch (error) {
                console.error("Error connecting wallet:", error);
            
            }
        };

        connectWallet();
    }, [isConnected, saveState, saveIssues]);

    return (
        <div>
  
        </div>
    );
};

export default Wallet;
