import React from 'react'
import { useNavigate } from 'react-router-dom'

function NotFound() {
    let navigate = useNavigate();
    return (
        <>
            <div className="wrapper">
                <div className="landing-page text-center py-5">
                    <h1 className='text-secondary'> 404 Error.</h1>
                    <p> We can't find the page you're looking for.</p>
                    <button className='btn btn-primary' onClick={() => navigate("/dashboard")}>Back to home</button>
                </div>
            </div>
        </>
    )
}

export default NotFound