'use client';

import { useState, useEffect } from 'react';
import { MapPin, Plus, Save, Trash2, Search, Star, Clock, Users, Phone, Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { GlassCard } from '@/components/ui/glass-card';

export default function ProviderManagerPage() {
    const [providers, setProviders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        city: '',
        address: '',
        lat: '',
        lng: '',
        services: [] as string[],
        verified: false,
        rating: '5.0',
        experienceYears: '5',
        patientCount: '100',
        phoneNumber: ''
    });

    const [activeTab, setActiveTab] = useState<'list' | 'add'>('list');

    const availableServices = [
        'Diagnóstico', 'Terapia ABA', 'Terapia de Habla', 'Terapia Ocupacional',
        'Grupos de Apoyo', 'Educación Especial', 'Apoyo Familiar',
        'Investigación', 'Intervención Temprana'
    ];

    useEffect(() => {
        fetchProviders();
    }, []);

    const fetchProviders = async () => {
        try {
            const res = await fetch('/api/providers');
            const data = await res.json();
            setProviders(Array.isArray(data) ? data : []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching providers:', error);
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`¿Estás seguro de que deseas eliminar a ${name}?`)) return;

        try {
            const res = await fetch(`/api/providers/${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchProviders();
            } else {
                alert('Error al eliminar');
            }
        } catch (error) {
            console.error('Error deleting:', error);
        }
    };

    const handleSubmit = async () => {
        if (!formData.name || !formData.lat || !formData.lng) {
            alert('Por favor complete los campos obligatorios');
            return;
        }

        try {
            const res = await fetch('/api/providers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                alert('Proveedor agregado exitosamente');
                setFormData({
                    name: '', email: '', city: '', address: '', lat: '', lng: '',
                    services: [], verified: false, rating: '5.0', experienceYears: '5',
                    patientCount: '100', phoneNumber: ''
                });
                setActiveTab('list');
                fetchProviders();
            } else {
                alert('Error al crear proveedor');
            }
        } catch (error) {
            console.error('Error creating:', error);
        }
    };

    const handleServiceToggle = (service: string) => {
        setFormData(prev => ({
            ...prev,
            services: prev.services.includes(service)
                ? prev.services.filter(s => s !== service)
                : [...prev.services, service]
        }));
    };

    const handleFindCoordinates = () => {
        const query = encodeURIComponent(`${formData.name} ${formData.address} ${formData.city}`);
        window.open(`https://www.google.com/maps/search/${query}`, '_blank');
    };

    const filteredProviders = providers.filter(p =>
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.city?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <main className="min-h-screen bg-background py-12">
            <div className="mx-auto max-w-6xl px-6">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-foreground">Gestor de Proveedores</h1>
                        <p className="text-muted-foreground mt-2">Agregue, modifique y elimine proveedores del mapa.</p>
                    </div>
                    <div className="flex gap-4">
                        <Button
                            variant={activeTab === 'list' ? 'default' : 'outline'}
                            onClick={() => setActiveTab('list')}
                        >
                            Ver Lista
                        </Button>
                        <Button
                            variant={activeTab === 'add' ? 'default' : 'outline'}
                            onClick={() => setActiveTab('add')}
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Agregar Nuevo
                        </Button>
                    </div>
                </div>

                {activeTab === 'list' ? (
                    <div className="space-y-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                placeholder="Buscar por nombre o ciudad..."
                                className="pl-10 h-12 text-lg"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {loading ? (
                            <div className="text-center py-12">Cargando...</div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredProviders.map((provider) => (
                                    <GlassCard key={provider.id} className="relative group">
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => handleDelete(provider.id, provider.name)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                                                {provider.name?.charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className="font-bold truncate pr-4">{provider.name}</h3>
                                                <p className="text-sm text-muted-foreground">{provider.city}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-1 mb-4">
                                            {provider.specialties?.slice(0, 3).map((s: string) => (
                                                <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                                            ))}
                                            {(provider.specialties?.length || 0) > 3 && (
                                                <Badge variant="outline" className="text-xs">+{provider.specialties.length - 3}</Badge>
                                            )}
                                        </div>
                                        <div className="flex justify-between text-sm text-muted-foreground border-t pt-3 mt-auto">
                                            <span className="flex items-center gap-1"><Star className="h-3 w-3" /> {provider.rating || 'N/A'}</span>
                                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {provider.experienceYears || 0} años</span>
                                        </div>
                                    </GlassCard>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <Card>
                        <CardHeader>
                            <CardTitle>Información del Centro</CardTitle>
                            <CardDescription>
                                Ingrese los detalles completos para agregar un nuevo proveedor al mapa en tiempo real.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Basic Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label>Nombre del Centro *</Label>
                                    <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Ej: Centro CDMX" />
                                </div>
                                <div>
                                    <Label>Correo Electrónico (Para citas)</Label>
                                    <Input value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="contacto@ejemplo.com" />
                                </div>
                                <div>
                                    <Label>Ciudad *</Label>
                                    <Input value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} placeholder="Ciudad de México" />
                                </div>
                                <div>
                                    <Label>Teléfono</Label>
                                    <Input value={formData.phoneNumber} onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} placeholder="+52 ..." />
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
                                <div>
                                    <Label>Calificación (0-5)</Label>
                                    <div className="relative">
                                        <Star className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input className="pl-9" type="number" step="0.1" value={formData.rating} onChange={(e) => setFormData({ ...formData, rating: e.target.value })} />
                                    </div>
                                </div>
                                <div>
                                    <Label>Años de Experiencia</Label>
                                    <div className="relative">
                                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input className="pl-9" type="number" value={formData.experienceYears} onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })} />
                                    </div>
                                </div>
                                <div>
                                    <Label>Pacientes Atendidos</Label>
                                    <div className="relative">
                                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input className="pl-9" type="number" value={formData.patientCount} onChange={(e) => setFormData({ ...formData, patientCount: e.target.value })} />
                                    </div>
                                </div>
                            </div>

                            {/* Location */}
                            <div className="p-4 border rounded-lg space-y-4">
                                <Label>Ubicación</Label>
                                <div className="flex gap-2">
                                    <Input
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        placeholder="Dirección para buscar en Google Maps..."
                                    />
                                    <Button variant="outline" onClick={handleFindCoordinates}>
                                        <MapPin className="mr-2 h-4 w-4" /> Buscar Coordenadas
                                    </Button>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Latitud *</Label>
                                        <Input type="number" step="any" value={formData.lat} onChange={(e) => setFormData({ ...formData, lat: e.target.value })} placeholder="19.4326" />
                                    </div>
                                    <div>
                                        <Label>Longitud *</Label>
                                        <Input type="number" step="any" value={formData.lng} onChange={(e) => setFormData({ ...formData, lng: e.target.value })} placeholder="-99.1332" />
                                    </div>
                                </div>
                            </div>

                            {/* Services */}
                            <div>
                                <Label className="mb-3 block">Servicios Ofrecidos</Label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {availableServices.map((service) => (
                                        <div key={service} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={service}
                                                checked={formData.services.includes(service)}
                                                onCheckedChange={() => handleServiceToggle(service)}
                                            />
                                            <Label htmlFor={service} className="text-sm font-normal cursor-pointer">{service}</Label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Button onClick={handleSubmit} className="w-full" size="lg">
                                <Save className="mr-2 h-5 w-5" />
                                Guardar Proveedor
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </main>
    );
}
