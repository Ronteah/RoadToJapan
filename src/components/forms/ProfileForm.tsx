import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import FileUploader from '../shared/FileUploader';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import * as z from 'zod';
import { ProfileValidation } from '@/lib/validation';
import { useToast } from '../ui/use-toast';
import { useUpdateUser } from '@/lib/react-query/queriesAndMutations';
import { IUser } from '@/types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type Props = {
    user?: IUser;
};

const ProfileForm = ({ user }: Props) => {
    const { toast } = useToast();

    const { mutateAsync: updateUser, isPending: isLoadingUpdate } =
        useUpdateUser();

    const form = useForm<z.infer<typeof ProfileValidation>>({
        resolver: zodResolver(ProfileValidation),
        defaultValues: {
            name: user?.name,
            file: [],
        },
    });

    async function onSubmit(values: z.infer<typeof ProfileValidation>) {
        const newProfile = await updateUser({
            ...values,
            userId: user!.id,
            imageId: user!.imageId,
            imageUrl: user!.imageUrl,
            xp: user!.xp,
            level: user!.level,
            followers: user!.followers,
            following: user!.following,
        });

        if (!newProfile) {
            return toast({
                title: 'Veuillez réessayez.',
            });
        }

        localStorage.setItem('firstLoadDone', '-1');
        navigate(-1);
    }

    const navigate = useNavigate();

    const [noChanges, setNoChanges] = useState(true);

    const handleCancel = () => {
        form.reset();
        setNoChanges(true);
        localStorage.setItem('firstLoadDone', '');
        navigate(-1);
    };

    return (
        <div className='bg-dark-2 p-10 mt-4 rounded-xl'>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='flex flex-col gap-9 w-full'
                >
                    <div className='flex items-center gap-9 w-full max-w-5x1'>
                        <FormField
                            control={form.control}
                            name='file'
                            render={({ field }) => (
                                <FormItem className='flex flex-col items-center'>
                                    <FormLabel className='shad-form_label'>
                                        Avatar
                                    </FormLabel>
                                    <FormControl>
                                        <FileUploader
                                            fieldChange={field.onChange}
                                            changeEvent={() =>
                                                setNoChanges(false)
                                            }
                                            mediaUrl={user?.imageUrl!}
                                        />
                                    </FormControl>
                                    <FormMessage className='shad-form_message' />
                                </FormItem>
                            )}
                        />
                        <div className='w-full flex flex-col gap-4'>
                            <FormField
                                control={form.control}
                                name='name'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='shad-form_label'>
                                            Nom
                                        </FormLabel>
                                        <FormControl
                                            onChange={(e) => {
                                                (
                                                    e.currentTarget as HTMLInputElement
                                                ).value === user?.name
                                                    ? setNoChanges(true)
                                                    : setNoChanges(false);
                                            }}
                                        >
                                            <Input
                                                type='text'
                                                className='shad-input'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className='shad-form_message' />
                                    </FormItem>
                                )}
                            />
                            <FormItem>
                                <FormLabel className='shad-form_label'>
                                    Nom d'utilisateur
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type='text'
                                        className='shad-input'
                                        value={user?.username}
                                        disabled
                                    />
                                </FormControl>
                            </FormItem>
                            <FormItem>
                                <FormLabel className='shad-form_label'>
                                    Email
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type='text'
                                        className='shad-input'
                                        value={user?.email}
                                        disabled
                                    />
                                </FormControl>
                            </FormItem>
                        </div>
                    </div>
                    <div className='flex gap-4 items-center justify-end'>
                        <Button
                            type='button'
                            className='h-12 mr-2 hover:opacity-65 transition'
                            onClick={handleCancel}
                        >
                            Annuler
                        </Button>
                        <Button
                            type='submit'
                            className='shad-button_primary whitespace-nowrap hover:opacity-65 transition'
                            disabled={isLoadingUpdate || noChanges}
                        >
                            Enregistrer
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default ProfileForm;
