import { useState } from "react";
import styled from "styled-components";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { auth, db } from "../../utils/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import FullPageLoader from "../../components/FullPageLoader";
import toast from "react-hot-toast";

// Aadhaar masking helper (SECURITY)
const maskAadhaar = aadhaar =>
  "XXXX-XXXX-" + aadhaar.slice(-4);

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    username: "",
    aadhaar: "",
    dob: "",
    gender: "",
    phone: "",
    email: "",
    password: "",
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async e => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      // 🔐 SEND VERIFICATION EMAIL
      await sendEmailVerification(res.user);

      // 🧾 SAVE USER PROFILE
      await setDoc(doc(db, "users", res.user.uid), {
        uid: res.user.uid,
        fullName: form.fullName.trim(),
        username: form.username.trim(),
        aadhaarMasked: maskAadhaar(form.aadhaar),
        dob: form.dob,
        gender: form.gender,
        phone: form.phone.replace(/\D/g, ""),
        email: form.email.toLowerCase(),
        emailVerified: false,
        phoneVerified: false,
        createdAt: serverTimestamp(),
      });

      // 🚫 IMPORTANT: DO NOT GO TO DASHBOARD
      // 👉 FORCE USER TO VERIFY EMAIL FIRST
      navigate("/verify-email", { replace: true });

    } catch (err) {
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <FullPageLoader text="Creating your account…" />;
  }

  return (
    <Wrapper>
      <Form onSubmit={handleRegister}>
        <Title>Create Account</Title>

        <Input name="fullName" placeholder="Full Name" required onChange={handleChange} />
        <Input name="username" placeholder="Username" required onChange={handleChange} />
        <Input name="aadhaar" placeholder="Aadhaar Number" maxLength={12} required onChange={handleChange} />
        <Input type="date" name="dob" required onChange={handleChange} />

        <Select name="gender" required onChange={handleChange}>
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </Select>

        <Input name="phone" placeholder="Phone Number" required onChange={handleChange} />
        <Input type="email" name="email" placeholder="Email" required onChange={handleChange} />
        <Input type="password" name="password" placeholder="Password" required onChange={handleChange} />

        <Button type="submit" disabled={loading}>
          {loading ? "Creating Account..." : "Register"}
        </Button>

        <FooterText>
          Already have an account? <StyledLink to="/login">Login</StyledLink>
        </FooterText>
      </Form>
    </Wrapper>
  );
};

export default Register;

/* ---------- STYLES ---------- */

const Wrapper = styled.div`
  min-height: calc(100vh - 64px);
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f4f6f8;
`;

const Form = styled.form`
  background: #fff;
  padding: 32px;
  border-radius: 12px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 12px 30px rgba(15,23,42,0.08);
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const Title = styled.h2`
  text-align: center;
  color: #0f172a;
`;

const Input = styled.input`
  max-width: 100%;
  padding: 10px 12px;
  border-radius: 6px;
  border: 1px solid #d1d5db;

  &:focus {
     outline: none;
     border-color: #2563eb;
   }
`;

const Select = styled.select`
  padding: 10px 12px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  
  &:focus {
     outline: none;
     border-color: #2563eb;
   }
`;

const Button = styled.button`
  margin-top: 10px;
  background: #2563eb;
  color: #fff;
  padding: 10px;
  border-radius: 6px;
  font-weight: 600;
  border: none;

  &:hover {
     background: #1d4ed8;
   }
`;

const FooterText = styled.p`
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
