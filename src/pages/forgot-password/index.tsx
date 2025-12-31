import React, { useState } from 'react';
import { Mail, ArrowLeft, Send, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const ForgotPasswordPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Password reset requested for:', email);
        setIsSubmitted(true);
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#0f172a] relative overflow-hidden font-sans">
            {/* Background decorative elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />

            <div className="w-full max-w-md p-8 relative">
                {/* Logo & Brand */}
                <div className="text-center mb-10">
                    <Link to="/" className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-tr from-blue-600 to-indigo-600 mb-6 shadow-xl shadow-blue-500/20 hover:scale-105 transition-transform">
                        <Mail className="w-8 h-8 text-white" />
                    </Link>
                    <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Reset Password</h1>
                    <p className="text-slate-400">Enter your email and we'll send you a link to reset your password</p>
                </div>

                {/* Card */}
                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl shadow-2xl">
                    {!isSubmitted ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Email Field */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300 ml-1">Email Address</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-500 text-slate-500">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full pl-11 pr-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                                        placeholder="name@example.com"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full flex items-center justify-center gap-2 py-3.5 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-all group"
                            >
                                Send Reset Link
                                <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </button>

                            <Link
                                to="/"
                                className="flex items-center justify-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors group py-2"
                            >
                                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                Back to Log In
                            </Link>
                        </form>
                    ) : (
                        <div className="text-center py-4 space-y-6 animate-in fade-in zoom-in duration-500">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 text-green-500 mb-2">
                                <CheckCircle2 className="w-10 h-10" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-xl font-bold text-white">Check your email</h2>
                                <p className="text-slate-400">
                                    We've sent a password reset link to <span className="text-blue-400 font-medium">{email}</span>
                                </p>
                            </div>
                            <Link
                                to="/"
                                className="inline-flex items-center justify-center gap-2 text-blue-500 font-semibold hover:text-blue-400 transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to Log In
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
