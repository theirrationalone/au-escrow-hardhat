import { ethers } from "ethers";
import Escrow from "./artifacts/contracts/Escrow.sol/Escrow.json";

export default async function deploy(signer, arbiter, beneficiary, value) {
  const factory = new ethers.ContractFactory(Escrow.abi, Escrow.bytecode, signer);
  return factory.deploy(arbiter, beneficiary, { value });
}

export const getContract = (signer, contractAddress) => {
  const contract = new ethers.Contract(contractAddress, Escrow.abi, signer);
  return contract;
};
