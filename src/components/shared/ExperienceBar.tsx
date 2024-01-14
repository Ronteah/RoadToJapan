import { baseXpByLevel, xpByLevelMultiplier } from '@/constants';
import ProgressBar from '@ramonak/react-progress-bar';
import { Models } from 'appwrite';

type Props = {
    user: Models.Document;
};

const ExperienceBar = ({ user }: Props) => {
    const xpToNextLevel = (level: number): number => {
        if (level <= 0) {
            return baseXpByLevel;
        }
        return Math.round(xpToNextLevel(level - 1) * xpByLevelMultiplier);
    };

    const xpTotalToNextLevel = (level: number): number => {
        if (level <= 0) {
            return baseXpByLevel;
        }
        return (
            Math.round(xpToNextLevel(level - 1) * xpByLevelMultiplier) +
            xpTotalToNextLevel(level - 1)
        );
    };

    const xpBarValue = (level: number): number => {
        if (level === 0) {
            return Math.round((user.xp / xpToNextLevel(user.level)) * 100);
        }
        return Math.round(
            ((user.xp - xpTotalToNextLevel(level - 1)) /
                xpToNextLevel(user.level)) *
                100
        );
    };

    return (
        <div className='w-full pr-14 h-8'>
            <div className='pb-2 flex gap-5'>
                <p>
                    <strong>Niveau {user.level}</strong>
                </p>
                <p className='opacity-35'>{`${user.xp}/${xpTotalToNextLevel(
                    user.level
                )} XP (${xpBarValue(user.level)}%)`}</p>
            </div>
            <ProgressBar
                completed={xpBarValue(user.level)}
                barContainerClassName='bg-dark-4 rounded-full'
                borderRadius='100px'
                isLabelVisible={false}
                bgColor='#E30613'
            />
        </div>
    );
};

export default ExperienceBar;
