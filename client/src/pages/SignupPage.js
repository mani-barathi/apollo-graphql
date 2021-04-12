import { useState } from "react";

function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log(username, password, email);
  };

  return (
    <div>
      <center>
        <h1> Signup </h1>
      </center>

      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          placeholder="Username"
          minLength={3}
        />
        <br />
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
          minLength={6}
        />
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default SignupPage;
