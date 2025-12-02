'use client';

import { motion } from 'framer-motion';
import { X, MapPin, Calendar, Phone, Mail, Globe, CheckCircle, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { calculateDistance, formatDistance } from '@/lib/geolocation';

interface ProviderDetailProps {
    provider: any;
    userLocation?: any;
    onClose: () => void;
}

export default function ProviderDetail({ provider, userLocation, onClose }: ProviderDetailProps) {
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
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-x-0 bottom-0 z-50 h-[85vh] bg-background rounded-t-[2rem] shadow-2xl border-t border-border lg:absolute lg:inset-0 lg:h-full lg:rounded-none lg:border-none"
        >
            <div className="h-full flex flex-col relative">
                {/* Header Image/Pattern */}
                <div className="h-32 bg-gradient-to-r from-blue-500/10 to-purple-500/10 w-full absolute top-0 left-0 rounded-t-[2rem] lg:rounded-none" />

                {/* Close Button */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 z-10 rounded-full bg-background/50 backdrop-blur hover:bg-background/80"
                    onClick={onClose}
                >
                    <X className="h-5 w-5" />
                </Button>

                <ScrollArea className="flex-1 pt-20 px-6 pb-6">
                    <div className="flex flex-col items-center mb-6">
                        <Avatar className="h-24 w-24 border-4 border-background shadow-lg mb-4">
                            <AvatarImage src={provider.image} alt={provider.name} />
                            <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                                {provider.name.charAt(0)}
                            </AvatarFallback>
                        </Avatar>

                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-foreground flex items-center justify-center gap-2">
                                {provider.name}
                                {provider.verified && (
                                    <CheckCircle className="h-5 w-5 text-blue-500" />
                                )}
                            </h2>
                            <p className="text-muted-foreground flex items-center justify-center gap-1 mt-1">
                                <MapPin className="h-4 w-4" />
                                {provider.city}
                                {distance && <span className="text-primary font-medium">• {distance}</span>}
                            </p>
                        </div>

                        <div className="flex gap-2 mt-4">
                            <Button className="rounded-full px-6">
                                <Calendar className="mr-2 h-4 w-4" />
                                Book Appointment
                            </Button>
                            <Button variant="outline" size="icon" className="rounded-full">
                                <Star className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </ScrollArea>
            </div>
        </motion.div>
    );
}
