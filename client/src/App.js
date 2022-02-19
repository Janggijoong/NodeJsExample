import React from "react";
import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import LandingPage from "./components/views/LandingPage/LandingPage";
import LoginPage from "./components/views/LoginPage/LoginPage";
import RegisterPage from "./components/views/RegisterPage/RegisterPage";
import Auth from './hoc/auth';

function App() {
  //null  => 아무나 출입 가능
  //true  => 로그인한 유저만 출입 가능
  //false => 로그인한 유저는 출입 불가능한 페이지

  const NewLandingPage = Auth(LandingPage, null);
  const NewLoginPage = Auth(LoginPage, false)
  const NewRegisterPage = Auth(RegisterPage, false);

  return (
   <BrowserRouter>
    <Routes>
      <Route exact path="/" element = {<NewLandingPage/>}/>
      <Route exact path="/login" element = {<NewLoginPage/>}/>
      <Route exact path="/register" element = {<NewRegisterPage/>}/>
    </Routes> 
  </BrowserRouter>
  );
}

export default App;