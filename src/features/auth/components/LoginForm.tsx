/**
 * features/auth/components/LoginForm.tsx
 *
 * The login form — connects React Hook Form, Zod, and RTK Query together.
 *
 * Flow:
 *   1. User fills in email + password
 *   2. On submit, Zod validates the values (via zodResolver)
 *   3. If valid, we call the RTK Query `login` mutation (API call)
 *   4. On success, we dispatch the `login` Redux action to save the token
 *   5. On error, we show an error message
 */

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { APP_ROUTES } from "@/lib/constants";
import { APP_TEXT } from "@/lib/messages";
import { useLoginMutation } from "../api/authApi";
import { type LoginFormValues, loginSchema } from "../schemas/auth.schema";
import { login } from "../slice/authSlice";

export function LoginForm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // RTK Query mutation hook
  // `loginUser`  → function to trigger the API call
  // `isLoading`  → true while the request is in flight
  // `error`      → contains error info if the request failed
  const [loginUser, { isLoading, error }] = useLoginMutation();

  // React Hook Form setup
  // `register`       → connects each input to the form
  // `handleSubmit`   → validates then calls our onSubmit
  // `formState`      → contains { errors } for each field
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema), // Zod validates on submit
  });

  // Called by handleSubmit ONLY when all fields pass Zod validation
  const onSubmit = async (values: LoginFormValues) => {
    try {
      // Fire the API call — RTK Query handles the fetch under the hood
      const result = await loginUser(values).unwrap();
      console.log("Login response:", result);

      // Save the returned token + user info to the Redux store
      dispatch(login(result));

      // Redirect to the home page after successful login
      navigate(APP_ROUTES.HOME);
    } catch {
      // Error is already captured by RTK Query in the `error` variable above
      // We just let the UI re-render and show the error message below
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        {APP_TEXT.AUTH.LOGIN_TITLE}
      </h1>

      {/* Show a general API error if the request failed */}
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {APP_TEXT.AUTH.LOGIN_ERROR}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Email field */}
        <Input
          id="email"
          label={APP_TEXT.AUTH.EMAIL_LABEL}
          type="email"
          placeholder={APP_TEXT.AUTH.EMAIL_PLACEHOLDER}
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />

        {/* Password field */}
        <Input
          id="password"
          label={APP_TEXT.AUTH.PASSWORD_LABEL}
          type="password"
          placeholder={APP_TEXT.AUTH.PASSWORD_PLACEHOLDER}
          autoComplete="current-password"
          error={errors.password?.message}
          {...register("password")}
        />

        {/* Submit button — shows loading state while API call is in flight */}
        <Button type="submit" isLoading={isLoading} className="w-full">
          {APP_TEXT.AUTH.SIGN_IN}
        </Button>
      </form>
    </div>
  );
}
