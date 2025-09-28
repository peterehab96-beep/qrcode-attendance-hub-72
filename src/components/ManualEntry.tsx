
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";

interface ManualEntryProps {
  onSubmit: (civilId: string) => void;
}

const ManualEntry: React.FC<ManualEntryProps> = ({ onSubmit }) => {
  const [civilId, setCivilId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!civilId || civilId.length < 5) {
      toast({
        variant: "destructive",
        title: "Invalid Civil ID",
        description: "Please enter a valid Civil ID number",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate a backend check
    setTimeout(() => {
      onSubmit(civilId);
      setCivilId("");
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Search className="mr-2 h-5 w-5" />
          Manual Civil ID Entry
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="civil-id">Civil ID Number</Label>
              <div className="flex gap-2">
                <Input
                  id="civil-id"
                  placeholder="Enter Civil ID"
                  value={civilId}
                  onChange={(e) => setCivilId(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Checking..." : "Submit"}
                </Button>
              </div>
            </div>
          </div>
        </form>
        
        <div className="mt-4 text-sm text-center text-muted-foreground">
          <p>
            Enter the student's Civil ID number<br />to record attendance manually.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ManualEntry;
