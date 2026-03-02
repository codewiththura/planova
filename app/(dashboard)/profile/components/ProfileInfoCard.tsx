"use client";

import { Heading, Text } from "@radix-ui/themes";
import { BriefcaseIcon, LogOut, Pencil, Check, X } from "lucide-react";
import { RefObject } from "react";

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
        <div className="w-full md:w-[38%] p-2 sm:px-6 flex flex-col">
            <div className="flex items-start justify-between mb-1">
                <div>
                    <Heading size="4" weight="bold">Profile Information</Heading>
                    <Text as="p" size="2" color="gray" className="mt-0.5">Your personal information and bio</Text>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors py-1 px-2 rounded-lg hover:bg-destructive/10"
                    title="Sign out"
                >
                    <LogOut className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Logout</span>
                </button>
            </div>

            <div className="mt-6 flex items-start gap-5">
                {/* Avatar */}
                <div className="h-20 w-20 rounded-full shrink-0 overflow-hidden bg-accent flex items-center justify-center border-2 border-border">
                    {photoURL ? (
                        <img src={photoURL} alt={displayName} className="h-full w-full object-cover" />
                    ) : (
                        <span className="text-2xl font-bold text-primary">{getInitials(displayName)}</span>
                    )}
                </div>
                {/* Identity & Details */}
                <div className="min-w-0 flex-1">
                    {isEditing ? (
                        <input
                            ref={nameInputRef}
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="text-xl font-bold bg-transparent border-b border-primary focus:outline-none w-full text-foreground pb-0.5"
                            placeholder="Your name"
                        />
                    ) : (
                        <Heading size="5" weight="bold" className="truncate">{displayName}</Heading>
                    )}
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

            {/* Action buttons */}
            <div className="mt-6 flex gap-2">
                {isEditing ? (
                    <>
                        <button
                            onClick={saveProfile}
                            disabled={editSaving}
                            className="flex-1 flex items-center justify-center gap-2 bg-primary hover:opacity-90 text-primary-foreground rounded-lg py-2 text-xs font-medium transition-opacity disabled:opacity-60"
                        >
                            {editSaving ? (
                                <span className="h-4 w-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                            ) : (
                                <Check className="h-3 w-3" />
                            )}
                            Save Changes
                        </button>
                        <button
                            onClick={() => setIsEditing(false)}
                            className="py-2 px-4 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-muted/50 transition-colors flex items-center gap-1.5"
                        >
                            <X className="h-3 w-3" />
                            Cancel
                        </button>
                    </>
                ) : (
                    <button
                        onClick={openEdit}
                        className="w-full flex items-center justify-center gap-2 bg-primary hover:opacity-90 text-primary-foreground rounded-lg py-2 text-xs font-medium transition-opacity"
                    >
                        <Pencil className="h-3 w-3" />
                        Edit Profile
                    </button>
                )}
            </div>
        </div>
    );
}
