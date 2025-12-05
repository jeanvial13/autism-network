'use client';

import { motion } from 'framer-motion';
import { X, MapPin, Calendar, Phone, Mail, Globe, CheckCircle, Star, Clock, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { GlassCard } from '@/components/ui/glass-card';

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

    const handleBookAppointment = () => {
        if (provider.email) {
            window.location.href = `mailto:${provider.email}?subject=Solicitud de Cita - T-Conecta Autismo&body=Hola ${provider.name}, me gustaría agendar una cita.`;
        } else {
            alert('No hay correo electrónico disponible para este especialista.');
        }
    };

    return (
        <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-x-0 bottom-0 z-50 h-[85vh] bg-background/95 backdrop-blur-xl rounded-t-[2rem] shadow-2xl border-t border-border lg:absolute lg:inset-0 lg:h-full lg:rounded-none lg:border-none lg:backdrop-blur-none"
        >
            <div className="h-full flex flex-col relative">
                {/* Header Image/Pattern */}
                <div className="h-40 bg-gradient-to-br from-primary/20 via-purple-500/10 to-blue-500/20 w-full absolute top-0 left-0 rounded-t-[2rem] lg:rounded-none overflow-hidden">
                    <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]" />
                </div>

                {/* Close Button */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 z-10 rounded-full bg-background/50 backdrop-blur hover:bg-background/80 transition-colors"
                    onClick={onClose}
                >
                    <X className="h-5 w-5" />
                </Button>

                <ScrollArea className="flex-1 pt-24 px-6 pb-24">
                    <div className="flex flex-col items-center mb-8 relative">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                        >
                            <Avatar className="h-32 w-32 border-4 border-background shadow-2xl mb-4 ring-4 ring-primary/10">
                                <AvatarImage src={provider.image} alt={provider.name} className="object-cover" />
                                <AvatarFallback className="text-4xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary font-bold">
                                    {provider.name.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                        </motion.div>

                        <div className="text-center space-y-2">
                            <h2 className="text-3xl font-bold text-foreground flex items-center justify-center gap-2">
                                {provider.name}
                                {provider.verified && (
                                    <CheckCircle className="h-6 w-6 text-blue-500 fill-blue-500/10" />
                                )}
                            </h2>
                            <p className="text-muted-foreground flex items-center justify-center gap-2 text-lg">
                                <MapPin className="h-4 w-4 text-primary" />
                                {provider.city}
                                {distance && <span className="text-primary font-medium bg-primary/10 px-2 py-0.5 rounded-full text-sm">{distance}</span>}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6 max-w-2xl mx-auto">
                        {/* Quick Stats Grid */}
                        <div className="grid grid-cols-3 gap-4">
                            <GlassCard className="p-3 flex flex-col items-center justify-center text-center gap-1 hover:bg-primary/5 transition-colors">
                                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500/20" />
                                <span className="font-bold text-lg">{provider.rating || 'N/A'}</span>
                                <span className="text-xs text-muted-foreground">Rating</span>
                            </GlassCard>
                            <GlassCard className="p-3 flex flex-col items-center justify-center text-center gap-1 hover:bg-primary/5 transition-colors">
                                <Clock className="h-5 w-5 text-green-500" />
                                <span className="font-bold text-lg">{provider.experienceYears ? `${provider.experienceYears}+` : 'N/A'}</span>
                                <span className="text-xs text-muted-foreground">Aiños Exp.</span>
                            </GlassCard>
                            <GlassCard className="p-3 flex flex-col items-center justify-center text-center gap-1 hover:bg-primary/5 transition-colors">
                                <Heart className="h-5 w-5 text-red-500" />
                                <span className="font-bold text-lg">{provider.patientCount ? `${provider.patientCount}+` : 'N/A'}</span>
                                <span className="text-xs text-muted-foreground">Pacientes</span>
                            </GlassCard>
                        </div>

                        {/* About Section */}
                        <section className="space-y-3">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <div className="h-6 w-1 bg-primary rounded-full" />
                                Sobre mí
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {provider.bio || `El Dr. ${provider.name.split(' ').pop()} es un especialista dedicado con amplia experiencia en el diagnóstico y tratamiento del espectro autista. Se enfoca en proporcionar una atención personalizada y compasiva para cada paciente y su familia.`}
                            </p>
                        </section>

                        {/* Specialties Section */}
                        <section className="space-y-3">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <div className="h-6 w-1 bg-purple-500 rounded-full" />
                                Especialidades
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {provider.services && provider.services.length > 0 ? (
                                    provider.services.map((s: string) => (
                                        <Badge key={s} variant="secondary" className="px-3 py-1 text-sm bg-primary/10 hover:bg-primary/20 text-primary border-primary/20">
                                            {s}
                                        </Badge>
                                    ))
                                ) : (
                                    <Badge variant="secondary" className="px-3 py-1 text-sm bg-primary/10 hover:bg-primary/20 text-primary border-primary/20">
                                        Especialista General
                                    </Badge>
                                )}
                            </div>
                        </section>

                        {/* Contact Info */}
                        <section className="space-y-3">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <div className="h-6 w-1 bg-green-500 rounded-full" />
                                Contacto
                            </h3>
                            <div className="grid gap-3">
                                {provider.email && (
                                    <GlassCard className="flex items-center gap-3 p-3 cursor-pointer hover:bg-primary/5 transition-colors" onClick={handleBookAppointment}>
                                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                            <Mail className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">Correo Electrónico</p>
                                            <p className="text-sm text-muted-foreground truncate">{provider.email}</p>
                                        </div>
                                    </GlassCard>
                                )}
                                {provider.phoneNumber && (
                                    <GlassCard className="flex items-center gap-3 p-3">
                                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                            <Phone className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">Teléfono</p>
                                            <p className="text-sm text-muted-foreground">{provider.phoneNumber}</p>
                                        </div>
                                    </GlassCard>
                                )}
                            </div>
                        </section>
                    </div>
                </ScrollArea>

                {/* Fixed Booking Footer */}
                <div className="absolute bottom-0 inset-x-0 p-6 bg-background/80 backdrop-blur-xl border-t border-border z-20">
                    <Button
                        size="lg"
                        className="w-full rounded-full h-14 text-lg font-semibold shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all hover:scale-[1.02]"
                        onClick={handleBookAppointment}
                    >
                        <Calendar className="mr-2 h-5 w-5" />
                        Agendar Cita
                    </Button>
                </div>
            </div>
        </motion.div>
    );
}
