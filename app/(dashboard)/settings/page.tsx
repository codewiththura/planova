"use client";

import { useState, useEffect } from "react";
import { onAuthStateChanged, User, signOut } from "firebase/auth";
import { auth, db } from "@/app/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { Heading } from "@radix-ui/themes";
import { ArrowLeft } from "lucide-react";

import { PreferencesSection } from "./components/PreferencesSection";
import { DataManagementSection } from "./components/DataManagementSection";
import { DangerZoneSection } from "./components/DangerZoneSection";
import { ConfirmClearDialog, ConfirmDeleteAccountDialog } from "./components/ProfileDialogs";

export default function SettingsPage() {
    const router = useRouter();
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    const [notifEnabled, setNotifEnabled] = useState(true);
    const [language, setLanguage] = useState("en");

    const [showClearConfirm, setShowClearConfirm] = useState(false);
    const [clearLoading, setClearLoading] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        setMounted(true);
        const unsub = onAuthStateChanged(auth, async (u) => {
            setUser(u);
        });
        return () => unsub();
    }, []);

    const handleExport = async () => {
        if (!user) return;
        try {
            const [plansSnap, actionsSnap] = await Promise.all([
                getDocs(query(collection(db, "plans"), where("userId", "==", user.uid))),
                getDocs(query(collection(db, "actions"), where("userId", "==", user.uid))),
            ]);
            const plans = plansSnap.docs.map((d) => d.data());
            const actions = actionsSnap.docs.map((d) => d.data());

            const stats = {
                totalPlans: plans.length,
                completedPlans: plans.filter((p) => p.status === "completed").length,
                totalActions: actions.length,
                completedActions: actions.filter((a) => a.status === "done").length,
            };

            const data = {
                exportedAt: new Date().toISOString(),
                user: { name: user.displayName, email: user.email },
                stats,
            };
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "planova-data.json";
            a.click();
            URL.revokeObjectURL(url);
        } catch (e) {
            console.error("Failed to export data", e);
        }
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
            // clear complete
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
            const { deleteDoc, doc } = await import("firebase/firestore");
            const [plansSnap, actionsSnap] = await Promise.all([
                getDocs(query(collection(db, "plans"), where("userId", "==", user.uid))),
                getDocs(query(collection(db, "actions"), where("userId", "==", user.uid))),
            ]);
            await Promise.all([
                ...plansSnap.docs.map((d) => deleteDoc(doc(db, "plans", d.id))),
                ...actionsSnap.docs.map((d) => deleteDoc(doc(db, "actions", d.id))),
            ]);

            localStorage.removeItem(`planova_profile_${user.uid}`);

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
        <div className="container mx-auto px-4 sm:px-6 max-w-3xl pb-10">
            <div className="flex items-center gap-3 mb-2">
                <button
                    onClick={() => router.back()}
                    className="p-1.5 -ml-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    title="Go back"
                >
                    <ArrowLeft className="h-5 w-5" />
                </button>
                <Heading size="6" weight="bold">Settings</Heading>
            </div>

            <PreferencesSection
                notifEnabled={notifEnabled}
                setNotifEnabled={setNotifEnabled}
                currentTheme={currentTheme}
                setTheme={setTheme}
                language={language}
                setLanguage={setLanguage}
                mounted={mounted}
            />

            <DataManagementSection handleExport={handleExport} />

            <DangerZoneSection
                setShowClearConfirm={setShowClearConfirm}
                setShowDeleteConfirm={setShowDeleteConfirm}
                clearLoading={clearLoading}
                deleteLoading={deleteLoading}
            />

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

