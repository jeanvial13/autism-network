'use client';

import { motion } from 'framer-motion';
import { MapPin, CheckCircle, ArrowRight } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Badge } from '@/components/ui/badge';
import { GlassButton } from '@/components/ui/glass-button';
import { useTranslations } from 'next-intl';

import { calculateDistance, formatDistance } from '@/lib/geolocation';

interface ProviderCardProps {
    provider: any;
    userLocation?: any;
    isSelected?: boolean;
    onClick: () => void;
}

export default function ProviderCard({ provider, userLocation, isSelected, onClick }: ProviderCardProps) {
    const t = useTranslations('map.card');

    const distance = userLocation?.latitude && userLocation?.longitude
        ? formatDistance(calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            provider.lat,
            provider.lng
        ))
        : null;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
        >
            <GlassCard
                className={`cursor-pointer transition-all border-l-4 p-4 ${isSelected
                    ? 'border-l-primary ring-1 ring-primary/20 shadow-lg bg-primary/5'
                    : 'border-l-transparent hover:shadow-md'
                    }`}
                hover={false} // We handle hover manually with motion
            >
                <div onClick={onClick}>
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h3 className="font-semibold text-lg text-foreground line-clamp-1">
                                {provider.name}
                            </h3>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                                <MapPin className="h-3 w-3" />
                                <span>{provider.city || 'Ubicación'}</span>
                                {distance && (
                                    <>
                                        <span className="mx-1">•</span>
                                        <span className="text-primary font-medium">{distance}</span>
                                    </>
                                )}
                            </div>
                        </div>
                        {provider.verified && (
                            <Badge variant="default" className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                {t('verified')}
                            </Badge>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-3 mb-3">
                        {provider.services.slice(0, 3).map((service: string, idx: number) => (
                            <Badge key={idx} variant="secondary" className="text-xs font-normal bg-secondary/10 text-secondary-foreground border-secondary/20">
                                {service}
                            </Badge>
                        ))}
                        {provider.services.length > 3 && (
                            <Badge variant="outline" className="text-xs text-muted-foreground">
                                +{provider.services.length - 3} {t('more')}
                            </Badge>
                        )}
                    </div>

                    <div className="flex justify-end">
                        <GlassButton variant="ghost" size="sm" className="text-xs h-8 group px-3">
                            {t('viewProfile')}
                            <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
                        </GlassButton>
                    </div>
                </div>
            </GlassCard>
        </motion.div>
    );
}
