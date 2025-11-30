import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Mock type for now, will replace with Prisma type
type Resource = {
    id: string;
    title: string;
    summarySimple: string | null;
    category: string;
    credibilityScore: number;
};

export default function ResourceGrid({ resources }: { resources: Resource[] }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource) => (
                <Card key={resource.id} className="flex flex-col h-full hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <div className="flex justify-between items-start mb-2">
                            <Badge variant="secondary">{resource.category}</Badge>
                            <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                                {resource.credibilityScore}% Credibility
                            </Badge>
                        </div>
                        <CardTitle className="line-clamp-2">{resource.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <CardDescription className="line-clamp-3">
                            {resource.summarySimple || "No summary available."}
                        </CardDescription>
                    </CardContent>
                    <CardFooter>
                        <Button asChild className="w-full">
                            <Link href={`/resources/${resource.id}`}>Read More</Link>
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}
