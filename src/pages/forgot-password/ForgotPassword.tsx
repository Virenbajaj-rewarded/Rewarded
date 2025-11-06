import { Card, CardTitle, CardDescription } from '@/components/ui/card';

const ForgotPassword = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md p-4">
        <CardTitle className="text-2xl text-center mb-10">
          Forgot password
        </CardTitle>
        <CardDescription className="text-xl text-center mb-10">
          Enter your email to reset your password
        </CardDescription>
      </Card>
    </div>
  );
};

export default ForgotPassword;
