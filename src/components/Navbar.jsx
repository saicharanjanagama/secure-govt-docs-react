import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../utils/firebase";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../features/auth/authSlice";
import { logAction } from "../utils/logger";
import { useEffect, useState } from "react";

const Navbar = () => {
  const { user, authChecked } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  useEffect(() => {
  setOpen(false);
}, [user]);

  if (!authChecked) return null;

  const handleLogout = async () => {
    if (user?.uid) {
      await logAction(user.uid, "LOGOUT");
    }

    sessionStorage.removeItem("loginLogged");

    await signOut(auth);
    dispatch(clearUser());
    setOpen(false);
  };

  return (
    <Nav>
      <Logo onClick={() => setOpen(false)}>SecureDocs</Logo>

      {user && user.emailVerified && user.phoneVerified && (
        <Hamburger onClick={() => setOpen(!open)}>
          ☰
        </Hamburger>
      )}

      <NavLinks $open={open} $hasUser={!!user}>
        {user && user.emailVerified && user.phoneVerified ? (
          <>
            <StyledLink to="/dashboard" onClick={() => setOpen(false)}>
              Dashboard
            </StyledLink>
            <StyledLink to="/shared" onClick={() => setOpen(false)}>
              Shared Docs
            </StyledLink>
            <StyledLink to="/profile" onClick={() => setOpen(false)}>
              My Profile
            </StyledLink>
            <LogoutBtn onClick={handleLogout}>Logout</LogoutBtn>
          </>
        ) : user ? (
          // 👇 logged in but not fully verified
          <LogoutBtn onClick={handleLogout}>Logout</LogoutBtn>
        ) : (
          <>
            <StyledLink to="/login">Login</StyledLink>
            <StyledLink to="/register">Register</StyledLink>
          </>
        )}
      </NavLinks>
    </Nav>
  );
};

const Nav = styled.nav`
  height: 64px;
  background: #ffffff;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 4px 12px rgba(0,0,0,0.06);
  position: sticky;
  top: 0;
  z-index: 100;
`;

const Logo = styled.h2`
  cursor: pointer;
  color: #2563eb;
  font-weight: 800;
  font-size: 18px;
  
  @media (max-width: 420px) {
    font-size: 16px;
  }
`;

const Hamburger = styled.div`
  display: none;
  font-size: 24px;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  @media (max-width: 768px) {
    position: ${({ $hasUser }) => ($hasUser ? "absolute" : "static")};
    top: ${({ $hasUser }) => ($hasUser ? "64px" : "auto")};
    left: 0;
    width: 100%;

    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: ${({ $hasUser }) =>
      $hasUser ? "space-between" : "flex-end"};

    background: ${({ $hasUser }) =>
      $hasUser ? "rgba(255, 255, 255, 0.75)" : "transparent"};

    backdrop-filter: ${({ $hasUser }) =>
      $hasUser ? "blur(10px) saturate(120%)" : "none"};
    -webkit-backdrop-filter: ${({ $hasUser }) =>
      $hasUser ? "blur(6px)" : "none"};

    border-bottom: ${({ $hasUser }) =>
      $hasUser ? "1px solid rgba(0,0,0,0.06)" : "none"};

    overflow-x: ${({ $hasUser }) => ($hasUser ? "auto" : "visible")};
    overflow-y: hidden;
    white-space: nowrap;

    /* ✅ FIXED: use $open */
    max-height: ${({ $hasUser, $open }) =>
      $hasUser ? ($open ? "72px" : "0") : "none"};

    padding: ${({ $hasUser, $open }) =>
      $hasUser ? ($open ? "12px 10px" : "0") : "0 8px"};

    transition: ${({ $hasUser }) =>
      $hasUser ? "max-height 0.25s ease, padding 0.25s ease" : "none"};

    box-shadow: ${({ $hasUser, $open }) =>
      $hasUser && $open ? "0 10px 24px rgba(0,0,0,0.12)" : "none"};

    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

const StyledLink = styled(NavLink)`
  text-decoration: none;
  color: #0f172a;
  font-weight: 500;
  font-size: 14px;
  padding: 8px 14px;
  border-radius: 6px;
  background: #e0e7ff;
  flex-shrink: 0;

  &.active {
    background: #2563eb;
    color: #ffffff;
  }

  @media (max-width: 420px) {
    font-size: 13px;
    padding: 8px 12px;
  }
`;

const LogoutBtn = styled.button`
  background: #ef4444;
  color: #ffffff;
  border: none;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  flex-shrink: 0;

  &:hover {
    background: #dc2626;
  }

  @media (max-width: 420px) {
    font-size: 13px;
    padding: 8px 12px;
  }
`;

export default Navbar;
