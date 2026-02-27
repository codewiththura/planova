"use client";

import { useState, useEffect, useRef } from "react";
import { onAuthStateChanged, User, signOut, updateProfile } from "firebase/auth";
import { auth, db } from "@/app/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { cn } from "@/app/lib/utils";
import { Heading, Text } from "@radix-ui/themes";
import { useTheme } from "next-themes";
import {
    Trophy,
    Star,
    Zap,
    Target,
    CheckCircle2,
    FlameIcon,
    CalendarCheck2,
    Award,
    Download,
    Upload,
    Trash2,
    ChevronDown,
    BriefcaseIcon,
    LogOut,
    Bell,
    Globe,
    Pencil,
    X,
    Check,
    AlertTriangle,
} from "lucide-react";

interface AchievementDef {
    id: string;
    icon: React.ReactNode;
    label: string;
    description: string;
    color: string;
    check: (stats: UserStats) => boolean;
    progress?: (stats: UserStats) => { current: number; max: number };
}

interface UserStats {
    totalPlans: number;
    completedPlans: number;
    totalActions: number;
    completedActions: number;
}

const ACHIEVEMENT_DEFS: AchievementDef[] = [
    {
        id: "first_plan",
        icon: <Star className="h-5 w-5" />,
        label: "First Steps",
        description: "Created your first plan",
        color: "from-amber-400 to-yellow-500",
        check: (s) => s.totalPlans >= 1,
    },
    {
        id: "plan_master",
        icon: <Trophy className="h-5 w-5" />,
        label: "Plan Master",
        description: "Complete 5 plans",
        color: "from-violet-500 to-purple-600",
        check: (s) => s.completedPlans >= 5,
        progress: (s) => ({ current: Math.min(s.completedPlans, 5), max: 5 }),
    },
    {
        id: "action_hero",
        icon: <Zap className="h-5 w-5" />,
        label: "Action Hero",
        description: "Complete 50 actions",
        color: "from-blue-400 to-cyan-500",
        check: (s) => s.completedActions >= 50,
        progress: (s) => ({ current: Math.min(s.completedActions, 50), max: 50 }),
    },
    {
        id: "goal_getter",
        icon: <Target className="h-5 w-5" />,
        label: "Goal Getter",
        description: "Complete your first plan",
        color: "from-emerald-400 to-green-500",
        check: (s) => s.completedPlans >= 1,
    },
    {
        id: "streak",
        icon: <FlameIcon className="h-5 w-5" />,
        label: "On Fire",
        description: "Create 10 plans total",
        color: "from-orange-400 to-red-500",
        check: (s) => s.totalPlans >= 10,
        progress: (s) => ({ current: Math.min(s.totalPlans, 10), max: 10 }),
    },
    {
        id: "checklist",
        icon: <CheckCircle2 className="h-5 w-5" />,
        label: "Checklist Champ",
        description: "Complete 20 actions",
        color: "from-pink-400 to-rose-500",
        check: (s) => s.completedActions >= 20,
        progress: (s) => ({ current: Math.min(s.completedActions, 20), max: 20 }),
    },
    {
        id: "planner",
        icon: <CalendarCheck2 className="h-5 w-5" />,
        label: "Super Planner",
        description: "Create 3 plans",
        color: "from-teal-400 to-cyan-500",
        check: (s) => s.totalPlans >= 3,
        progress: (s) => ({ current: Math.min(s.totalPlans, 3), max: 3 }),
    },
    {
        id: "legend",
        icon: <Award className="h-5 w-5" />,
        label: "Legend",
        description: "Complete 10 plans",
        color: "from-indigo-400 to-violet-500",
        check: (s) => s.completedPlans >= 10,
        progress: (s) => ({ current: Math.min(s.completedPlans, 10), max: 10 }),
    },
];

function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
    return (
        <button
            onClick={onToggle}
            className={cn(
                "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                enabled ? "bg-primary" : "bg-muted-foreground/30"
            )}
            role="switch"
            aria-checked={enabled}
        >
            <span
                className={cn(
                    "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out",
                    enabled ? "translate-x-5" : "translate-x-0"
                )}
            />
        </button>
    );
}

