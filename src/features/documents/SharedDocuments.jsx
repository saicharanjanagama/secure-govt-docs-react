import { useEffect, useState, useMemo } from "react";
import { listenSharedDocuments } from "./documentService";
import { useSelector } from "react-redux";
import DocumentCard from "./DocumentCard";
import styled from "styled-components";

const categories = ["All", "File", "PAN", "Passport", "Education", "Health"];

const SharedDocuments = () => {
  const user = useSelector(state => state.auth.user);

  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ NEW STATES
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("date-desc"); // date-desc | date-asc | name-asc | name-desc

  useEffect(() => {
    if (!user) return;

    const unsubscribe = listenSharedDocuments(user.uid, sharedDocs => {
      setDocs(sharedDocs);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  /* ✅ FILTER + SEARCH + SORT (MEMOIZED) */
  const processedDocs = useMemo(() => {
    let result = [...docs];

    // FILTER BY CATEGORY
    if (selectedCategory !== "All") {
      result = result.filter(
        doc => doc.category === selectedCategory
      );
    }

    // SEARCH BY FILE NAME
    if (search.trim()) {
      result = result.filter(doc =>
        doc.fileName.toLowerCase().includes(search.toLowerCase())
      );
    }

    // SORTING
    switch (sortBy) {
      case "name-asc":
        result.sort((a, b) =>
          a.fileName.localeCompare(b.fileName)
        );
        break;
      case "name-desc":
        result.sort((a, b) =>
          b.fileName.localeCompare(a.fileName)
        );
        break;
      case "date-asc":
        result.sort(
          (a, b) =>
            (a.createdAt?.toMillis?.() || 0) -
            (b.createdAt?.toMillis?.() || 0)
        );
        break;
      case "date-desc":
      default:
        result.sort(
          (a, b) =>
            (b.createdAt?.toMillis?.() || 0) -
            (a.createdAt?.toMillis?.() || 0)
        );
        break;
    }

    return result;
  }, [docs, selectedCategory, search, sortBy]);

  if (loading) {
    return <InfoText>Loading shared documents…</InfoText>;
  }

  return (
    <Container>
      <Title>Documents Shared With Me</Title>

      {/* ✅ CONTROLS BAR */}
      <Controls>
        {/* SEARCH */}
        <SearchInput
          placeholder="Search by file name"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        {/* SORT */}
        <Select value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="date-desc">Newest First</option>
          <option value="date-asc">Oldest First</option>
          <option value="name-asc">Name A–Z</option>
          <option value="name-desc">Name Z–A</option>
        </Select>
      </Controls>

      {/* CATEGORY FILTER */}
      <FilterBar>
        {categories.map(cat => (
          <FilterBtn
            key={cat}
            $active={selectedCategory === cat}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat === "File" ? "General" : cat}
          </FilterBtn>
        ))}
      </FilterBar>

      {processedDocs.length === 0 && (
        <InfoText>📁 No documents found</InfoText>
      )}

      {processedDocs.map(doc => (
        <DocumentCard
          key={doc.id}
          doc={doc}
          isShared
        />
      ))}
    </Container>
  );
};

export default SharedDocuments;

/* ---------- styles ---------- */

const Container = styled.div`
  padding: 32px;
  max-width: 1000px;
  margin: auto;
`;

const Title = styled.h2`
  margin-bottom: 20px;
  color: #0f172a;
`;

const Controls = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
`;

const SearchInput = styled.input`
  flex: 1;
  min-width: 220px;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #2563eb;
  }
`;

const Select = styled.select`
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  font-size: 14px;
`;

const FilterBar = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const FilterBtn = styled.button`
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 13px;
  border: 1px solid #e5e7eb;
  background: ${({ $active }) =>
    $active ? "#2563eb" : "#ffffff"};
  color: ${({ $active }) =>
    $active ? "#ffffff" : "#0f172a"};
  cursor: pointer;

  &:hover {
    background: ${({ $active }) =>
      $active ? "#1d4ed8" : "#e0e7ff"};
  }
`;

const InfoText = styled.p`
  color: #64748b;
  font-size: 14px;
  text-align: center;
`;
