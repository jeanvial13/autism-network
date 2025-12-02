import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, MapPin, Phone, Navigation, Save, FileText, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { calculateDistance, formatDistance } from '@/lib/geolocation';
import { toast } from 'sonner';

interface ProviderDetailProps {
    provider: any;
    userLocation?: any;
    onClose: () => void;
}

export default function ProviderDetail({ provider, userLocation, onClose }: ProviderDetailProps) {
    const [note, setNote] = useState('');
    const [isSaved, setIsSaved] = useState(false);

    const distance = userLocation?.latitude && userLocation?.longitude
        ? formatDistance(calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            provider.lat,
            provider.lng
        ))
        : null;

    // Load state from localStorage
    useEffect(() => {
        const savedNotes = JSON.parse(localStorage.getItem('provider_notes') || '{}');
        const savedProviders = JSON.parse(localStorage.getItem('saved_providers') || '[]');

        if (savedNotes[provider.id]) {
            setNote(savedNotes[provider.id]);
        }
        setIsSaved(savedProviders.includes(provider.id));
    }, [provider.id]);

    // Save Note
    const handleSaveNote = () => {
        const savedNotes = JSON.parse(localStorage.getItem('provider_notes') || '{}');
        savedNotes[provider.id] = note;
        localStorage.setItem('provider_notes', JSON.stringify(savedNotes));
        toast.success('Note saved locally');
    };

    // Toggle Save Provider
    const handleToggleSave = () => {
        const savedProviders = JSON.parse(localStorage.getItem('saved_providers') || '[]');
        let newSaved;
        if (isSaved) {
            newSaved = savedProviders.filter((id: string) => id !== provider.id);
            toast.info('Provider removed from saved list');
        } else {
            newSaved = [...savedProviders, provider.id];
            toast.success('Provider saved to your list');
        }
        localStorage.setItem('saved_providers', JSON.stringify(newSaved));
        setIsSaved(!isSaved);
    };

    const handleCall = () => {
        window.location.href = `tel:${provider.phone || ''}`;
    };

    const handleNavigate = () => {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${provider.lat},${provider.lng}`;
        window.open(url, '_blank');
    };

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

                        <div className="text-center mb-6">
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

                        {/* Action Buttons */}
                        <div className="flex gap-3 mb-8 w-full justify-center">
                            <Button onClick={handleCall} className="flex-1 max-w-[120px] rounded-full" variant="outline">
                                <Phone className="h-4 w-4 mr-2" />
                                Call
                            </Button>
                            <Button onClick={handleNavigate} className="flex-1 max-w-[120px] rounded-full" variant="default">
                                <Navigation className="h-4 w-4 mr-2" />
                                Go
                            </Button>
                            <Button onClick={handleToggleSave} className="flex-1 max-w-[120px] rounded-full" variant={isSaved ? "secondary" : "outline"}>
                                <Save className={`h-4 w-4 mr-2 ${isSaved ? 'fill-current' : ''}`} />
                                {isSaved ? 'Saved' : 'Save'}
                            </Button>
                        </div>

                        {/* Notes Section */}
                        <div className="w-full max-w-md bg-muted/30 p-4 rounded-xl border border-border">
                            <div className="flex items-center gap-2 mb-2 text-sm font-medium text-foreground">
                                <FileText className="h-4 w-4 text-primary" />
                                Personal Notes
                            </div>
                            <Textarea
                                placeholder="Add private notes about this provider..."
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                className="bg-background resize-none mb-2"
                                rows={3}
                            />
                            <Button size="sm" onClick={handleSaveNote} className="w-full">
                                Save Note
                            </Button>
                        </div>
                    </div>
                </ScrollArea>
            </div>
        </motion.div>
    );
}