function ConfirmClearDialog({
    open,
    onConfirm,
    onCancel,
}: {
    open: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
            <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-sm shadow-2xl">
                <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                    </div>
                    <div>
                        <Text as="p" size="2" weight="bold">Clear All Data?</Text>
                        <Text as="p" size="1" color="gray" className="mt-0.5">This action cannot be undone.</Text>
                    </div>
                </div>
                <Text as="p" size="2" color="gray" className="mb-5 leading-relaxed">
                    All your plans and actions will be permanently deleted. Your account will remain active.
                </Text>
                <div className="flex gap-2">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-2 px-4 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted/50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 py-2 px-4 rounded-lg bg-destructive hover:opacity-90 text-destructive-foreground text-sm font-medium transition-colors"
                    >
                        Clear Data
                    </button>
                </div>
            </div>
        </div>
    );
}

function ConfirmDeleteAccountDialog({
    open,
    onConfirm,
    onCancel,
}: {
    open: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
            <div className="bg-card border border-destructive/30 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
                <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                    </div>
                    <div>
                        <Text as="p" size="2" weight="bold" className="text-destructive">Delete Account Permanently?</Text>
                        <Text as="p" size="1" color="gray" className="mt-0.5">This action is irreversible.</Text>
                    </div>
                </div>
                <Text as="p" size="2" color="gray" className="mb-5 leading-relaxed">
                    This will permanently delete your account and all associated data, including plans, actions, and settings.
                </Text>
                <div className="flex gap-2">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-2 px-4 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted/50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 py-2 px-4 rounded-lg bg-destructive hover:opacity-90 text-destructive-foreground text-sm font-medium transition-colors"
                    >
                        Delete Account
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function ProfilePage() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [stats, setStats] = useState<UserStats>({
        totalPlans: 0,
        completedPlans: 0,
        totalActions: 0,
        completedActions: 0,
    });

    const [notifEnabled, setNotifEnabled] = useState(true);
    const [language, setLanguage] = useState("en");

    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState("");
    const [editBio, setEditBio] = useState("");
    const [editRole, setEditRole] = useState("");
    const [editSaving, setEditSaving] = useState(false);
    const nameInputRef = useRef<HTMLInputElement>(null);

    const [showClearConfirm, setShowClearConfirm] = useState(false);
    const [clearLoading, setClearLoading] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const getUserExtra = (uid: string) => {
        if (typeof window === "undefined") return { bio: "", role: "" };
        try {
            const raw = localStorage.getItem(`planova_profile_${uid}`);
            return raw ? JSON.parse(raw) : { bio: "", role: "" };
        } catch {
            return { bio: "", role: "" };
        }
    };

    const setUserExtra = (uid: string, data: { bio: string; role: string }) => {
        if (typeof window === "undefined") return;
        localStorage.setItem(`planova_profile_${uid}`, JSON.stringify(data));
    };

    useEffect(() => {
        setMounted(true);
        const unsub = onAuthStateChanged(auth, async (u) => {
            setUser(u);
            if (u) {
                const extra = getUserExtra(u.uid);
                setEditBio(extra.bio || "");
                setEditRole(extra.role || "");

                try {
                    const [plansSnap, actionsSnap] = await Promise.all([
                        getDocs(query(collection(db, "plans"), where("userId", "==", u.uid))),
                        getDocs(query(collection(db, "actions"), where("userId", "==", u.uid))),
                    ]);
                    const plans = plansSnap.docs.map((d) => d.data());
                    const actions = actionsSnap.docs.map((d) => d.data());
                    setStats({
                        totalPlans: plans.length,
                        completedPlans: plans.filter((p) => p.status === "completed").length,
                        totalActions: actions.length,
                        completedActions: actions.filter((a) => a.status === "done").length,
                    });
                } catch (e) {
                    console.error("Failed to load stats:", e);
                }
            }
        });
        return () => unsub();
    }, []);

    const displayName = user?.displayName || "Your Name";
    const displayEmail = user?.email || "";
    const photoURL = user?.photoURL || null;

    const getInitials = (name: string) =>
        name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .substring(0, 2)
            .toUpperCase();

    const joinedDate = user?.metadata?.creationTime
        ? new Date(user.metadata.creationTime).toLocaleDateString("en-US", { month: "long", year: "numeric" })
        : "Recently";

    const extra = user ? getUserExtra(user.uid) : { bio: "", role: "" };
    const userBio = extra.bio || "Tap Edit Profile to add a bio.";
    const userRole = extra.role || "Add your role";

    const achievements = ACHIEVEMENT_DEFS.map((def) => ({
        ...def,
        unlocked: def.check(stats),
        prog: def.progress ? def.progress(stats) : null,
    }));

    const openEdit = () => {
        setEditName(user?.displayName || "");
        setIsEditing(true);
        setTimeout(() => nameInputRef.current?.focus(), 50);
    };

    const saveProfile = async () => {
        if (!user) return;
        setEditSaving(true);
        try {
            if (editName.trim() && editName.trim() !== user.displayName) {
                await updateProfile(user, { displayName: editName.trim() });
                setUser({ ...user, displayName: editName.trim() } as User);
            }
            setUserExtra(user.uid, { bio: editBio, role: editRole });
            setEditBio(editBio);
            setEditRole(editRole);
        } catch (e) {
            console.error("Failed to save profile:", e);
        } finally {
            setEditSaving(false);
            setIsEditing(false);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            window.location.href = "/login";
        } catch (e) {
            console.error("Failed to sign out:", e);
        }
    };

    const handleExport = () => {
        const data = {
            exportedAt: new Date().toISOString(),
            user: { name: displayName, email: displayEmail },
            stats,
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "planova-data.json";
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleClearData = async () => {
        if (!user) return;
        setClearLoading(true);
        try {
            const { deleteDoc, doc } = await import("firebase/firestore");
            const [plansSnap, actionsSnap] = await Promise.all([
                getDocs(query(collection(db, "plans"), where("userId", "==", user.uid))),
                getDocs(query(collection(db, "actions"), where("userId", "==", user.uid))),
            ]);
            await Promise.all([
                ...plansSnap.docs.map((d) => deleteDoc(doc(db, "plans", d.id))),
                ...actionsSnap.docs.map((d) => deleteDoc(doc(db, "actions", d.id))),
            ]);
            setStats({ totalPlans: 0, completedPlans: 0, totalActions: 0, completedActions: 0 });
        } catch (e) {
            console.error("Failed to clear data:", e);
        } finally {
            setClearLoading(false);
            setShowClearConfirm(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!user) return;
        setDeleteLoading(true);
        try {
            // 1. Clear data first
            const { deleteDoc, doc } = await import("firebase/firestore");
            const [plansSnap, actionsSnap] = await Promise.all([
                getDocs(query(collection(db, "plans"), where("userId", "==", user.uid))),
                getDocs(query(collection(db, "actions"), where("userId", "==", user.uid))),
            ]);
            await Promise.all([
                ...plansSnap.docs.map((d) => deleteDoc(doc(db, "plans", d.id))),
                ...actionsSnap.docs.map((d) => deleteDoc(doc(db, "actions", d.id))),
            ]);

            // 2. Remove profile from localStorage
            localStorage.removeItem(`planova_profile_${user.uid}`);

            // 3. Delete auth account
            const { deleteUser } = await import("firebase/auth");
            await deleteUser(user);
            window.location.href = "/login";
        } catch (e: any) {
            console.error("Failed to delete account:", e);
            if (e.code === "auth/requires-recent-login") {
                alert("Please log in again before deleting your account for security reasons.");
                await signOut(auth);
                window.location.href = "/login";
            } else {
                alert("Failed to delete account. Please try again later.");
            }
        } finally {
            setDeleteLoading(false);
            setShowDeleteConfirm(false);
        }
    };

    const currentTheme = mounted ? theme ?? "system" : "system";

    return (
        <div className="container mx-auto px-4 sm:px-6 max-w-[1600px] pb-10">

            {/* Top Section: Profile + Achievements */}
            <div className="flex flex-col md:flex-row items-start gap-6 sm:gap-5">

                {/* A. Profile Information Card */}
                <div className="w-full md:w-[38%] p-2 sm:p-6 flex flex-col">
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
                            <div className="flex items-center gap-2 mt-4">
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
                            <div className="mt-4">
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

                {/* B. Achievements Grid */}
                <div className="flex-1 p-2 sm:p-6 w-full md:w-[62%]">
                    <Heading size="4" weight="bold">Your Achievements</Heading>
                    <Text as="p" size="2" color="gray">Track your progress and unlock new achievements</Text>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
                        {achievements.map((ach) => (
                            <div
                                key={ach.id}
                                className={cn(
                                    "border border-border p-4 rounded-xl flex items-center gap-4 transition-all",
                                    ach.unlocked
                                        ? "bg-accent/30"
                                        : "bg-card opacity-70"
                                )}
                            >
                                {/* Icon */}
                                <div
                                    className={cn(
                                        "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 text-white",
                                        ach.unlocked
                                            ? `bg-gradient-to-br ${ach.color}`
                                            : "bg-muted"
                                    )}
                                >
                                    {ach.unlocked ? (
                                        ach.icon
                                    ) : (
                                        <div className="grayscale opacity-60">{ach.icon}</div>
                                    )}
                                </div>

                                {/* Text */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2 mb-0.5">
                                        <Text
                                            as="p"
                                            size="2"
                                            weight="medium"
                                            className={cn("truncate", !ach.unlocked && "text-muted-foreground")}
                                        >
                                            {ach.label}
                                        </Text>
                                        {ach.unlocked && (
                                            <span className="shrink-0 bg-accent text-accent-foreground text-xs px-2 py-0.5 rounded font-medium">
                                                Unlocked
                                            </span>
                                        )}
                                    </div>
                                    <Text as="p" size="1" color="gray" className="truncate">{ach.description}</Text>
                                    {!ach.unlocked && ach.prog && (
                                        <div className="mt-2">
                                            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full bg-gradient-to-r ${ach.color} transition-all duration-500`}
                                                    style={{ width: `${(ach.prog.current / ach.prog.max) * 100}%` }}
                                                />
                                            </div>
                                            <Text as="p" size="1" color="gray" className="mt-1">{ach.prog.current} / {ach.prog.max}</Text>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Middle Section: App Preferences */}
            <div className="mt-5 bg-card rounded-2xl border border-border p-6">
                <Heading size="4" weight="bold">Preferences</Heading>
                <Text as="p" size="2" color="gray" className="mt-0.5 mb-2">Customize your app experience</Text>

                {/* Notifications */}
                <div className="flex justify-between items-center py-4 border-b border-border/60">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0">
                            <Bell className="h-4 w-4" />
                        </div>
                        <div>
                            <Text as="p" size="2" weight="medium">Notifications</Text>
                            <Text as="p" size="1" color="gray" className="mt-0.5">Enable push notifications</Text>
                        </div>
                    </div>
                    <Toggle enabled={notifEnabled} onToggle={() => setNotifEnabled((v) => !v)} />
                </div>

                {/* Theme */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 border-b border-border/60 gap-3">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0">
                            <svg className="h-4 w-4" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="5" />
                                <line x1="12" y1="1" x2="12" y2="3" />
                                <line x1="12" y1="21" x2="12" y2="23" />
                                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                                <line x1="1" y1="12" x2="3" y2="12" />
                                <line x1="21" y1="12" x2="23" y2="12" />
                                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                            </svg>
                        </div>
                        <div>
                            <Text as="p" size="2" weight="medium">Appearance</Text>
                            <Text as="p" size="1" color="gray" className="mt-0.5">Choose your preferred theme</Text>
                        </div>
                    </div>
                    {mounted && (
                        <div className="flex gap-2 ml-11 sm:ml-0">
                            {(["light", "dark", "system"] as const).map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setTheme(t)}
                                    className={cn(
                                        "px-4 py-2 rounded-md border text-xs font-medium capitalize transition-all",
                                        currentTheme === t
                                            ? "bg-primary text-primary-foreground border-transparent"
                                            : "border-border text-foreground hover:bg-muted/50 bg-transparent"
                                    )}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Language */}
                <div className="flex justify-between items-center py-4">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0">
                            <Globe className="h-4 w-4" />
                        </div>
                        <div>
                            <Text as="p" size="2" weight="medium">Language</Text>
                            <Text as="p" size="1" color="gray" className="mt-0.5">Select your display language</Text>
                        </div>
                    </div>
                    <div className="relative">
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="appearance-none bg-muted/50 border border-border text-sm text-foreground rounded-lg py-2 pl-3 pr-8 focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                        >
                            <option value="en">English</option>
                            <option value="es">Español</option>
                            <option value="fr">Français</option>
                            <option value="de">Deutsch</option>
                            <option value="ja">日本語</option>
                            <option value="zh">中文</option>
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Bottom Section: Data Management */}
            <div className="mt-5 bg-card rounded-2xl border border-border p-6">
                <Heading size="4" weight="bold">Data Management</Heading>
                <Text as="p" size="2" color="gray" className="mt-0.5 mb-2">Manage and control your app data</Text>

                {/* Export */}
                <div className="flex justify-between items-center py-4 border-b border-border/60">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0">
                            <Download className="h-4 w-4" />
                        </div>
                        <div>
                            <Text as="p" size="2" weight="medium">Export Data</Text>
                            <Text as="p" size="1" color="gray" className="mt-0.5">Download all your data as JSON</Text>
                        </div>
                    </div>
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 py-2 px-4 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted/50 transition-colors bg-transparent"
                    >
                        <Download className="h-4 w-4" />
                        <span className="hidden sm:inline">Export</span>
                    </button>
                </div>

                {/* Import */}
                <div className="flex justify-between items-center py-4">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0">
                            <Upload className="h-4 w-4" />
                        </div>
                        <div>
                            <Text as="p" size="2" weight="medium">Import Data</Text>
                            <Text as="p" size="1" color="gray" className="mt-0.5">Restore data from a backup file</Text>
                        </div>
                    </div>
                    <button
                        onClick={() => alert("Import feature coming soon!")}
                        className="flex items-center gap-2 py-2 px-4 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted/50 transition-colors bg-transparent"
                    >
                        <Upload className="h-4 w-4" />
                        <span className="hidden sm:inline">Import</span>
                    </button>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="mt-5 bg-card rounded-2xl border border-destructive/20 p-6">
                <Heading size="4" weight="bold" className="text-destructive">Danger Zone</Heading>
                <Text as="p" size="2" color="gray" className="mt-0.5 mb-2">High-risk actions that cannot be reversed</Text>

                {/* Clear All Data */}
                <div className="flex justify-between items-center py-4 border-b border-border/60">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-destructive/5 flex items-center justify-center shrink-0">
                            <Trash2 className="h-4 w-4 text-destructive" />
                        </div>
                        <div>
                            <Text as="p" size="2" weight="medium">Clear All Data</Text>
                            <Text as="p" size="2" color="gray">Permanently delete all plans and actions</Text>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowClearConfirm(true)}
                        disabled={clearLoading}
                        className="flex items-center gap-2 py-2 px-4 rounded-lg bg-destructive/10 hover:bg-destructive/20 text-destructive text-xs font-medium transition-colors disabled:opacity-60"
                    >
                        {clearLoading ? (
                            <span className="h-3 w-3 rounded-full border-2 border-destructive/30 border-t-destructive animate-spin" />
                        ) : (
                            <Trash2 className="hidden sm:block h-3 w-3" />
                        )}
                        <span className="sm:inline text-xs sm:text-sm w-[60px] sm:w-auto">Clear Data</span>
                    </button>
                </div>

                {/* Delete Account */}
                <div className="flex justify-between items-center py-4">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-destructive/5 flex items-center justify-center shrink-0">
                            <AlertTriangle className="h-4 w-4 text-destructive" />
                        </div>
                        <div>
                            <Text as="p" size="2" weight="medium" className="text-destructive">Delete Account</Text>
                            <Text as="p" size="2" color="gray">Permanently delete your account and all data</Text>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        disabled={deleteLoading}
                        className="flex items-center gap-2 py-2 px-4 rounded-lg bg-destructive hover:opacity-90 text-destructive-foreground text-xs font-medium transition-colors disabled:opacity-60"
                    >
                        {deleteLoading ? (
                            <span className="h-3 w-3 rounded-full border-2 border-destructive-foreground/30 border-t-destructive-foreground animate-spin" />
                        ) : (
                            <AlertTriangle className="hidden sm:block h-3 w-3" />
                        )}
                        <span className="sm:inline text-xs sm:text-sm w-[60px] sm:w-auto">Delete Account</span>
                    </button>
                </div>
            </div>

            <ConfirmClearDialog
                open={showClearConfirm}
                onConfirm={handleClearData}
                onCancel={() => setShowClearConfirm(false)}
            />

            <ConfirmDeleteAccountDialog
                open={showDeleteConfirm}
                onConfirm={handleDeleteAccount}
                onCancel={() => setShowDeleteConfirm(false)}
            />
        </div>
    );
}
