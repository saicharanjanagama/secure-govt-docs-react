import styled from "styled-components";

const FullPageLoader = ({ text = "Please wait..." }) => {
  return (
    <Wrapper>
      <Spinner />
      <Message>{text}</Message>
    </Wrapper>
  );
};

export default FullPageLoader;

/* ---------- STYLES ---------- */

const Wrapper = styled.div`
  min-height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #f4f6f8;
`;

const Spinner = styled.div`
  width: 42px;
  height: 42px;
  border: 4px solid #e5e7eb;
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const Message = styled.p`
  margin-top: 14px;
  font-size: 15px;
  color: #475569;
`;
