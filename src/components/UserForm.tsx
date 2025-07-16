
'use client';

import { useState } from 'react';
import { useForm, FormProvider, useWatch } from 'react-hook-form';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Loader2, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { User, SchoolType } from '@/lib/types';
import { findSchoolsAction } from '@/app/actions';

const schoolTypes: { id: SchoolType; name: string }[] = [
  { id: 'SDN', name: 'SD Negeri' },
  { id: 'SDIT', name: 'SD Islam Terpadu' },
  { id: 'MI', name: 'Madrasah Ibtidaiyah (MI)' },
];

export const userSchema = z.object({
  name: z.string().min(2, { message: 'Nama harus memiliki setidaknya 2 karakter.' }),
  username: z.string().min(3, { message: 'Username harus memiliki setidaknya 3 karakter.' }).regex(/^[a-z0-9_]+$/, 'Username hanya boleh berisi huruf kecil, angka, dan garis bawah (_).'),
  email: z.string().email({ message: 'Email tidak valid.' }),
  role: z.enum(['user', 'admin'], { required_error: 'Peran harus dipilih.' }),
  city: z.string().optional(),
  schoolType: z.enum(['SDN', 'SDIT', 'MI']).optional(),
  schoolName: z.string().optional(),
  password: z.string().optional(),
});

type UserFormValues = z.infer<typeof userSchema>;

interface UserFormProps {
    form: ReturnType<typeof useForm<UserFormValues>>;
    onSubmit: (data: UserFormValues) => void;
    editingUser: User | null;
    children: React.ReactNode;
}

function InnerUserForm({ form, onSubmit, editingUser, children }: UserFormProps) {
    const { toast } = useToast();
    const [isSearchingSchools, setIsSearchingSchools] = useState(false);
    const [availableSchools, setAvailableSchools] = useState<string[]>([]);
    
    const role = useWatch({ control: form.control, name: 'role' });
    const city = useWatch({ control: form.control, name: 'city' });
    const schoolType = useWatch({ control: form.control, name: 'schoolType' });

    useState(() => {
      if (editingUser?.schoolName) {
        setAvailableSchools([editingUser.schoolName]);
      }
    });

    const handleFindSchools = async () => {
      if (!city || !schoolType) {
        toast({ title: 'Informasi Kurang', description: 'Isi kota dan jenis sekolah.', variant: 'destructive' });
        return;
      }
      setIsSearchingSchools(true);
      setAvailableSchools([]);
      form.setValue('schoolName', '');
      const result = await findSchoolsAction({ city, schoolType });
      setIsSearchingSchools(false);

      if (result.error || !result.data?.schools) {
        toast({ title: 'Gagal Mencari Sekolah', description: result.error || 'Tidak ada sekolah ditemukan.', variant: 'destructive' });
      } else {
        setAvailableSchools(result.data.schools);
      }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Lengkap</FormLabel>
                    <FormControl>
                      <Input placeholder="Nama Lengkap" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="username" {...field} disabled={!!editingUser} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="email@contoh.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder={editingUser ? 'Isi untuk mengubah' : 'Password baru'} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Peran</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih peran" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {role === 'user' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Kota</FormLabel>
                                <FormControl>
                                    <Input placeholder="Contoh: Surabaya" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="schoolType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Jenis Sekolah</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Pilih jenis" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {schoolTypes.map((s) => (
                                  <SelectItem key={s.id} value={s.id}>
                                    {s.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                  </div>
                   <Button type="button" variant="secondary" className="w-full" onClick={handleFindSchools} disabled={isSearchingSchools || !city || !schoolType}>
                      {isSearchingSchools ? <Loader2 className="animate-spin" /> : <Search />}
                      Cari Sekolah
                    </Button>
                    <FormField
                      control={form.control}
                      name="schoolName"
                      render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nama Sekolah</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value} disabled={availableSchools.length === 0}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih nama sekolah" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                {availableSchools.map((s) => (
                                    <SelectItem key={s} value={s}>
                                      {s}
                                    </SelectItem>
                                ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                      )}
                    />
                </>
              )}

              {children}
            </form>
          </Form>
    );
}

export function UserForm({ form, onSubmit, editingUser, children }: UserFormProps) {
    return (
        <FormProvider {...form}>
            <InnerUserForm form={form} onSubmit={onSubmit} editingUser={editingUser}>
                {children}
            </InnerUserForm>
        </FormProvider>
    )
}
