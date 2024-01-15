import { useSignOutAccount } from '@/lib/react-query/queriesAndMutations';
import { useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { useUserContext } from '@/context/AuthContext';
import { CONTACT_EMAIL, topbarLinks } from '@/constants';
import { INavLink } from '@/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconName } from '@fortawesome/fontawesome-svg-core';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';

const Topbar = () => {
    const { pathname } = useLocation();
    const { mutate: signOut, isSuccess } = useSignOutAccount();
    const navigate = useNavigate();

    const { user } = useUserContext();

    useEffect(() => {
        if (isSuccess) navigate(0);
    }, [isSuccess]);

    library.add(fas);

    return (
        <>
            <div className='w-full h-24 bg-dark-2 top-0 left-0 block'></div>
            <div className='w-full h-24 p-4 bg-dark-2 flex items-center justify-between fixed top-0 left-0 z-50'>
                <Link
                    to={'/'}
                    className='flex gap-3 items-center justify-center'
                >
                    <img src='/assets/images/logo.png' alt='logo' width={50} />
                </Link>
                <ul className='flex gap-6 ml-24'>
                    {topbarLinks.map((link: INavLink) => {
                        const isActive = pathname === link.route;
                        const isCreate = link.route === '/create-post';

                        return (
                            <li
                                key={link.label}
                                className={`leftsidebar-link group ${
                                    isActive && 'bg-primary-500'
                                } ${isCreate && 'bg-dark-3'}`}
                            >
                                <NavLink
                                    to={link.route}
                                    className='flex gap-4 items-center p-4'
                                >
                                    <FontAwesomeIcon
                                        icon={['fas', link.img as IconName]}
                                        className={`group-hover:invert-white text-light-3 transition ${
                                            isActive && 'invert-white'
                                        }`}
                                    />
                                    {link.label}
                                </NavLink>
                            </li>
                        );
                    })}
                    <hr className='border h-14 border-dark-4/80 mr-6' />
                    <li className='leftsidebar-link bg-dark-4'>
                        <NavLink
                            to={user.id ? '/create' : '/sign-in'}
                            className='flex gap-4 items-center p-4'
                        >
                            <FontAwesomeIcon
                                icon={['fas', 'add']}
                                className='group-hover:invert-white transition'
                            />
                            Ajouter
                        </NavLink>
                    </li>
                </ul>
                <div className='flex'>
                    <Link to={`mailto:${CONTACT_EMAIL}`} title='Contacter'>
                        <FontAwesomeIcon
                            icon={['fas', 'envelope']}
                            className='fa-xl px-6 py-6 mr-5 opacity-35 bg-dark-3 rounded-full hover:opacity-100 transition'
                        />
                    </Link>
                    {user.id ? (
                        <div className='flex items-center'>
                            <div className='flex items-center w-60 px-5 py-3 bg-dark-3 hover:bg-dark-4 transition rounded-full'>
                                <Link
                                    to={`/profile/${user.id}`}
                                    className='flex gap-3 items-center'
                                >
                                    <img
                                        src={
                                            user.imageUrl ||
                                            '/assets/images/profile.png'
                                        }
                                        alt='profile picture'
                                        className='h-10 w-10 rounded-full object-cover'
                                    />
                                    <div className='flex flex-col'>
                                        <p className='body-bold truncate w-28'>
                                            {user.name}
                                        </p>
                                        <p className='small-regular text-light-3 truncate w-28 mr-12'>
                                            @{user.username}
                                        </p>
                                    </div>
                                </Link>
                                <Button
                                    variant='ghost'
                                    className='shad-button_ghost hover:opacity-35 p-0 m-0 transition'
                                    onClick={() => signOut()}
                                >
                                    <FontAwesomeIcon
                                        icon={['fas', 'right-from-bracket']}
                                        className='fa-xl text-primary-500'
                                    />
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className='leftsidebar-link bg-primary-500 hover:bg-dark-4 h-14 mt-2'>
                            <NavLink
                                to='/sign-in'
                                className='flex gap-4 justify-center items-center w-52 py-4'
                            >
                                <FontAwesomeIcon
                                    icon={['fas', 'right-to-bracket']}
                                    className='fa-xl'
                                />
                                Se connecter
                            </NavLink>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Topbar;
