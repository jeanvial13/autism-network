{ article.whyItMatters }
                    </p >
                </section >

                <Separator className="my-8" />

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Practical Tips</h2>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                        {article.practicalTips}
                    </p>
                </section>

{
    article.technicalSection && (
        <>
            <Separator className="my-8" />
            <details className="mb-8">
                <summary className="text-2xl font-semibold mb-4 cursor-pointer hover:text-primary">
                    For Professionals: Technical Details ▼
                </summary>
                <div className="mt-4 p-6 bg-muted/30 rounded-lg">
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                        {article.technicalSection}
                    </p>
                </div>
            </details>
        </>
    )
}
            </div >

    {/* References */ }
    < div className = "mb-12" >
                <h2 className="text-2xl font-semibold mb-4">References</h2>
                <Card className="p-6">
                    <ul className="space-y-3">
                        {article.sourceUrls.map((url: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2">
                                <ExternalLink className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
                                <a
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline break-all"
                                >
            guidance and treatment decisions.
        </p>
            </Card >

    {/* Back Link */ }
    < div className = "mt-8 text-center" >
        <Link href="/articles">
            <Button variant="outline">← Back to Articles</Button>
        </Link>
            </div >
        </article >
    </main >
);
}
