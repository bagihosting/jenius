
'use client';

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
import type { User, SchoolType } from '@/lib/types';
import { ScrollArea } from './ui/scroll-area';

const schoolTypes: { id: SchoolType; name: string }[] = [
  { id: 'SDN', name: 'SD Negeri' },
  { id: 'SDIT', name: 'SD Islam Terpadu' },
  { id: 'MI', name: 'Madrasah Ibtidaiyah (MI)' },
  { id: 'SMP', name: 'SMP (Sekolah Menengah Pertama)' },
  { id: 'MTs', name: 'MTs (Madrasah Tsanawiyah)' },
  { id: 'SMA', name: 'SMA (Sekolah Menengah Atas)' },
  { id: 'MA', name: 'MA (Madrasah Aliyah)' },
  { id: 'AKADEMI', name: 'Akademi' },
  { id: 'UNIVERSITAS', name: 'Universitas' },
];

export const userSchema = z.object({
  name: z.string().min(2, { message: 'Nama harus memiliki setidaknya 2 karakter.' }),
  username: z.string().min(3, { message: 'Username harus memiliki setidaknya 3 karakter.' }).regex(/^[a-z0-9_]+$/, 'Username hanya boleh berisi huruf kecil, angka, dan garis bawah (_).'),
  email: z.string().email({ message: 'Email tidak valid.' }),
  role: z.enum(['user', 'admin', 'mahasiswa'], { required_error: 'Peran harus dipilih.' }),
  schoolType: z.nativeEnum(Object.fromEntries(schoolTypes.map(s => [s.id, s.id])) as Record<SchoolType, SchoolType>).optional(),
  schoolName: z.string().optional(),
  password: z.string().optional(),
  photoUrl: z.string().optional(),
  robloxUsername: z.string().optional(),
  major: z.string().optional(),
  bonusPoints: z.number().optional(),
}).superRefine((data, ctx) => {
    if (data.role === 'user' && (!data.schoolType || !data.schoolName)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Jenis dan nama sekolah wajib diisi untuk peran 'user'.",
            path: ['schoolName'],
        });
    }
    if (data.role === 'mahasiswa' && !data.major) {
         ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Jurusan wajib diisi untuk peran 'mahasiswa'.",
            path: ['major'],
        });
    }
});


type UserFormValues = z.infer<typeof userSchema>;

interface UserFormProps {
    form: ReturnType<typeof useForm<UserFormValues>>;
    onSubmit: (data: UserFormValues) => void;
    editingUser: User | null;
    children: React.ReactNode;
}

function InnerUserForm({ form, onSubmit, editingUser, children }: UserFormProps) {
    const role = useWatch({ control: form.control, name: 'role' });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full">
              <ScrollArea className="flex-1 pr-6 -mr-6">
                <div className="space-y-4 py-4">
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
                          <Input type="password" placeholder="Isi untuk mengubah (admin tidak bisa mengubah)" disabled />
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
                            <SelectItem value="user">User (Siswa)</SelectItem>
                            <SelectItem value="mahasiswa">Mahasiswa</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {role === 'user' && (
                    <>
                      <FormField
                        control={form.control}
                        name="schoolType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Jenis Sekolah/Institusi</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Pilih jenis" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {schoolTypes.filter(s => !['AKADEMI', 'UNIVERSITAS'].includes(s.id)).map((s) => (
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
                      <FormField
                        control={form.control}
                        name="schoolName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nama Sekolah/Institusi</FormLabel>
                            <FormControl>
                                <Input placeholder="Contoh: SDN Merdeka 5" {...field} value={field.value || ''} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}

                  {role === 'mahasiswa' && (
                      <FormField
                        control={form.control}
                        name="major"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Jurusan</FormLabel>
                            <FormControl>
                                <Input placeholder="Contoh: Teknik Informatika" {...field} value={field.value || ''} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                  )}

                  <FormField
                    control={form.control}
                    name="bonusPoints"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Poin Bonus</FormLabel>
                        <FormControl>
                            <Input 
                              type="number" 
                              placeholder="0"
                              {...field}
                              onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                              value={field.value || 0}
                              step="0.001"
                            />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="robloxUsername"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username Roblox (Opsional)</FormLabel>
                        <FormControl>
                            <Input placeholder="Username Roblox" {...field} value={field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </ScrollArea>
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
