import React, {useState} from 'react'
import {useNavigate} from 'react-router-dom'

const Signup = (props) => {
    let navigate = useNavigate() // useHistory is a hook
    const [credentials, setCredentials] = useState({name: "", email: "", password: "", cpassword: ""})
    const handleSubmit = async (e) => {
        e.preventDefault();
        const {name, email, password} = credentials;
        const response = await fetch(`http://localhost:5000/api/auth/createuser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({name, email, password})
        });
        const data = await response.json();
        console.log(data);
        if(data.success){ //&& password === credentials.cpassword){
            // Save the auth-token and redirect to home
            localStorage.setItem('token', data.authtoken);
            navigate('/login')   
            props.showAlert("Account created successfully", "success")         
        }else{
            props.showAlert("Invalid credentials", "danger")
        }
    }
    const onChange = (e) => {
        setCredentials({...credentials, [e.target.name]: e.target.value});
    }
  return (
    <div className="my-3">
        <h1>Create a new account</h1>
        <form onSubmit={handleSubmit}>
            <div className="mb-3 my-4">
                <label htmlFor="name" className="form-label">Name</label>
                <input type="text" className="form-control" id="name" onChange={onChange} name="name" aria-describedby="emailHelp" required/>
            </div> 
            <div className="mb-3">
                <label htmlFor="email" className="form-label">Email address</label>
                <input type="email" className="form-control" id="email" onChange={onChange} name="email" aria-describedby="emailHelp" required/>
            </div>
            <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input type="password" className="form-control" id="password" onChange={onChange} name="password" minLength={5} required/>
            </div>
            <div className="mb-3">
                <label htmlFor="cpassword" className="form-label">Confirm Password</label>
                <input type="password" className="form-control" id="cpassword" onChange={onChange} name="cpassword" minLength={5} required/>
            </div>
            
            <button type="submit" className="btn btn-primary">Submit</button>
    </form>
    </div>
  )
}

export default Signup