import axios from 'axios';
import { Constants } from '@/utils/constants';

// Token related APIs
export const getDeploymentsLength = async () => {
  const response = await axios.get(`${Constants.BASE_API_URL}/getDeploymentsLength`);
  return response.data;
};

export const getDeployments = async (offset = 0, max = 20) => {
  const response = await axios.get(`${Constants.BASE_API_URL}/getDeployments?offset=${offset}&max=${max}`);
  return response.data;
};

export const getDeployment = async (tick) => {
  const response = await axios.get(`${Constants.BASE_API_URL}/getDeployment/${tick}`);
  return response.data;
};

export const getMintTokensLeft = async (tick) => {
  const response = await axios.get(`${Constants.BASE_API_URL}/getMintTokensLeft/${tick}`);
  return response.data;
};

export const getDayTokens = async () => {
  const response = await axios.get(`${Constants.BASE_URL}/token/stats/day`);
  return response.data;
};

export const getStatsResponse = async (data) => {
  const response = await axios.post(`${Constants.BASE_URL}/token/stats/multi`, data);
  return response.data;
};

export const getDogePrice = async () => {
  const response = await axios.get(`${Constants.COINGECKO_API_URL}/simple/price?ids=dogecoin&vs_currencies=usd`);
  return response.data;
};

// Wallet related APIs
export const getTokensBalance = async (address) => {
  const response = await axios.get(`${Constants.BASE_API_URL}/getAccountTokensBalance/${address}?offset=0&max=500`);
  return response.data;
};

export const getAccountBlockedTransferables = async (address) => {
  const response = await axios.get(`${Constants.BASE_API_URL}/getAccountBlockedTransferables/${address}`);
  return response.data;
};

// Inscription related APIs
export const inscribe = async (data) => {
  const response = await axios.post(`${Constants.BASE_URL}/wallet/inscribe`, data);
  return response;
};

export const getCurrentBlock = async () => {
  const response = await axios.get(`${Constants.BASE_API_URL}/getCurrentBlock`);
  return response.data;
};

// SoChain APIs
export const callSoChainForData = async (address) => {
  const response = await axios.post(`${Constants.API_BASE_URL}/wallet/utxos`, {
    address: address
  });
  return response.data;
};

export const getBestBlockHash = async () => {
  const response = await axios.get(`${Constants.API_BASE_URL}/wallet/bestblock`);
  return response.data;
}; 