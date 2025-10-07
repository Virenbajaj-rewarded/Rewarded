import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

export const NotesSection = () => {
  return (
    <Card className="bg-gradient-card shadow-card">
      <CardHeader>
        <CardTitle className="text-foreground">Notes</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Add your notes here..."
          className="min-h-[120px] bg-background border-border text-foreground placeholder:text-muted-foreground"
        />
      </CardContent>
    </Card>
  );
};
