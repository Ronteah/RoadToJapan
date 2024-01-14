import Topbar from '@/components/shared/Topbar';
import { Outlet } from 'react-router-dom';

const RootLayout = () => {
    return (
        <div className='w-full'>
            <Topbar />

            <section className='flex flex-1 h-auto w-full justify-center'>
                <Outlet />
            </section>
        </div>
    );
};

export default RootLayout;
