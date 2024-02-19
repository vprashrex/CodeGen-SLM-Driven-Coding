import React, { useEffect , useState} from "react";
//import { useNavigate } from 'react-router-dom';

const Welcome = () => {
    //const navigate = useNavigate();

    const [userData, setUserData] = useState();
    const [show, setShow] = useState(false);

    const callWelcome = async () => {
        try {
            const res = await fetch('/welcome', {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                credentials: "include"
            });
                const data = await res.json();
                console.log(data);
                setUserData(data);
                setShow(true);
              
        } catch (err) {
            console.log(err);
            //navigate('/login');
        }
    }

    useEffect(() => {
        callWelcome();
    }, []);

    return (
        <>
        <div>
            <form method="GET">
                <p>Hello Welcome page</p>
                <h1>Welcome {show ? userData.data : 'User'}</h1>
            </form>
        </div>
        </>
    );
}

export default Welcome;
