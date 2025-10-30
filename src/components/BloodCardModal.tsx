import { BloodCard as BloodCardType } from '@/types';
import { BloodCard } from './BloodCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, Share2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface BloodCardModalProps {
  card: BloodCardType | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRefresh?: () => void;
}

export const BloodCardModal = ({ card, open, onOpenChange, onRefresh }: BloodCardModalProps) => {
  const handleDownload = async () => {
    if (!card) return;

    try {
      const element = document.getElementById('blood-card');
      if (!element) {
        toast.error('Card element not found');
        return;
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        logging: false,
        useCORS: true,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 20, pdfWidth, pdfHeight);
      pdf.save(`blood-card-${card.cardNumber}.pdf`);

      toast.success('Blood card downloaded successfully');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download blood card');
    }
  };

  const handleShare = async () => {
    if (!card) return;

    const shareText = `Digital Blood Card - ${card.bloodType}\nCard No: ${card.cardNumber}`;
    const shareUrl = `${window.location.origin}/card/${card.id}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Blood Card',
          text: shareText,
          url: shareUrl,
        });
        toast.success('Blood card shared successfully');
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          toast.error('Failed to share blood card');
        }
      }
    } else {
      // Fallback: Copy link to clipboard
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast.success('Card link copied to clipboard');
      } catch (error) {
        toast.error('Failed to copy link');
      }
    }
  };

  if (!card) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">My Blood Card</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <BloodCard card={card} />
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <Button onClick={handleDownload} variant="default" className="flex-1">
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
          <Button onClick={handleShare} variant="outline" className="flex-1">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          {onRefresh && (
            <Button onClick={onRefresh} variant="ghost" size="icon">
              <RefreshCw className="w-4 h-4" />
            </Button>
          )}
        </div>

        <div className="text-xs text-muted-foreground text-center space-y-1">
          <p>This is an official digital blood card issued by BloodStream.</p>
          <p>Valid for blood donation and hospital verification purposes.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
