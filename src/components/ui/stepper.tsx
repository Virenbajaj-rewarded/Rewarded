import * as React from 'react';
import { Check, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Step {
  id: string;
  label: string;
}

export interface StepperProps {
  steps: Step[];
  currentStep: number;
  className?: string;
  onStepClick?: (step: number) => void;
}

const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  ({ steps, currentStep, className, onStepClick }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex items-center justify-center gap-4', className)}
      >
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => onStepClick?.(index + 1)}
            >
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors',
                  currentStep === index + 1
                    ? 'bg-primary border-primary'
                    : currentStep > index + 1
                      ? 'bg-primary border-primary'
                      : 'bg-transparent border-muted-foreground'
                )}
              >
                {currentStep > index + 1 ? (
                  <Check className="w-5 h-5 text-primary-foreground" />
                ) : (
                  <span className="text-sm font-semibold">{index + 1}</span>
                )}
              </div>
              <span
                className={cn(
                  'text-sm font-medium',
                  currentStep === index + 1
                    ? 'text-primary'
                    : 'text-muted-foreground'
                )}
              >
                {step.label}
              </span>
            </div>

            {index < steps.length - 1 && (
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  }
);
Stepper.displayName = 'Stepper';

export { Stepper };
