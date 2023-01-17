import React, { useState, useEffect } from 'react';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import axios from 'axios';
import { create as ipfsHttpClient } from 'ipfs-http-client';

import { MarketAddress, MarketAddressABI } from './constants';

const projectId = "2K5zR3tQsK14vGROjytMi69BU31" //process.env.IPFS_PROJECT_ID;
console.log(projectId)
const projectSecret = "83d9d11beadcbe21abff7dd5c0723904" //process.env.API_KEY_SECRET;
console.log(projectSecret)

const auth = `Basic ${Buffer.from(`${projectId}:${projectSecret}`).toString('base64')}`;


const options = { host: 'ipfs.infura.io', apiPath: '/api/v0', protocol: 'https', port: 5001, headers: { authorization: auth } };
const client = ipfsHttpClient(options);
const dedicatedEndPoint = 'https://novoux.infura-ipfs.io';

// const client = ipfsHttpClient({
//   host: 'ipfs.infura.io',
//   port: 5001,
//   protocol: 'https',
//   headers: {
//     authorization: auth,
//   },
// });

const fetchContract = (signerOrProvider) => new ethers.Contract(MarketAddress, MarketAddressABI, signerOrProvider);

export const NFTContext = React.createContext();

export const NFTProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState('');
  const nftCurrency = 'ETH';
  const [isLoadingNFT, setIsLoadingNFT] = useState(false);

  const checkIfWalletIsConnected = async () => {
    if (!window.ethereum) return alert('Please install Metamask');

    const accounts = await window.ethereum.request({ method: 'eth_accounts' });

    if (accounts.length) {
      setCurrentAccount(accounts[0]);
    } else {
      console.log({ accounts });
    }

    console.log({ accounts });
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) return alert('Please install Metamask');

    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

    setCurrentAccount(accounts[0]);
    window.location.reload();
  };

  const uploadToIPFS = async (file) => {
    const dedicatedEndPoint = 'https://novoux.infura-ipfs.io';
    try {
      const added = await client.add({ content: file });
      //const URL = `${subdomain}/ipfs/${added.path}`;
      const URL = `${dedicatedEndPoint}/ipfs/${added.path}`;

      return URL;
    } catch (error) {
      console.log('Error uploading file to IPFS.');
    }
  };

  const createSale = async (url, formInputPrice, isReselling, id) => {
    const web3Modal = new Web3Modal();

    const connection = await web3Modal.connect();

    const provider = new ethers.providers.Web3Provider(connection);

    const signer = provider.getSigner();

    const price = ethers.utils.parseUnits(formInputPrice, 'ether');

    const contract = fetchContract(signer);
    console.log(8);

    const listingPrice = await contract.getListingPrice();
    console.log(9);

    const transaction = !isReselling
      ? await contract.createToken(url, price, { value: listingPrice.toString() })
      : await contract.resellToken(id, price, { value: listingPrice.toString() });

    setIsLoadingNFT(true);

    await transaction.wait();

    console.log(contract);
  };

  const createNFT = async (formInput, fileUrl, router) => {
    const { name, description, price } = formInput;

    if (!name || !description || !price || !fileUrl) return;

    const data = JSON.stringify({ name, description, image: fileUrl });

    try {
      const added = await client.add(data);

      //const url = `https://novoux.infura-ipfs.io/ipfs/${added.path}`;
      const dedicatedEndPoint = 'https://novoux.infura-ipfs.io';

      const url = `${dedicatedEndPoint}/ipfs/${added.path}`;


      await createSale(url, price);

      router.push('/');
    } catch (error) {
      console.log('Error uploading file to IPFS');
    }
  };

  const fetchNFTs = async () => {
    setIsLoadingNFT(false);
    // const ALCHEMY_API_KEY = 'Hkl3gRjaeweUgWKKphq8zqWHkCUuBxNP';

    // const provider = new ethers.providers.JsonRpcProvider(`https://eth-goerli.alchemyapi.io/v2/${ALCHEMY_API_KEY}`);
    const provider = new ethers.providers.JsonRpcProvider('https://eth-goerli.gateway.pokt.network/v1/lb/e0d7a3d4f654c1961c0aca9f');
    const contract = fetchContract(provider);

    const data = await contract.fetchMarketItems();

    const items = await Promise.all(data.map(async ({ tokenId, seller, owner, price: unformattedPrice }) => {
      const tokenURI = await contract.tokenURI(tokenId);
      const { data: { image, name, description } } = await axios.get(tokenURI);
      const price = ethers.utils.formatUnits(unformattedPrice.toString(), 'ether');

      return {
        price,
        tokenId: tokenId.toNumber(),
        seller,
        owner,
        image,
        name,
        description,
        tokenURI,
      };
    }));
    return items;
  };

  const fetchMyNFTsOrListedNFTs = async (type) => {
    setIsLoadingNFT(false);

    const web3Modal = new Web3Modal();

    const connection = await web3Modal.connect();

    const provider = new ethers.providers.Web3Provider(connection);

    const signer = provider.getSigner();

    const contract = fetchContract(signer);

    const data = type === 'fetchItemsListed' ? await contract.fetchItemsListed() : await contract.fetchMyNFTs();

    const items = await Promise.all(data.map(async ({ tokenId, seller, owner, price: unformattedPrice }) => {
      const tokenURI = await contract.tokenURI(tokenId);
      const { data: { image, name, description } } = await axios.get(tokenURI);
      const price = ethers.utils.formatUnits(unformattedPrice.toString(), 'ether');

      return {
        price,
        tokenId: tokenId.toNumber(),
        seller,
        owner,
        image,
        name,
        description,
        tokenURI,
      };
    }));

    return items;
  };

  const buyNFT = async (nft) => {
    const web3Modal = new Web3Modal();

    const connection = await web3Modal.connect();

    const provider = new ethers.providers.Web3Provider(connection);

    const signer = provider.getSigner();

    const contract = fetchContract(signer);

    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether');
    const transaction = await contract.createMarketSale(nft.tokenId, { value: price });
    setIsLoadingNFT(true);

    await transaction.wait();
    setIsLoadingNFT(false);
  };

  return (
    <NFTContext.Provider value={{ nftCurrency,
      connectWallet,
      currentAccount,
      uploadToIPFS,
      createNFT,
      fetchNFTs,
      fetchMyNFTsOrListedNFTs,
      buyNFT,
      createSale,
      isLoadingNFT }}
    >
      {children}
    </NFTContext.Provider>
  );
};

