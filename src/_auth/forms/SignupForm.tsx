import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/components/ui/use-toast';

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { SignupValidation } from '@/lib/validation';
import Loader from '@/components/shared/Loader';
import { Link, useNavigate } from 'react-router-dom';
import { useCreateUserAccount } from '@/lib/react-query/queriesAndMutations';

const SignupForm = () => {
    const { toast } = useToast();
    const navigate = useNavigate();

    const { mutateAsync: createUserAccount, isPending: isCreatingAccount } =
        useCreateUserAccount();

    const form = useForm<z.infer<typeof SignupValidation>>({
        resolver: zodResolver(SignupValidation),
        defaultValues: {
            name: '',
            username: '',
            email: '',
            password: '',
        },
    });

    async function onSubmit(values: z.infer<typeof SignupValidation>) {
        let newUser;

        try {
            newUser = await createUserAccount(values);
        } catch (error) {
            console.log(error);
        }

        if (!newUser) return;

        toast({
            title: 'Votre compte a été créé avec succès !',
        });
        navigate('/sign-in');
    }

    return (
        <Form {...form}>
            <div className='sm:w-420 flex-center flex-col'>
                <img src='/assets/images/logo.png' alt='logo' width={100} />

                <h2 className='h3-bold md:h2-bold pt-5 sm:pt-12'>
                    Créer un nouveau compte
                </h2>
                <p className='text-light-3 small-medium md:base-regular mt-2'>
                    Bienvenue ! Veuillez renseigner vos informations.
                </p>

                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='flex flex-col gap-5 w-full mt-4'
                >
                    <FormField
                        control={form.control}
                        name='name'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nom</FormLabel>
                                <FormControl>
                                    <Input
                                        type='text'
                                        className='shad-input'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='username'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nom d'utilisateur</FormLabel>
                                <FormControl>
                                    <Input
                                        type='text'
                                        className='shad-input'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='email'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        type='email'
                                        className='shad-input'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='password'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Mot de passe</FormLabel>
                                <FormControl>
                                    <Input
                                        type='password'
                                        className='shad-input'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button
                        type='submit'
                        className='shad-button_primary w-full mt-4'
                    >
                        {isCreatingAccount ? (
                            <div className='flex-center gap-2'>
                                <Loader size='sm' />
                                Chargement...
                            </div>
                        ) : (
                            'Créer mon compte'
                        )}
                    </Button>

                    <p className='text-small-regular text-light-2 text-center mt-2'>
                        Vous avez déjà un compte ?
                        <Link
                            to={'/sign-in'}
                            className='text-primary-500 text-small-semibold underline ml-2'
                        >
                            Se connecter
                        </Link>
                    </p>
                </form>
            </div>
        </Form>
    );
};

export default SignupForm;
