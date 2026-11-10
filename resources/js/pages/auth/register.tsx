import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/register', {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="bg-gray-1 min-h-screen flex items-center justify-center p-4 sm:p-6 font-sans text-dark">
            <Head title="Create Account | CSN Platform" />

            <div className="max-w-[480px] w-full">
                <div className="bg-white rounded-2xl border border-gray-3 p-8 sm:p-10 shadow-sm space-y-6">
                    {/* Header */}
                    <div className="text-center space-y-2">
                        <Link href="/" className="inline-block mb-2">
                            <img
                                src="/images/logo/csn_logo_transparent.png"
                                alt="CSN Bangladesh Ltd."
                                className="h-10 mx-auto object-contain"
                            />
                        </Link>
                        <h1 className="text-2xl font-bold text-dark">Create Account</h1>
                        <p className="text-xs text-dark-4">Sign up to buy authentic tech from verified local shops.</p>
                    </div>

                    {/* Register Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5 text-xs">
                            <label htmlFor="name" className="block font-semibold text-dark">
                                Full Name <span className="text-rose-600">*</span>
                            </label>
                            <input
                                type="text"
                                id="name"
                                required
                                autoFocus
                                placeholder="e.g. Mahfuz Rahman"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full px-4 py-2.5 bg-white border border-gray-3 rounded-lg text-dark text-sm outline-none focus:border-blue transition"
                            />
                            {errors.name && <span className="text-red text-xs">{errors.name}</span>}
                        </div>

                        <div className="space-y-1.5 text-xs">
                            <label htmlFor="email" className="block font-semibold text-dark">
                                Email Address <span className="text-rose-600">*</span>
                            </label>
                            <input
                                type="email"
                                id="email"
                                required
                                placeholder="name@example.com"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full px-4 py-2.5 bg-white border border-gray-3 rounded-lg text-dark text-sm outline-none focus:border-blue transition"
                            />
                            {errors.email && <span className="text-red text-xs">{errors.email}</span>}
                        </div>

                        <div className="space-y-1.5 text-xs">
                            <label htmlFor="password" className="block font-semibold text-dark">
                                Password <span className="text-rose-600">*</span>
                            </label>
                            <input
                                type="password"
                                id="password"
                                required
                                placeholder="Min 8 characters"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="w-full px-4 py-2.5 bg-white border border-gray-3 rounded-lg text-dark text-sm outline-none focus:border-blue transition"
                            />
                            {errors.password && <span className="text-red text-xs">{errors.password}</span>}
                        </div>

                        <div className="space-y-1.5 text-xs">
                            <label htmlFor="password_confirmation" className="block font-semibold text-dark">
                                Confirm Password <span className="text-rose-600">*</span>
                            </label>
                            <input
                                type="password"
                                id="password_confirmation"
                                required
                                placeholder="Repeat your password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                className="w-full px-4 py-2.5 bg-white border border-gray-3 rounded-lg text-dark text-sm outline-none focus:border-blue transition"
                            />
                            {errors.password_confirmation && (
                                <span className="text-red text-xs">{errors.password_confirmation}</span>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-3 rounded-lg bg-blue hover:bg-blue-dark text-white font-semibold text-xs transition cursor-pointer shadow-2xs disabled:opacity-70 mt-2"
                        >
                            {processing ? 'Creating Account...' : 'Register Account'}
                        </button>
                    </form>

                    <div className="pt-2 text-center space-y-3">
                        <div className="text-xs text-dark-3">
                            Already have an account?{' '}
                            <Link href="/login" className="font-semibold text-blue hover:underline">
                                Sign In
                            </Link>
                        </div>
                        <div>
                            <Link href="/" className="text-xs text-dark-4 hover:text-dark transition">
                                &larr; Back to Storefront
                            </Link>
                        </div>
                        <div className="text-[11px] text-dark-4 pt-2 border-t border-gray-100">
                            Developed by{' '}
                            <a
                                href="https://kaziomar.vercel.app"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-semibold text-dark hover:text-blue transition underline decoration-gray-300 underline-offset-4"
                            >
                                Kazi Omar Faruk
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
