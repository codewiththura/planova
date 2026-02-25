import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, doc, setDoc, deleteDoc, updateDoc, deleteField } from 'firebase/firestore';
import { db, auth } from '@/app/lib/firebase';
import { Plan, Action, PlanStatus, ActionStatus } from '@/app/types';

export function useAppData() {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [actions, setActions] = useState<Action[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Guard: auth is only initialized on the client (inside window check)
        if (!auth) {
            setLoading(false);
            return;
        }

        const unsubscribeAuth = auth.onAuthStateChanged((user) => {
            if (user) {
                let plansResolved = false;
                let actionsResolved = false;

                const maybeFinishLoading = () => {
                    if (plansResolved && actionsResolved) {
                        setLoading(false);
                    }
                };

                const plansQuery = query(collection(db, 'plans'), where('userId', '==', user.uid));
                const unsubscribePlans = onSnapshot(plansQuery, (snapshot) => {
                    setPlans(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Plan)));
                    plansResolved = true;
                    maybeFinishLoading();
                });

                const actionsQuery = query(collection(db, 'actions'), where('userId', '==', user.uid));
                const unsubscribeActions = onSnapshot(actionsQuery, (snapshot) => {
                    setActions(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Action)));
                    actionsResolved = true;
                    maybeFinishLoading();
                });

                return () => {
                    unsubscribePlans();
                    unsubscribeActions();
                };
            } else {
                setPlans([]);
                setActions([]);
                setLoading(false);
            }
        });

        return () => unsubscribeAuth();
    }, []);

    // Removes keys with undefined values — Firestore rejects them
    const stripUndefined = <T extends object>(obj: T): Partial<T> =>
        Object.fromEntries(
            Object.entries(obj).filter(([, v]) => v !== undefined)
        ) as Partial<T>;

    // Replaces undefined values with deleteField() for updateDoc calls
    const toUpdatePayload = <T extends object>(obj: T): Record<string, unknown> =>
        Object.fromEntries(
            Object.entries(obj).map(([k, v]) => [k, v === undefined ? deleteField() : v])
        );

    const handleCreatePlan = async (newPlan: Omit<Plan, 'id' | 'userId' | 'status' | 'createdAt'>) => {
        const user = auth.currentUser;
        if (!user) return;
        const newRef = doc(collection(db, 'plans'));
        const plan: Plan = {
            id: newRef.id,
            userId: user.uid,
            status: 'active',
            createdAt: new Date().toISOString(),
            ...newPlan,
        };
        await setDoc(newRef, plan);
    };

    const handleEditPlan = async (planId: string, updates: Partial<Plan>) => {
        await updateDoc(doc(db, 'plans', planId), updates);
    };

    const handleDeletePlan = async (planId: string) => {
        await deleteDoc(doc(db, 'plans', planId));
        const relatedActions = actions.filter(a => a.planId === planId);
        await Promise.all(relatedActions.map(a => deleteDoc(doc(db, 'actions', a.id))));
    };

    const handleCreateAction = async (planId: string, title: string, options?: Partial<Action>) => {
        const user = auth.currentUser;
        if (!user) return;
        const newRef = doc(collection(db, 'actions'));
        const action = stripUndefined({
            id: newRef.id,
            userId: user.uid,
            planId,
            title,
            status: 'pending' as const,
            createdAt: new Date().toISOString(),
            ...options,
        });
        await setDoc(newRef, action);
    };

    const handleEditAction = async (actionId: string, title: string, options?: Partial<Action>) => {
        await updateDoc(doc(db, 'actions', actionId), toUpdatePayload({ title, ...options }));
    };

    const handleUpdateActionStatus = async (actionId: string, status: ActionStatus) => {
        const updates: Record<string, unknown> = { status };
        if (status === 'done') {
            updates.completedAt = new Date().toISOString();
        } else {
            updates.completedAt = deleteField();
        }
        await updateDoc(doc(db, 'actions', actionId), updates);
    };

    const handleUpdatePlanStatus = async (planId: string, status: PlanStatus) => {
        const updates: Record<string, unknown> = { status };
        if (status === 'completed') {
            updates.completedAt = new Date().toISOString();
            updates.closedAt = deleteField();
        } else if (status === 'closed') {
            updates.closedAt = new Date().toISOString();
            updates.completedAt = deleteField();
        } else {
            updates.completedAt = deleteField();
            updates.closedAt = deleteField();
        }
        await updateDoc(doc(db, 'plans', planId), updates);
    };

    const handleDeleteAction = async (actionId: string) => {
        await deleteDoc(doc(db, 'actions', actionId));
    };

    return {
        plans,
        actions,
        loading,
        handleCreatePlan,
        handleEditPlan,
        handleDeletePlan,
        handleCreateAction,
        handleEditAction,
        handleUpdateActionStatus,
        handleUpdatePlanStatus,
        handleDeleteAction
    };
}
