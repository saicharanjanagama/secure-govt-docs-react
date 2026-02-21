import { useState } from "react";
import styled from "styled-components";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../utils/firebase";
import { Link, useNavigate } from "react-router-dom";
import FullPageLoader from "../../components/FullPageLoader";
import toast from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async e => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await signInWithEmailAndPassword(auth, email, password);

      // 🔐 EMAIL VERIFICATION CHECK
      if (!res.user.emailVerified) {
        toast.error("Please verify your email before logging in");
        setLoading(false);
        return;
      }

      // 🔁 REDIRECT AFTER SUCCESS
      navigate("/dashboard", { replace: true });
    } catch (err) {
      toast.error("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  // 🔄 FULL PAGE LOADER
  if (loading) {
    return <FullPageLoader text="Signing you in…" />;
  }

  return (
    <Wrapper>
      <Form onSubmit={handleLogin}>
        <Title>Welcome Back</Title>
        <Subtitle>Login to access your secure documents</Subtitle>

        <Input
          type="email"
          placeholder="Email Address"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <Input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <Button type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </Button>

        <FooterText>
          Not registered yet?{" "}
          <StyledLink to="/register">Register first</StyledLink>
        </FooterText>
      </Form>
    </Wrapper>
  );
};

export default Login;

/* ---------- STYLES ---------- */

const Wrapper = styled.div`
  min-height: calc(100vh - 64px);
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f4f6f8;
  padding: 16px;
`;

const Form = styled.form`
  background: #ffffff;
  padding: 32px;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
  display: flex;
  flex-direction: column;
  gap: 14px;

  @media (max-width: 420px) {
    padding: 24px;
  }
`;

const Title = styled.h2`
  text-align: center;
  color: #0f172a;
  font-size: 22px;
`;

const Subtitle = styled.p`
  text-align: center;
  font-size: 14px;
  color: #64748b;
  margin-bottom: 10px;
`;

const Input = styled.input`
  padding: 10px 12px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #2563eb;
  }
`;

const Button = styled.button`
  margin-top: 10px;
  padding: 10px;
  background: #2563eb;
  color: #fff;
  border-radius: 6px;
  font-weight: 600;
  border: none;
  font-size: 15px;

  &:hover {
    background: #1d4ed8;
  }
`;

const FooterText = styled.p`
  margin-top: 12px;
  font-size: 14px;
  text-align: center;
  color: #64748b;
`;

const StyledLink = styled(Link)`
  color: #2563eb;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;
