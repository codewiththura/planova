import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';

interface CreateActionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  planTitle: string;
  onCreateAction: (title: string) => void;
}

export function CreateActionDialog({ open, onOpenChange, planTitle, onCreateAction }: CreateActionDialogProps) {
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;
    
    onCreateAction(title.trim());
    
    // Reset form
    setTitle('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Action</DialogTitle>
          <DialogDescription>
            Add a specific action to: <span className="font-medium text-foreground">{planTitle}</span>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="action-title">Action Title *</Label>
              <Input
                id="action-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Complete market research"
                required
                autoFocus
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!title.trim()}>
              Add Action
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
