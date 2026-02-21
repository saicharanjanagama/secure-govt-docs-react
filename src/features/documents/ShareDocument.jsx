import { useState } from "react";
import { shareDocument } from "./documentService";
import { logAction } from "../../utils/logger";
import styled from "styled-components";
import toast from "react-hot-toast";

const ShareDocument = ({ doc, ownerId }) => {
  const [sharedUid, setSharedUid] = useState("");
  const [loading, setLoading] = useState(false); // ✅ NEW

  const handleShare = async () => {
    if (!sharedUid) {
      return toast.error("Enter family member UID");
    }

    try {
      setLoading(true); // ✅ START LOADING

      await shareDocument(doc.id, sharedUid);
      await logAction(
        ownerId,
        "SHARE_DOCUMENT",
        `${doc.fileName} → ${sharedUid}`
      );

      toast.success("Document shared successfully");
      setSharedUid("");
    } catch (err) {
      toast.error("Failed to share document");
    } finally {
      setLoading(false); // ✅ STOP LOADING
    }
  };

  return (
    <ShareBox>
      <Input
        placeholder="Family Member UID"
        value={sharedUid}
        disabled={loading} // ✅ disable input while loading
        onChange={e => setSharedUid(e.target.value)}
      />

      {/* ✅ THIS IS WHERE YOUR BUTTON CODE GOES */}
      <ShareBtn onClick={handleShare} disabled={loading}>
        {loading ? "Processing..." : "Share"}
      </ShareBtn>
    </ShareBox>
  );
};

export default ShareDocument;

/* ---------- styles ---------- */

const ShareBox = styled.div`
  margin-top: 12px;
  display: flex;
  gap: 8px;
`;

const Input = styled.input`
  flex: 1;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #d1d5db;

  &:disabled {
    background: #f1f5f9;
    cursor: not-allowed;
  }
`;

const ShareBtn = styled.button`
  background: #0f172a;
  color: #fff;
  padding: 8px 12px;
  border-radius: 6px;
  border: none;
  font-weight: 500;

  &:disabled {
    background: #94a3b8;
    cursor: not-allowed;
  }
`;
