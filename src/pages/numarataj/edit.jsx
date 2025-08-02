import { useState, useEffect } from 'react';

import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';

import { NumberingView } from 'src/sections/overview/numarataj/view';

// ----------------------------------------------------------------------

const metadata = { title: `Numarataj Düzenle` };

export default function Page() {
    const { id = 0 } = useParams();
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
        const token = localStorage.getItem('jwt_access_token');
        try {
            const response = await fetch(`${CONFIG.apiUrl}/Numarataj/numbering-by-id?id=${id}`, {
                headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
                }
            });
            const datas = await response.json();
            setData(datas);
        } catch (error) {
        }
        };
    
        fetchData();
    }, [id]);
    
    return (
        <>
        <Helmet>
            <title> {metadata.title}</title>
        </Helmet>

        {data && <NumberingView data={data} id={id} />}
        </>
    );
}
