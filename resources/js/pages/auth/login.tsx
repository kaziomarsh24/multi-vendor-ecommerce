import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

interface LoginProps {
    status?: string;
    canResetPassword?: boolean;
}

export default function Login({ status }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: 'admin@csn.com',
        password: 'password',
        remember: true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/login', {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="bg-gray-1 min-h-screen flex items-center justify-center p-4 sm:p-6 font-sans text-dark">
            <Head title="Sign In | CSN E-Commerce" />

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
                        <h1 className="text-2xl font-bold text-dark">Sign In</h1>
                        <p className="text-xs text-dark-4">Enter your credentials to access your account.</p>
                    </div>

                    {/* Status Alert */}
                    {status && (
                        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs">
                            {status}
                        </div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5 text-xs">
                            <label htmlFor="email" className="block font-semibold text-dark">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                required
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full px-4 py-2.5 bg-white border border-gray-3 rounded-lg text-dark text-sm outline-none focus:border-blue transition"
                            />
                            {errors.email && <span className="text-red text-xs">{errors.email}</span>}
                        </div>

                        <div className="space-y-1.5 text-xs">
                            <label htmlFor="password" className="block font-semibold text-dark">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                required
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="w-full px-4 py-2.5 bg-white border border-gray-3 rounded-lg text-dark text-sm outline-none focus:border-blue transition"
                            />
                            {errors.password && <span className="text-red text-xs">{errors.password}</span>}
                        </div>

                        <div className="flex items-center justify-between text-xs pt-0.5">
                            <label className="flex items-center gap-2 cursor-pointer text-dark-3">
                                <input
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="w-4 h-4 rounded border-gray-3 text-blue"
                                />
                                <span>Remember me</span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-3 rounded-lg bg-blue hover:bg-blue-dark text-white font-semibold text-xs transition cursor-pointer shadow-2xs disabled:opacity-70"
                        >
                            {processing ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="pt-2 text-center space-y-3">
                        <div className="text-xs text-dark-3">
                            Don't have an account?{' '}
                            <Link href="/register" className="font-semibold text-blue hover:underline">
                                Create an account
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
