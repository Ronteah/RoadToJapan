import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
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
import { TrainingValidation } from '@/lib/validation';
import { Models } from 'appwrite';
import {
    useCreateTraining,
    useUpdateTraining,
    useUpdateUserXp,
} from '@/lib/react-query/queriesAndMutations';
import { useUserContext } from '@/context/AuthContext';
import { useToast } from '../ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { baseXpByLevel, trainingNames, xpByLevelMultiplier } from '@/constants';
import { useEffect, useState } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import moment from 'moment';

type Props = {
    training?: Models.Document;
    action: 'Ajouter' | 'Modifier';
};

const TrainingForm = ({ training, action }: Props) => {
    const { mutateAsync: createTraining, isPending: isLoadingCreate } =
        useCreateTraining();
    const { mutateAsync: updateTraining, isPending: isLoadingUpdate } =
        useUpdateTraining();

    const { mutateAsync: updateUserXp } = useUpdateUserXp();

    const [selectedTraining, setSelectedTraining] = useState('');
    const [date, setDate] = useState<Date>();

    const { user } = useUserContext();
    const { toast } = useToast();
    const navigate = useNavigate();

    const form = useForm<z.infer<typeof TrainingValidation>>({
        resolver: zodResolver(TrainingValidation),
        defaultValues: {
            name: training ? training?.name : '',
            value: training ? parseFloat(training?.value).toString() : '0',
            date: training ? training?.date : '',
        },
    });

    const getXpValue = (name: string, value: number) => {
        switch (name) {
            case 'Marche / Course à pied':
                return value * 6;
            case 'Vélo':
                return value * 2;
            default:
                return value * 30;
        }
    };

    const xpToNextLevel = (level: number): number => {
        if (level <= 0) {
            return baseXpByLevel;
        }
        return Math.round(xpToNextLevel(level - 1) * xpByLevelMultiplier);
    };

    const levelFromXp = (xp: number): number => {
        let currentLevel = 0;
        let xpToReachNextLevel = 0;

        while (xp >= xpToReachNextLevel) {
            xpToReachNextLevel = xpToNextLevel(currentLevel);
            xp -= xpToReachNextLevel;
            currentLevel++;
        }

        if (xp >= 0) {
            currentLevel++;
        }

        return currentLevel - 1;
    };

    async function onSubmit(values: z.infer<typeof TrainingValidation>) {
        form.setValue('date', moment(date).format('YYYY-MM-DD').toString());
        if (training && action === 'Modifier') {
            const updatedTraining = await updateTraining({
                ...values,
                trainingId: training.$id,
                name: values.name,
                value: parseFloat(values.value),
                date: moment(date).format('YYYY-MM-DD').toString(),
                xp: getXpValue(values.name, parseFloat(values.value)),
                likes: 0,
            });

            if (!updatedTraining) {
                return toast({
                    title: 'Veuillez réessayez.',
                });
            }

            const updatedUser = await updateUserXp({
                userId: user.id,
                userXp: user.xp - training.xp + updatedTraining.xp,
                userLevel: levelFromXp(
                    user.xp - training.xp + updatedTraining.xp
                ),
            });

            if (!updatedUser) {
                return toast({
                    title: 'Veuillez réessayez.',
                });
            }

            return navigate(-1);
        }

        const newTraining = await createTraining({
            ...values,
            userId: user.id,
            name: values.name,
            value: parseFloat(values.value),
            date: moment(date).format('YYYY-MM-DD').toString(),
            xp: getXpValue(values.name, parseFloat(values.value)),
        });

        if (!newTraining) {
            return toast({
                title: 'Veuillez réessayez.',
            });
        }

        const updatedUser = await updateUserXp({
            userId: user.id,
            userXp: user.xp + newTraining.xp,
            userLevel: levelFromXp(user.xp + newTraining.xp),
        });

        if (!updatedUser) {
            return toast({
                title: 'Veuillez réessayez.',
            });
        }

        navigate('/');
    }

    const handleCancel = () => {
        navigate(-1);
    };

    useEffect(() => {
        if (training) {
            setSelectedTraining(training.name);
            setDate(new Date(training.date));
        }
    });

    if (!!!date) setDate(moment().toDate());

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='flex flex-col gap-9 w-full'
            >
                <div className='flex flex-col gap-9 w-full max-w-5x1'>
                    <FormField
                        control={form.control}
                        name='name'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='shad-form_label'>
                                    Choisissez un entraînement
                                </FormLabel>
                                <br />
                                <FormControl>
                                    <Select
                                        defaultValue={selectedTraining}
                                        onValueChange={(e) => {
                                            setSelectedTraining(e);
                                            field.onChange(e);
                                        }}
                                    >
                                        <SelectTrigger className='shad-input rounded-md px-2 cursor-pointer w-full'>
                                            <SelectValue
                                                placeholder={
                                                    !!selectedTraining
                                                        ? selectedTraining
                                                        : 'Sélectionnez un entraînement'
                                                }
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {trainingNames.map(
                                                (name: string) => {
                                                    return (
                                                        <SelectItem
                                                            key={name}
                                                            value={name}
                                                            className={`${
                                                                field.name ===
                                                                    name &&
                                                                'text-primary-500'
                                                            }`}
                                                        >
                                                            {name}
                                                        </SelectItem>
                                                    );
                                                }
                                            )}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage className='shad-form_message' />
                            </FormItem>
                        )}
                    />
                    {(selectedTraining !== '' || action === 'Modifier') && (
                        <>
                            <FormField
                                control={form.control}
                                name='value'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='shad-form_label'>
                                            Entrez une valeur en
                                            {(() => {
                                                switch (
                                                    form.getValues('name')
                                                ) {
                                                    case 'Marche / Course à pied':
                                                        return ' kilomètres';
                                                    case 'Vélo':
                                                        return ' kilomètres';
                                                    default:
                                                        return ' heures';
                                                }
                                            })()}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                step='0.1'
                                                className='shad-input'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className='shad-form_message' />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='date'
                                render={() => (
                                    <FormItem>
                                        <FormLabel className='shad-form_label'>
                                            Entrez une date
                                        </FormLabel>
                                        <FormControl>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant={'outline'}
                                                        className={cn(
                                                            'shad-input w-full text-left font-normal flex justify-between items-center',
                                                            !date &&
                                                                'text-muted-foreground'
                                                        )}
                                                    >
                                                        {date ? (
                                                            format(date, 'PPP')
                                                        ) : (
                                                            <span>
                                                                {moment().format(
                                                                    'LL'
                                                                )}
                                                            </span>
                                                        )}
                                                        <CalendarIcon className='h-4 w-4 opacity-35' />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className='w-auto p-0'>
                                                    <Calendar
                                                        mode='single'
                                                        selected={date}
                                                        onSelect={setDate}
                                                        initialFocus
                                                        className='bg-dark-4 rounded-2xl'
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </FormControl>
                                        <FormMessage className='shad-form_message' />
                                    </FormItem>
                                )}
                            />
                        </>
                    )}
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
                        disabled={
                            isLoadingCreate ||
                            isLoadingUpdate ||
                            !selectedTraining
                        }
                    >
                        {action} votre entraînement
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default TrainingForm;
