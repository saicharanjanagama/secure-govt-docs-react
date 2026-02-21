import styled from "styled-components";
import { lazy, Suspense } from "react";
import { useSelector } from "react-redux";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../utils/firebase";
import { useEffect, useState } from "react";

const UploadDocument = lazy(() => import("../documents/UploadDocument"));
const DocumentList = lazy(() => import("../documents/DocumentList"));

const Dashboard = () => {
  const [fullName, setFullName] = useState("");
  const user = useSelector(state => state.auth.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.uid) return;

      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) setFullName(snap.data().fullName);
      setLoading(false);
    };

    fetchProfile();
  }, [user?.uid]);

  if (loading) return <Loading>Loading Dashboard…</Loading>;

  return (
    <Container>
      {/* HEADER */}
      <Header>
        <HeaderLeft>
          <Title>Dashboard</Title>
          <SubTitle>Welcome back{fullName ? `, ${fullName}` : ""}</SubTitle>
        </HeaderLeft>
      </Header>

      {/* CONTENT */}
      <Content>
        <Suspense fallback={<Loader>Loading documents…</Loader>}>
          {/* UPLOAD CARD */}
          <Card>
            <CardHeader>
              <CardTitle>Upload Document</CardTitle>
              <CardDesc>
                Upload government documents securely
              </CardDesc>
            </CardHeader>

            <UploadDocument />
          </Card>

          {/* DOCUMENT LIST CARD */}
          <Card>
            <CardHeader>
              <CardTitle>My Documents</CardTitle>
              <CardDesc>
                View, manage and share your documents
              </CardDesc>
            </CardHeader>

            <DocumentList />
          </Card>
        </Suspense>
      </Content>
    </Container>
  );
};

export default Dashboard;

/* ---------- STYLES ---------- */

const Container = styled.div`
  padding: 32px;
  max-width: 1200px;
  margin: auto;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
`;

const HeaderLeft = styled.div``;

const Title = styled.h2`
  font-size: 28px;
  font-weight: 700;
  color: #0f172a;
`;

const SubTitle = styled.p`
  margin-top: 4px;
  color: #64748b;
  font-size: 14px;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Card = styled.div`
  background: #ffffff;
  padding: 28px;
  border-radius: 14px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
`;

const CardHeader = styled.div`
  margin-bottom: 18px;
`;

const CardTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #0f172a;
`;

const CardDesc = styled.p`
  font-size: 14px;
  color: #64748b;
  margin-top: 4px;
`;

const Loader = styled.p`
  padding: 24px;
  text-align: center;
  color: #64748b;
`;

const Loading = styled.p`
  padding: 40px;
  text-align: center;
  color: #64748b;
`;