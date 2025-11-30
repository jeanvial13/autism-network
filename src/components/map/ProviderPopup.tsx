'use client';

import { MapPin, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ProviderPopupProps {
    provider: any;
    distance?: string;
    onClose: () => void;
}

export default function ProviderPopup({ provider, distance, onClose }: ProviderPopupProps) {
    return (
        <div className="p-1 min-w-[240px] max-w-[280px]">
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-base text-foreground pr-4">{provider.name}</h3>
                {provider.verified && (
                    <CheckCircle className="h-4 w-4 text-blue-500 flex-shrink-0" />
                )}
            </div>

            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                <MapPin className="h-3 w-3" />
                <span>{provider.city}</span>
                {distance && (
                    <span className="font-medium text-primary ml-1">({distance})</span>
                )}
            </div>

            <div className="flex flex-wrap gap-1 mb-3">
                {provider.services.slice(0, 4).map((service: string, idx: number) => (
                    <Badge key={idx} variant="secondary" className="text-[10px] px-1.5 py-0.5 h-5">
                        {service}
                    </Badge>
                ))}
            </div>

            <Button size="sm" className="w-full text-xs h-8" onClick={onClose}>
                View Details
            </Button>
        </div>
    );
}
