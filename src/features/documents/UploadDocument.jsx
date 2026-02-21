import { useState } from "react";
import { uploadDocumentWithProgress } from "./documentService";
import { useSelector } from "react-redux";
import { logAction } from "../../utils/logger";
import styled from "styled-components";
import toast from "react-hot-toast";

const UploadDocument = () => {
  const user = useSelector(state => state.auth.user);

  const [file, setFile] = useState(null);
  const [category, setCategory] = useState("");
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) return toast.error("Select a file");
    if (!category) return toast.error("Select document category");

    const maxSize = 5 * 1024 * 1024; // 5MB
    const blockedExtensions = ["exe", "apk", "bat", "cmd", "sh"];

    const extension = file.name.split(".").pop().toLowerCase();
    if (blockedExtensions.includes(extension)) {
      return toast.error("Executable files are not allowed");
    }

    if (file.size > maxSize) {
      return toast.error("Max file size is 5MB");
    }

    try {
      setUploading(true);
      setProgress(0);

      await uploadDocumentWithProgress(
        file,
        user.uid,
        setProgress,
        category
      );

      await logAction(
        user.uid,
        "UPLOAD_DOCUMENT",
        `${file.name} (${category})`
      );

      toast.success("Document uploaded successfully");

      // RESET
      setFile(null);
      setCategory("");
    } catch (err) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <Wrapper>
      {/* FILE INPUT */}
      <Input
        type="file"
        disabled={uploading}
        onChange={e => setFile(e.target.files[0])}
      />

      {/* CATEGORY SELECT */}
      <Select
        value={category}
        disabled={uploading}
        onChange={e => setCategory(e.target.value)}
      >
        <option value="">Select Category</option>
        <option value="File">File (General)</option>
        <option value="PAN">PAN Card</option>
        <option value="Passport">Passport</option>
        <option value="Education">Education</option>
        <option value="Health">Health</option>
      </Select>

      {/* PROGRESS BAR */}
      {uploading && (
        <ProgressBar>
          <ProgressFill style={{ width: `${progress}%` }} />
        </ProgressBar>
      )}

      {/* UPLOAD BUTTON */}
      <UploadBtn
        onClick={handleUpload}
        disabled={!file || !category || uploading}
      >
        {uploading ? "Uploading…" : "Upload Document"}
      </UploadBtn>
    </Wrapper>
  );
};

export default UploadDocument;

/* ---------- styles ---------- */

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Input = styled.input`
  font-size: 14px;
`;

const Select = styled.select`
  width: 180px;
  font-size: 14px;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #d1d5db;

  &:focus {
    outline: none;
    border-color: #2563eb;
  }
`;

const ProgressBar = styled.div`
  height: 6px;
  width: 180px;
  background: #e5e7eb;
  border-radius: 999px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: #2563eb;
  transition: width 0.3s ease;
`;

const UploadBtn = styled.button`
  width: 180px;
  background: #2563eb;
  color: #fff;
  padding: 10px;
  border-radius: 8px;
  font-weight: 600;
  border: none;

  &:disabled {
    background: #94a3b8;
  }
`;
