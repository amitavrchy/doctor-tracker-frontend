"use client";

import { Activity, ArrowRight, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState, type FormEvent } from "react";
import { Button, Input, Spinner } from "@/components/ui";
import { useLogin } from "@/hooks/use-auth";
import { ApiError } from "@/lib/api/client";
import { safeNext } from "@/lib/auth/redirect";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const login = useLogin();
  const errorRef = useRef<HTMLParagraphElement>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    login.reset();
    const nextErrors: typeof errors = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      nextErrors.email = "Enter a valid email address.";
    if (!password) nextErrors.password = "Enter your password.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      document
        .getElementById(nextErrors.email ? "login-email" : "login-password")
        ?.focus();
      return;
    }
    try {
      await login.mutateAsync({ email: email.trim(), password });
      router.replace(safeNext(params.get("next") || params.get("callbackUrl")));
      router.refresh();
    } catch {
      /* Error is displayed below. */
    }
  }
  const error = login.error instanceof ApiError ? login.error : null;
  const message =
    error?.status === 401
      ? "The email or password is incorrect."
      : error?.status === 429
        ? "Too many attempts. Please wait 15 minutes and try again."
        : error?.status === 400
          ? "Please check your details and try again."
          : error?.message;
  useEffect(() => {
    if (message) errorRef.current?.focus();
  }, [message, login.error]);
  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-[#103e40] p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="flex items-center gap-3 text-lg font-bold">
          <div className="flex size-11 items-center justify-center rounded-xl bg-white/15">
            <Activity />
          </div>
          Doctor Tracker
        </div>
        <div className="relative z-10 max-w-lg">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-teal-200">
            A clearer view of care
          </p>
          <h1 className="text-5xl leading-[1.12] font-semibold tracking-tight">
            Better care starts with a better overview.
          </h1>
          <p className="mt-6 max-w-md text-base leading-7 text-teal-100/80">
            Bring your doctors and patients together in one thoughtful
            workspace.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-teal-100/70">
          <ShieldCheck size={18} /> A secure space for your care team
        </div>
        <div className="absolute -right-32 -bottom-48 size-[500px] rounded-full border border-white/10" />
        <div className="absolute right-4 -bottom-24 size-[350px] rounded-full border border-white/10" />
      </section>
      <section className="flex items-center justify-center bg-[#f8faf9] px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-12 flex items-center gap-3 font-bold text-slate-900 lg:hidden">
            <div className="flex size-10 items-center justify-center rounded-xl bg-teal-700 text-white">
              <Activity />
            </div>
            Doctor Tracker
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">
            Welcome back
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            Sign in to your account
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            Enter your details to access your care workspace.
          </p>
          {params.get("expired") === "1" && (
            <p
              role="status"
              className="mt-6 rounded-xl bg-amber-50 p-4 text-sm text-amber-800"
            >
              Your session has expired. Please sign in again.
            </p>
          )}
          <form
            onSubmit={submit}
            noValidate
            aria-describedby={message ? "login-error" : undefined}
            className="mt-8 space-y-5"
          >
            <Input
              id="login-email"
              label="Email address"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
            />
            <div className="relative">
              <Input
                id="login-password"
                label="Password"
                type={show ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                className="pr-12"
              />
              <button
                type="button"
                aria-label={show ? "Hide password" : "Show password"}
                aria-pressed={show}
                onClick={() => setShow(!show)}
                className="absolute top-9 right-3 rounded-md p-1 text-slate-500 focus-visible:outline-2 focus-visible:outline-teal-600"
              >
                {show ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>
            {message && (
              <p
                id="login-error"
                ref={errorRef}
                tabIndex={-1}
                role="alert"
                className="rounded-xl bg-red-50 p-4 text-sm text-red-700"
              >
                {message}
              </p>
            )}
            <Button
              type="submit"
              loading={login.isPending}
              size="lg"
              className="w-full"
            >
              Sign in <ArrowRight size={18} />
            </Button>
          </form>
          <p className="mt-8 text-center text-xs text-slate-400">
            Doctor Tracker · Care, thoughtfully connected.
          </p>
        </div>
      </section>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-teal-700">
          <Spinner />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
