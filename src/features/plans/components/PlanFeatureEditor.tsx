import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { X, Plus } from 'lucide-react';

interface PlanFeatureEditorProps {
  features: string[];
  onChange: (features: string[]) => void;
}

const PlanFeatureEditor = ({ features, onChange }: PlanFeatureEditorProps) => {
  const [newFeature, setNewFeature] = useState('');

  const addFeature = () => {
    if (newFeature.trim()) {
      onChange([...features, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    onChange(features.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <Label>Features</Label>
      <div className="space-y-2">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              value={feature}
              onChange={(e) => {
                const updated = [...features];
                updated[index] = e.target.value;
                onChange(updated);
              }}
              className="flex-1"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeFeature(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <Input
          value={newFeature}
          onChange={(e) => setNewFeature(e.target.value)}
          placeholder="Add a feature..."
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
        />
        <Button type="button" variant="outline" onClick={addFeature}>
          <Plus className="h-4 w-4" />
          Add
        </Button>
      </div>
    </div>
  );
};

export default PlanFeatureEditor;
