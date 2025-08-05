const Login = () => {
  return(<>
    <form action="POST" className="login">
      <h1>Login</h1>
        <label htmlFor="Username">Username</label>
        <input type="text" name="Username"/>
        <label htmlFor="Password">Password</label>
        <input type="password" name="Password"/>
    </form>
  </>);
};

export default Login;
