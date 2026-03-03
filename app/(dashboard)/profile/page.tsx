"use client";

import { useState, useEffect, useRef } from "react";
import { onAuthStateChanged, User, signOut, updateProfile } from "firebase/auth";
import { auth, db } from "@/app/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useTheme } from "next-themes";
import {
    Trophy,
    Star,
    Zap,
    Target,
    CheckCircle2,
    FlameIcon,
    CalendarCheck2,
    Award
} from "lucide-react";

// Components
import { ProfileInfoCard } from "./components/ProfileInfoCard";
import { AchievementsGrid } from "./components/AchievementsGrid";

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

    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState("");
    const [editBio, setEditBio] = useState("");
    const [editRole, setEditRole] = useState("");
    const [editSaving, setEditSaving] = useState(false);
    const nameInputRef = useRef<HTMLInputElement>(null);

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
        const extra = user ? getUserExtra(user.uid) : { bio: "", role: "" };
        setEditBio(extra.bio || "");
        setEditRole(extra.role || "");
        setIsEditing(true);
        setTimeout(() => nameInputRef.current?.focus(), 50);
    };

    const saveProfile = async () => {
        if (!user) return;
        setEditSaving(true);
        try {
            if (editName.trim() && editName.trim() !== user.displayName) {
                const currentUser = auth.currentUser;
                if (currentUser) {
                    await updateProfile(currentUser, { displayName: editName.trim() });
                    setUser(Object.assign(Object.create(Object.getPrototypeOf(currentUser)), currentUser));
                }
            }
            setUserExtra(user.uid, { bio: editBio, role: editRole });
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

    const currentTheme = mounted ? theme ?? "system" : "system";

    return (
        <div className="container mx-auto px-4 sm:px-6 max-w-[1600px] pb-10">
            {/* Top Section: Profile + Achievements */}
            <div className="flex flex-col md:flex-row items-start gap-6 sm:gap-5">
                <ProfileInfoCard
                    displayName={displayName}
                    displayEmail={displayEmail}
                    photoURL={photoURL}
                    userRole={userRole}
                    userBio={userBio}
                    joinedDate={joinedDate}
                    isEditing={isEditing}
                    editName={editName}
                    editRole={editRole}
                    editBio={editBio}
                    editSaving={editSaving}
                    nameInputRef={nameInputRef}
                    getInitials={getInitials}
                    handleLogout={handleLogout}
                    openEdit={openEdit}
                    setIsEditing={setIsEditing}
                    setEditName={setEditName}
                    setEditRole={setEditRole}
                    setEditBio={setEditBio}
                    saveProfile={saveProfile}
                />

                <AchievementsGrid achievements={achievements} />
            </div>
        </div>
    );
}

