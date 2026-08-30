import { useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./Settings.css";

const Settings = () => {
    const [isOpen, setIsOpen] = useState(true);

    // Read initial user settings from localStorage or defaults
    const [settings, setSettings] = useState({
        theme: localStorage.getItem("appTheme") || "light",
        defaultLanguage: localStorage.getItem("defaultLanguage") || "javascript",
        autoSave: localStorage.getItem("autoSave") === "true",
        profileVisibility: localStorage.getItem("profileVisibility") || "public"
    });

    const [savedMessage, setSavedMessage] = useState("");

    const handleSaveSettings = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        // Save preferences to localStorage
        localStorage.setItem("appTheme", settings.theme);
        localStorage.setItem("defaultLanguage", settings.defaultLanguage);
        localStorage.setItem("autoSave", settings.autoSave ? "true" : "false");
        localStorage.setItem("profileVisibility", settings.profileVisibility);

        setSavedMessage("Settings saved successfully!");

        setTimeout(() => {
            setSavedMessage("");
        }, 3000);
    };

    return (
        <>
            {!isOpen && (
                <button id="expand-sidebar" onClick={() => setIsOpen(true)}>
                    =
                </button>
            )}

            <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

            <div className={`settings-container ${isOpen ? "sidebar-expanded" : "sidebar-collapsed"}`}>
                <div className="settings-header">
                    <h1>Settings</h1>
                    <p>Customize your experience and workspace preferences</p>
                </div>

                <div className="settings-card">
                    <form onSubmit={handleSaveSettings} className="settings-form">
                        
                        {/* Theme Preference */}
                        <div className="setting-item">
                            <div className="setting-text">
                                <h3>Appearance Theme</h3>
                                <p>Select your preferred visual style for the platform.</p>
                            </div>
                            <select
                                value={settings.theme}
                                onChange={(e) => setSettings({ ...settings, theme: e.target.value })}
                                className="setting-select"
                            >
                                <option value="light">Light Mode</option>
                                <option value="dark">Dark Mode (Beta)</option>
                            </select>
                        </div>

                        {/* Default Snippet Language */}
                        <div className="setting-item">
                            <div className="setting-text">
                                <h3>Default Code Language</h3>
                                <p>Pre-select language when creating new code snippets.</p>
                            </div>
                            <select
                                value={settings.defaultLanguage}
                                onChange={(e) => setSettings({ ...settings, defaultLanguage: e.target.value })}
                                className="setting-select"
                            >
                                <option value="javascript">JavaScript</option>
                                <option value="typescript">TypeScript</option>
                                <option value="python">Python</option>
                                <option value="cpp">C++</option>
                                <option value="java">Java</option>
                                <option value="html">HTML/CSS</option>
                            </select>
                        </div>

                        {/* Auto Save Toggle */}
                        <div className="setting-item">
                            <div className="setting-text">
                                <h3>Auto-Save Drafts</h3>
                                <p>Automatically save snippet drafts while typing.</p>
                            </div>
                            <label className="toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={settings.autoSave}
                                    onChange={(e) => setSettings({ ...settings, autoSave: e.target.checked })}
                                />
                                <span className="slider"></span>
                            </label>
                        </div>

                        {/* Profile Visibility */}
                        <div className="setting-item">
                            <div className="setting-text">
                                <h3>Profile Visibility</h3>
                                <p>Choose who can view your shared profile and snippets.</p>
                            </div>
                            <select
                                value={settings.profileVisibility}
                                onChange={(e) => setSettings({ ...settings, profileVisibility: e.target.value })}
                                className="setting-select"
                            >
                                <option value="public">Public</option>
                                <option value="private">Private</option>
                            </select>
                        </div>

                        <button type="submit" className="save-settings-btn">
                            Save Settings
                        </button>

                        {savedMessage && (
                            <div className="settings-success">
                                {savedMessage}
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </>
    );
};

export default Settings;
