'use client';

import { motion } from 'framer-motion';
import { MapPin, CheckCircle, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ProviderCardProps {
    provider: any;
    distance?: string;
    isSelected?: boolean;
    onClick: () => void;
}

export default function ProviderCard({ provider, distance, isSelected, onClick }: ProviderCardProps) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
        >
            <Card
                className={`cursor-pointer transition-all border-l-4 ${isSelected
                    ? 'border-l-primary ring-1 ring-primary/20 shadow-lg bg-primary/5'
                    : 'border-l-transparent hover:shadow-md'
                    }`}
                onClick={onClick}
            >
                <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h3 className="font-semibold text-lg text-foreground line-clamp-1">
                                {provider.name}
                            </h3>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                                <MapPin className="h-3 w-3" />
                                <span>{provider.city}</span>
                                {distance && (
                                    <>
                                        <span className="mx-1">•</span>
                                        <span className="text-primary font-medium">{distance}</span>
                                    </>
                                )}
                            </div>
                        </div>
                        {provider.verified && (
                            <Badge variant="default" className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Verified
                            </Badge>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-3 mb-3">
                        {provider.services.slice(0, 3).map((service: string, idx: number) => (
                            <Badge key={idx} variant="secondary" className="text-xs font-normal">
                                {service}
                            </Badge>
                        ))}
                        {provider.services.length > 3 && (
                            <Badge variant="outline" className="text-xs text-muted-foreground">
                                +{provider.services.length - 3} more
                            </Badge>
                        )}
                    </div>

                    <div className="flex justify-end">
                        <Button variant="ghost" size="sm" className="text-xs h-8 group">
                            View Profile
                            <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
