import { useEffect, useState } from "react";
import styled from "styled-components";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { db, auth, storage } from "../../utils/firebase";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const maskAadhaar = aadhaar =>
  "XXXX-XXXX-" + aadhaar.slice(-4);

const MyProfile = () => {
  const user = useSelector(state => state.auth.user);

  const [profile, setProfile] = useState({
    uid: "",
    photoURL: "",
    fullName: "",
    username: "",
    aadhaarMasked: "",
    dob: "",
    gender: "",
    phone: "",
    email: "",
  });
  
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) setProfile(snap.data());
      setLoading(false);
    };
    fetchProfile();
  }, [user.uid]);

  const handleChange = e => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const uploadProfilePhoto = async () => {
    if (!photoFile) return profile.photoURL;

    const ext = photoFile.name.split(".").pop().toLowerCase();
    const newRef = ref(
      storage,
      `profile-pictures/${user.uid}/profile.${ext}`
    );

    // ✅ USE RESUMABLE UPLOAD (AUTH SAFE)
    const uploadTask = uploadBytesResumable(newRef, photoFile);

    await new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        null,
        error => reject(error),
        () => resolve()
      );
    });

    const newUrl = await getDownloadURL(newRef);

    // Optional: cleanup old photo
    if (profile.photoURL && profile.photoURL !== newUrl) {
      try {
        await deleteObject(ref(storage, profile.photoURL));
      } catch (_) {}
    }

    return newUrl;
  };

  const saveProfile = async () => {
    if (!auth.currentUser) {
      alert("Authentication not ready. Please wait a moment.");
      return;
    }

    try {
      setSaving(true); // ✅ start loading

      const photoURL = await uploadProfilePhoto();

      await updateDoc(doc(db, "users", user.uid), {
        fullName: profile.fullName,
        username: profile.username,
        dob: profile.dob,
        gender: profile.gender,
        phone: profile.phone,
        photoURL,
        updatedAt: serverTimestamp(),
      });

      setProfile(prev => ({
        ...prev,
        photoURL,
      }));

      setEditMode(false);
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error("Failed to update Profile");
    } finally {
      setSaving(false); // ✅ stop loading
    }
  };

  useEffect(() => {
    return () => {
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);

  if (loading) return <Loading>Loading profile…</Loading>;

  return (
    <Wrapper>
      <Card>
        {/* TOP SECTION */}
        <ProfileTop>
          <AvatarSection>
            <Avatar
              src={
                photoPreview ||
                profile.photoURL ||
                `https://api.dicebear.com/7.x/initials/svg?seed=${profile.fullName || "User"}`
              }
            />

            {editMode && (
              <UploadLabel>
                Change Photo
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={e => {
                    const file = e.target.files[0];
                    if (!file) return;

                    setPhotoFile(file);
                    setPhotoPreview(URL.createObjectURL(file));
                  }}
                />
              </UploadLabel>
            )}
          </AvatarSection>

          <ProfileMeta>
            <Title>{profile.fullName ? `${profile.fullName}` : "My Profile"}</Title>
            <EmailText>{profile.email}</EmailText>
            <UidBox>
              <UidLabel>UID:</UidLabel>
              <UidValue
                title="Click to copy User ID"
                onClick={() => {
                  navigator.clipboard.writeText(profile.uid);
                  toast.success("User ID copied");
                }}
              >
                {profile.uid}
              </UidValue>
            </UidBox>

            {!editMode && (
              <EditBtn onClick={() => setEditMode(true)}>
                Edit Profile
              </EditBtn>
            )}
          </ProfileMeta>
        </ProfileTop>

        <Divider />

        {/* DETAILS GRID */}
        <Grid>
          <Field>
            <Label>Full Name</Label>
            {editMode ? (
              <Input name="fullName" value={profile.fullName} onChange={handleChange} />
            ) : (
              <Value>{profile.fullName || "-"}</Value>
            )}
          </Field>

          <Field>
            <Label>Username</Label>
            {editMode ? (
              <Input name="username" value={profile.username} onChange={handleChange} />
            ) : (
              <Value>{profile.username || "-"}</Value>
            )}
          </Field>

          <Field>
            <Label>Aadhaar Number</Label>

            {editMode ? (
              <Input
                name="aadhaar"
                maxLength={12}
                placeholder="Enter Aadhaar Number"
                onChange={e =>
                  setProfile(prev => ({
                    ...prev,
                    aadhaarMasked: maskAadhaar(e.target.value),
                  }))
                }
              />
            ) : (
              <Value>{profile.aadhaarMasked || "-"}</Value>
            )}
          </Field>

          <Field>
            <Label>Date of Birth</Label>
            {editMode ? (
              <Input type="date" name="dob" value={profile.dob} onChange={handleChange} />
            ) : (
              <Value>{profile.dob || "-"}</Value>
            )}
          </Field>

          <Field>
            <Label>Gender</Label>
            {editMode ? (
              <Select name="gender" value={profile.gender} onChange={handleChange}>
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </Select>
            ) : (
              <Value>{profile.gender || "-"}</Value>
            )}
          </Field>

          <Field>
            <Label>Phone</Label>
            {editMode ? (
              <Input name="phone" value={profile.phone} onChange={handleChange} />
            ) : (
              <Value>{profile.phone || "-"}</Value>
            )}
          </Field>
        </Grid>

        {/* ACTIONS */}
        {editMode && (
          <Actions>
            <SaveBtn
              onClick={saveProfile}
              disabled={!auth.currentUser || saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </SaveBtn>
            <CancelBtn onClick={() => setEditMode(false)}>Cancel</CancelBtn>
          </Actions>
        )}
      </Card>
    </Wrapper>
  );
};

export default MyProfile;

/* ---------- STYLES ---------- */

const Wrapper = styled.div`
  padding: 40px;
  display: flex;
  justify-content: center;
`;

const Card = styled.div`
  width: 100%;
  max-width: 720px;
  background: #ffffff;
  padding: 32px;
  border-radius: 14px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
`;

const ProfileTop = styled.div`
/* border: 2px solid black; */
  display: flex;
  gap: 28px;
  align-items: center;

  @media (max-width: 768px) {
    gap: 16px;
  }
`;

const ProfileMeta = styled.div`
  flex: 1;
`;

const Title = styled.h2`
  color: #0f172a;
  margin-bottom: 4px;

  @media (max-width: 768px) {
    font-size: 15px;
  }
`;

const EmailText = styled.p`
  color: #64748b;
  font-size: 14px;

  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

const UidBox = styled.div`
/* border: 2px solid red; */
  margin-bottom: 12px;
  display: flex;
  gap: 6px;
  align-items: center;
  text-align: center;
`;

const UidLabel = styled.p`
  font-size: 12px;
  color: #64748b;
`;

const UidValue = styled.p`
  font-size: 13px;
  letter-spacing: 1px;
  color: #0f172a;
  font-family: monospace;
  border-radius: 6px;
  word-break: break-all;
  cursor: pointer;

  @media (max-width: 768px) {
    font-size: 9px;
  }
`;

const EditBtn = styled.button`
  background: #e0e7ff;
  color: #2563eb;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 500;
  border: none;
`;

const Divider = styled.div`
  height: 1px;
  background: #e5e7eb;
  margin: 28px 0;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const AvatarSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Avatar = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #e5e7eb;

  @media (max-width: 768px) {
    width: 125px;
    height: 125px;
  }
`;

const UploadLabel = styled.label`
  margin-top: 10px;
  font-size: 13px;
  color: #2563eb;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const Field = styled.div``;

const Label = styled.p`
  font-size: 13px;
  color: #64748b;
  margin-bottom: 4px;
`;

const Value = styled.p`
  font-size: 15px;
  color: #0f172a;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #d1d5db;

  &:focus {
    outline: none;
    border-color: #2563eb;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 28px;
`;

const SaveBtn = styled.button`
  background: #2563eb;
  color: #fff;
  padding: 10px 18px;
  border-radius: 8px;
  font-weight: 600;
  border: none;
`;

const CancelBtn = styled.button`
  background: #e5e7eb;
  color: #0f172a;
  padding: 10px 18px;
  border-radius: 8px;
  border: none;
`;

const Loading = styled.p`
  padding: 40px;
  text-align: center;
  color: #64748b;
`;
