import * as z from 'zod';

export const SignupValidation = z.object({
    name: z.string().min(2, {
        message: 'Votre nom doit contenir au moins 2 caractères',
    }),
    username: z.string().min(2, {
        message: "Votre nom d'utilisateur doit contenir au moins 2 caractères",
    }),
    email: z.string().email({ message: 'Email invalide' }),
    password: z.string().min(8, {
        message: 'Votre mot de passe doit contenir au moins 8 caractères',
    }),
});

export const SigninValidation = z.object({
    email: z.string().email({ message: 'Email invalide' }),
    password: z.string().min(1, {
        message: 'Votre mot de passe ne peut pas être vide',
    }),
});

export const TrainingValidation = z.object({
    name: z.string().min(1, 'Vous devez choisir un entraînement'),
    value: z.string().min(1, 'La valeur doit être supérieure à 0'),
    date: z.string(),
});

export const ProfileValidation = z.object({
    name: z.string(),
    file: z.custom<File[]>(),
});
