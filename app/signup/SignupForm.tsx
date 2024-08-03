"use client";

import { useFormState } from "react-dom";
import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { Button } from "../uil/Button";
import { signup, SignUpState } from "../lib/actions";

const initialState: SignUpState = {
  message: undefined,
  errors: { email: undefined, name: undefined, password: undefined },
};

function FieldErrors({
  errors,
  id,
}: {
  errors: string[] | undefined;
  id: string;
}) {
  return (
    <div id={id} aria-live="polite" aria-atomic="true">
      {errors &&
        errors.map((error: string) => (
          <p className="mt-2 text-sm text-red-500" key={error}>
            {error}
          </p>
        ))}
    </div>
  );
}

export default function LoginForm() {
  const [state, formAction, isPending] = useFormState(signup, initialState);

  return (
    <form action={formAction} className="space-y-3 w-3/6 max-w-2xl" noValidate>
      <h1 className="mb-3 text-2xl">Please sign up to continue</h1>
      <div className="w-full">
        <div className="mt-4">
          <div className="relative">
            <input
              className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500 text-gray-900"
              id="name"
              name="name"
              placeholder="Enter your name"
              aria-describedby="name-error"
            />
            {/* <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" /> */}
          </div>
          <FieldErrors errors={state.errors?.name} id="name-error" />
        </div>
        <div className="mt-4">
          <div className="relative">
            <input
              className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500 text-gray-900"
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email address"
              aria-describedby="email-error"
            />
            <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
          <FieldErrors errors={state.errors?.email} id="email-error" />
        </div>
        <div className="mt-4">
          <div className="relative">
            <input
              className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500 text-gray-900"
              id="password"
              type="password"
              name="password"
              placeholder="Enter password"
              aria-describedby="password-error"
            />
            <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
          <FieldErrors errors={state.errors?.password} id="password-error" />
        </div>
      </div>
      <Button className="mt-4 w-full" disabled={isPending}>
        Sign up <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
      </Button>
      <div className="flex h-8 items-end space-x-1">
        {state.message && (
          <>
            <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
            <p className="text-sm text-red-500">{state.message}</p>
          </>
        )}
      </div>
    </form>
  );
}
