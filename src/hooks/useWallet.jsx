import { useCallback, useEffect, useMemo, useState } from "react";
import { ethers } from "ethers";

import affirmingPortalAbi from '../utils/affirmingPortal.json';
import useWindowFocus from './useWindowFocus';

const RINKEBY_CONTRACT_ADDRESS = "0xfeA9Ceb2D86b9847DC48067503F3523CdEe32550";

export const Reaction = {
  Affirm: 0,
  Quote: 1,
  Hype: 2,
};

export const WriteStatus = {
  None: 0,
  Connect: 1,
  Request: 2,
  Pending: 3,
};

const EvmName = {
  1: "Mainnet",
};

const EvmChain = {
  Rinkeby: 4,
};

export default function useWallet() {
  const { ethereum } = window;

  const [loading, setLoading] = useState(true);
  const [writeLoading, setWriteLoading] = useState(WriteStatus.None);
  const [walletInstalled, setInstalled] = useState(false);
  const [walletConnected, setConnected] = useState(false);
  const [walletNetwork, setNetwork] = useState(false);
  const [walletAccount, setAccount] = useState("");
  const [walletError, setWalletError] = useState(null);
  const [affirmationList, setAffirmationList] = useState([]);
  const [totalCount, setTotalCount] = useState(null);
  console.log("walletNetwork", walletNetwork)
  const networkName = useMemo(() => {
    console.log("walletNetwork 3", walletNetwork)
    if (!walletNetwork) {
      return "";
    }
    console.log("walletNetwork 2", walletNetwork)

    return EvmName[walletNetwork.chainId] || walletNetwork.name;
  }, [walletNetwork]);

  const isRinkeby = walletNetwork.chainId === EvmChain.Rinkeby;

  const isWindowFocused = useWindowFocus();

  const updateAffirmations = useCallback(() => {
    const runUpdates = async () => {
      setTotalCount(await getTotalCount());
      setAffirmationList(await getAllAffirmations());
    };
    runUpdates();
  }, [setTotalCount, setAffirmationList]);

  const addNewAffirmationToList = useCallback(
    (newAffirmation) => {
      setAffirmationList([newAffirmation, ...affirmationList]);
    },
    [affirmationList],
  );

  useEffect(() => {
    subscribeToAffirmationEvents((newAffirmation) => {
      updateAffirmations();
    });
    // SUBSCRICE ONCE when mounting the component
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isWindowFocused) {
      // check status whenever the window focus status changes
    }
    const runUpdates = async () => {
      setInstalled(getWalletInstalled());
      setConnected(await getWalletConnected());
      setNetwork(await getNetwork());
      updateAffirmations();
      setLoading(false);
    };
    runUpdates();
  }, [isWindowFocused, setInstalled, setConnected, updateAffirmations, setLoading]);

  const connectWallet = () => {
    return ethereum
      .request({ method: "eth_requestAccounts" })
      .then((accountList) => {
        const [firstAccount] = accountList;
        setAccount(firstAccount);
      })
      .catch((error) => {
        setWalletError(error);
      });
  };

  const affirmingReaction = async (reaction, message) => {
    if (!walletInstalled) {
      return;
    }

    if (!walletConnected) {
      setWriteLoading(WriteStatus.Connect);
      await connectWallet();
      setConnected(await getWalletConnected());
    }
    setWriteLoading(WriteStatus.Request);

    writeAffirmation(reaction, message)
      .then(async (transaction) => {
        setWriteLoading(WriteStatus.Pending);

        await transaction.wait();
        updateAffirmations();
        setWriteLoading(WriteStatus.None);
      })
      .catch((error) => {
        window.alert("Failed to write transaction!");
        console.error(error);
        setWriteLoading(WriteStatus.None);
      });
  };

  const sendAffirmation = (message) => affirmingReaction(Reaction.Affirm, message);
  const sendQuote = (message) => affirmingReaction(Reaction.Quote, message);
  const sendHype = (message) => affirmingReaction(Reaction.Hype, message);

  return {
    loading,
    writeLoading,
    walletInstalled,
    walletConnected,
    walletAccount,
    walletError,
    connectWallet,
    networkName,
    isRinkeby,
    affirmationList,
    totalCount,
    sendAffirmation,
    sendQuote,
    sendHype,
  };
}

function getWalletInstalled() {
  return typeof window.ethereum !== "undefined";
}

async function getWalletConnected() {
  if (!window.ethereum) {
    return false;
  }

  const accountList = await window.ethereum.request({ method: "eth_accounts" });
  console.log({ accountList });
  return accountList.length !== 0;
}

function getNetwork() {
  if (!window.ethereum) {
    return false;
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  console.log(provider.getNetwork())
  return provider.getNetwork();
}

async function getTotalCount() {
  if (!window.ethereum) {
    return;
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const affirmingPortalContract = new ethers.Contract(
    RINKEBY_CONTRACT_ADDRESS,
    affirmingPortalAbi.abi,
    provider,
  );

  const totalCount = await affirmingPortalContract.getTotalAffirmed();
  console.log({ totalCount });
  return Number.parseInt(totalCount.toString(), 10);
}

function writeAffirmation(reaction, message) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const affirmingPortalContract = new ethers.Contract(
    RINKEBY_CONTRACT_ADDRESS,
    affirmingPortalAbi.abi,
    signer,
  );

  return affirmingPortalContract.affirm(reaction, message,
    {
      gasLimit: 400000,
    }
  );
}

async function getAllAffirmations() {
  if (!window.ethereum) {
    return;
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const affirmingPortalContract = new ethers.Contract(
    RINKEBY_CONTRACT_ADDRESS,
    affirmingPortalAbi.abi,
    provider,
  );

  const allAffirmations = await affirmingPortalContract.getAllAffirmed();

  if (!allAffirmations) {
    return [];
  }

  const normalizeAffirmations = (affirm) => ({
    reaction: affirm.reaction,
    message: affirm.message,
    affirmer: affirm.affirmer,
    timestamp: new Date(affirm.timestamp * 1000),
  });

  return allAffirmations.map(normalizeAffirmations).sort((a, b) => b.timestamp - a.timestamp);
}

function subscribeToAffirmationEvents(callback) {
  if (!window.ethereum) {
    return;
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const affirmingPortalContract = new ethers.Contract(
    RINKEBY_CONTRACT_ADDRESS,
    affirmingPortalAbi.abi,
    provider,
  );

  affirmingPortalContract.on("NewAffirmation", (reaction, message, affirmer, timestamp) => {
    callback({ reaction, message, affirmer, timestamp });
  });
}
