
'use client';

import { useEffect, useMemo } from 'react';
import { useForm, FormProvider, useWatch, Controller } from 'react-hook-form';
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
import { getSchoolsByCityAndType, School } from '@/lib/schools';

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
  schoolType: z.enum(['SDN', 'SDIT', 'MI']),
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
    const role = useWatch({
        control: form.control,
        name: 'role',
    });
    const schoolType = useWatch({
        control: form.control,
        name: 'schoolType',
    });

    const availableSchools = useMemo(() => {
        if (role === 'user' && schoolType) {
            return getSchoolsByCityAndType('Tangerang', schoolType);
        }
        return [];
    }, [role, schoolType]);

    useEffect(() => {
        if (role === 'admin') {
            form.setValue('schoolType', 'SDN');
            form.setValue('schoolName', '');
        }
    }, [role, form]);
    
    useEffect(() => {
        // Reset schoolName if schoolType changes and the current schoolName is not in the new list
        const currentSchoolName = form.getValues('schoolName');
        if (schoolType && currentSchoolName && !availableSchools.find(s => s.name === currentSchoolName)) {
            form.setValue('schoolName', '');
        }
    }, [schoolType, availableSchools, form]);


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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="schoolType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Jenis Sekolah</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih jenis sekolah" />
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
                    <FormField
                      control={form.control}
                      name="schoolName"
                      render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nama Sekolah</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value} disabled={!schoolType}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih nama sekolah" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                {availableSchools.map((s) => (
                                    <SelectItem key={s.name} value={s.name}>
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
