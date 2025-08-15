import axios from 'axios';
import { Constants } from './constants';

// Create an Axios instance with the base URL
const apiClient = axios.create({
  baseURL: Constants.BASE_URL,
  timeout: 10000, // Set a timeout for requests
});

export const getCurrentBlock = async () => {
  try {
    const response = await axios.get(`/api/tap/getCurrentBlock`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const getBestBlockHash = async () => {
  try {
    const response = await axios.get(`/api/tapondoge/wallet/bestblock`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const getDogePrice = async () => {
  try {
    const response = await axios.get(`${Constants.COINGECKO_API_URL}/simple/price?ids=dogecoin&vs_currencies=usd`);
    return response.data;
  } catch (error) {
    console.error("Error fetching doge price:", error);
    throw error;
  }
}

export const getDayTokens = async () => {
  try {
    const response = await axios.get(`/api/tapondoge/token/stats/day`);
    return response.data;
  } catch (error) {
    console.error("Error fetching day tokens:", error);
    throw error;
  }
}

export const getDeploymentsLength = async () => {
  try {
    const response = await axios.get(`/api/tap/getDeploymentsLength`);
    return response.data;
  } catch (error) {
    console.error("Error fetching deployments length:", error);
    throw error;
  }
}

export const getDeployments = async (offset, limit) => {
  try {
    const response = await axios.get(`/api/tap/getDeployments?offset=${offset}&max=${limit}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching deployments:", error);
    throw error;
  }
}

export const getStatsResponse = async (body) => {
  try {
    const response = await axios.post(`/api/tod/token/stats/multi`, body);
    return response.data;
  } catch (error) {
    console.error("Error in getStatsResponse:", error);
    throw error;
  }
}

export const getTokensBalance = async (address) => {
  try {
    const response = await axios.get(`/api/tap/getAccountTokensBalance/${address}`);
    return response.data;
  } catch (error) {
    console.error("Error in getTokensBalance:", error);
    throw error;
  }
}

export const getMintTokensLeft = async (token) => {
  try {
    const response = await axios.get(`/api/tap/getMintTokensLeft/${token}`);
    return response.data;
  } catch (error) {
    console.log('Error in getMintTokensLeft', error);
    throw error;
  }
}

export const callSoChainForData = async (address) => {
  try {
    const response = await axios.post(`/api/tapondoge/wallet/utxos`, {
      address: address
    });
    return response.data;
  } catch (error) {
    console.error("Error in callSoChainForData:", error);
    throw error;
  }
};

export const getAccountBlockedTransferables = async (address) => {
  try {
    const response = await axios.get(`/api/tap/getAccountBlockedTransferables/${address}`);
    return response.data;
  } catch (error) {
    console.error("Error in getAccountBlockedTransferables:", error);
    throw error;
  }
};

export const inscribe = async (data) => {
  try {
    const response = await axios.post(`/api/tapondoge/wallet/inscribe`, data);
    return response;
  } catch (error) {
    console.error("Error in inscribe:", error);
    throw error;
  }
};

