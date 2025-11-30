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

    const availableServices = [
        'Diagnosis',
        'ABA Therapy',
        'Speech Therapy',
        'Occupational Therapy',
        'Support Groups',
        'Education',
        'Family Support',
        'Research',
        'Early Intervention'
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
  id: ${Date.now()}, // Replace with next available ID
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
                        <h1 className="text-4xl font-bold text-foreground">Add New Center</h1>
                    </div>
                    <p className="text-lg text-muted-foreground">
                        Fill in the details below to generate code for a new autism center.
                    </p>
                </div>

                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Center Information</CardTitle>
                        <CardDescription>
                            Enter the center details. You can find coordinates by searching on Google Maps.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="name">Center Name *</Label>
                                <Input
                                    id="name"
                                    placeholder="NYC Autism Center"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label htmlFor="city">City, State *</Label>
                                <Input
                                    id="city"
                                    placeholder="New York, NY"
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="address">Full Address (for coordinates lookup)</Label>
                            <Input
                                id="address"
                                placeholder="123 Main St, New York, NY 10001"
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
                                Find on Google Maps
                            </Button>
                        </div>

                        {/* Coordinates */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="lat">Latitude *</Label>
                                <Input
                                    id="lat"
                                    type="number"
                                    step="any"
                                    placeholder="40.7128"
                                    value={formData.lat}
                                    onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                    Right-click on Google Maps and copy the first number
                                </p>
                            </div>
                            <div>
                                <Label htmlFor="lng">Longitude *</Label>
                                <Input
                                    id="lng"
                                    type="number"
                                    step="any"
                                    placeholder="-74.006"
                                    value={formData.lng}
                                    onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                    The second number from Google Maps
                                </p>
                            </div>
                        </div>

                        {/* Services */}
                        <div>
                            <Label className="mb-3 block">Services Offered</Label>
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
                                This center is verified
                            </label>
                        </div>

                        <Button onClick={handleGenerateCode} className="w-full" size="lg">
                            <Save className="mr-2 h-5 w-5" />
                            Generate Code
                        </Button>
                    </CardContent>
                </Card>

                {/* Generated Code */}
                {generatedCode && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Generated Code</CardTitle>
                            <CardDescription>
                                Copy this code and add it to the EXAMPLE_CENTERS array in{' '}
                                <code className="text-xs bg-muted px-1 py-0.5 rounded">
                                    src/app/map/page.tsx
                                </code>
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
                                        alert('Code copied to clipboard!');
                                    }}
                                >
                                    Copy
                                </Button>
                            </div>
                            <div className="mt-4 p-4 bg-primary/10 rounded-lg">
                                <h4 className="font-semibold text-sm mb-2">How to add this to the map:</h4>
                                <ol className="text-sm space-y-1 text-muted-foreground list-decimal list-inside">
                                    <li>Copy the code above</li>
                                    <li>
                                        Open <code className="text-xs bg-muted px-1 rounded">src/app/map/page.tsx</code>
                                    </li>
                                    <li>Find the EXAMPLE_CENTERS array (around line 22)</li>
                                    <li>Paste the code before the closing bracket ]</li>
                                    <li>Save the file - the map will update automatically!</li>
                                </ol>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </main>
    );
}
