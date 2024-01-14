import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';

import SigninForm from './_auth/forms/SigninForm';
import SignupForm from './_auth/forms/SignupForm';
import AuthLayout from './_auth/AuthLayout';
import RootLayout from './_root/RootLayout';
import {
    CreateTraining,
    Home,
    Profile,
    Standings,
    UpdateProfile,
    UpdateTraining,
    Users,
} from './_root/pages';

import './globals.css';

const App = () => {
    return (
        <main className='flex h-screen'>
            <Routes>
                {/* Public routes */}
                <Route element={<AuthLayout />}>
                    <Route path='/sign-in' element={<SigninForm />} />
                    <Route path='/sign-up' element={<SignupForm />} />
                </Route>

                {/* Private routes */}
                <Route element={<RootLayout />}>
                    <Route index element={<Home />} />
                    <Route path='/users' element={<Users />} />
                    <Route path='/standings' element={<Standings />} />
                    <Route path='/create' element={<CreateTraining />} />
                    <Route path='/update/:id' element={<UpdateTraining />} />
                    <Route path='/profile/:id/*' element={<Profile />} />
                    <Route
                        path='/update-profile/:id'
                        element={<UpdateProfile />}
                    />
                </Route>
            </Routes>

            <Toaster />
        </main>
    );
};

export default App;
