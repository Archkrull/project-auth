import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector, batch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { API_URL } from 'utils/Utils'
import user from 'reducers/user'

const UserInput = (page) => {
  const endPoint = (page.page)
  const [username, setUsername] = useState("") 
  const [password, setPassword] = useState("") 

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const accessToken = useSelector((store) => store.user.accessToken) 

  useEffect(() => {
    if(accessToken) {
      navigate("/dashboard")
    }
  }, [accessToken])

  const onFormSubmit = (event) => {
    event.preventDefault();
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({username: username, password: password})
    }
    fetch(API_URL(endPoint), options)
    .then(response => response.json())
    .then(data => {
      if(data.success) {
        batch(() => {
          dispatch(user.actions.setUsername(data.response.username));
          dispatch(user.actions.setUserId(data.response.id));
          dispatch(user.actions.setAccessToken(data.response.accessToken));
          dispatch(user.actions.setError(null));
          navigate("/dashboard");
        });
      } else {
        batch (() => { 
          dispatch(user.actions.setUsername(null));
          dispatch(user.actions.setUserId(null));
          dispatch(user.actions.setAccessToken(null));
          dispatch(user.actions.setError(data.response));
          alert("Something went wrong");
        })
      }
    })
   
  }

  return (
  <>
    <form onSubmit={onFormSubmit}>
      <label htmlFor="username">Username</label>
      <input
        type="text"
        id="username"
        value={username}
        onChange={e => setUsername(e.target.value)} />

      <label htmlFor="password">Password</label>
      <input
        type="password"
        id="password"
        value={password}
        onChange={e => setPassword(e.target.value)} />

    <button type="submit">Submit</button>
    </form>
  </>
  
  )

}

export default UserInput;