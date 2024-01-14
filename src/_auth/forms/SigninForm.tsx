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
import { SigninValidation } from '@/lib/validation';
import Loader from '@/components/shared/Loader';
import { Link, useNavigate } from 'react-router-dom';
import { useSignInAccount } from '@/lib/react-query/queriesAndMutations';
import { useUserContext } from '@/context/AuthContext';

const SigninForm = () => {
    const { toast } = useToast();
    const navigate = useNavigate();
    const { checkAuthUser, isLoading: isUserLoading } = useUserContext();

    const { mutateAsync: signInAccount } = useSignInAccount();

    const form = useForm<z.infer<typeof SigninValidation>>({
        resolver: zodResolver(SigninValidation),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    async function onSubmit(values: z.infer<typeof SigninValidation>) {
        const session = await signInAccount({
            email: values.email,
            password: values.password,
        });

        if (!session) {
            return toast({
                title: 'Une erreur est survenue lors de la connexion à votre compte. Veuillez réessayer.',
            });
        }

        const isLoggedIn = await checkAuthUser();

        if (isLoggedIn) {
            form.reset();
            navigate('/');
        } else {
            return toast({
                title: 'Une erreur est survenue lors de la connexion à votre compte. Veuillez réessayer.',
            });
        }
    }

    return (
        <Form {...form}>
            <div className='sm:w-420 flex-center flex-col'>
                <img src='/assets/images/logo.png' alt='logo' width={100} />

                <h2 className='h3-bold md:h2-bold pt-5 sm:pt-12'>
                    Connexion à votre compte
                </h2>
                <p className='text-light-3 small-medium md:base-regular mt-2'>
                    Bienvenue ! Connectez-vous pour accéder à R2J.
                </p>

                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='flex flex-col gap-5 w-full mt-4'
                >
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
                        {isUserLoading ? (
                            <div className='flex-center gap-2'>
                                <Loader size='sm' />
                                Chargement...
                            </div>
                        ) : (
                            'Se connecter'
                        )}
                    </Button>

                    <p className='text-small-regular text-light-2 text-center mt-2'>
                        Vous n'avez pas de compte ?
                        <Link
                            to={'/sign-up'}
                            className='text-primary-500 text-small-semibold underline ml-2'
                        >
                            Créer un compte
                        </Link>
                    </p>
                </form>
            </div>
        </Form>
    );
};

export default SigninForm;
