'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CopyButtonProps {
  value: string;
  field?: string;
  className?: string;
  variant?: 'default' | 'ghost' | 'outline';
}

export default function CopyButton({ 
  value, 
  field = 'Valor', 
  className = '',
  variant = 'ghost'
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  return (
    <Button
      variant={variant}
      size="sm"
      onClick={handleCopy}
      className={className}
      title={`Copiar ${field}`}
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 mr-1" />
          Copiado
        </>
      ) : (
        <>
          <Copy className="w-4 h-4 mr-1" />
          Copiar
        </>
      )}
    </Button>
  );
}