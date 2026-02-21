import styled from "styled-components";

const SharedDocumentCard = ({ doc, onRemove }) => {
  return (
    <Card>
      <Info>
        <FileName>{doc.fileName}</FileName>
        <FileType>{doc.fileType}</FileType>
      </Info>

      <Actions>
        <a href={doc.fileUrl} target="_blank" rel="noreferrer">
          View
        </a>
      </Actions>
    </Card>
  );
};

export default SharedDocumentCard;

/* styles */
const Card = styled.div`
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 14px 16px;
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
`;

const FileName = styled.span`
  font-weight: 600;
  font-size: 14px;
`;

const FileType = styled.span`
  font-size: 12px;
  color: #64748b;
`;

const Actions = styled.div`
  display: flex;
  gap: 10px;
`;


