"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/firebase-context";
import { toast } from "sonner";
import {
  User,
  CalendarPlus,
  Share2,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Copy,
  Sparkles,
  Upload,
} from "lucide-react";

interface OnboardingWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const STEPS = [
  { id: 1, title: "Set Up Your Profile", icon: User, description: "Tell your attendees who you are" },
  { id: 2, title: "Create Your First Event", icon: CalendarPlus, description: "Or import your schedule" },
  { id: 3, title: "Share Your Link", icon: Share2, description: "Start building your community" },
];

export default function OnboardingWizard({ isOpen, onClose, onComplete }: OnboardingWizardProps) {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Step 1: Profile
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");

  // Step 3: Share link
  const shareUrl = typeof window !== "undefined"
    ? `${window.location.origin}/discover`
    : "https://huddlemap.live/discover";

  const handleSaveProfile = async () => {
    if (!user || !displayName.trim()) {
      toast.error("Please enter your name.");
      return;
    }

    setIsLoading(true);
    try {
      const idToken = await user.getIdToken();
      const res = await fetch(`/api/users/${user.uid}/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          displayName: displayName.trim(),
          bio: bio.trim(),
          onboardingComplete: true,
        }),
      });

      if (res.ok) {
        toast.success("Profile saved! 🎉");
        setStep(2);
      } else {
        toast.error("Failed to save profile.");
      }
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join me on Huddle!",
          text: `Check out events happening near campus on Huddle!`,
          url: shareUrl,
        });
      } catch {}
    } else {
      handleCopyLink();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-surface border-white/10 sm:max-w-[520px] p-0 overflow-hidden">
        {/* Progress bar */}
        <div className="flex gap-1.5 p-4 pb-0">
          {STEPS.map((s) => (
            <div
              key={s.id}
              className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${
                s.id <= step ? "bg-primary shadow-[0_0_8px_rgba(234,88,12,0.4)]" : "bg-white/10"
              }`}
            />
          ))}
        </div>

        {/* Step header */}
        <div className="px-6 pt-4 pb-2">
          <div className="flex items-center gap-3 mb-1">
            {(() => {
              const StepIcon = STEPS[step - 1].icon;
              return <StepIcon className="w-6 h-6 text-primary" />;
            })()}
            <DialogTitle className="text-xl font-black text-white tracking-tight">{STEPS[step - 1].title}</DialogTitle>
          </div>
          <DialogDescription className="text-sm text-slate-400 ml-9">{STEPS[step - 1].description}</DialogDescription>
        </div>

        {/* Step content */}
        <div className="px-6 pb-6 pt-2">
          {/* Step 1: Profile Setup */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Organization / Display Name <span className="text-primary">*</span>
                </Label>
                <Input
                  placeholder="e.g., UMD Running Club"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="bg-slate-900/50 border-white/10 text-white placeholder:text-slate-500 h-11"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Bio <span className="text-slate-600 font-normal normal-case tracking-normal">(Optional)</span>
                </Label>
                <Textarea
                  placeholder="What does your org do? What kind of events do you host?"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="bg-slate-900/50 border-white/10 text-white placeholder:text-slate-500 min-h-[80px]"
                />
              </div>
              <Button
                onClick={handleSaveProfile}
                disabled={isLoading || !displayName.trim()}
                className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-bold gap-2"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                Save & Continue
              </Button>
            </div>
          )}

          {/* Step 2: Create Event / Import */}
          {step === 2 && (
            <div className="space-y-4">
              <div
                onClick={() => {
                  onClose();
                  // Trigger create event modal from parent
                  onComplete();
                }}
                className="group cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-5 transition-all"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <CalendarPlus className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">Create an Event</p>
                    <p className="text-xs text-slate-400">Set up your first event from scratch</p>
                  </div>
                </div>
              </div>

              <div
                onClick={() => {
                  // Navigate to import
                  window.location.href = "/dashboard";
                }}
                className="group cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-5 transition-all"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Upload className="w-5 h-5 text-violet-400" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">Import Your Schedule</p>
                    <p className="text-xs text-slate-400">Paste your event schedule and AI will create events</p>
                  </div>
                </div>
              </div>

              <Button
                variant="ghost"
                onClick={() => setStep(3)}
                className="w-full text-slate-400 hover:text-white text-sm"
              >
                Skip for now <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          )}

          {/* Step 3: Share */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/30 to-violet-500/30 flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-white font-bold mb-1">You're all set!</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Share your Huddle profile with your community. Every RSVP increases your event's visibility.
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleCopyLink}
                  className="flex-1 h-10 border-white/10 bg-white/5 text-white text-sm font-bold gap-2"
                >
                  {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copied!" : "Copy Link"}
                </Button>
                <Button
                  onClick={handleNativeShare}
                  className="flex-1 h-10 bg-primary hover:bg-primary/90 text-white text-sm font-bold gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>
              </div>

              <Button
                onClick={() => {
                  onClose();
                  onComplete();
                }}
                className="w-full h-11 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/20 font-bold gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Done — Let's Go!
              </Button>
            </div>
          )}

          {/* Back button */}
          {step > 1 && step < 3 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setStep(step - 1)}
              className="mt-2 text-slate-500 hover:text-white text-xs"
            >
              <ArrowLeft className="w-3 h-3 mr-1" />
              Back
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
