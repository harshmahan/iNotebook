import React, {useState} from 'react'
import {useNavigate} from 'react-router-dom'

const Login = (props) => {
    let navigate = useNavigate() // useHistory is a hook
    const [credentials, setCredentials] = useState({email: "", password: ""})
    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(`http://localhost:5000/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({email: credentials.email, password: credentials.password})
        });
        const json = await response.json();
        console.log(json);
        if(json.success){
            // Save the auth-token and redirect to home
            localStorage.setItem('auth-token', json.authToken);
            navigate('/')   
            props.showAlert("Logged in successfully", "success")         
        }else{
            props.showAlert("Invalid credentials", "danger")
        }
    }
    const onChange = (e) => {
        setCredentials({...credentials, [e.target.name]: e.target.value});
    }
  return (
    <div className="my-3">
        <h2>Login to continue to iNotebook</h2>
        <form onSubmit={handleSubmit}>
            <div className="mb-3 my-4">
                <label htmlFor="email" className="form-label">Email address</label>
                <input type="email" className="form-control" id="email" value={credentials.email} onChange={onChange} name="email" aria-describedby="emailHelp"/>
            </div>
            <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input type="password" className="form-control" id="password" value={credentials.password} onChange={onChange} name="password" />
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
        </form>
    </div>
  )
}

export default Login