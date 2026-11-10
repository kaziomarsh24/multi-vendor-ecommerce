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
        <div className="flex min-h-screen items-center justify-center bg-gray-1 p-4 font-sans text-dark sm:p-6">
            <Head title="Create Account | CSN Platform" />

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
                            Create Account
                        </h1>
                        <p className="text-xs text-dark-4">
                            Sign up to buy authentic tech from verified local
                            shops.
                        </p>
                    </div>

                    {/* Register Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5 text-xs">
                            <label
                                htmlFor="name"
                                className="block font-semibold text-dark"
                            >
                                Full Name{' '}
                                <span className="text-rose-600">*</span>
                            </label>
                            <input
                                type="text"
                                id="name"
                                required
                                autoFocus
                                placeholder="e.g. Mahfuz Rahman"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                className="w-full rounded-lg border border-gray-3 bg-white px-4 py-2.5 text-sm text-dark transition outline-none focus:border-blue"
                            />
                            {errors.name && (
                                <span className="text-xs text-red">
                                    {errors.name}
                                </span>
                            )}
                        </div>

                        <div className="space-y-1.5 text-xs">
                            <label
                                htmlFor="email"
                                className="block font-semibold text-dark"
                            >
                                Email Address{' '}
                                <span className="text-rose-600">*</span>
                            </label>
                            <input
                                type="email"
                                id="email"
                                required
                                placeholder="name@example.com"
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
                                Password{' '}
                                <span className="text-rose-600">*</span>
                            </label>
                            <input
                                type="password"
                                id="password"
                                required
                                placeholder="Min 8 characters"
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

                        <div className="space-y-1.5 text-xs">
                            <label
                                htmlFor="password_confirmation"
                                className="block font-semibold text-dark"
                            >
                                Confirm Password{' '}
                                <span className="text-rose-600">*</span>
                            </label>
                            <input
                                type="password"
                                id="password_confirmation"
                                required
                                placeholder="Repeat your password"
                                value={data.password_confirmation}
                                onChange={(e) =>
                                    setData(
                                        'password_confirmation',
                                        e.target.value,
                                    )
                                }
                                className="w-full rounded-lg border border-gray-3 bg-white px-4 py-2.5 text-sm text-dark transition outline-none focus:border-blue"
                            />
                            {errors.password_confirmation && (
                                <span className="text-xs text-red">
                                    {errors.password_confirmation}
                                </span>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="mt-2 w-full cursor-pointer rounded-lg bg-blue py-3 text-xs font-semibold text-white shadow-2xs transition hover:bg-blue-dark disabled:opacity-70"
                        >
                            {processing
                                ? 'Creating Account...'
                                : 'Register Account'}
                        </button>
                    </form>

                    <div className="space-y-3 pt-2 text-center">
                        <div className="text-xs text-dark-3">
                            Already have an account?{' '}
                            <Link
                                href="/login"
                                className="font-semibold text-blue hover:underline"
                            >
                                Sign In
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
