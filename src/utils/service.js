import axios from 'axios';
import { Constants } from './constants';

// Create an Axios instance with the base URL
const apiClient = axios.create({
  baseURL: Constants.BASE_URL,
  timeout: 10000, // Set a timeout for requests
});


export const getCurrentBlock = async () => {
  try {
    const response = await apiClient.get(`${Constants.BASE_API_URL}/getCurrentBlock`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const getBestBlockHash = async () => {
  try {
    const response = await apiClient.get(`${Constants.API_BASE_URL}/wallet/bestblock`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};



export const getDogePrice = async () => {
  try {
    // const response = await apiClient.get('https://api.coingecko.com/api/v3/simple/price?ids=dogecoin&vs_currencies=usd');
    // return response.data;
    return { "dogecoin": { "usd": 0.178595 } };
  } catch (error) {
    console.error("Error fetching doge price:", error);
    throw error;
  }
}

export const getDayTokens = async () => {
  try {
    const response = await apiClient.get(`${Constants.API_BASE_URL}/token/stats/day`);
    return response.data;
  } catch (error) {
    console.error("Error fetching day tokens:", error);
    throw error;
  }
}

export const getDeploymentsLength = async () => {
  try {
    const response = await apiClient.get(`${Constants.BASE_API_URL}/getDeploymentsLength`);
    return response.data;
  } catch (error) {
    console.error("Error fetching deployments length:", error);
    throw error;
  }
}

export const getDeployments = async (offset, limit) => {
  try {
    const response = await apiClient.get(`${Constants.BASE_API_URL}/getDeployments?offset=${offset}&max=${limit}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching deployments:", error);
    throw error;
  }
}

export const getStatsResponse = async (body) => {
  try {
    const response = await apiClient.post(`${Constants.API_BASE_URL}/token/stats/multi`, body);
    return response.data;
  } catch (error) {
    console.error("Error in getStatsResponse:", error);
    throw error;
  }
}

export const getTokensBalance = async (address) => {
  try {
    const response = await apiClient.get(`${Constants.BASE_API_URL}/getAccountTokensBalance/${address}`);
    return response.data;
  } catch (error) {
    console.error("Error in getTokensBalance:", error);
    throw error;
  }
}

export const getMintTokensLeft = async (token) => {
  try {
    const response = await apiClient.get(`${Constants.BASE_API_URL}/getMintTokensLeft/${token}`);
    return response.data;
  } catch (error) {
    console.log('Error in getMintTokensLeft', error);
  }
}

export const getAccountBlockedTransferables = async (address) => {
  try {
    const response = await apiClient.get(`${Constants.BASE_API_URL}/getAccountBlockedTransferables/${address}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching blocked transferables:', error);
    throw error;
  }
}

export const callSoChainForData = async (address) => {
  try {
    const response = await axios.post(`${Constants.API_BASE_URL}/wallet/utxos`, {
      address: address
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 500) {
      console.warn('SoChain API returned 500 error');
      // Return empty outputs to prevent UI break
      return {
        data: {
          data: {
            outputs: []
          }
        }
      };
    }
    throw error; // Re-throw other errors
  }
};

// Get token listings
export const getTokenListings = async (tick) => {
  try {
    const response = await axios.get(`${Constants.API_BASE_URL}/token/list/all/${tick}`);
    return response.data.response;
  } catch (error) {
    console.error('Error fetching token listings:', error);
    throw error;
  }
};

// Get token stats
export const getTokenStats = async (tick) => {
  try {
    const response = await axios.get(`${Constants.API_BASE_URL}/token/stats/${tick}`);
    return response.data.response;
  } catch (error) {
    console.error('Error fetching token stats:', error);
    throw error;
  }
};

// Get token holders count
export const getTokenHolders = async (tick) => {
  try {
    const response = await axios.get(`${Constants.BASE_API_URL}/getHoldersLength/${tick}`);
    return response.data.result;
  } catch (error) {
    console.error('Error fetching token holders:', error);
    throw error;
  }
};

// Get token deployment info
export const getTokenDeployment = async (tick) => {
  try {
    const response = await axios.get(`${Constants.BASE_API_URL}/getDeployment/${tick}`);
    return response.data.result;
  } catch (error) {
    console.error('Error fetching token deployment:', error);
    throw error;
  }
};

// Get token activity
export const getTokenActivity = async (tick, page = 1, limit = 10) => {
  try {
    const response = await axios.get(`${Constants.API_BASE_URL}/token/activity/${tick}?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching token activity:', error);
    throw error;
  }
};

// Buy token
export const buyToken = async (inscriptionId) => {
  try {
    const response = await axios.post(`${Constants.API_BASE_URL}/token/buy`, { inscriptionId });
    return response.data;
  } catch (error) {
    console.error('Error buying token:', error);
    throw error;
  }
};

