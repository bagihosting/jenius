
'use client';

import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Award, Brain, Camera, KeyRound, LogOut, Star, User as UserIcon, Save, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';

const schoolTypeMap: { [key: string]: string } = {
  SDN: 'SD Negeri',
  SDIT: 'SD Islam Terpadu',
  MI: 'Madrasah Ibtidaiyah',
};

const badgeMap: { [key: string]: { icon: React.ElementType; label: string; color: string } } = {
  star_student: { icon: Star, label: 'Bintang Kelas', color: 'text-yellow-500' },
  diligent_learner: { icon: Award, label: 'Rajin Belajar', color: 'text-blue-500' },
  little_genius: { icon: Brain, label: 'Jenius Cilik', color: 'text-purple-500' },
};

async function compressAndConvertToWebP(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 256;
                const MAX_HEIGHT = 256;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    return reject(new Error('Could not get canvas context'));
                }
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/webp', 0.8)); // 80% quality
            };
            img.onerror = reject;
        };
        reader.onerror = reject;
    });
}


export function ProfileDialog({ children }: { children: React.ReactNode }) {
  const { user, updateUser, updatePassword, logout } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  if (!user) return null;

  const handleSaveName = () => {
    if (name.trim() === '') {
      toast({ title: 'Nama tidak boleh kosong', variant: 'destructive' });
      return;
    }
    updateUser({ name });
    setIsEditingName(false);
    toast({ title: 'Nama berhasil diperbarui!', variant: 'default' });
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({ title: 'Ukuran file terlalu besar', description: 'Silakan pilih file di bawah 5MB.', variant: 'destructive' });
        return;
    }

    setIsUploading(true);
    try {
        const compressedDataUrl = await compressAndConvertToWebP(file);
        updateUser({ photoUrl: compressedDataUrl });
        toast({ title: 'Foto profil berhasil diperbarui!', variant: 'default' });
    } catch (error) {
        console.error("Image processing failed:", error);
        toast({ title: 'Gagal memproses gambar', description: 'Silakan coba file lain.', variant: 'destructive' });
    } finally {
        setIsUploading(false);
    }
  };

  const handlePasswordChange = () => {
    if (password === '' || confirmPassword === '') {
        toast({ title: 'Password tidak boleh kosong', variant: 'destructive' });
        return;
    }
    if (password !== confirmPassword) {
        toast({ title: 'Password tidak cocok', description: 'Pastikan konfirmasi password sama.', variant: 'destructive' });
        return;
    }
    if (password.length < 6) {
        toast({ title: 'Password terlalu pendek', description: 'Password minimal harus 6 karakter.', variant: 'destructive' });
        return;
    }
    
    updatePassword(password);
    toast({ title: 'Password berhasil diperbarui!', variant: 'default' });
    setPassword('');
    setConfirmPassword('');
  };

  const userBadge = user.badge && badgeMap[user.badge];

  return (
    <Dialog onOpenChange={() => setIsEditingName(false)}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-center text-2xl font-headline">Profil Saya</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col sm:flex-row items-center gap-4 px-6">
            <div className="relative group shrink-0">
              <Avatar className="h-20 w-20 sm:h-24 sm:w-24 cursor-pointer" onClick={handleAvatarClick}>
                <AvatarImage src={user.photoUrl} alt={user.name} />
                <AvatarFallback className="text-4xl">
                   <UserIcon className="h-10 w-10"/>
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                 {isUploading ? <Loader2 className="h-6 w-6 text-white animate-spin" /> : <Camera className="h-8 w-8 text-white" />}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/png, image/jpeg, image/gif"
              />
            </div>
            
            <div className="flex flex-col items-center sm:items-start w-full">
                {isEditingName ? (
                   <div className="w-full flex items-center gap-2">
                      <Input value={name} onChange={(e) => setName(e.target.value)} className="text-xl h-10" />
                      <Button onClick={handleSaveName} size="sm"><Save /></Button>
                   </div>
                ) : (
                   <h2 className="text-2xl font-bold cursor-pointer" onClick={() => setIsEditingName(true)}>
                      {user.name}
                  </h2>
                )}

                <p className="text-muted-foreground">{user.email}</p>
                <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary">{schoolTypeMap[user.schoolType] || user.schoolType}</Badge>
                    {userBadge && (
                       <div className="flex items-center gap-1.5 p-1 px-2 bg-secondary rounded-full">
                          <userBadge.icon className={`h-4 w-4 ${userBadge.color}`} />
                          <span className="font-semibold text-secondary-foreground text-xs">{userBadge.label}</span>
                       </div>
                    )}
                </div>
            </div>
        </div>
        
        <Separator className="my-4"/>

        <ScrollArea className="max-h-[calc(100vh-20rem)] sm:max-h-auto">
            <div className="space-y-4 px-6 pb-6">
                <div className="space-y-4">
                    <h3 className="font-semibold text-center">Ubah Password</h3>
                    <div className="space-y-2">
                        <Label htmlFor="new-password">Password Baru</Label>
                        <Input id="new-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Minimal 6 karakter" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="confirm-password">Konfirmasi Password Baru</Label>
                        <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Ulangi password baru" />
                    </div>
                    <Button onClick={handlePasswordChange} className="w-full">
                        <KeyRound className="mr-2"/>
                        Ubah Password
                    </Button>
                </div>
                
                <Separator />

                <Button onClick={logout} variant="destructive" className="w-full">
                    <LogOut className="mr-2" />
                    Keluar
                </Button>
            </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
