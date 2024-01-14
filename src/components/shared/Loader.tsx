type Props = {
    size?: 'sm' | 'lg';
};

const Loader = ({ size }: Props) => {
    return (
        <div className='flex-center w-full'>
            <img
                src={`${
                    size === 'sm'
                        ? '/assets/icons/loader-white.svg'
                        : '/assets/icons/loader.svg'
                }`}
                alt='loader'
                width={size === 'sm' ? 24 : 84}
                height={size === 'sm' ? 24 : 84}
            />
        </div>
    );
};

export default Loader;
