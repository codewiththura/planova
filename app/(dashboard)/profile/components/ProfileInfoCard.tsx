"use client";

import { Heading, Text } from "@radix-ui/themes";
import { BriefcaseIcon, LogOut, Pencil, Check, X, Settings } from "lucide-react";
import { RefObject } from "react";
import Link from "next/link";

interface ProfileInfoCardProps {
    displayName: string;
    displayEmail: string;
    photoURL: string | null;
    userRole: string;
    userBio: string;
    joinedDate: string;
    isEditing: boolean;
    editName: string;
    editRole: string;
    editBio: string;
    editSaving: boolean;
    nameInputRef: RefObject<HTMLInputElement | null>;
    getInitials: (name: string) => string;
    handleLogout: () => void;
    openEdit: () => void;
    setIsEditing: (val: boolean) => void;
    setEditName: (val: string) => void;
    setEditRole: (val: string) => void;
    setEditBio: (val: string) => void;
    saveProfile: () => void;
}

export function ProfileInfoCard({
    displayName,
    displayEmail,
    photoURL,
    userRole,
    userBio,
    joinedDate,
    isEditing,
    editName,
    editRole,
    editBio,
    editSaving,
    nameInputRef,
    getInitials,
    handleLogout,
    openEdit,
    setIsEditing,
    setEditName,
    setEditRole,
    setEditBio,
    saveProfile,
}: ProfileInfoCardProps) {
    return (
        <div className="w-full md:w-[38%] sm:px-6 flex flex-col overflow-hidden mt-2">
            <div className="flex items-start justify-between mb-1">
                <div>
                    <Heading size="4" weight="bold">Profile Information</Heading>
                    <Text as="p" size="2" color="gray" className="mt-0.5">Your personal information and bio</Text>
                </div>
                <Link
                    href="/settings"
                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors py-1 px-2 rounded-lg hover:bg-muted"
                    title="Settings"
                >
                    <Settings className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Settings</span>
                </Link>
            </div>

            <div className="mt-6 flex items-start gap-5 overflow-hidden">
                {/* Avatar */}
                <div className="h-20 w-20 rounded-full shrink-0 overflow-hidden bg-accent flex items-center justify-center border-2 border-border">
                    {photoURL ? (
                        <img src={photoURL} alt={displayName} className="h-full w-full object-cover" />
                    ) : (
                        <span className="text-2xl font-bold text-primary">{getInitials(displayName)}</span>
                    )}
                </div>
                {/* Identity & Details */}
                <div className="min-w-0 flex-1 overflow-hidden">
                    <div className="flex items-center gap-2 overflow-hidden">
                        {isEditing ? (
                            <input
                                ref={nameInputRef}
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="text-xl font-bold bg-transparent border-b border-primary focus:outline-none w-0 flex-1 text-foreground pb-0.5"
                                placeholder="Your name"
                            />
                        ) : (
                            <Heading size="5" weight="bold" className="truncate flex-1">{displayName}</Heading>
                        )}
                        <div className="flex items-center gap-1 shrink-0">
                            {isEditing ? (
                                <>
                                    <button
                                        onClick={saveProfile}
                                        disabled={editSaving}
                                        className="p-2 rounded-md hover:bg-primary/10 text-primary transition-colors disabled:opacity-50"
                                        title="Save Changes"
                                    >
                                        {editSaving ? (
                                            <span className="h-4 w-4 block rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
                                        ) : (
                                            <Check className="h-4 w-4" />
                                        )}
                                    </button>
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="p-2 rounded-md hover:bg-muted text-muted-foreground transition-colors"
                                        title="Discard Changes"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={openEdit}
                                    className="p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                                    title="Edit Profile"
                                >
                                    <Pencil className="h-3 w-3" />
                                </button>
                            )}
                        </div>
                    </div>
                    <Text as="p" size="2" color="gray" className="truncate mt-0.5">{displayEmail}</Text>

                    {/* Role */}
                    <div className="flex items-center gap-2 mt-2">
                        <BriefcaseIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                        {isEditing ? (
                            <input
                                value={editRole}
                                onChange={(e) => setEditRole(e.target.value)}
                                className="text-sm text-foreground bg-transparent border-b border-border focus:border-primary focus:outline-none flex-1 pb-0.5"
                                placeholder="Your role or title"
                            />
                        ) : (
                            <Text as="p" size="2">{userRole}</Text>
                        )}
                    </div>

                    {/* Bio */}
                    <div className="mt-2">
                        {isEditing ? (
                            <textarea
                                value={editBio}
                                onChange={(e) => setEditBio(e.target.value)}
                                rows={3}
                                className="text-sm text-foreground leading-relaxed bg-muted/40 rounded-lg p-3 w-full focus:outline-none focus:ring-1 focus:ring-primary resize-none border border-border"
                                placeholder="Write a short bio about yourself..."
                            />
                        ) : (
                            <Text as="p" size="2" color="gray" className="leading-relaxed">{userBio}</Text>
                        )}
                    </div>

                    {/* Joined Date */}
                    <Text as="p" size="1" color="gray" className="mt-4">Joined {joinedDate}</Text>
                </div>
            </div>

            {/* Logout button */}
            <div className="mt-6">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 border border-destructive/20 text-destructive hover:bg-destructive/10 rounded-lg py-2 text-xs font-medium transition-colors"
                >
                    <LogOut className="h-3 w-3" />
                    Logout
                </button>
            </div>
        </div>
    );
}