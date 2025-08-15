import { useEffect, useState } from 'react';
import { getDeployments } from '@/utils/service';
import { useLoader } from '@/contexts/LoaderContext';

export default function Dmt() {
    const [deployments, setDeployments] = useState([]);

    const { showLoader, hideLoader } = useLoader();

    useEffect(() => {
        fetchDeployments(0, 20);
    
        // const priceRefreshInterval = setInterval(fetchDogePrice, 60000); // Refresh price every minute
        
        // return () => clearInterval(priceRefreshInterval);
      }, []);

    // Fetch Deployments
  const fetchDeployments = async (offset, rowsPerPage) => {
    try {
        showLoader();
      const response = await getDeployments(offset, rowsPerPage);
      setDeployments(response.result);
      console.log('response', response);
    } catch (error) {
      console.error('Error fetching deployments:', error);
    } finally {
        hideLoader();
    }
  };

    return (
        <>
            <div className="table-responsive">
                <table className="table table-hover" style={{ maxWidth: '80%', margin: '0 auto' }}>
                    <thead>
                        <tr>
                            <th scope="col" className="text-center">Token</th>
                            <th scope="col" className="text-center">Block</th>
                        </tr>
                    </thead>
                    <tbody>
                        {deployments
                        .filter(data => data.dmt === true)
                        .map((data, index) => (
                            <tr key={index}>
                                <td className="text-center">{data.tick}</td>
                                <td className="text-center">{data.blck}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}