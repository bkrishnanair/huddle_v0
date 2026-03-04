"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/lib/firebase-context";
import { storage, db } from "@/lib/firebase";
import { ref, uploadBytesResumable, getDownloadURL, listAll, deleteObject } from "firebase/storage";
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Loader2, UploadCloud, Trash2, Image as ImageIcon, XCircle } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface EventGalleryProps {
    eventId: string;
    isOrganizer: boolean;
    hasJoined: boolean;
    eventDate: string;
}

export default function EventGallery({ eventId, isOrganizer, hasJoined, eventDate }: EventGalleryProps) {
    const { user } = useAuth();
    const [photos, setPhotos] = useState<{ url: string, path: string, uploaderId: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const uploadTaskRef = useRef<any>(null);

    const isPastEvent = () => {
        if (!eventDate || eventDate.includes('/')) return true; // default open for legacy/bad dates
        try {
            const evDate = new Date(eventDate);
            const now = new Date();
            now.setHours(0, 0, 0, 0);
            evDate.setHours(0, 0, 0, 0);
            // Open if today or in the past
            return evDate.getTime() <= now.getTime();
        } catch (e) {
            return true;
        }
    };

    const fetchPhotos = async () => {
        if (!eventId || !db) return;
        setLoading(true);
        try {
            const eventRef = doc(db, "events", eventId);
            const snap = await getDoc(eventRef);
            if (snap.exists() && snap.data().gallery) {
                setPhotos(snap.data().gallery || []);
            } else {
                setPhotos([]);
            }
        } catch (error) {
            console.error("Error fetching gallery:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPhotos();
    }, [eventId]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0 || !user || !storage) {
            console.warn("Upload blocked: Missing file, user, or storage instance.", { user: !!user, storage: !!storage });
            return;
        }

        // Diagnostic: check if the bucket is configured
        if (!(storage as any)._bucket && !(storage as any).app?.options?.storageBucket) {
            toast.error("Firebase Storage Bucket not configured in environment variables!");
            return;
        }

        const file = e.target.files[0];
        console.log(`Starting upload for: ${file.name} (${file.size} bytes)`);

        if (file.size > 10 * 1024 * 1024) {
            toast.error("File must be less than 10MB");
            return;
        }

        if (!file.type.startsWith('image/')) {
            toast.error("Only images are allowed");
            return;
        }

        setUploading(true);
        setProgress(0);

        try {
            const cleanFileName = file.name.replace(/[^a-z0-9.]/gi, '_').toLowerCase();
            const fileName = `${Date.now()}_${cleanFileName}`;
            const storageRef = ref(storage, `events/${eventId}/gallery/${fileName}`);

            console.log(`Target Path: events/${eventId}/gallery/${fileName}`);

            const uploadTask = uploadBytesResumable(storageRef, file, {
                contentType: file.type,
                customMetadata: {
                    uploaderId: user.uid,
                }
            });

            uploadTaskRef.current = uploadTask;

            uploadTask.on('state_changed',
                (snapshot) => {
                    const p = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`Upload status: ${snapshot.state} - ${snapshot.bytesTransferred}/${snapshot.totalBytes} (${p}%)`);
                    setProgress(p);
                },
                (error) => {
                    if (error.code === 'storage/canceled') {
                        // User cancelled — handled by the cancel button, don't show error
                        return;
                    }
                    console.error("Upload failed! Error Code:", error.code, "Message:", error.message);
                    toast.error(`Upload failed: ${error.code}. Check CORS settings.`);
                    setUploading(false);
                },
                async () => {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    const photoData = {
                        url: downloadURL,
                        path: uploadTask.snapshot.ref.fullPath,
                        uploaderId: user.uid
                    };

                    // Save to Firestore array
                    const eventRef = doc(db, "events", eventId);
                    await updateDoc(eventRef, {
                        gallery: arrayUnion(photoData)
                    });

                    setPhotos(prev => [...prev, photoData]);
                    toast.success("Photo added to gallery! 📸");
                    setUploading(false);
                    uploadTaskRef.current = null;
                    if (fileInputRef.current) fileInputRef.current.value = "";
                }
            );

        } catch (err) {
            console.error(err);
            toast.error("Unexpected error uploading photo.");
            setUploading(false);
        }
    };

    const handleDelete = async (photo: { url: string, path: string, uploaderId: string }) => {
        if (!confirm("Delete this photo forever?")) return;
        if (!storage || !db || !user) return;

        try {
            // Delete from Storage
            const storageRef = ref(storage, photo.path);
            await deleteObject(storageRef);

            // Remove from Firestore array
            const eventRef = doc(db, "events", eventId);
            await updateDoc(eventRef, {
                gallery: arrayRemove(photo)
            });

            setPhotos(prev => prev.filter(p => p.path !== photo.path));
            toast.success("Photo deleted.");
        } catch (err) {
            console.error("Delete failed:", err);
            toast.error("Failed to delete photo. You might not have permission.");
        }
    };

    if (!isPastEvent() && !isOrganizer) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-900/40 rounded-xl border border-white/5 space-y-3">
                <ImageIcon className="w-10 h-10 text-slate-600 mb-2" />
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest">Gallery Locked</h3>
                <p className="text-xs text-slate-500 max-w-xs">The photo gallery opens after the event starts. Come back later to share and relive the memories!</p>
            </div>
        );
    }

    return (
        <div className="bg-slate-900/40 rounded-xl border border-white/5 p-4 space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="font-black text-[10px] uppercase tracking-widest text-emerald-400">Event Gallery</h3>
                    <p className="text-[10px] text-slate-500 mt-0.5">Share photos from the game.</p>
                </div>

                {(hasJoined || isOrganizer) && (
                    <>
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            disabled={uploading}
                        />
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            className="bg-white/5 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300 text-[10px] font-bold h-7"
                        >
                            {uploading ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <UploadCloud className="w-3 h-3 mr-1" />}
                            {uploading ? `${Math.round(progress)}%` : "Upload Photo"}
                        </Button>
                        {uploading && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                onClick={() => {
                                    if (uploadTaskRef.current) {
                                        uploadTaskRef.current.cancel();
                                        uploadTaskRef.current = null;
                                    }
                                    setUploading(false);
                                    setProgress(0);
                                    if (fileInputRef.current) fileInputRef.current.value = "";
                                    toast.info("Upload cancelled.");
                                }}
                            >
                                <XCircle className="w-3.5 h-3.5" />
                            </Button>
                        )}
                    </>
                )}
            </div>

            {loading ? (
                <div className="flex justify-center p-8"><Loader2 className="w-5 h-5 animate-spin text-primary/50" /></div>
            ) : photos.length === 0 ? (
                <div className="text-center p-6 border border-dashed border-white/10 rounded-xl">
                    <p className="text-xs text-slate-500 font-medium">No photos yet. Be the first to share! 📸</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {photos.map((photo, i) => (
                        <div key={i} className="relative aspect-square rounded-lg overflow-hidden group bg-slate-800">
                            <img
                                src={photo.url}
                                alt="Event photo"
                                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                            />
                            {(isOrganizer || user?.uid === photo.uploaderId) && (
                                <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        className="h-6 w-6 rounded-md bg-red-500/80 hover:bg-red-500 backdrop-blur-sm"
                                        onClick={() => handleDelete(photo)}
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
