import React, { useEffect} from "react";
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();

    const callLogout = async () => {
        try {
            const res = await fetch('/logout', {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                credentials: "include"
            });

            if (res.status === 200) {
                window.alert("Logout Successfull");
                navigate('/login', {replace:true});
            }

            else {
                throw new Error('Error Occurred');
            }
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        callLogout();
    }, []);

    return (
        <>
        <div>
            <form method="GET">
                <p>Hello Logout page</p>
            </form>
        </div>
        </>
    );
}

export default Logout;