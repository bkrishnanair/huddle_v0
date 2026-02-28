"use client"

import { useState } from "react"
import { ShieldAlert, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { useAuth } from "@/lib/firebase-context"

interface ReportModalProps {
    isOpen: boolean
    onClose: () => void
    targetId: string
    itemType: "user" | "event" | "photo"
    targetName?: string
}

const REPORT_REASONS = {
    user: [
        "Inappropriate Behavior",
        "Harassment / Bullying",
        "Spam / Fake Profile",
        "No-Show abuse",
        "Other"
    ],
    event: [
        "Fake Event",
        "Inappropriate Content",
        "Commercial Spam",
        "Dangerous Location",
        "Other"
    ],
    photo: [
        "Inappropriate Content",
        "Not related to event",
        "Violates Privacy",
        "Other"
    ]
}

export function ReportModal({ isOpen, onClose, targetId, itemType, targetName }: ReportModalProps) {
    const { user } = useAuth()
    const [reason, setReason] = useState("")
    const [details, setDetails] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async () => {
        if (!user) {
            toast.error("You must be logged in to submit a report.");
            return;
        }

        if (!reason) {
            toast.error("Please select a reason for reporting.");
            return;
        }

        setIsSubmitting(true)
        try {
            const idToken = await user.getIdToken();
            const response = await fetch("/api/reports", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${idToken}`
                },
                body: JSON.stringify({
                    targetId,
                    itemType,
                    reason,
                    details
                })
            });

            if (!response.ok) {
                throw new Error("Failed to submit report");
            }

            toast.success("Report submitted successfully. We will review it shortly.");

            // Reset form
            setReason("");
            setDetails("");
            onClose();
        } catch (error) {
            console.error(error);
            toast.error("An error occurred while submitting the report.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="glass-surface border-white/10 sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-black uppercase tracking-widest flex items-center gap-2 text-white">
                        <ShieldAlert className="w-5 h-5 text-red-500" />
                        Report {itemType}
                    </DialogTitle>
                    <DialogDescription className="text-slate-400">
                        {targetName ? `Reporting ${targetName}. ` : ""}
                        Please select a reason and provide context. This report is confidential.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-300">
                            Reason <span className="text-red-500">*</span>
                        </label>
                        <Select value={reason} onValueChange={setReason}>
                            <SelectTrigger className="bg-slate-900/50 border-white/10 text-white">
                                <SelectValue placeholder="Select a reason" />
                            </SelectTrigger>
                            <SelectContent>
                                {REPORT_REASONS[itemType].map((r) => (
                                    <SelectItem key={r} value={r}>{r}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-300 flex justify-between">
                            <span>Details</span>
                            <span className="text-slate-500 font-normal normal-case">Optional</span>
                        </label>
                        <Textarea
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                            placeholder="Provide any additional context to help our review..."
                            className="bg-slate-900/50 border-white/10 text-white placeholder:text-slate-500 min-h-[100px]"
                        />
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="text-slate-300 hover:text-white hover:bg-white/10"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleSubmit}
                        disabled={isSubmitting || !reason}
                        className="font-bold"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            "Submit Report"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
