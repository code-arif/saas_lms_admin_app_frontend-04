import { useState, useRef, type KeyboardEvent, type ClipboardEvent } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ArrowLeft, Loader2, Shield } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { authService } from '@/features/auth/services/authService';

const OTP_LENGTH = 6;

const OtpVerificationPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const email = searchParams.get('email') || '';

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-advance to next input
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pastedData) return;

    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);

    // Focus the next empty or last input
    const nextIndex = Math.min(pastedData.length, OTP_LENGTH - 1);
    inputRefs.current[nextIndex]?.focus();
  };

  const verifyOtpMutation = useMutation({
    mutationFn: (otpCode: string) => authService.verifyOtp({ email, otp: otpCode }),
    onSuccess: (response, otpCode) => {
      if (response.success) {
        toast.success('OTP verified successfully');
        navigate(`/reset-password?email=${encodeURIComponent(email)}&otp=${otpCode}`);
      } else {
        toast.error(response.message || 'Invalid OTP');
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Verification failed');
    },
  });

  const resendMutation = useMutation({
    mutationFn: () => authService.forgotPassword({ email }),
    onSuccess: (response) => {
      if (response.success) {
        toast.success('A new code has been sent to your email');
      } else {
        toast.error(response.message || 'Failed to resend code');
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to resend code');
    },
  });

  const onSubmit = () => {
    const otpCode = otp.join('');
    if (otpCode.length !== OTP_LENGTH) {
      toast.error('Please enter the complete 6-digit code');
      return;
    }
    verifyOtpMutation.mutate(otpCode);
  };

  if (!email) {
    return (
      <div className="space-y-6 text-center">
        <Shield className="h-12 w-12 mx-auto text-destructive" />
        <p className="text-muted-foreground">No email provided. Please start the forgot password process again.</p>
        <Button asChild>
          <Link to="/forgot-password">Go to Forgot Password</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <Shield className="h-10 w-10 mx-auto text-primary" />
        <h1 className="text-3xl font-bold">Verify OTP</h1>
        <p className="text-muted-foreground">
          Enter the 6-digit code sent to <span className="font-medium text-foreground">{email}</span>
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <Label className="text-center block">6-digit verification code</Label>
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            {otp.map((digit, index) => (
              <Input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className="w-10 sm:w-12 h-12 sm:h-14 text-center text-lg font-bold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            ))}
          </div>
        </div>

        <Button
          type="button"
          className="w-full"
          disabled={verifyOtpMutation.isPending}
          onClick={onSubmit}
        >
          {verifyOtpMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            'Verify Code'
          )}
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <Link
          to="/forgot-password"
          className="inline-flex items-center text-sm text-primary hover:underline gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          Change email
        </Link>
        <button
          type="button"
          className="text-sm text-primary hover:underline disabled:opacity-50"
          disabled={resendMutation.isPending}
          onClick={() => resendMutation.mutate()}
        >
          {resendMutation.isPending ? 'Sending...' : 'Resend code'}
        </button>
      </div>
    </div>
  );
};

export default OtpVerificationPage;
