import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, XCircle } from 'lucide-react';
import { ValidationResult } from './types';

interface ValidationStatusProps {
  validation: ValidationResult;
  template: any;
}

export function ValidationStatus({ validation, template }: ValidationStatusProps) {
  if (validation.errors.length > 0 || validation.warnings.length > 0) {
    return (
      <Card className={`mb-6 border-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md shadow-sm ${validation.isValid ? 'border-yellow-200' : 'border-red-200'}`}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {validation.isValid ? (
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
            )}
            <div className="flex-1">
              <h4 className={`font-semibold ${validation.isValid ? 'text-green-700' : 'text-red-700'}`}>
                {validation.isValid ? 'Template is Valid' : 'Template Validation Failed'}
              </h4>
              
              {validation.errors.length > 0 && (
                <div className="mt-2">
                  <h5 className="text-sm font-medium text-red-700">Errors:</h5>
                  <ul className="text-sm text-red-600 list-disc list-inside space-y-1">
                    {validation.errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {validation.warnings.length > 0 && (
                <div className="mt-2">
                  <h5 className="text-sm font-medium text-yellow-700">Warnings:</h5>
                  <ul className="text-sm text-yellow-600 list-disc list-inside space-y-1">
                    {validation.warnings.map((warning, index) => (
                      <li key={index}>{warning}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (template) {
    return (
      <Card className="mb-6 border-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md shadow-sm border-green-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 text-green-700">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">Template is valid and ready to use</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
}