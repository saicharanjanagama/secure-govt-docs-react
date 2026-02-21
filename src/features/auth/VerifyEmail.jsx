import styled from "styled-components";
import { sendEmailVerification } from "firebase/auth";
import { auth, db } from "../../utils/firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUser } from "../../features/auth/authSlice";
import { mapFirebaseUser } from "../../utils/mapUser";

const VerifyEmail = () => {
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  /* ---------- GUARD ---------- */
  useEffect(() => {
    if (!auth.currentUser) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  /* ---------- RESEND EMAIL ---------- */
  const resendVerification = async () => {
    if (!auth.currentUser || cooldown) return;

    try {
      setLoading(true);
      await sendEmailVerification(auth.currentUser);
      toast.success("Verification email sent");

      setCooldown(true);
      setTimeout(() => setCooldown(false), 30000);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- MANUAL CHECK ---------- */
  const checkVerification = async () => {
    if (!auth.currentUser) return;

    await auth.currentUser.reload();

    if (auth.currentUser.emailVerified) {
      await syncVerificationAndRedirect();
    } else {
      toast.error("Email not verified yet");
    }
  };

  /* ---------- 🔥 FIXED SYNC + REDIRECT ---------- */
  const syncVerificationAndRedirect = useCallback(async () => {
    if (!auth.currentUser) return;

    try {
      // 1️⃣ Update Firestore emailVerified
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        emailVerified: true,
      });

      // 2️⃣ FETCH FULL FIRESTORE PROFILE (IMPORTANT FIX)
      const snap = await getDoc(
        doc(db, "users", auth.currentUser.uid)
      );
      const firestoreData = snap.exists() ? snap.data() : {};

      // 3️⃣ UPDATE REDUX WITH FULL DATA (EMAIL + PHONE)
      dispatch(
        setUser(
          mapFirebaseUser(auth.currentUser, firestoreData)
        )
      );

      toast.success("Email verified successfully");

      // 4️⃣ Redirect → OTP will now have phone
      navigate("/verify-otp", { replace: true });

    } catch (err) {
      toast.error("Failed to update verification status");
    }
  }, [dispatch, navigate]);

  /* ---------- AUTO POLLING ---------- */
  useEffect(() => {
    const interval = setInterval(async () => {
      if (!auth.currentUser) return;

      await auth.currentUser.reload();

      if (auth.currentUser.emailVerified) {
        clearInterval(interval);
        await syncVerificationAndRedirect();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [syncVerificationAndRedirect]);

  return (
    <Wrapper>
      <Card>
        <Title>Verify Your Email</Title>

        <Text>
          We’ve sent a verification link to your email address.
          <br />
          Please verify your email before continuing.
        </Text>

        <Hint>
          Didn’t receive the email? Check spam or resend.
        </Hint>

        <Button onClick={resendVerification} disabled={loading || cooldown}>
          {cooldown
            ? "Please wait…"
            : loading
            ? "Sending..."
            : "Resend Verification Email"}
        </Button>

        <SecondaryBtn onClick={checkVerification}>
          I’ve verified my email
        </SecondaryBtn>
      </Card>
    </Wrapper>
  );
};

export default VerifyEmail;

/* ---------- styles ---------- */

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
  font-size: 22px;
`;

const Text = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 20px;
`;

const Hint = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 16px;
`;

const Button = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  padding: 10px 18px;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
  }
`;

const SecondaryBtn = styled.button`
  margin-top: 18px;
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 14px;
  cursor: pointer;
`;
