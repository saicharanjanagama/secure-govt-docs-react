import styled from "styled-components";
import { useSelector } from "react-redux";
import ShareDocument from "./ShareDocument";

const DocumentCard = ({ doc, onDelete, isShared = false }) => {
  const user = useSelector(state => state.auth.user);
  const isOwner = user?.uid === doc.ownerId;

  return (
    <Card>
      <TopRow>
        <Info>
          <FileName>{doc.originalName || doc.fileName}</FileName>
          <FileType>{doc.fileType}</FileType>
        </Info>

        {/* ✅ CATEGORY BADGE */}
        {doc.category && <CategoryBadge>{doc.category}</CategoryBadge>}
      </TopRow>

      <Actions>
        <ViewLink href={doc.fileUrl} target="_blank" rel="noreferrer">
          View
        </ViewLink>

        {/* ✅ DELETE ONLY FOR OWNER */}
        {isOwner && !isShared && onDelete && (
          <DeleteBtn onClick={() => onDelete(doc)}>
            Delete
          </DeleteBtn>
        )}
      </Actions>

      {/* ✅ SHARE SECTION ONLY FOR OWNER */}
      {isOwner && !isShared && (
        <ShareWrapper>
          <ShareDocument doc={doc} ownerId={user.uid} />
        </ShareWrapper>
      )}
    </Card>
  );
};

export default DocumentCard;

/* ---------- styles ---------- */

const Card = styled.div`
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 14px 16px;
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
`;

const FileName = styled.span`
  font-weight: 600;
  font-size: 14px;
  color: #0f172a;
`;

const FileType = styled.span`
  font-size: 12px;
  color: #64748b;
`;

const CategoryBadge = styled.span`
  background: #e0e7ff;
  color: #2563eb;
  padding: 4px 10px;
  font-size: 12px;
  border-radius: 999px;
  font-weight: 500;
`;

const Actions = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const ViewLink = styled.a`
  color: #2563eb;
  font-weight: 500;
  font-size: 13px;
`;

const DeleteBtn = styled.button`
  background: #ef4444;
  color: #fff;
  padding: 6px 10px;
  font-size: 13px;
  border-radius: 6px;
  border: none;
  cursor: pointer;

  &:hover {
    background: #dc2626;
  }
`;

const ShareWrapper = styled.div`
  margin-top: 6px;
`;
