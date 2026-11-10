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
        <div className="flex min-h-screen items-center justify-center bg-gray-1 p-4 font-sans text-dark sm:p-6">
            <Head title="Sign In | CSN E-Commerce" />

            <div className="w-full max-w-[480px]">
                <div className="space-y-6 rounded-2xl border border-gray-3 bg-white p-8 shadow-sm sm:p-10">
                    {/* Header */}
                    <div className="space-y-2 text-center">
                        <Link href="/" className="mb-2 inline-block">
                            <img
                                src="/images/logo/csn_logo_transparent.png"
                                alt="CSN Bangladesh Ltd."
                                className="mx-auto h-10 object-contain"
                            />
                        </Link>
                        <h1 className="text-2xl font-bold text-dark">
                            Sign In
                        </h1>
                        <p className="text-xs text-dark-4">
                            Enter your credentials to access your account.
                        </p>
                    </div>

                    {/* Status Alert */}
                    {status && (
                        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800">
                            {status}
                        </div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5 text-xs">
                            <label
                                htmlFor="email"
                                className="block font-semibold text-dark"
                            >
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                required
                                value={data.email}
                                onChange={(e) =>
                                    setData('email', e.target.value)
                                }
                                className="w-full rounded-lg border border-gray-3 bg-white px-4 py-2.5 text-sm text-dark transition outline-none focus:border-blue"
                            />
                            {errors.email && (
                                <span className="text-xs text-red">
                                    {errors.email}
                                </span>
                            )}
                        </div>

                        <div className="space-y-1.5 text-xs">
                            <label
                                htmlFor="password"
                                className="block font-semibold text-dark"
                            >
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                required
                                value={data.password}
                                onChange={(e) =>
                                    setData('password', e.target.value)
                                }
                                className="w-full rounded-lg border border-gray-3 bg-white px-4 py-2.5 text-sm text-dark transition outline-none focus:border-blue"
                            />
                            {errors.password && (
                                <span className="text-xs text-red">
                                    {errors.password}
                                </span>
                            )}
                        </div>

                        <div className="flex items-center justify-between pt-0.5 text-xs">
                            <label className="flex cursor-pointer items-center gap-2 text-dark-3">
                                <input
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) =>
                                        setData('remember', e.target.checked)
                                    }
                                    className="h-4 w-4 rounded border-gray-3 text-blue"
                                />
                                <span>Remember me</span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full cursor-pointer rounded-lg bg-blue py-3 text-xs font-semibold text-white shadow-2xs transition hover:bg-blue-dark disabled:opacity-70"
                        >
                            {processing ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="space-y-3 pt-2 text-center">
                        <div className="text-xs text-dark-3">
                            Don't have an account?{' '}
                            <Link
                                href="/register"
                                className="font-semibold text-blue hover:underline"
                            >
                                Create an account
                            </Link>
                        </div>
                        <div>
                            <Link
                                href="/"
                                className="text-xs text-dark-4 transition hover:text-dark"
                            >
                                &larr; Back to Storefront
                            </Link>
                        </div>
                        <div className="border-t border-gray-100 pt-2 text-[11px] text-dark-4">
                            Developed by{' '}
                            <a
                                href="https://kaziomar.vercel.app"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-semibold text-dark underline decoration-gray-300 underline-offset-4 transition hover:text-blue"
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
