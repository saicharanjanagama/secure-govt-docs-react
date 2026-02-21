import styled from "styled-components";
import {
  getAuth,
  RecaptchaVerifier,
  PhoneAuthProvider,
  linkWithCredential,
} from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../utils/firebase";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../features/auth/authSlice";

const VerifyOtp = () => {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = getAuth();

  const [otp, setOtp] = useState("");
  const verificationIdRef = useRef(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    };
  }, []);

  /* ---------- INIT reCAPTCHA (ONCE) ---------- */
  const initRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
        }
      );
    }
  };

  /* ---------- SEND OTP ---------- */
  const sendOtp = async () => {
    if (!user?.phone) {
      toast.error("Phone number missing");
      return;
    }

    try {
      setLoading(true);
      initRecaptcha();

      const provider = new PhoneAuthProvider(auth);

      const verificationId = await provider.verifyPhoneNumber(
        `+91${user.phone}`,
        window.recaptchaVerifier
      );

      verificationIdRef.current = verificationId;
      toast.success("OTP sent");

    } catch (err) {
      console.error(err);
      toast.error("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- VERIFY OTP ---------- */
  const verifyOtp = async () => {
    if (!verificationIdRef.current || otp.length !== 6) {
      toast.error("Invalid OTP");
      return;
    }

    try {
      setLoading(true);

      const credential = PhoneAuthProvider.credential(
        verificationIdRef.current,
        otp
      );

      // 🔥 LINK phone to EXISTING logged-in user
      await linkWithCredential(auth.currentUser, credential);

      // 🔁 Update Firestore
      await updateDoc(doc(db, "users", user.uid), {
        phoneVerified: true,
      });

      // 🔁 Update Redux
      dispatch(
        setUser({
          ...user,
          phoneVerified: true,
        })
      );

      toast.success("Mobile number verified");
      navigate("/dashboard", { replace: true });

    } catch (err) {
      console.error(err);
      toast.error("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Wrapper>
        <Card>
          <Text>Loading verification details…</Text>
        </Card>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Card>
        <Title>Verify Mobile Number</Title>

        <Text>
          OTP will be sent to <strong>+91 {user.phone}</strong>
        </Text>

        {/* 🔒 Required container for reCAPTCHA */}
        <div id="recaptcha-container" style={{ display: "none" }} />

        {!verificationIdRef.current ? (
          <Button onClick={sendOtp} disabled={loading}>
            {loading ? "Sending..." : "Send OTP"}
          </Button>
        ) : (
          <>
            <Input
              placeholder="Enter 6-digit OTP"
              value={otp}
              maxLength={6}
              onChange={e => setOtp(e.target.value)}
            />

            <Button
              onClick={verifyOtp}
              disabled={loading || otp.length !== 6}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </Button>
          </>
        )}
      </Card>
    </Wrapper>
  );
};

export default VerifyOtp;

/* ---------- STYLES ---------- */

const Wrapper = styled.div`
  min-height: calc(100vh - 64px);
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.background};
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.white};
  padding: 32px;
  max-width: 420px;
  width: 100%;
  border-radius: 14px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
  text-align: center;
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.secondary};
  margin-bottom: 10px;
`;

const Text = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  margin-bottom: 14px;
`;

const Button = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  padding: 10px 18px;
  border-radius: 8px;
  border: none;
  font-weight: 600;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;