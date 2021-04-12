import { useState } from "react";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log(password, email);
  };

  return (
    <div>
      <center>
        <h1> Login </h1>
      </center>

      <form onSubmit={handleFormSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Email"
        />
        <br />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Password"
        />
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default LoginPage;
