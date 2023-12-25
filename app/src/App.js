import { ethers } from "ethers";
import { useEffect, useState } from "react";
import deploy, { getContract } from "./deploy";
import Escrow from "./Escrow";

const provider = new ethers.providers.Web3Provider(window.ethereum);

export async function approve(escrowContract, signer) {
  const approveTxn = await escrowContract.connect(signer).approve();
  await approveTxn.wait();
}

function App() {
  const [escrows, setEscrows] = useState([]);
  const [account, setAccount] = useState();
  const [signer, setSigner] = useState();

  useEffect(() => {
    async function getAccounts() {
      const accounts = await provider.send("eth_requestAccounts", []);

      setAccount(accounts[0]);
      setSigner(provider.getSigner());
    }

    getAccounts();
  }, [account]);

  useEffect(() => {
    const escrowsHandler = async () => {
      const allEscrows = JSON.parse(localStorage.getItem("escrows"));
      if (allEscrows) {
        const fetchedEscrows = allEscrows.map((escrow) => {
          const escrowContract = getContract(signer, escrow.address);

          return {
            ...escrow,
            handleApprove: async () => {
              escrowContract.on("Approved", () => {
                document.getElementById(escrowContract.address).parentElement.classList.add("list--escrow_complete");
                document.getElementById(escrowContract.address).className = "complete";
                document.getElementById(escrowContract.address).innerText = "✓";
              });

              try {
                await approve(escrowContract, signer);
              } catch (e) {
                alert("Something went wrong, Check logs if you're a Dev!");
                console.log("e: ", e);
              }
            },
          };
        });

        setEscrows(fetchedEscrows);
      }
    };

    escrowsHandler();
  }, [signer]);

  async function newContract() {
    try {
      const beneficiary = document.getElementById("beneficiary").value;
      const arbiter = document.getElementById("arbiter").value;

      let val = document.getElementById("wei").value;
      val = parseFloat(+val * 1e18);
      if (parseInt(val.toString().split(".")[1]) >= 50) {
        val = Math.ceil(val);
      } else {
        val = Math.floor(val);
      }

      const value = ethers.BigNumber.from(val.toString());
      const escrowContract = await deploy(signer, arbiter, beneficiary, value);
      document.getElementById("beneficiary").value = "";
      document.getElementById("arbiter").value = "";
      document.getElementById("wei").value = "";

      const escrow = {
        address: escrowContract.address,
        arbiter,
        beneficiary,
        value: value.toString(),
        handleApprove: async () => {
          escrowContract.on("Approved", () => {
            document.getElementById(escrowContract.address).parentElement.classList.add("list--escrow_complete");
            document.getElementById(escrowContract.address).className = "complete";
            document.getElementById(escrowContract.address).innerText = "✓";
          });

          try {
            await approve(escrowContract, signer);
          } catch (e) {
            alert("Something went wrong, Check logs if you're a Dev!");
            console.log("e: ", e);
          }
        },
      };

      localStorage.setItem("escrows", JSON.stringify([...escrows, escrow]));
      setEscrows([...escrows, escrow]);
    } catch (e) {
      alert("Something wrong, Please check logs if you're a Dev!");
      console.log("e:", e);
    }
  }

  return (
    <>
      <div className="contract">
        <h1> New Contract </h1>
        <label>
          Arbiter Address
          <input type="text" id="arbiter" />
        </label>

        <label>
          Beneficiary Address
          <input type="text" id="beneficiary" />
        </label>

        <label>
          Deposit Amount (in ETH)
          <input type="number" id="wei" step={0.01} min={0.000000000000000001} />
        </label>

        <div
          className="button"
          id="deploy"
          onClick={(e) => {
            e.preventDefault();

            newContract();
          }}
        >
          Deploy
        </div>
      </div>

      <div className="existing-contracts">
        <h1> Existing Contracts </h1>

        <div id="container">
          {escrows.length <= 0 ? (
            <h1 className="no-contracts">No Contracts, Deploy First :)"</h1>
          ) : (
            escrows.map((escrow) => {
              return <Escrow key={escrow.address} {...escrow} />;
            })
          )}
        </div>
      </div>
    </>
  );
}

export default App;
