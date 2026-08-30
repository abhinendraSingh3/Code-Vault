import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./Profile.css";
import { getUserProfile, updateUserProfile, resetPasswordApi } from "../../api/userApi";

const Profile = () => {
    const [isOpen, setIsOpen] = useState(true);
    
    // Form profile state (editable by user)
    const [profile, setProfile] = useState({
        firstName: localStorage.getItem("firstName") || "",
        lastName: localStorage.getItem("lastName") || "",
        userName: localStorage.getItem("userName") || "",
        email: localStorage.getItem("email") || "",
        profilePic: localStorage.getItem("profilePic") || "https://api.dicebear.com/7.x/bottts/svg?seed=user",
        bio: localStorage.getItem("bio") || ""
    });

    // Saved profile state (only updates top card preview when Update Profile is clicked)
    const [savedProfile, setSavedProfile] = useState({
        firstName: localStorage.getItem("firstName") || "",
        lastName: localStorage.getItem("lastName") || "",
        userName: localStorage.getItem("userName") || "",
        email: localStorage.getItem("email") || "",
        profilePic: localStorage.getItem("profilePic") || "https://api.dicebear.com/7.x/bottts/svg?seed=user",
        bio: localStorage.getItem("bio") || ""
    });

    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState<"success" | "error">("success");
    const [loading, setLoading] = useState(false);

    // Reset password state
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [passMessage, setPassMessage] = useState("");
    const [passMessageType, setPassMessageType] = useState<"success" | "error">("success");
    const [passLoading, setPassLoading] = useState(false);

    const userId = localStorage.getItem("userId");

    // Fetch latest user profile from backend on load
    useEffect(() => {
        const fetchProfileData = async () => {
            if (!userId) return;
            try {
                const data = await getUserProfile(userId);
                if (data) {
                    const fetchedData = {
                        firstName: data.firstName || "",
                        lastName: data.lastName || "",
                        userName: data.userName || "",
                        email: data.email || "",
                        profilePic: data.profilePic || "https://api.dicebear.com/7.x/bottts/svg?seed=user",
                        bio: data.bio || ""
                    };

                    setProfile(fetchedData);
                    setSavedProfile(fetchedData);

                    // Update localStorage with fresh data from backend
                    localStorage.setItem("firstName", fetchedData.firstName);
                    localStorage.setItem("lastName", fetchedData.lastName);
                    localStorage.setItem("userName", fetchedData.userName);
                    localStorage.setItem("email", fetchedData.email);
                    localStorage.setItem("profilePic", fetchedData.profilePic);
                    localStorage.setItem("bio", fetchedData.bio);
                }
            } catch (error) {
                console.error("Failed to load profile data:", error);
            }
        };

        fetchProfileData();
    }, [userId]);

    // Handle form submit to update profile details
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!userId) {
            setMessage("User not logged in");
            setMessageType("error");
            return;
        }

        setLoading(true);
        try {
            const updated = await updateUserProfile(userId, profile);
            if (updated) {
                // Update savedProfile state so top card updates ONLY after clicking Update Profile
                setSavedProfile({ ...profile });

                // Update local storage so sidebar and dashboard update immediately
                localStorage.setItem("firstName", profile.firstName);
                localStorage.setItem("lastName", profile.lastName);
                localStorage.setItem("email", profile.email);
                localStorage.setItem("profilePic", profile.profilePic);
                localStorage.setItem("bio", profile.bio);

                setMessage("Profile updated successfully!");
                setMessageType("success");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            setMessage("Failed to update profile. Please try again.");
            setMessageType("error");
        } finally {
            setLoading(false);
        }
    };

    // Handle password reset submit
    const handlePasswordReset = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!userId) {
            setPassMessage("User not logged in");
            setPassMessageType("error");
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPassMessage("New password and confirm password do not match");
            setPassMessageType("error");
            return;
        }

        setPassLoading(true);
        try {
            await resetPasswordApi(userId, {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });

            setPassMessage("Password reset successfully!");
            setPassMessageType("success");
            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            });
        } catch (error: any) {
            const errText = error.response?.data?.message || "Failed to reset password. Check current password.";
            setPassMessage(errText);
            setPassMessageType("error");
        } finally {
            setPassLoading(false);
        }
    };

    return (
        <>
            {!isOpen && (
                <button id="expand-sidebar" onClick={() => setIsOpen(true)}>
                    =
                </button>
            )}

            <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

            <div className={`profile-container ${isOpen ? "sidebar-expanded" : "sidebar-collapsed"}`}>
                <div className="profile-header">
                    <h1>My Profile</h1>
                    <p>View and edit your personal details</p>
                </div>

                <div className="profile-card">
                    {/* Top Preview Section - displays saved profile values */}
                    <div className="profile-preview-section">
                        <img 
                            src={savedProfile.profilePic || "https://api.dicebear.com/7.x/bottts/svg?seed=user"} 
                            alt="Profile Avatar" 
                            className="profile-avatar-large" 
                        />
                        <div className="profile-preview-info">
                            <h2>{savedProfile.firstName} {savedProfile.lastName}</h2>
                            <p className="username-tag">@{savedProfile.userName}</p>
                            <p className="bio-text">{savedProfile.bio || "No bio added yet."}</p>
                        </div>
                    </div>

                    {/* Edit Profile Form */}
                    <form className="profile-form" onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label>First Name</label>
                                <input
                                    type="text"
                                    value={profile.firstName}
                                    onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Last Name</label>
                                <input
                                    type="text"
                                    value={profile.lastName}
                                    onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Username</label>
                                <input
                                    type="text"
                                    value={profile.userName}
                                    disabled
                                    className="disabled-input"
                                />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={profile.email}
                                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Choose Avatar Preset</label>
                            <div className="avatar-options-grid">
                                {[
                                    "https://api.dicebear.com/7.x/bottts/svg?seed=user1",
                                    "https://api.dicebear.com/7.x/bottts/svg?seed=coder",
                                    "https://api.dicebear.com/7.x/bottts/svg?seed=developer",
                                    "https://api.dicebear.com/7.x/bottts/svg?seed=ninja",
                                    "https://api.dicebear.com/7.x/bottts/svg?seed=hacker"
                                ].map((url, idx) => (
                                    <img
                                        key={idx}
                                        src={url}
                                        alt={`preset-${idx}`}
                                        className={`avatar-option-item ${profile.profilePic === url ? "active-avatar" : ""}`}
                                        onClick={() => setProfile({ ...profile, profilePic: url })}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Profile Photo URL</label>
                            <input
                                type="text"
                                value={profile.profilePic}
                                placeholder="Paste image link"
                                onChange={(e) => setProfile({ ...profile, profilePic: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label>Bio</label>
                            <textarea
                                value={profile.bio}
                                rows={3}
                                placeholder="Write something about yourself"
                                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                            />
                        </div>

                        <button type="submit" className="save-profile-btn" disabled={loading}>
                            {loading ? "Saving..." : "Update Profile"}
                        </button>

                        {message && (
                            <div className={`status-message ${messageType}`}>
                                {message}
                            </div>
                        )}
                    </form>
                </div>

                {/* Reset Password Card */}
                <div className="profile-card reset-password-card">
                    <div className="reset-password-header">
                        <h2>Reset Password</h2>
                        <p>Update your security password</p>
                    </div>

                    <form className="profile-form" onSubmit={handlePasswordReset}>
                        <div className="form-group">
                            <label>Current Password</label>
                            <input
                                type="password"
                                value={passwordData.currentPassword}
                                placeholder="Enter current password"
                                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>New Password</label>
                                <input
                                    type="password"
                                    value={passwordData.newPassword}
                                    placeholder="Enter new password"
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Confirm New Password</label>
                                <input
                                    type="password"
                                    value={passwordData.confirmPassword}
                                    placeholder="Confirm new password"
                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className="save-profile-btn reset-pass-btn" disabled={passLoading}>
                            {passLoading ? "Resetting..." : "Reset Password"}
                        </button>

                        {passMessage && (
                            <div className={`status-message ${passMessageType}`}>
                                {passMessage}
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </>
    );
};

export default Profile;
