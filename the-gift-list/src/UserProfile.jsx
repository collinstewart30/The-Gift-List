import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBTypography,
  MDBIcon,
} from "mdb-react-ui-kit";

// Initialize Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function UserProfile() {
  const [userId, setUserId] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [userFullName, setUserFullName] = useState(null);
  const [userPhoneNumber, setUserPhoneNumber] = useState(null);
  const [userAvatarUrl, setUserAvatarUrl] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newFullName, setNewFullName] = useState("");
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [newAvatarUrl, setNewAvatarUrl] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();
        if (error) {
          console.error("Error fetching user:", error.message);
          return;
        }

        if (user) {
          setUserId(user.id);
          setUserEmail(user.email);

          // Check or insert profile in the profiles table
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("full_name, avatar_url")
            .eq("id", user.id)
            .single();

          if (profileError) {
            if (profileError.code === "PGRST116") {
              // Profile doesn't exist, insert default
              const { error: insertError } = await supabase
                .from("profiles")
                .insert({
                  id: user.id,
                  full_name:
                    user.user_metadata?.full_name || user.email.split("@")[0],
                  avatar_url:
                    user.user_metadata?.avatar_url ||
                    "https://via.placeholder.com/100",
                });

              if (insertError) {
                console.error("Error inserting profile:", insertError.message);
                return;
              }
              setUserFullName(
                user.user_metadata?.full_name || user.email.split("@")[0]
              );
              setUserPhoneNumber(
                user.user_metadata?.phone || "+1 (234) 567-8901"
              );
              setUserAvatarUrl(
                user.user_metadata?.avatar_url ||
                  "https://via.placeholder.com/100"
              );
            } else {
              console.error("Error fetching profile:", profileError.message);
              return;
            }
          } else {
            // Profile exists
            setUserFullName(profile.full_name);
            setUserPhoneNumber(profile.phone);
            setUserAvatarUrl(profile.avatar_url);
          }
        }
      } catch (err) {
        console.error("Unexpected error fetching user data:", err);
      }
    };

    fetchUserData();
  }, []);

  const saveChanges = async () => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: newFullName || userFullName,
          phone: newPhoneNumber || userPhoneNumber,
          avatar_url: newAvatarUrl || userAvatarUrl,
        })
        .eq("id", userId);

      if (error) {
        console.error("Error saving changes:", error.message);
        return;
      }

      setUserFullName(newFullName || userFullName);
      setUserPhoneNumber(newPhoneNumber || userPhoneNumber);
      setUserAvatarUrl(newAvatarUrl || userAvatarUrl);
      setIsEditing(false);
    } catch (err) {
      console.error("Unexpected error saving changes:", err);
    }
  };

  return (
    <Container>
      <section className="vh-100">
        <MDBContainer className="py-5 h-100">
          <MDBRow className="justify-content-center align-items-center h-100">
            <MDBCol lg="10" className="mb-4 mb-lg-0">
              <MDBCard className="mb-3" style={{ borderRadius: ".5rem" }}>
                <MDBRow className="g-0">
                  <MDBCol
                    md="4"
                    className="gradient-custom text-center text-white"
                    style={{
                      borderTopLeftRadius: ".5rem",
                      borderBottomLeftRadius: ".5rem",
                    }}
                  >
                    {userAvatarUrl ? (
                      <div>
                        <MDBCardImage
                          src={userAvatarUrl}
                          alt="Avatar"
                          className="my-5"
                          style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "cover",
                            borderRadius: "50%",
                          }}
                          fluid
                        />
                      </div>
                    ) : (
                      <div>
                        <p>No avatar available.</p>
                      </div>
                    )}
                    {isEditing ? (
                      <div>
                        <div>
                          <p className="mb-0">New Avatar URL:</p>
                          <input
                            type="text"
                            className="mb-3"
                            defaultValue={userAvatarUrl}
                            onChange={(e) => setNewAvatarUrl(e.target.value)}
                          />
                        </div>
                        <div>
                          <p className="mb-0">Full Name:</p>
                          <input
                            type="text"
                            className="mb-3"
                            defaultValue={userFullName}
                            onChange={(e) => setNewFullName(e.target.value)}
                          />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <MDBTypography tag="h5">{userFullName}</MDBTypography>
                      </div>
                    )}
                    {isEditing ? (
                      <div>
                        <MDBIcon
                          onClick={() => setIsEditing(false)}
                          far
                          icon="circle-xmark mb-5 me-3"
                        />
                        <MDBIcon onClick={saveChanges} far icon="save mb-5" />
                      </div>
                    ) : (
                      <div>
                        <MDBIcon
                          onClick={() => setIsEditing(true)}
                          far
                          icon="edit mb-5"
                        />
                      </div>
                    )}
                  </MDBCol>
                  <MDBCol md="8">
                    <MDBCardBody className="p-4">
                      <MDBTypography tag="h6">Information</MDBTypography>
                      <hr className="mt-0 mb-4" />
                      <MDBRow className="pt-1">
                        <MDBCol size="6" className="mb-3">
                          <MDBTypography tag="h6">Email</MDBTypography>
                          <MDBCardText className="text-muted">
                            {userEmail}
                          </MDBCardText>
                        </MDBCol>
                        <MDBCol size="6" className="mb-3">
                          <MDBTypography tag="h6">Phone Number</MDBTypography>
                          {isEditing ? (
                            <input
                              type="text"
                              className="mb-3"
                              defaultValue={userPhoneNumber}
                              onChange={(e) =>
                                setNewPhoneNumber(e.target.value)
                              }
                            />
                          ) : (
                            <MDBCardText className="text-muted">
                              {userPhoneNumber}
                            </MDBCardText>
                          )}
                        </MDBCol>
                      </MDBRow>
                    </MDBCardBody>
                  </MDBCol>
                </MDBRow>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </section>
    </Container>
  );
}
