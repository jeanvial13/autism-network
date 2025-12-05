'use client';

import { useState } from 'react';
import { MapPin, Plus, Save } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

export default function AddCenterPage() {
    const [formData, setFormData] = useState({
        name: '',
        city: '',
        address: '',
        lat: '',
        lng: '',
        services: [] as string[],
        verified: false,
    });

    const [generatedCode, setGeneratedCode] = useState('');

    // Must match the Spanish translations in FilterBar.tsx
    const availableServices = [
        'Diagnóstico',
        'Terapia ABA',
        'Terapia de Habla',
        'Terapia Ocupacional',
        'Grupos de Apoyo',
        'Educación Especial',
        'Apoyo Familiar',
        'Investigación',
        'Intervención Temprana'
    ];

    const handleServiceToggle = (service: string) => {
        setFormData(prev => ({
            ...prev,
            services: prev.services.includes(service)
                ? prev.services.filter(s => s !== service)
                : [...prev.services, service]
        }));
    };

    const handleGenerateCode = () => {
        const code = `{
  id: ${Date.now()}, // Reemplazar con el siguiente ID disponible
  name: '${formData.name}',
  city: '${formData.city}',
  lat: ${formData.lat || '0'},
  lng: ${formData.lng || '0'},
  services: [${formData.services.map(s => `'${s}'`).join(', ')}],
  verified: ${formData.verified}
},`;
        setGeneratedCode(code);
    };

    const handleFindCoordinates = () => {
        const query = encodeURIComponent(`${formData.name} ${formData.address} ${formData.city}`);
        window.open(`https://www.google.com/maps/search/${query}`, '_blank');
    };

    return (
        <main className="min-h-screen bg-background py-12">
            <div className="mx-auto max-w-4xl px-6 lg:px-8">
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <Plus className="h-10 w-10 text-primary" />
                        <h1 className="text-4xl font-bold text-foreground">Agregar Nuevo Centro</h1>
                    </div>
                    <p className="text-lg text-muted-foreground">
                        Complete los detalles a continuación para generar el código para un nuevo centro de autismo.
                    </p>
                </div>

                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Información del Centro</CardTitle>
                        <CardDescription>
                            Ingrese los detalles del centro. Puede encontrar las coordenadas buscando en Google Maps.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="name">Nombre del Centro *</Label>
                                <Input
                                    id="name"
                                    placeholder="Centro de Autismo CDMX"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label htmlFor="city">Ciudad, Estado *</Label>
                                <Input
                                    id="city"
                                    placeholder="Ciudad de México, CDMX"
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="address">Dirección Completa (para búsqueda de coordenadas)</Label>
                            <Input
                                id="address"
                                placeholder="Av. Insurgentes Sur 123, CDMX"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            />
                            <Button
                                variant="outline"
                                size="sm"
                                className="mt-2"
                                onClick={handleFindCoordinates}
                                disabled={!formData.name && !formData.address}
                            >
                                <MapPin className="mr-2 h-4 w-4" />
                                Buscar en Google Maps
                            </Button>
                        </div>

                        {/* Coordinates */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="lat">Latitud *</Label>
                                <Input
                                    id="lat"
                                    type="number"
                                    step="any"
                                    placeholder="19.4326"
                                    value={formData.lat}
                                    onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                    Haga clic derecho en Google Maps y copie el primer número
                                </p>
                            </div>
                            <div>
                                <Label htmlFor="lng">Longitud *</Label>
                                <Input
                                    id="lng"
                                    type="number"
                                    step="any"
                                    placeholder="-99.1332"
                                    value={formData.lng}
                                    onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                    El segundo número de Google Maps
                                </p>
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
                                        <label
                                            htmlFor={service}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            {service}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Verified */}
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="verified"
                                checked={formData.verified}
                                onCheckedChange={(checked) => setFormData({ ...formData, verified: !!checked })}
                            />
                            <label
                                htmlFor="verified"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Este centro está verificado
                            </label>
                        </div>

                        <Button onClick={handleGenerateCode} className="w-full" size="lg">
                            <Save className="mr-2 h-5 w-5" />
                            Generar Código
                        </Button>
                    </CardContent>
                </Card>

                {/* Generated Code */}
                {generatedCode && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Código Generado</CardTitle>
                            <CardDescription>
                                Copie este código y agréguelo a la base de datos o archivo correspondiente.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="relative">
                                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                                    <code>{generatedCode}</code>
                                </pre>
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    className="absolute top-2 right-2"
                                    onClick={() => {
                                        navigator.clipboard.writeText(generatedCode);
                                        alert('¡Código copiado al portapapeles!');
                                    }}
                                >
                                    Copiar
                                </Button>
                            </div>
                            <div className="mt-4 p-4 bg-primary/10 rounded-lg">
                                <h4 className="font-semibold text-sm mb-2">Cómo agregar esto:</h4>
                                <ol className="text-sm space-y-1 text-muted-foreground list-decimal list-inside">
                                    <li>Copie el código de arriba</li>
                                    <li>Abra el archivo de datos correspondiente</li>
                                    <li>Pegue el código en la lista de proveedores</li>
                                    <li>Guarde el archivo</li>
                                </ol>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </main>
    );
}
