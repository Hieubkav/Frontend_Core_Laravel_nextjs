import Link from 'next/link';
import { ArrowRight, Code2, Zap, Lock, BookOpen } from 'lucide-react';

export const metadata = {
    title: 'Core - Nền tảng quản lý hiện đại',
    description: 'Hệ thống tách biệt site public và khu vực admin bằng Next.js & Laravel',
};

export default function Home() {
    return (
        <div className="min-h-screen bg-white">
            {/* Navigation */}
            <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
                <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700" />
                            <span className="font-semibold text-gray-900">Core</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Link
                                href="/login"
                                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition"
                            >
                                Đăng nhập
                            </Link>
                            <Link
                                href="/admin"
                                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
                            >
                                Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <main>
                {/* Hero Section */}
                <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
                    <div className="space-y-6 text-center">
                        <div>
                            <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-200">
                                Tách biệt site & admin
                            </span>
                        </div>
                        <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-tight text-gray-900 sm:text-5xl sm:leading-tight">
                            Nền tảng quản lý <span className="text-blue-600">hiện đại</span> cho ứng dụng của bạn
                        </h1>
                        <p className="mx-auto max-w-2xl text-lg text-gray-600">
                            Thiết kế đơn giản, mạnh mẽ. Trang công khai cho người dùng, khu vực quản trị riêng biệt cho admin. Built with Next.js & Laravel.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4 pt-4">
                            <Link
                                href="/admin"
                                className="group inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 transition"
                            >
                                Vào Dashboard
                                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition" />
                            </Link>
                            <Link
                                href="/docs"
                                className="inline-flex items-center gap-2 rounded-lg border border-amber-200 px-6 py-3 font-medium text-amber-700 hover:border-amber-300 hover:bg-amber-50 transition"
                            >
                                <BookOpen className="h-4 w-4" />
                                API Documentation
                            </Link>
                            <Link
                                href="#features"
                                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-6 py-3 font-medium text-gray-900 hover:border-gray-300 hover:bg-gray-50 transition"
                            >
                                Tìm hiểu thêm
                            </Link>
                        </div>
                    </div>

                    {/* Visual Demo Box */}
                    <div className="mt-16 rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-8 sm:p-12">
                        <div className="grid gap-6 sm:grid-cols-2">
                            <div className="rounded-xl bg-white p-6 ring-1 ring-gray-200">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                                        <span className="text-sm font-semibold text-blue-600">S</span>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-gray-500 uppercase">Site</p>
                                        <p className="font-semibold text-gray-900">Trang công khai</p>
                                    </div>
                                </div>
                                <p className="mt-3 text-sm text-gray-600">
                                    Nơi khách hàng, người dùng tương tác với sản phẩm hoặc dịch vụ của bạn.
                                </p>
                            </div>

                            <div className="rounded-xl bg-white p-6 ring-1 ring-gray-200">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                                        <span className="text-sm font-semibold text-emerald-600">A</span>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-gray-500 uppercase">Admin</p>
                                        <p className="font-semibold text-gray-900">Khu vực quản trị</p>
                                    </div>
                                </div>
                                <p className="mt-3 text-sm text-gray-600">
                                    Riêng biệt, an toàn. Chỉ dành cho những người có quyền quản lý.
                                </p>
                            </div>

                            <div className="rounded-xl bg-white p-6 ring-1 ring-gray-200">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
                                        <span className="text-sm font-semibold text-amber-600">A</span>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-gray-500 uppercase">API</p>
                                        <p className="font-semibold text-gray-900">Backend riêng biệt</p>
                                    </div>
                                </div>
                                <p className="mt-3 text-sm text-gray-600">
                                    Laravel API đủ mạnh để phục vụ cả site lẫn admin một cách hiệu quả.
                                </p>
                            </div>

                            <div className="rounded-xl bg-white p-6 ring-1 ring-gray-200">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                                        <span className="text-sm font-semibold text-purple-600">🔧</span>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-gray-500 uppercase">Next.js</p>
                                        <p className="font-semibold text-gray-900">Framework modern</p>
                                    </div>
                                </div>
                                <p className="mt-3 text-sm text-gray-600">
                                    React 19, Server Components, routing tự động. Nhanh mạnh hiệu quả.
                                </p>
                            </div>

                            <div className="rounded-xl bg-white p-6 ring-1 ring-gray-200">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-100">
                                        <BookOpen className="h-6 w-6 text-rose-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-gray-500 uppercase">Docs</p>
                                        <p className="font-semibold text-gray-900">API Documentation</p>
                                    </div>
                                </div>
                                <p className="mt-3 text-sm text-gray-600">
                                    Tài liệu chi tiết mọi endpoint. Dễ dàng integrate và phát triển.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="border-t border-gray-200 bg-gray-50 py-20 sm:py-28">
                    <div className="mx-auto max-w-6xl px-4 sm:px-6">
                        <div className="mb-16 text-center">
                            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                                Tại sao chọn Core?
                            </h2>
                            <p className="mt-4 text-lg text-gray-600">
                                Thiết kế bài bản, đơn giản nhưng đủ mạnh cho ứng dụng thực tế.
                            </p>
                        </div>

                        <div className="grid gap-8 sm:grid-cols-3">
                            <div className="space-y-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                                    <Code2 className="h-6 w-6 text-blue-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Kiến trúc rõ ràng
                                </h3>
                                <p className="text-gray-600">
                                    Tách biệt site, admin và API. Dễ hiểu, dễ phát triển, dễ bảo trì.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100">
                                    <Zap className="h-6 w-6 text-emerald-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Hiệu suất cao
                                </h3>
                                <p className="text-gray-600">
                                    Next.js App Router, Server Components, caching tối ưu. Nhanh chóng.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100">
                                    <Lock className="h-6 w-6 text-amber-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    An toàn
                                </h3>
                                <p className="text-gray-600">
                                    Admin riêng biệt, authentication rõ ràng, quyền hạn chi tiết.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                        Sẵn sàng bắt đầu?
                    </h2>
                    <p className="mt-4 text-lg text-gray-600">
                        Truy cập dashboard quản trị hoặc khám phá các tính năng.
                    </p>
                    <div className="mt-8 flex flex-wrap justify-center gap-4">
                        <Link
                            href="/admin"
                            className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 transition"
                        >
                            Vào Dashboard
                        </Link>
                        <Link
                            href="/docs"
                            className="rounded-lg border border-amber-200 px-6 py-3 font-medium text-amber-700 hover:border-amber-300 hover:bg-amber-50 transition"
                        >
                            <BookOpen className="h-4 w-4 inline mr-2" />
                            Xem API Docs
                        </Link>
                        <Link
                            href="/login"
                            className="rounded-lg border border-gray-200 px-6 py-3 font-medium text-gray-900 hover:border-gray-300 hover:bg-gray-50 transition"
                        >
                            Đăng nhập
                        </Link>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-gray-200 bg-gray-50 py-8">
                <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
                    <p className="text-sm text-gray-600">
                        © 2025 Core Platform. Xây dựng với Next.js & Laravel.
                    </p>
                </div>
            </footer>
        </div>
    );
}
